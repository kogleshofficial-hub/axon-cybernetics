import TelemetryTicker from "@/components/TelemetryTicker";

const capabilityRows = [
  ["01", "NEXT.JS / TYPESCRIPT", "CLOUD APPLICATION FABRICATION"],
  ["02", "SUPABASE / POSTGRESQL", "DATA + CONTROL PLANE LOGIC"],
  ["03", "VERCEL DEVOPS", "EDGE DEPLOYMENT / DELIVERY"],
  ["04", "PYTHON / OPENCV / TENSORFLOW", "VISION + PERCEPTION PIPELINE"],
  ["05", "C++ MICROCONTROLLERS", "LOW-LEVEL EMBEDDED CONTROL"],
  ["06", "MECHANICAL PROTOTYPING", "ROBOTIC CHASSIS / HARDWARE"],
];

const gridPulseSignals = [
  ["NETWORK", "GLOBAL UTILITY TELEMETRY"],
  ["INGEST", "AUTHENTICATED NODE REPORTING"],
  ["DATABASE", "GRIDPULSE / PRIVATE POSTGRES"],
  ["VERIFICATION", "SERVER-SIDE TRANSFORMATION"],
];

export default function Home() {
  return (
    <main className="command-shell">
      <div className="scanline" aria-hidden="true" />

      <header className="system-header">
        <div className="brand-lockup">
          <span className="brand-mark">AX</span>
          <div>
            <p className="eyebrow">AXON CYBERNETICS</p>
            <h1>COMMAND / 01</h1>
          </div>
        </div>

        <div className="system-state" role="status" aria-live="polite">
          <span className="live-dot" aria-hidden="true" />
          <span>SYSTEM: OPERATIONAL</span>
          <span className="state-divider">//</span>
          <span>AGENTIC_ROBOTICS_LINK_ACTIVE</span>
        </div>

        <div className="header-meta">
          <span>BUILD 01.0001</span>
          <span>GLOBAL // UTC</span>
        </div>
      </header>

      <section className="hero-grid" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="section-index">[ AXON / INDUSTRIAL DEEP-TECH COLLECTIVE ]</p>
          <h2 id="hero-title">
            THE SOFTWARE
            <br />
            BRAIN MEETS
            <br />
            THE PHYSICAL BODY.
          </h2>
          <p className="hero-summary">
            A joint engineering surface for cloud intelligence, embedded systems,
            robotics hardware, and infrastructure telemetry. No decorative layer.
            Just the control plane.
          </p>
          <div className="hero-actions">
            <span className="action-tag">[ LIVE SYSTEM ]</span>
            <span className="action-tag">[ EXHIBITION BUILD ]</span>
            <span className="action-tag">[ IMAGINE CUP TRACK ]</span>
          </div>
        </div>

        <div className="hero-instrument" aria-label="Command center instrumentation">
          <div className="instrument-topline">
            <span>AXON.NODE / CORE</span>
            <span>AUTH 100%</span>
          </div>
          <div className="instrument-grid">
            <div className="instrument-cell large">
              <span className="cell-label">CONTROL PLANE</span>
              <strong>ONLINE</strong>
              <span className="cell-code">NEXT / PG / EDGE</span>
            </div>
            <div className="instrument-cell">
              <span className="cell-label">LATENCY</span>
              <strong>&lt;100MS</strong>
              <span className="cell-code">TARGET</span>
            </div>
            <div className="instrument-cell warning-cell">
              <span className="cell-label">SAFETY</span>
              <strong>HARD-FAIL</strong>
              <span className="cell-code">NO SILENT DEGRADE</span>
            </div>
          </div>
          <div className="instrument-footer">
            <span>SYNC ████████████████████ 100%</span>
            <span>RLS / ACTIVE</span>
          </div>
        </div>
      </section>

      <section className="dual-grid" aria-label="Unified technical capabilities">
        <article className="capability-panel brain-panel">
          <div className="panel-header">
            <span className="panel-id">A-01</span>
            <span className="panel-state">SOFTWARE BRAIN // ACTIVE</span>
          </div>
          <h3>SOFTWARE BRAIN</h3>
          <p className="panel-lead">
            Cloud architecture, data systems, deployment infrastructure, and the
            decision logic that turns physical signals into actionable state.
          </p>
          <div className="capability-list">
            {capabilityRows.slice(0, 3).map(([id, title, detail]) => (
              <div className="capability-row" key={id}>
                <span className="row-id">{id}</span>
                <span className="row-title">{title}</span>
                <span className="row-detail">{detail}</span>
              </div>
            ))}
          </div>
          <div className="owner-strip">
            <span>DIRECTOR</span>
            <strong>KOGLESH R. MURUGAN</strong>
            <span>FULL-STACK / CLOUD / DATABASE</span>
          </div>
        </article>

        <article className="capability-panel body-panel">
          <div className="panel-header">
            <span className="panel-id">B-01</span>
            <span className="panel-state">HARDWARE BODY // ACTIVE</span>
          </div>
          <h3>HARDWARE BODY</h3>
          <p className="panel-lead">
            Embedded control, perception, chassis engineering, and the physical
            systems that collect real-world evidence and execute commands.
          </p>
          <div className="capability-list">
            {capabilityRows.slice(3).map(([id, title, detail]) => (
              <div className="capability-row" key={id}>
                <span className="row-id">{id}</span>
                <span className="row-title">{title}</span>
                <span className="row-detail">{detail}</span>
              </div>
            ))}
            <div className="capability-row">
              <span className="row-id">06</span>
              <span className="row-title">CIRCUIT DESIGN</span>
              <span className="row-detail">POWER / SENSOR / CONTROL INTERFACES</span>
            </div>
          </div>
          <div className="owner-strip">
            <span>DIRECTOR</span>
            <strong>YENNAMUTAN MUTHUKUMARAN</strong>
            <span>EMBEDDED / ROBOTICS / MECHANICAL</span>
          </div>
        </article>
      </section>

      <section className="gridpulse-panel" aria-labelledby="gridpulse-title">
        <div className="gridpulse-heading">
          <div>
            <p className="section-index">[ INFRASTRUCTURE ENGINE / GP-01 ]</p>
            <h2 id="gridpulse-title">GRIDPULSE</h2>
            <p>GLOBAL UTILITY BLACKOUT TELEMETRY NETWORK</p>
          </div>
          <div className="pulse-state">
            <span className="live-dot" aria-hidden="true" />
            <strong>INGEST READY</strong>
            <span>POST /api/telemetry/report</span>
          </div>
        </div>

        <div className="gridpulse-grid">
          <div className="telemetry-card">
            <div className="telemetry-card-head">
              <span>LIVE FEED / SYSTEM EVENTS</span>
              <span className="terminal-green">● STREAM</span>
            </div>
            <TelemetryTicker />
          </div>

          <div className="telemetry-card specification-card">
            <div className="telemetry-card-head">
              <span>CONTROL SURFACE</span>
              <span>LOCKED</span>
            </div>
            {gridPulseSignals.map(([label, value]) => (
              <div className="spec-row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
            <div className="coordinates-block">
              <span>GEO-DATA FORMAT</span>
              <strong>DECIMAL LAT / LONG</strong>
              <code>LAT ±90.000000 / LONG ±180.000000</code>
            </div>
            <div className="warning-banner">
              <span>!</span>
              <strong>SAFETY GATE</strong>
              <p>UNVERIFIED HARDWARE PAYLOADS ARE REJECTED BEFORE TRANSACTION COMMIT.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="engineering-log" aria-label="Engineering record">
        <div className="log-title">
          <span>ENGINEERING RECORD</span>
          <span>NO. AXON-0001</span>
        </div>
        <div className="log-grid">
          <div>
            <span className="log-label">MISSION</span>
            <strong>BUILD SYSTEMS THAT SURVIVE REAL-WORLD CONDITIONS.</strong>
          </div>
          <div>
            <span className="log-label">PRINCIPLE</span>
            <strong>MEASURE FIRST. VERIFY TWICE. SHIP THE HARD THING.</strong>
          </div>
          <div>
            <span className="log-label">STATUS</span>
            <strong className="terminal-green">OPERATIONAL / CONTINUOUS</strong>
          </div>
        </div>
      </section>

      <footer className="industrial-footer">
        <div>
          <strong>AXON CYBERNETICS</strong>
          <span>ENGINEERING OWNERSHIP // SYSTEM RECORD</span>
        </div>
        <p>
          © 2026 AXON CYBERNETICS. SYSTEM ARCHITECTURE, SOFTWARE, HARDWARE
          CONCEPTS, AND ENGINEERING RECORDS CREDITED TO KOGLESH R. MURUGAN
          (SOFTWARE BRAIN) AND YENNAMUTAN MUTHUKUMARAN (HARDWARE BODY).
        </p>
        <div className="footer-code">AXON//GRIDPULSE//01</div>
      </footer>
    </main>
  );
}
