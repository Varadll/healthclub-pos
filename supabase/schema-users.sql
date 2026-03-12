-- HealthPOS: app_users table
-- Run AFTER schema-clubs.sql

-- Create role enum
CREATE TYPE user_role AS ENUM ('owner', 'manager', 'trainer');

CREATE TABLE IF NOT EXISTS app_users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT NOT NULL,
  role        user_role NOT NULL DEFAULT 'trainer',
  club_id     UUID REFERENCES clubs(id) ON DELETE SET NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Users can read their own record
CREATE POLICY "Users can view own record"
  ON app_users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Owners can view all users
CREATE POLICY "Owners can view all users"
  ON app_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users au
      WHERE au.id = auth.uid() AND au.role = 'owner'
    )
  );

-- Managers can view users in their club
CREATE POLICY "Managers can view club users"
  ON app_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users au
      WHERE au.id = auth.uid()
        AND au.role = 'manager'
        AND au.club_id = app_users.club_id
    )
  );

-- Owners can insert new users
CREATE POLICY "Owners can create users"
  ON app_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM app_users au
      WHERE au.id = auth.uid() AND au.role = 'owner'
    )
  );

-- Owners can update all users
CREATE POLICY "Owners can update users"
  ON app_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users au
      WHERE au.id = auth.uid() AND au.role = 'owner'
    )
  );

-- Users can update own record (limited fields via app logic)
CREATE POLICY "Users can update own record"
  ON app_users FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Auto-create app_users row when a new auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.app_users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'trainer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
