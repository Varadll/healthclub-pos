-- Batch 5 RLS Policies
-- Run this in Supabase SQL Editor BEFORE testing the APIs

-- Memberships: authenticated users can SELECT
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can read memberships' AND tablename = 'memberships'
  ) THEN
    CREATE POLICY "Authenticated users can read memberships"
      ON memberships FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Memberships: authenticated users can INSERT
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can create memberships' AND tablename = 'memberships'
  ) THEN
    CREATE POLICY "Authenticated users can create memberships"
      ON memberships FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

-- Memberships: authenticated users can UPDATE (for status/days_remaining changes)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update memberships' AND tablename = 'memberships'
  ) THEN
    CREATE POLICY "Authenticated users can update memberships"
      ON memberships FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Visits: authenticated users can SELECT
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can read visits' AND tablename = 'visits'
  ) THEN
    CREATE POLICY "Authenticated users can read visits"
      ON visits FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Visits: authenticated users can INSERT
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can create visits' AND tablename = 'visits'
  ) THEN
    CREATE POLICY "Authenticated users can create visits"
      ON visits FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;

SELECT 'Batch 5 RLS policies applied ✅' AS result;
