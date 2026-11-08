# Protfolio-
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ayush Kumar Pandey | Frontend Web Developer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #111827;
      --border: #1f2937;
      --accent: #38bdf8;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 0 1.25rem;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 3rem 0;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--border);
    }
    .logo {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--accent);
      letter-spacing: -0.5px;
    }
    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      margin-left: 1.5rem;
      font-size: 0.95rem;
      transition: color 0.2s;
    }
    .nav-links a:hover {
      color: var(--accent);
    }
    .hero {
      padding: 5rem 0 3.5rem;
    }
    .badge {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      background: rgba(56, 189, 248, 0.1);
      color: var(--accent);
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    .hero h1 {
      font-size: clamp(2.2rem, 5vw, 3.5rem);
      line-height: 1.15;
      font-weight: 800;
      margin-bottom: 1rem;
    }
    .hero p {
      color: var(--text-muted);
      font-size: 1.15rem;
      max-width: 620px;
      margin-bottom: 2rem;
    }
    .cta-btn {
      display: inline-block;
      background: var(--accent);
      color: #0b0f19;
      font-weight: 700;
      padding: 0.85rem 1.75rem;
      border-radius: 8px;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .cta-btn:hover {
      opacity: 0.9;
    }
    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      letter-spacing: -0.5px;
    }
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 4rem;
    }
    .skill-chip {
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 4rem;
    }
    .project-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 1.5rem;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .project-card h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }
    .project-card p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1.25rem;
    }
    .project-tech {
      display: flex;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .project-links a {
      color: var(--text);
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      border-bottom: 1px solid var(--accent);
      padding-bottom: 2px;
    }
    footer {
      border-top: 1px solid var(--border);
      padding-top: 2rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    footer a {
      color: var(--accent);
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo">AYUSH.DEV</div>
      <div class="nav-links">
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="mailto:pandeybrother251@gmail.com">Contact</a>
      </div>
    </header>

    <section class="hero">
      <span class="badge">Open for Web Development Opportunities</span>
      <h1>Hi, I'm Ayush Kumar Pandey.</h1>
      <p>Frontend Web Developer specializing in clean UI design, responsive interfaces, and modern landing pages.</p>
      <a href="mailto:pandeybrother251@gmail.com" class="cta-btn">Get In Touch</a>
    </section>

    <section id="skills">
      <h2 class="section-title">Technical Skills</h2>
      <div class="skills-grid">
        <div class="skill-chip">HTML5 & Semantic Structure</div>
        <div class="skill-chip">CSS3 & Responsive Layouts</div>
        <div class="skill-chip">JavaScript (ES6+)</div>
        <div class="skill-chip">Git & GitHub</div>
        <div class="skill-chip">UI/UX Optimization</div>
      </div>
    </section>

    <section id="projects">
      <h2 class="section-title">Projects</h2>
      <div class="projects-grid">
        <div class="project-card">
          <div>
            <div class="project-tech">HTML5 • CSS3 • JavaScript</div>
            <h3>Modern Responsive Website</h3>
            <p>Fast-loading landing page structure featuring mobile-first layout and clean typography.</p>
          </div>
          <div class="project-links">
            <a href="https://github.com/pandeybrother251-ugh/portfolio" target="_blank">View Repository →</a>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <p>© 2026 Ayush Kumar Pandey • <a href="https://www.linkedin.com/in/pandey-ayush-40418044a" target="_blank">LinkedIn</a> • <a href="https://github.com/pandeybrother251-ugh" target="_blank">GitHub</a></p>
    </footer>
  </div>
</body>
</html>