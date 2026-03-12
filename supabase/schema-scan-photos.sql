-- HealthPOS: scan_photos table
-- Run AFTER schema-customers.sql

CREATE TABLE IF NOT EXISTS scan_photos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id  UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  photo_url    TEXT NOT NULL,
  scan_number  SMALLINT NOT NULL,
  day_number   SMALLINT NOT NULL,
  notes        TEXT,
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX scan_photos_customer_id_idx ON scan_photos(customer_id);

-- Enable RLS
ALTER TABLE scan_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers see scan photos of own customers"
  ON scan_photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = scan_photos.customer_id
        AND c.trainer_id = auth.uid()
    )
  );

CREATE POLICY "Managers see club scan photos"
  ON scan_photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers c
      JOIN app_users au ON au.id = auth.uid()
      WHERE c.id = scan_photos.customer_id
        AND au.role = 'manager'
        AND c.club_id = au.club_id
    )
  );

CREATE POLICY "Owners see all scan photos"
  ON scan_photos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM app_users au
      WHERE au.id = auth.uid() AND au.role = 'owner'
    )
  );

CREATE POLICY "Trainers can upload scan photos for own customers"
  ON scan_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers c
      WHERE c.id = scan_photos.customer_id
        AND c.trainer_id = auth.uid()
    )
  );
