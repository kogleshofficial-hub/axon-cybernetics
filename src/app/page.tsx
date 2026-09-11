const nav = ["SYSTEMS", "CAPABILITIES", "FOUNDERS", "ROADMAP"];

const capabilities = [
  ["01", "AI ROBOTICS", "Machine intelligence designed to interpret real-world conditions and act on them."],
  ["02", "EMBEDDED SYSTEMS", "Sensors, microcontrollers, electronics and mechanical integration."],
  ["03", "CLOUD INTELLIGENCE", "Software infrastructure that turns physical-world signals into useful state."],
  ["04", "AUTONOMOUS SYSTEMS", "Robotic behavior built around perception, reasoning and controlled action."],
];

const roadmap = [
  ["01", "FOUNDATION", "Software architecture, robotics research and engineering prototypes."],
  ["02", "PROTOTYPE", "Build, test and document the first physical autonomous systems."],
  ["03", "EXHIBITION", "Present working systems at international engineering and technology exhibitions."],
  ["04", "COMMERCIAL", "When the engineering is mature and the founders are ready, evaluate real-world deployment and product opportunities."],
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="AXON Cybernetics home">
          <span className="logo-box">AX</span>
          <span>AXON<br /><b>CYBERNETICS</b></span>
        </a>
        <nav aria-label="Primary navigation">
          {nav.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
        </nav>
        <a className="header-cta" href="https://github.com/kogleshofficial-hub/axon-cybernetics">BUILD LOG <span>↗</span></a>
      </header>

      <section id="top" className="hero">
        <div className="hero-image" aria-hidden="true">
          <div className="robot-placeholder">
            <span>AXON / FUTURE MACHINE</span>
            <strong>HARDWARE<br />IN DEVELOPMENT</strong>
            <small>NO PRODUCT CLAIMS // NO STOCK ROBOT</small>
          </div>
          <div className="hero-crosshair">+</div>
        </div>
        <div className="hero-content">
          <p className="kicker">INDEPENDENT ROBOTICS &amp; AI ENGINEERING COLLECTIVE</p>
          <h1>BUILDING<br /><em>INTELLIGENCE</em><br />FOR THE REAL WORLD.</h1>
          <p className="hero-copy">AXON CYBERNETICS is a two-founder engineering collective exploring what happens when artificial intelligence, robotics hardware and cloud systems are designed as one machine.</p>
          <div className="hero-links">
            <a className="button button-dark" href="#systems">EXPLORE AXON <span>↘</span></a>
            <a className="text-link" href="#founders">MEET THE FOUNDERS <span>↗</span></a>
          </div>
          <div className="hero-note"><span>01</span> CURRENTLY BUILDING / RESEARCH + PROTOTYPING</div>
        </div>
      </section>

      <section className="statement-band">
        <p>OUR APPROACH</p>
        <h2>ROBOTS SHOULD NOT JUST<br /><span>OBEY COMMANDS.</span> THEY SHOULD<br />UNDERSTAND THE WORLD.</h2>
      </section>

      <section id="systems" className="section systems-section">
        <div className="section-head">
          <div><p className="eyebrow">01 / WHAT WE ARE BUILDING</p><h2>SYSTEMS, NOT GIMMICKS.</h2></div>
          <p className="section-intro">We are intentionally early. This platform documents the engineering journey rather than pretending a prototype already exists.</p>
        </div>
        <div className="feature-grid">
          <article className="feature feature-main">
            <div className="feature-index">AXON / 001</div>
            <div className="feature-visual"><span>PRIMARY ROBOTIC PLATFORM</span><strong>COMING<br />THROUGH<br />ENGINEERING</strong><small>PHYSICAL HARDWARE NOT YET DEPLOYED</small></div>
            <div className="feature-bottom"><h3>AI-NATIVE ROBOTICS</h3><p>A future platform for perception, reasoning and action in physical environments.</p></div>
          </article>
          <div className="feature-stack">
            <article className="feature small-feature"><span className="feature-index">AXON / 002</span><div><p className="eyebrow">INFRASTRUCTURE</p><h3>GRIDPULSE</h3><p>Utility telemetry architecture exploring how distributed physical nodes can report verified real-world conditions.</p><span className="status">RESEARCH / ACTIVE</span></div></article>
            <article className="feature small-feature light-feature"><span className="feature-index">AXON / 003</span><div><p className="eyebrow">RESEARCH</p><h3>THE AUTONOMY LAB</h3><p>Experiments in computer vision, AI decision systems, embedded control and mechanical robotics.</p><span className="status dark-status">BUILDING / NEXT</span></div></article>
          </div>
        </div>
      </section>

      <section id="capabilities" className="capability-strip">
        <div className="section capability-inner">
          <div className="section-head compact"><div><p className="eyebrow">02 / CAPABILITIES</p><h2>ONE MACHINE.<br />MULTIPLE DISCIPLINES.</h2></div></div>
          <div className="capability-grid">
            {capabilities.map(([num, title, text]) => <article key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section id="founders" className="section founders-section">
        <div className="section-head"><div><p className="eyebrow">03 / FOUNDERS</p><h2>TWO ENGINEERS.<br />ONE SYSTEM.</h2></div><p className="section-intro">AXON is intentionally small. Every part of the system has an owner, and every future machine must connect software decisions to physical reality.</p></div>
        <div className="founder-grid">
          <article className="founder-card"><div className="portrait-placeholder"><span>KRM</span><small>SOFTWARE / CLOUD / AI</small></div><div className="founder-copy"><p className="eyebrow">SOFTWARE BRAIN</p><h3>KOGLESH R.<br />MURUGAN</h3><p>Lead Full-Stack Cloud Architecture &amp; Database Logic. Next.js, TypeScript, PostgreSQL, Supabase and Vercel.</p><div className="founder-role">LEAD SOFTWARE / CLOUD ARCHITECTURE</div></div></article>
          <article className="founder-card"><div className="portrait-placeholder orange"><span>YM</span><small>EMBEDDED / ROBOTICS</small></div><div className="founder-copy"><p className="eyebrow">PHYSICAL BODY</p><h3>YENNAMUTAN<br />MUTHUKUMARAN</h3><p>Lead Embedded Systems, Robotics Chassis &amp; Mechanical Hardware Prototyping. C++, Python, computer vision and circuit design.</p><div className="founder-role">LEAD ROBOTICS / EMBEDDED ENGINEERING</div></div></article>
        </div>
      </section>

      <section className="principle-band"><div><p className="eyebrow">ENGINEERING PRINCIPLE</p><h2>IF IT CANNOT SURVIVE<br /><span>REAL-WORLD TESTING,</span><br />IT IS NOT FINISHED.</h2></div><div className="principle-number">AX<br />/02</div></section>

      <section id="roadmap" className="section roadmap-section">
        <div className="section-head"><div><p className="eyebrow">04 / ROADMAP</p><h2>FROM IDEA<br />TO MACHINE.</h2></div><p className="section-intro">No invented customer list. No imaginary fleet. No fake deployment numbers. The public record grows only when the engineering does.</p></div>
        <div className="roadmap-list">{roadmap.map(([num, title, text]) => <article key={num}><span>{num}</span><div><h3>{title}</h3><p>{text}</p></div><b>↗</b></article>)}</div>
      </section>

      <section id="contact" className="contact-section"><p className="eyebrow">AXON CYBERNETICS / 2026</p><h2>THE MACHINE<br /><em>IS NEXT.</em></h2><p>For engineering collaboration, exhibition opportunities or technical enquiries, follow the public build record and contact the founders through their professional channels.</p><a className="button button-light" href="https://github.com/kogleshofficial-hub/axon-cybernetics">VIEW BUILD LOG <span>↗</span></a></section>

      <footer className="site-footer"><div className="footer-brand"><span className="logo-box">AX</span><strong>AXON CYBERNETICS</strong></div><div>AI ROBOTICS / EMBEDDED SYSTEMS / CLOUD INTELLIGENCE</div><div>© 2026 AXON CYBERNETICS</div></footer>
    </main>
  );
}
