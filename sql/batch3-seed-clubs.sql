-- HealthPOS Batch 3 — Seed 5 Herbalife Clubs
-- Run this in Supabase SQL Editor AFTER the RLS policies
-- Only inserts if clubs table is empty (safe to re-run)

INSERT INTO clubs (id, name, address, phone, email)
SELECT * FROM (VALUES
  (gen_random_uuid(), 'Herbalife Nutrition Club Cork City', '12 Patrick Street, Cork City, Co. Cork', '+353 21 123 4567', 'corkcity@healthpos.ie'),
  (gen_random_uuid(), 'Herbalife Nutrition Club Ballincollig', '45 Main Street, Ballincollig, Co. Cork', '+353 21 234 5678', 'ballincollig@healthpos.ie'),
  (gen_random_uuid(), 'Herbalife Nutrition Club Douglas', '8 Douglas Village, Douglas, Co. Cork', '+353 21 345 6789', 'douglas@healthpos.ie'),
  (gen_random_uuid(), 'Herbalife Nutrition Club Carrigaline', '22 Main Street, Carrigaline, Co. Cork', '+353 21 456 7890', 'carrigaline@healthpos.ie'),
  (gen_random_uuid(), 'Herbalife Nutrition Club Midleton', '15 Main Street, Midleton, Co. Cork', '+353 21 567 8901', 'midleton@healthpos.ie')
) AS v(id, name, address, phone, email)
WHERE NOT EXISTS (SELECT 1 FROM clubs LIMIT 1);

-- Verify
SELECT id, name, address FROM clubs ORDER BY name;
