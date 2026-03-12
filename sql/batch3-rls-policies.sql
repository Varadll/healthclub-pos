-- HealthPOS Batch 3 — RLS Policies
-- Run this in Supabase SQL Editor FIRST before testing
-- Policy: All authenticated users can read all tables
-- (Owner sees everything; trainer/manager filtering done in app code)

-- CLUBS
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can read clubs" ON clubs;
CREATE POLICY "Authenticated users can read clubs" ON clubs
  FOR SELECT USING (auth.role() = 'authenticated');

-- CUSTOMERS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can read customers" ON customers;
CREATE POLICY "Authenticated users can read customers" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert customers" ON customers;
CREATE POLICY "Authenticated users can insert customers" ON customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update customers" ON customers;
CREATE POLICY "Authenticated users can update customers" ON customers
  FOR UPDATE USING (auth.role() = 'authenticated');

-- MEMBERSHIPS
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can read memberships" ON memberships;
CREATE POLICY "Authenticated users can read memberships" ON memberships
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert memberships" ON memberships;
CREATE POLICY "Authenticated users can insert memberships" ON memberships
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update memberships" ON memberships;
CREATE POLICY "Authenticated users can update memberships" ON memberships
  FOR UPDATE USING (auth.role() = 'authenticated');

-- VISITS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can read visits" ON visits;
CREATE POLICY "Authenticated users can read visits" ON visits
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert visits" ON visits;
CREATE POLICY "Authenticated users can insert visits" ON visits
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- WEIGHT_LOGS
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can read weight_logs" ON weight_logs;
CREATE POLICY "Authenticated users can read weight_logs" ON weight_logs
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert weight_logs" ON weight_logs;
CREATE POLICY "Authenticated users can insert weight_logs" ON weight_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- SCAN_PHOTOS
ALTER TABLE scan_photos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can read scan_photos" ON scan_photos;
CREATE POLICY "Authenticated users can read scan_photos" ON scan_photos
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert scan_photos" ON scan_photos;
CREATE POLICY "Authenticated users can insert scan_photos" ON scan_photos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Verify
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
