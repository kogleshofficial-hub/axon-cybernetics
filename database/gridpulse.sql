-- AXON CYBERNETICS // GRIDPULSE
-- Isolated PostgreSQL telemetry schema.
-- Execute as the database owner/migration role.
-- The ingestion service should connect with a tightly scoped server-side role.

BEGIN;

CREATE SCHEMA IF NOT EXISTS gridpulse;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS gridpulse.grid_outages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporting_node_token_hash char(64) NOT NULL,
  node_id text NOT NULL,
  latitude numeric(9,6) NOT NULL,
  longitude numeric(9,6) NOT NULL,
  reported_at timestamptz NOT NULL,
  outage_started_at timestamptz NOT NULL,
  outage_resolved_at timestamptz,
  downtime_seconds integer NOT NULL DEFAULT 0,
  signal_quality smallint,
  voltage_v numeric(8,3),
  frequency_hz numeric(8,3),
  payload_version text NOT NULL DEFAULT '1.0',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT grid_outages_node_token_hash_unique UNIQUE (reporting_node_token_hash),
  CONSTRAINT grid_outages_node_id_format CHECK (node_id ~ '^[A-Za-z0-9._:-]{2,96}$'),
  CONSTRAINT grid_outages_latitude_range CHECK (latitude BETWEEN -90 AND 90),
  CONSTRAINT grid_outages_longitude_range CHECK (longitude BETWEEN -180 AND 180),
  CONSTRAINT grid_outages_reported_time_valid CHECK (reported_at <= now() + interval '10 minutes'),
  CONSTRAINT grid_outages_start_valid CHECK (outage_started_at <= reported_at),
  CONSTRAINT grid_outages_resolve_valid CHECK (outage_resolved_at IS NULL OR outage_resolved_at >= outage_started_at),
  CONSTRAINT grid_outages_signal_valid CHECK (signal_quality IS NULL OR signal_quality BETWEEN 0 AND 100),
  CONSTRAINT grid_outages_voltage_valid CHECK (voltage_v IS NULL OR voltage_v BETWEEN 0 AND 1000),
  CONSTRAINT grid_outages_frequency_valid CHECK (frequency_hz IS NULL OR frequency_hz BETWEEN 0 AND 1000),
  CONSTRAINT grid_outages_downtime_valid CHECK (downtime_seconds >= 0)
);

CREATE INDEX IF NOT EXISTS grid_outages_node_id_idx
  ON gridpulse.grid_outages (node_id);

CREATE INDEX IF NOT EXISTS grid_outages_reported_at_idx
  ON gridpulse.grid_outages (reported_at DESC);

CREATE INDEX IF NOT EXISTS grid_outages_outage_started_at_idx
  ON gridpulse.grid_outages (outage_started_at DESC);

CREATE INDEX IF NOT EXISTS grid_outages_geo_idx
  ON gridpulse.grid_outages (latitude, longitude);

CREATE INDEX IF NOT EXISTS grid_outages_active_idx
  ON gridpulse.grid_outages (node_id, outage_started_at DESC)
  WHERE outage_resolved_at IS NULL;

CREATE OR REPLACE FUNCTION gridpulse.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION gridpulse.calculate_downtime()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.downtime_seconds := GREATEST(
    0,
    FLOOR(EXTRACT(EPOCH FROM (COALESCE(NEW.outage_resolved_at, NEW.reported_at) - NEW.outage_started_at)))::integer
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS grid_outages_updated_at ON gridpulse.grid_outages;
CREATE TRIGGER grid_outages_updated_at
BEFORE UPDATE ON gridpulse.grid_outages
FOR EACH ROW
EXECUTE FUNCTION gridpulse.set_updated_at();

DROP TRIGGER IF EXISTS grid_outages_downtime ON gridpulse.grid_outages;
CREATE TRIGGER grid_outages_downtime
BEFORE INSERT OR UPDATE OF reported_at, outage_started_at, outage_resolved_at
ON gridpulse.grid_outages
FOR EACH ROW
EXECUTE FUNCTION gridpulse.calculate_downtime();

-- Defense in depth: this schema is not a public Data API surface.
REVOKE ALL ON SCHEMA gridpulse FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA gridpulse FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA gridpulse FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA gridpulse FROM PUBLIC;

-- RLS is mandatory even though the schema is private.
ALTER TABLE gridpulse.grid_outages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gridpulse.grid_outages FORCE ROW LEVEL SECURITY;

-- No client-facing role can read or mutate telemetry directly.
DROP POLICY IF EXISTS grid_outages_deny_anon ON gridpulse.grid_outages;
DROP POLICY IF EXISTS grid_outages_deny_authenticated ON gridpulse.grid_outages;
DROP POLICY IF EXISTS grid_outages_deny_public ON gridpulse.grid_outages;

CREATE POLICY grid_outages_deny_anon
  ON gridpulse.grid_outages
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY grid_outages_deny_authenticated
  ON gridpulse.grid_outages
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY grid_outages_deny_public
  ON gridpulse.grid_outages
  AS RESTRICTIVE
  FOR ALL
  TO PUBLIC
  USING (false)
  WITH CHECK (false);

COMMIT;

-- IMPORTANT:
-- The server-side DATABASE_URL used by the ingestion route must belong to a role
-- that is intentionally permitted to write to this private schema. Do not expose
-- that role, its password, or DATABASE_URL to the browser or any NEXT_PUBLIC_* env var.
