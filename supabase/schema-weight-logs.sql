-- HealthPOS: weight_logs table
-- Run AFTER schema-customers.sql

CREATE TABLE IF NOT EXISTS weight_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  weight_kg   NUMERIC(5,2) NOT NULL,
  log_date    DATE NOT NULL,
  notes       TEXT,
  logged_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One entry per customer per day
  UNIQUE(customer_id, log_date)
);

CREATE INDEX weight_logs_customer_id_idx ON weight_logs(customer_id);
CREATE INDEX weight_logs_log_date_idx ON weight_logs(log_date DESC);

-- Enable RLS
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers see weight logs of own customers"
  ON weight_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = weight_logs.customer_id
        AND c.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Managers see club weight logs"
  ON weight_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      JOIN app_users au ON au.id = auth.uid()
      WHERE c.id = weight_logs.customer_id
        AND au.role = 'manager'
        AND c.club_id = au.club_id
    )
  );

CREATE POLICY "Owners see all weight logs"
  ON weight_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users au
      WHERE au.id = auth.uid() AND au.role = 'owner'
    )
  );

CREATE POLICY "Trainers can log weight for own customers"
  ON weight_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = weight_logs.customer_id
        AND c.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Trainers can update weight logs of own customers"
  ON weight_logs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = weight_logs.customer_id
        AND c.trainer_id = auth.uid()
    )
  );
