import { createHash, timingSafeEqual } from "node:crypto";
import { Pool, type PoolClient } from "pg";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 32 * 1024;
const MAX_NODE_ID_LENGTH = 96;

const globalForGridPulse = globalThis as unknown as {
  gridPulsePool?: Pool;
};

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!connectionString) throw new Error("DATABASE_URL or POSTGRES_URL is not configured");

  if (!globalForGridPulse.gridPulsePool) {
    globalForGridPulse.gridPulsePool = new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
      maxUses: 5_000,
      ssl: process.env.DATABASE_SSL === "disable" ? false : { rejectUnauthorized: false },
    });
  }

  return globalForGridPulse.gridPulsePool;
}

type TelemetryPayload = {
  nodeId: string;
  nodeToken: string;
  latitude: number;
  longitude: number;
  reportedAt: string;
  outageStartedAt: string;
  outageResolvedAt?: string | null;
  signalQuality?: number | null;
  voltageV?: number | null;
  frequencyHz?: number | null;
  payloadVersion?: string;
};

type NormalizedTelemetry = {
  nodeId: string;
  tokenHash: string;
  latitude: number;
  longitude: number;
  reportedAt: Date;
  outageStartedAt: Date;
  outageResolvedAt: Date | null;
  signalQuality: number | null;
  voltageV: number | null;
  frequencyHz: number | null;
  payloadVersion: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string" || value.length === 0 || value.length > maxLength) {
    throw new Error(`${field} must be a non-empty string with max length ${maxLength}`);
  }
  return value;
}

function optionalFiniteNumber(value: unknown, field: string): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${field} must be a finite number`);
  }
  return value;
}

function parseTimestamp(value: unknown, field: string): Date {
  const raw = requiredString(value, field, 64);
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) throw new Error(`${field} must be a valid ISO-8601 timestamp`);
  return parsed;
}

function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function tokensMatch(received: string, expected: string): boolean {
  const receivedHash = Buffer.from(sha256Hex(received), "hex");
  const expectedHash = Buffer.from(sha256Hex(expected), "hex");
  return receivedHash.length === expectedHash.length && timingSafeEqual(receivedHash, expectedHash);
}

function configuredNodeTokens(): Record<string, string> {
  const mapping = process.env.GRIDPULSE_NODE_TOKENS;

  if (mapping) {
    try {
      const parsed: unknown = JSON.parse(mapping);
      if (!isPlainObject(parsed)) throw new Error("GRIDPULSE_NODE_TOKENS must be a JSON object");

      const output: Record<string, string> = {};
      for (const [nodeId, token] of Object.entries(parsed)) {
        if (!/^[A-Za-z0-9._:-]{2,96}$/.test(nodeId) || typeof token !== "string" || token.length < 24) {
          throw new Error("Invalid GRIDPULSE_NODE_TOKENS entry");
        }
        output[nodeId] = token;
      }
      return output;
    } catch (error) {
      console.error("Invalid GRIDPULSE_NODE_TOKENS", error);
      return {};
    }
  }

  const fallback = process.env.GRIDPULSE_INGEST_TOKEN;
  return fallback ? { "NODE-DEFAULT": fallback } : {};
}

function normalizePayload(input: unknown): NormalizedTelemetry {
  if (!isPlainObject(input)) throw new Error("Request body must be a JSON object");
  const payload = input as Record<string, unknown>;

  const nodeId = requiredString(payload.nodeId, "nodeId", MAX_NODE_ID_LENGTH);
  const nodeToken = requiredString(payload.nodeToken, "nodeToken", 256);
  const latitude = optionalFiniteNumber(payload.latitude, "latitude");
  const longitude = optionalFiniteNumber(payload.longitude, "longitude");

  if (latitude === null || latitude < -90 || latitude > 90) throw new Error("latitude must be between -90 and 90");
  if (longitude === null || longitude < -180 || longitude > 180) throw new Error("longitude must be between -180 and 180");

  const reportedAt = parseTimestamp(payload.reportedAt, "reportedAt");
  const outageStartedAt = parseTimestamp(payload.outageStartedAt, "outageStartedAt");
  const outageResolvedAt =
    payload.outageResolvedAt === undefined || payload.outageResolvedAt === null
      ? null
      : parseTimestamp(payload.outageResolvedAt, "outageResolvedAt");

  const now = Date.now();
  if (reportedAt.getTime() > now + 10 * 60 * 1000) throw new Error("reportedAt is too far in the future");
  if (outageStartedAt.getTime() > reportedAt.getTime()) throw new Error("outageStartedAt cannot be after reportedAt");
  if (outageResolvedAt && outageResolvedAt.getTime() < outageStartedAt.getTime()) {
    throw new Error("outageResolvedAt cannot be before outageStartedAt");
  }

  const signalQuality = optionalFiniteNumber(payload.signalQuality, "signalQuality");
  if (signalQuality !== null && (signalQuality < 0 || signalQuality > 100)) {
    throw new Error("signalQuality must be between 0 and 100");
  }

  const voltageV = optionalFiniteNumber(payload.voltageV, "voltageV");
  if (voltageV !== null && (voltageV < 0 || voltageV > 1000)) throw new Error("voltageV must be between 0 and 1000");

  const frequencyHz = optionalFiniteNumber(payload.frequencyHz, "frequencyHz");
  if (frequencyHz !== null && (frequencyHz < 0 || frequencyHz > 1000)) {
    throw new Error("frequencyHz must be between 0 and 1000");
  }

  const payloadVersion = payload.payloadVersion === undefined
    ? "1.0"
    : requiredString(payload.payloadVersion, "payloadVersion", 32);

  return {
    nodeId,
    tokenHash: sha256Hex(nodeToken),
    latitude,
    longitude,
    reportedAt,
    outageStartedAt,
    outageResolvedAt,
    signalQuality,
    voltageV,
    frequencyHz,
    payloadVersion,
  };
}

async function readJson(request: Request): Promise<unknown> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) throw new Error("Payload exceeds 32 KB limit");

  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) throw new Error("Payload exceeds 32 KB limit");

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Request body is not valid JSON");
  }
}

async function insertTelemetry(client: PoolClient, telemetry: NormalizedTelemetry): Promise<string> {
  await client.query("SET LOCAL app.gridpulse_ingest = 'true'");

  const registryResult = await client.query(
    `
      INSERT INTO gridpulse.reporting_nodes (node_id, reporting_node_token_hash, last_seen_at, active)
      VALUES ($1, $2, now(), true)
      ON CONFLICT (node_id)
      DO UPDATE SET
        last_seen_at = now(),
        active = true
      WHERE gridpulse.reporting_nodes.reporting_node_token_hash = EXCLUDED.reporting_node_token_hash
    `,
    [telemetry.nodeId, telemetry.tokenHash],
  );

  if (registryResult.rowCount !== 1) {
    throw new Error("Reporting node identity conflict");
  }

  const result = await client.query<{ id: string }>(
    `
      INSERT INTO gridpulse.grid_outages (
        reporting_node_token_hash,
        node_id,
        latitude,
        longitude,
        reported_at,
        outage_started_at,
        outage_resolved_at,
        signal_quality,
        voltage_v,
        frequency_hz,
        payload_version
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `,
    [
      telemetry.tokenHash,
      telemetry.nodeId,
      telemetry.latitude,
      telemetry.longitude,
      telemetry.reportedAt.toISOString(),
      telemetry.outageStartedAt.toISOString(),
      telemetry.outageResolvedAt?.toISOString() ?? null,
      telemetry.signalQuality,
      telemetry.voltageV,
      telemetry.frequencyHz,
      telemetry.payloadVersion,
    ],
  );

  const id = result.rows[0]?.id;
  if (!id) throw new Error("Database insert returned no telemetry identifier");
  return id;
}

export async function POST(request: Request): Promise<NextResponse> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Content-Type must be application/json" }, { status: 415 });
  }

  let telemetry: NormalizedTelemetry;
  try {
    const body = await readJson(request);
    if (!isPlainObject(body)) return NextResponse.json({ ok: false, error: "Invalid telemetry payload" }, { status: 400 });

    const candidateToken = body.nodeToken;
    const nodeId = body.nodeId;
    if (typeof candidateToken !== "string" || typeof nodeId !== "string") {
      return NextResponse.json({ ok: false, error: "nodeId and nodeToken are required" }, { status: 400 });
    }

    const configuredToken = configuredNodeTokens()[nodeId];
    if (!configuredToken || !tokensMatch(candidateToken, configuredToken)) {
      return NextResponse.json({ ok: false, error: "Unauthorized reporting node" }, { status: 401 });
    }

    telemetry = normalizePayload(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }

  const pool = getPool();
  let client: PoolClient | undefined;

  try {
    client = await pool.connect();
    await client.query("BEGIN");
    const telemetryId = await insertTelemetry(client, telemetry);
    await client.query("COMMIT");

    return NextResponse.json(
      { ok: true, accepted: true, telemetryId, receivedAt: new Date().toISOString() },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (client) {
      try { await client.query("ROLLBACK"); } catch (rollbackError) { console.error("GRIDPULSE rollback failed", rollbackError); }
    }

    const message = error instanceof Error ? error.message : "Telemetry transaction failed";
    if (message === "Reporting node identity conflict") {
      return NextResponse.json({ ok: false, error: message }, { status: 409 });
    }

    console.error("GRIDPULSE telemetry ingestion failed", error);
    return NextResponse.json({ ok: false, error: "Telemetry transaction failed" }, { status: 503 });
  } finally {
    client?.release();
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: true, service: "GRIDPULSE telemetry ingestion", status: "READY", method: "POST" },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export type { TelemetryPayload };
