const nav = ["MACHINES", "INTELLIGENCE", "FOUNDERS", "ROADMAP"];

const machines = [
  { id: "AX-01", name: "AEGIS", type: "AUTONOMOUS FIELD PLATFORM", mission: "A future mobile robotic platform for inspection, mapping and environmental awareness in places where human access is limited.", intelligence: "PERCEPTION / LOCAL REASONING / AUTONOMOUS NAVIGATION", body: "MOBILE CHASSIS / SENSOR ARRAY / EMBEDDED CONTROL", state: "CONCEPT / RESEARCH" },
  { id: "AX-02", name: "SENTINEL", type: "INFRASTRUCTURE INTELLIGENCE UNIT", mission: "A future robotic system designed to observe infrastructure conditions and turn physical signals into actionable system state.", intelligence: "COMPUTER VISION / SENSOR FUSION / CLOUD TELEMETRY", body: "MODULAR SENSOR BODY / EDGE COMPUTE / FIELD LINK", state: "CONCEPT / RESEARCH" },
  { id: "AX-03", name: "ORBIT", type: "ADAPTIVE SERVICE ROBOT", mission: "A long-term exploration platform for robots that can perceive changing environments and choose actions instead of following a fixed script.", intelligence: "WORLD MODEL / DECISION SYSTEMS / CONTROL", body: "RECONFIGURABLE BODY / ACTUATION / EMBEDDED AI", state: "FUTURE PROGRAM" },
];

const intelligence = [
  ["01", "SEE", "Computer vision, sensor inputs and environmental perception."],
  ["02", "UNDERSTAND", "Software models that turn raw signals into a usable picture of the world."],
  ["03", "DECIDE", "Reasoning and control logic for selecting actions under changing conditions."],
  ["04", "MOVE", "Embedded systems, actuation and mechanical design that turn decisions into physical action."],
];

const roadmap = [
  ["01", "FOUNDATION", "Build the software brain, simulation systems and engineering architecture."],
  ["02", "FIRST BODY", "Prototype the first physical robotic platform and validate the core control loop."],
  ["03", "FIELD TEST", "Take working systems outside the lab, measure failure and iterate."],
  ["04", "EXHIBITION", "Present verified working technology at international engineering exhibitions."],
];

function MachineCard({ machine, featured = false }: { machine: typeof machines[number]; featured?: boolean }) {
  return <article className={`machine-card ${featured ? "machine-featured" : ""}`}>
    <div className="machine-top"><span>{machine.id}</span><span>{machine.state}</span></div>
    <div className="machine-drawing" aria-hidden="true">
      <div className="drawing-frame" /><div className="robot-silhouette"><i /><b /><em /></div>
      <span className="drawing-label label-a">AXON / DESIGN STUDY</span><span className="drawing-label label-b">{machine.body}</span><span className="drawing-label label-c">CONCEPT ONLY</span><div className="drawing-cross">+</div>
    </div>
    <div className="machine-info"><p className="eyebrow">{machine.type}</p><h3>{machine.name}</h3><p>{machine.mission}</p>
      <div className="machine-specs"><span>INTELLIGENCE</span><strong>{machine.intelligence}</strong></div><div className="machine-specs"><span>PHYSICAL SYSTEM</span><strong>{machine.body}</strong></div>
    </div>
  </article>;
}

export default function Home() {
  return <main>
    <header className="site-header">
      <a className="logo" href="#top" aria-label="AXON Cybernetics home"><span className="logo-box">AX</span><span>AXON<br /><b>CYBERNETICS</b></span></a>
      <nav>{nav.map(item => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav>
      <a className="header-cta" href="#machines">ENTER SYSTEM ↘</a>
    </header>

    <section id="top" className="hero">
      <div className="hero-index">AXON / 01<br />INDEPENDENT ROBOTICS<br />2026</div>
      <div className="hero-center">
        <p className="hero-kicker">THE SOFTWARE BRAIN / THE PHYSICAL BODY</p>
        <h1>INTELLIGENCE<br /><span>THAT MOVES.</span></h1>
        <a className="hero-button" href="#machines">EXPLORE THE SYSTEM <b>↓</b></a>
      </div>
      <div className="hero-bottom">
        <div><span>BUILT BY</span><strong>KOGLESH R. MURUGAN</strong><small>SOFTWARE / CLOUD / DATABASE</small></div>
        <div><span>BUILT BY</span><strong>YENNAMUTAN MUTHUKUMARAN</strong><small>EMBEDDED / ROBOTICS / MECHANICAL</small></div>
        <div><span>TRACK</span><strong>IMAGINE CUP / DEEP TECH</strong><small>CONCEPT → PROTOTYPE → FIELD</small></div>
      </div>
    </section>

    <section className="manifesto"><span>AXON / ENGINEERING THESIS</span><h2>ROBOTS SHOULD NOT<br />JUST OBEY. <em>THEY SHOULD UNDERSTAND.</em></h2><p>AXON is a two-founder engineering collective building toward autonomous robotics. The systems shown here are future programs and design directions, presented honestly as work toward physical prototypes.</p></section>

    <section id="machines" className="section machines-section"><div className="section-head"><div><p className="eyebrow">01 / FUTURE MACHINE PROGRAMS</p><h2>THE MACHINES<br />WE ARE BUILDING TOWARD.</h2></div><p className="section-intro">The core of AXON: concrete machine programs with defined missions, intelligence architecture and physical design requirements.</p></div><div className="machine-grid"><MachineCard machine={machines[0]} featured /><MachineCard machine={machines[1]} /><MachineCard machine={machines[2]} /></div></section>

    <section id="intelligence" className="intelligence-section"><div className="section intelligence-inner"><div className="section-head"><div><p className="eyebrow">02 / INTELLIGENCE STACK</p><h2>FROM SENSOR<br />TO ACTION.</h2></div><p className="section-intro">Perception, reasoning, software infrastructure and physical control connected as one future architecture.</p></div><div className="intelligence-grid">{intelligence.map(([num,title,text]) => <article key={num}><span>{num}</span><div className="stack-mark">{title === "SEE" ? "01" : title === "UNDERSTAND" ? "02" : title === "DECIDE" ? "03" : "04"}</div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

    <section className="gridpulse-section"><div className="gridpulse-visual"><span>INFRASTRUCTURE ENGINE / GP-01</span><strong>PHYSICAL<br />WORLD<br /><em>→ DIGITAL STATE</em></strong><div className="pulse-lines" /></div><div className="gridpulse-copy"><p className="eyebrow">RESEARCH SYSTEM / GRIDPULSE</p><h2>THE WORLD<br />IS THE DATA.</h2><p>GRIDPULSE is AXON's infrastructure research direction: a telemetry architecture for distributed physical nodes, verified reports and real-world system state.</p><div className="gridpulse-list"><span>01 / EDGE SIGNALS</span><span>02 / VERIFIED EVENTS</span><span>03 / CLOUD STATE</span><span>04 / SYSTEM RESPONSE</span></div></div></section>

    <section id="founders" className="section founders-section"><div className="section-head"><div><p className="eyebrow">03 / ENGINEERING TEAM</p><h2>TWO BRAINS.<br />ONE MACHINE.</h2></div><p className="section-intro">Software and physical engineering developed together from the beginning.</p></div><div className="founder-grid"><article><div className="founder-mark">KRM</div><p className="eyebrow">SOFTWARE BRAIN</p><h3>KOGLESH R.<br />MURUGAN</h3><p>Lead Full-Stack Cloud Architecture &amp; Database Logic. Next.js, TypeScript, PostgreSQL, Supabase and Vercel.</p><strong>SOFTWARE / CLOUD / AI</strong></article><article className="founder-yellow"><div className="founder-mark">YM</div><p className="eyebrow">PHYSICAL BODY</p><h3>YENNAMUTAN<br />MUTHUKUMARAN</h3><p>Lead Embedded Systems, Robotics Chassis &amp; Mechanical Hardware Prototyping. C++, Python, computer vision and circuit design.</p><strong>ROBOTICS / EMBEDDED / HARDWARE</strong></article></div></section>

    <section id="roadmap" className="roadmap-v2"><div className="section"><div className="section-head"><div><p className="eyebrow">04 / ROADMAP</p><h2>CONCEPT.<br />PROTOTYPE.<br />MACHINE.</h2></div><p className="section-intro">No fake deployments. No imaginary customers. No pretending a concept is a finished robot.</p></div><div className="roadmap-grid">{roadmap.map(([num,title,text]) => <article key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p><b>↗</b></article>)}</div></div></section>

    <section className="closing"><p>AXON CYBERNETICS / INDEPENDENT ROBOTICS &amp; AI</p><h2>THE BODY<br /><em>COMES NEXT.</em></h2><a href="https://github.com/kogleshofficial-hub/axon-cybernetics">OPEN BUILD RECORD ↗</a></section>
    <footer><div><span className="logo-box">AX</span><strong>AXON CYBERNETICS</strong></div><span>INTELLIGENCE THAT MOVES.</span><span>© 2026</span></footer>
  </main>;
}
