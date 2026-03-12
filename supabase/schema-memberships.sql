-- HealthPOS: memberships table
-- Run AFTER schema-customers.sql

CREATE TYPE membership_type AS ENUM ('10-day', '30-day');
CREATE TYPE membership_status AS ENUM ('active', 'expired', 'pending');

CREATE TABLE IF NOT EXISTS memberships (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id    UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  club_id        UUID NOT NULL REFERENCES clubs(id) ON DELETE RESTRICT,
  type           membership_type NOT NULL,
  total_days     SMALLINT NOT NULL,
  days_remaining SMALLINT NOT NULL,
  price          NUMERIC(8,2) NOT NULL,
  status         membership_status NOT NULL DEFAULT 'active',
  started_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX memberships_customer_id_idx ON memberships(customer_id);
CREATE INDEX memberships_club_id_idx ON memberships(club_id);
CREATE INDEX memberships_status_idx ON memberships(status);

-- Enable RLS
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers see memberships of own customers"
  ON memberships FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = memberships.customer_id
        AND c.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Managers see club memberships"
  ON memberships FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users au
      WHERE au.id = auth.uid()
        AND au.role = 'manager'
        AND au.club_id = memberships.club_id
    )
  );

CREATE POLICY "Owners see all memberships"
  ON memberships FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users au
      WHERE au.id = auth.uid() AND au.role = 'owner'
    )
  );

CREATE POLICY "Trainers can create memberships for own customers"
  ON memberships FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = memberships.customer_id
        AND c.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can update memberships of own customers"
  ON memberships FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = memberships.customer_id
        AND c.trainer_id = auth.uid()
    )
  );
