# AXON CYBERNETICS // COMMAND CENTER

Industrial deep-tech showcase surface for the AXON CYBERNETICS collective.

## Engineering ownership

- **Koglesh R. Murugan** — Lead Full-Stack Cloud Architecture & Database Logic Engine (Software Brain)
- **Yennamutan Muthukumaran** — Lead Embedded Systems, Robotics Chassis & Mechanical Hardware Prototyping (Physical Body)

## Stack

- Next.js App Router + strict TypeScript
- PostgreSQL / isolated `gridpulse` schema
- Node.js route handler with parameterized SQL
- Vercel deployment target

## GRIDPULSE database setup

Run `database/gridpulse.sql` against the PostgreSQL instance used by the application.

The schema is deliberately private. RLS is enabled and forced on `gridpulse.grid_outages`. The ingestion transaction sets the transaction-local `app.gridpulse_ingest` flag before inserting telemetry.

For a dedicated application database role, grant only what the runtime requires:

```sql
GRANT USAGE ON SCHEMA gridpulse TO your_ingest_role;
GRANT INSERT ON gridpulse.grid_outages TO your_ingest_role;
```

If your provider uses a managed connection role, use the provider's documented least-privilege role rather than exposing a browser credential.

## Environment

Copy `.env.example` to your deployment environment and set:

- `DATABASE_URL`
- `GRIDPULSE_INGEST_TOKEN`
- optional `DATABASE_SSL=disable` for local-only development

Never expose either server secret through a `NEXT_PUBLIC_*` variable.

## Telemetry contract

`POST /api/telemetry/report`

```json
{
  "nodeId": "NODE-001",
  "nodeToken": "SERVER_PROVISIONED_NODE_SECRET",
  "latitude": 2.7258,
  "longitude": 101.9378,
  "reportedAt": "2026-09-11T06:00:00.000Z",
  "outageStartedAt": "2026-09-11T05:45:00.000Z",
  "outageResolvedAt": null,
  "signalQuality": 97,
  "voltageV": 231.4,
  "frequencyHz": 50,
  "payloadVersion": "1.0"
}
```

The route validates content type, body size, token authenticity, geographic bounds, timestamps, electrical ranges, and payload shape before opening a database transaction. SQL values are parameterized.

## Visual system

The command center intentionally uses:

- `#0B0B0C` dark foundation
- `#F4D03F` hazard yellow
- `#10B981` operational green
- `#F97316` safety orange
- `#27272A` mechanical gray boundaries
- zero-radius geometry
- monospace technical typography
- dense telemetry-style information hierarchy

No rounded cards or decorative gradients are part of the interface system.
