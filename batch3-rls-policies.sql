-- ============================================================
-- HealthPOS Batch 3 — RLS Policies for Dashboard Queries
-- Run this in Supabase SQL Editor
-- ============================================================

-- Customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

-- Memberships table
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read memberships"
  ON memberships FOR SELECT
  TO authenticated
  USING (true);

-- Visits table
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read visits"
  ON visits FOR SELECT
  TO authenticated
  USING (true);

-- Weight logs table
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read weight_logs"
  ON weight_logs FOR SELECT
  TO authenticated
  USING (true);

-- Scan photos table
ALTER TABLE scan_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read scan_photos"
  ON scan_photos FOR SELECT
  TO authenticated
  USING (true);
