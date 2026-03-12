-- HealthPOS: visits table
-- Run AFTER schema-memberships.sql

CREATE TABLE IF NOT EXISTS visits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
  club_id       UUID NOT NULL REFERENCES clubs(id) ON DELETE RESTRICT,
  trainer_id    UUID NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  visited_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX visits_customer_id_idx ON visits(customer_id);
CREATE INDEX visits_membership_id_idx ON visits(membership_id);
CREATE INDEX visits_visited_at_idx ON visits(visited_at DESC);

-- Enable RLS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers see visits of own customers"
  ON visits FOR SELECT
  TO authenticated
  USING (trainer_id = auth.uid());

CREATE POLICY "Managers see club visits"
  ON visits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users au
      WHERE au.id = auth.uid()
        AND au.role = 'manager'
        AND au.club_id = visits.club_id
    )
  );

CREATE POLICY "Owners see all visits"
  ON visits FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users au
      WHERE au.id = auth.uid() AND au.role = 'owner'
    )
  );

CREATE POLICY "Trainers can log visits"
  ON visits FOR INSERT
  TO authenticated
  WITH CHECK (trainer_id = auth.uid());
