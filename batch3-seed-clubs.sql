-- ============================================================
-- HealthPOS Batch 3 — Seed 5 Clubs
-- Run this in Supabase SQL Editor
-- ============================================================

INSERT INTO clubs (id, name, address, phone) VALUES
  (gen_random_uuid(), 'Dean Rock Nutrition', NULL, NULL),
  (gen_random_uuid(), 'Dublin Hill Nutrition — Blackpool', 'Blackpool, Cork', NULL),
  (gen_random_uuid(), 'Healthy Happy Club', 'Bishopstown, Cork', NULL),
  (gen_random_uuid(), 'Dublin Hill Nutrition — Ballincollig', 'Ballincollig, Cork', NULL),
  (gen_random_uuid(), 'Local Nutrition Club', NULL, NULL);
