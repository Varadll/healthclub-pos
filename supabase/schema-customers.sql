-- HealthPOS: customers table
-- Run AFTER schema-users.sql

CREATE TYPE gender AS ENUM ('male', 'female', 'other');

CREATE TABLE IF NOT EXISTS customers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        TEXT NOT NULL,
  phone            TEXT,
  email            TEXT,
  date_of_birth    DATE,
  gender           gender,
  goal             TEXT,
  notes            TEXT,
  club_id          UUID NOT NULL REFERENCES clubs(id) ON DELETE RESTRICT,
  trainer_id       UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  starting_weight  NUMERIC(5,2),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX customers_club_id_idx ON customers(club_id);
CREATE INDEX customers_trainer_id_idx ON customers(trainer_id);

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Trainers can only see their own customers
CREATE POLICY "Trainers see own customers"
  ON customers FOR SELECT
  TO authenticated
  USING (trainer_id = auth.uid());

-- Managers see all customers in their club
CREATE POLICY "Managers see club customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users au
      WHERE au.id = auth.uid()
        AND au.role = 'manager'
        AND au.club_id = customers.club_id
    )
  );

-- Owners see all customers
CREATE POLICY "Owners see all customers"
  ON customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users au
      WHERE au.id = auth.uid() AND au.role = 'owner'
    )
  );

-- Trainers can add customers
CREATE POLICY "Trainers can add customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (trainer_id = auth.uid());

-- Trainers can update their own customers
CREATE POLICY "Trainers can update own customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (trainer_id = auth.uid());
