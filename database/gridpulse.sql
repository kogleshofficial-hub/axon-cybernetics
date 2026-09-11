-- AXON CYBERNETICS // GRIDPULSE
-- Isolated PostgreSQL telemetry schema.
-- Execute as the database owner/migration role.

BEGIN;

CREATE SCHEMA IF NOT EXISTS gridpulse;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Node registry: the token hash is unique here, not on every outage row.
CREATE TABLE IF NOT EXISTS gridpulse.reporting_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id text NOT NULL UNIQUE,
  reporting_node_token_hash char(64) NOT NULL UNIQUE,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT reporting_nodes_node_id_format CHECK (node_id ~ '^[A-Za-z0-9._:-]{2,96}$')
);

CREATE INDEX IF NOT EXISTS reporting_nodes_active_idx
  ON gridpulse.reporting_nodes (active, last_seen_at DESC);

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
  CONSTRAINT grid_outages_node_id_format CHECK (node_id ~ '^[A-Za-z0-9._:-]{2,96}$'),
  CONSTRAINT grid_outages_latitude_range CHECK (latitude BETWEEN -90 AND 90),
  CONSTRAINT grid_outages_longitude_range CHECK (longitude BETWEEN -180 AND 180),
  CONSTRAINT grid_outages_reported_time_valid CHECK (reported_at <= now() + interval '10 minutes'),
  CONSTRAINT grid_outages_start_valid CHECK (outage_started_at <= reported_at),
  CONSTRAINT grid_outages_resolve_valid CHECK (outage_resolved_at IS NULL OR outage_resolved_at >= outage_started_at),
  CONSTRAINT grid_outages_signal_valid CHECK (signal_quality IS NULL OR signal_quality BETWEEN 0 AND 100),
  CONSTRAINT grid_outages_voltage_valid CHECK (voltage_v IS NULL OR voltage_v BETWEEN 0 AND 1000),
  CONSTRAINT grid_outages_frequency_valid CHECK (frequency_hz IS NULL OR frequency_hz BETWEEN 0 AND 1000),
  CONSTRAINT grid_outages_downtime_valid CHECK (downtime_seconds >= 0),
  CONSTRAINT grid_outages_node_registry_fk
    FOREIGN KEY (node_id) REFERENCES gridpulse.reporting_nodes(node_id)
);

CREATE INDEX IF NOT EXISTS grid_outages_node_id_idx ON gridpulse.grid_outages (node_id);
CREATE INDEX IF NOT EXISTS grid_outages_token_hash_idx ON gridpulse.grid_outages (reporting_node_token_hash);
CREATE INDEX IF NOT EXISTS grid_outages_reported_at_idx ON gridpulse.grid_outages (reported_at DESC);
CREATE INDEX IF NOT EXISTS grid_outages_outage_started_at_idx ON gridpulse.grid_outages (outage_started_at DESC);
CREATE INDEX IF NOT EXISTS grid_outages_geo_idx ON gridpulse.grid_outages (latitude, longitude);
CREATE INDEX IF NOT EXISTS grid_outages_active_idx ON gridpulse.grid_outages (node_id, outage_started_at DESC)
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

DROP TRIGGER IF EXISTS reporting_nodes_updated_at ON gridpulse.reporting_nodes;
CREATE TRIGGER reporting_nodes_updated_at
BEFORE UPDATE ON gridpulse.reporting_nodes
FOR EACH ROW EXECUTE FUNCTION gridpulse.set_updated_at();

DROP TRIGGER IF EXISTS grid_outages_updated_at ON gridpulse.grid_outages;
CREATE TRIGGER grid_outages_updated_at
BEFORE UPDATE ON gridpulse.grid_outages
FOR EACH ROW EXECUTE FUNCTION gridpulse.set_updated_at();

DROP TRIGGER IF EXISTS grid_outages_downtime ON gridpulse.grid_outages;
CREATE TRIGGER grid_outages_downtime
BEFORE INSERT OR UPDATE OF reported_at, outage_started_at, outage_resolved_at
ON gridpulse.grid_outages
FOR EACH ROW EXECUTE FUNCTION gridpulse.calculate_downtime();

-- Private schema: no public Data API exposure.
REVOKE ALL ON SCHEMA gridpulse FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA gridpulse FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA gridpulse FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA gridpulse FROM PUBLIC;

-- RLS is forced for defense in depth. The application explicitly opts into the
-- ingestion policies inside a transaction with SET LOCAL; client-facing roles do not.
ALTER TABLE gridpulse.reporting_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gridpulse.reporting_nodes FORCE ROW LEVEL SECURITY;
ALTER TABLE gridpulse.grid_outages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gridpulse.grid_outages FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS reporting_nodes_ingest_only ON gridpulse.reporting_nodes;
DROP POLICY IF EXISTS reporting_nodes_deny_anon ON gridpulse.reporting_nodes;
DROP POLICY IF EXISTS reporting_nodes_deny_authenticated ON gridpulse.reporting_nodes;
DROP POLICY IF EXISTS grid_outages_ingest_only ON gridpulse.grid_outages;
DROP POLICY IF EXISTS grid_outages_deny_anon ON gridpulse.grid_outages;
DROP POLICY IF EXISTS grid_outages_deny_authenticated ON gridpulse.grid_outages;

CREATE POLICY reporting_nodes_ingest_only
  ON gridpulse.reporting_nodes
  AS PERMISSIVE
  FOR INSERT
  TO PUBLIC
  WITH CHECK (current_setting('app.gridpulse_ingest', true) = 'true');

CREATE POLICY reporting_nodes_ingest_update
  ON gridpulse.reporting_nodes
  AS PERMISSIVE
  FOR UPDATE
  TO PUBLIC
  USING (current_setting('app.gridpulse_ingest', true) = 'true')
  WITH CHECK (current_setting('app.gridpulse_ingest', true) = 'true');

CREATE POLICY reporting_nodes_deny_anon
  ON gridpulse.reporting_nodes
  AS RESTRICTIVE
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY reporting_nodes_deny_authenticated
  ON gridpulse.reporting_nodes
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY grid_outages_ingest_only
  ON gridpulse.grid_outages
  AS PERMISSIVE
  FOR INSERT
  TO PUBLIC
  WITH CHECK (current_setting('app.gridpulse_ingest', true) = 'true');

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

COMMIT;

-- IMPORTANT:
-- The server-side DATABASE_URL must never be exposed as NEXT_PUBLIC_*.
-- The ingest connection needs USAGE on schema gridpulse and INSERT on
-- grid_outages plus INSERT/UPDATE on reporting_nodes. The route sets
-- app.gridpulse_ingest only for the transaction; it is never persisted.
