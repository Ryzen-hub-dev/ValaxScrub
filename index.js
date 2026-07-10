"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Shield,
  Sparkles,
  Terminal,
  Layers3,
  Cpu,
  Gauge,
  Fingerprint,
} from "lucide-react";

const NAV = [
  { id: "protection", label: "Protection" },
  { id: "workflow", label: "Workflow" },
  { id: "proof", label: "Proof" },
  { id: "pricing", label: "Pricing" },
];

const LAYERS = [
  {
    icon: Shield,
    title: "Hard to pick apart",
    text: "The surface stays tight: layered checks, runtime guards, and a layout that does not hand everything over at first glance.",
  },
  {
    icon: Fingerprint,
    title: "Identity stays bound",
    text: "Sessions, keys, and device signals move together so access feels deliberate instead of noisy.",
  },
  {
    icon: Cpu,
    title: "Light on the critical path",
    text: "The page feels quick because the heavy work stays out of the way and the motion stays controlled.",
  },
  {
    icon: Layers3,
    title: "Built like a system",
    text: "Every section has a job, and the whole thing reads more like a product shell than a promo page.",
  },
  {
    icon: Gauge,
    title: "Clear enough to trust",
    text: "You can see what the page is doing without digging through clutter or filler copy.",
  },
];

const METRICS = [
  { value: "10+", label: "Protection layers" },
  { value: "24/7", label: "Always-on runtime" },
  { value: "99.9%", label: "Deterministic output" },
  { value: "< 1s", label: "Perceived load time" },
];

const PLAN = [
  {
    name: "Starter",
    price: "$0",
    note: "Try the flow without friction.",
    features: ["Core protection", "Basic runtime checks", "Standard support"],
    href: "/register",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29",
    note: "For projects that ship often.",
    features: ["Everything in Starter", "Priority updates", "Usage analytics"],
    href: "/register",
    featured: true,
  },
  {
    name: "Team",
    price: "$59",
    note: "For teams that want consistency.",
    features: ["Everything in Pro", "Team controls", "Dedicated support"],
    href: "/register",
    featured: false,
  },
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.25, 0.4, 0.6] }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function FloatingButton({ href, children, className = "" }) {
  return (
    <Link href={href} className={`btn ${className}`}>
      {children}
      <ArrowRight size={16} />
    </Link>
  );
}

function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>;
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const springY = useSpring(y, { stiffness: 90, damping: 20 });
  const springOpacity = useSpring(opacity, { stiffness: 90, damping: 22 });

  return (
    <section ref={ref} className="hero">
      <motion.div className="hero-glow hero-glow-left" style={{ y: springY, opacity: springOpacity }} />
      <motion.div className="hero-glow hero-glow-right" style={{ y: springY, opacity: springOpacity }} />

      <div className="hero-grid">
        <div className="hero-copy">
          <SectionLabel>AstroProtect-inspired build</SectionLabel>
          <h1>
            Keep the page sharp.
            <br />
            Keep the copy calm.
          </h1>
          <p className="hero-lead">
            A cleaner landing page with the same deep, technical mood — less marketing noise,
            more product weight.
          </p>

          <div className="hero-actions">
            <FloatingButton href="/register" className="btn-primary">
              Start now
            </FloatingButton>
            <FloatingButton href="#protection" className="btn-secondary">
              See the structure
            </FloatingButton>
          </div>

          <div className="hero-badges">
            <span><Sparkles size={14} /> No filler</span>
            <span><Terminal size={14} /> Built for a dark UI</span>
            <span><Shield size={14} /> Motion with restraint</span>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-top">
            <span className="panel-dot" />
            <span className="panel-dot" />
            <span className="panel-dot" />
          </div>
          <div className="panel-shell">
            <div className="panel-title">Runtime snapshot</div>
            <div className="panel-code">
              <div><span className="muted">status</span> locked</div>
              <div><span className="muted">mode</span> steady</div>
              <div><span className="muted">surface</span> quiet</div>
              <div><span className="muted">motion</span> controlled</div>
            </div>
            <div className="panel-footer">
              <span>Protected layout</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Protection() {
  return (
    <section id="protection" className="section">
      <div className="section-head">
        <SectionLabel>Protection</SectionLabel>
        <h2>Layered, but not loud.</h2>
        <p>Each layer has a purpose. Nothing is there just to look technical.</p>
      </div>

      <div className="layer-grid">
        {LAYERS.map((item) => (
          <article key={item.title} className="layer-card">
            <div className="layer-icon"><item.icon size={20} /></div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Workflow() {
  const steps = [
    ["Drop in your code", "Start with a clean source and move fast."],
    ["Apply the policy", "Pick the controls you actually need."],
    ["Ship the result", "Keep the output stable and easy to maintain."],
  ];

  return (
    <section id="workflow" className="section section-alt">
      <div className="section-head narrow">
        <SectionLabel>Workflow</SectionLabel>
        <h2>Feels like a product, not a demo.</h2>
        <p>The page should move with you, not distract you.</p>
      </div>

      <div className="workflow">
        {steps.map(([title, text], index) => (
          <div key={title} className="workflow-step">
            <div className="workflow-index">0{index + 1}</div>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Proof() {
  return (
    <section id="proof" className="section">
      <div className="section-head narrow">
        <SectionLabel>Proof</SectionLabel>
        <h2>Enough signal to feel real.</h2>
        <p>Numbers, not hype.</p>
      </div>

      <div className="metrics-grid">
        {METRICS.map((metric) => (
          <div key={metric.label} className="metric-card">
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="section section-alt">
      <div className="section-head narrow">
        <SectionLabel>Pricing</SectionLabel>
        <h2>Simple choices. No fog.</h2>
        <p>Pick the plan that matches how often you ship.</p>
      </div>

      <div className="pricing-grid">
        {PLAN.map((plan) => (
          <article key={plan.name} className={`price-card ${plan.featured ? "featured" : ""}`}>
            <div className="price-header">
              <div>
                <div className="price-name">{plan.name}</div>
                <div className="price-note">{plan.note}</div>
              </div>
              <div className="price-amount">{plan.price}</div>
            </div>
            <ul className="feature-list">
              {plan.features.map((feature) => (
                <li key={feature}><Check size={14} /> {feature}</li>
              ))}
            </ul>
            <FloatingButton href={plan.href} className={plan.featured ? "btn-primary full" : "btn-secondary full"}>
              Choose {plan.name}
            </FloatingButton>
          </article>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <div className="footer-logo"><Shield size={18} /> AstroProtect</div>
        <p>Enterprise-grade code protection, presented with a quieter hand.</p>
      </div>
      <div className="footer-links">
        <Link href="#protection">Protection</Link>
        <Link href="#workflow">Workflow</Link>
        <Link href="#proof">Proof</Link>
        <Link href="#pricing">Pricing</Link>
      </div>
    </footer>
  );
}

export default function Home() {
  const active = useActiveSection(["protection", "workflow", "proof", "pricing"]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = useMemo(() => (scrolled ? "nav scrolled" : "nav"), [scrolled]);

  return (
    <div className="page-shell">
      <style jsx global>{`
        :root {
          --bg: #05070c;
          --bg2: #090d16;
          --card: rgba(13, 18, 31, 0.72);
          --card-border: rgba(255,255,255,0.08);
          --text: #eef2ff;
          --muted: rgba(238,242,255,0.66);
          --accent: #8b7bff;
          --accent2: #4dd6c9;
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          margin: 0;
          background:
            radial-gradient(circle at top left, rgba(139,123,255,.18), transparent 34%),
            radial-gradient(circle at top right, rgba(77,214,201,.12), transparent 32%),
            linear-gradient(180deg, var(--bg), var(--bg2));
          color: var(--text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        a { color: inherit; text-decoration: none; }
        .page-shell { min-height: 100vh; position: relative; overflow: hidden; }
        .nav {
          position: sticky; top: 0; z-index: 20;
          display: flex; justify-content: center;
          padding: 18px 20px; backdrop-filter: blur(10px);
          transition: background .2s ease, border-color .2s ease;
        }
        .nav.scrolled { background: rgba(5,7,12,.72); border-bottom: 1px solid rgba(255,255,255,.05); }
        .nav-inner {
          width: min(1180px, 100%);
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
        }
        .brand { display:flex; align-items:center; gap:10px; font-weight:700; letter-spacing:.02em; }
        .nav-links { display:flex; gap: 18px; flex-wrap: wrap; color: var(--muted); }
        .nav-links a { position: relative; padding-bottom: 4px; }
        .nav-links a.active, .nav-links a:hover { color: var(--text); }
        .nav-links a.active::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }
        .nav-cta { display:flex; gap: 10px; }
        .hero, .section, .footer { width: min(1180px, 100%); margin: 0 auto; padding: 0 20px; }
        .hero { padding-top: 62px; padding-bottom: 42px; position: relative; }
        .hero-grid { display:grid; grid-template-columns: 1.18fr .82fr; gap: 28px; align-items: center; }
        .hero h1 { font-size: clamp(44px, 6vw, 88px); line-height: .95; margin: 12px 0 18px; letter-spacing: -0.05em; }
        .hero-lead { max-width: 640px; color: var(--muted); font-size: 1.05rem; line-height: 1.7; }
        .section-label {
          display:inline-flex; align-items:center; gap:8px; padding: 8px 12px;
          border: 1px solid rgba(255,255,255,.08); border-radius: 999px; color: var(--muted);
          background: rgba(255,255,255,.03); font-size: .8rem; letter-spacing: .08em; text-transform: uppercase;
        }
        .hero-actions, .footer-links { display:flex; gap: 12px; flex-wrap: wrap; }
        .btn {
          display:inline-flex; align-items:center; gap:10px; justify-content:center;
          padding: 13px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.04); transition: transform .2s ease, border-color .2s ease, background .2s ease;
        }
        .btn:hover { transform: translateY(-1px); border-color: rgba(255,255,255,.22); }
        .btn-primary { background: linear-gradient(135deg, rgba(139,123,255,.96), rgba(77,214,201,.9)); color: #041018; }
        .btn-secondary { color: var(--text); }
        .hero-badges { display:flex; gap: 10px; flex-wrap: wrap; margin-top: 18px; color: var(--muted); }
        .hero-badges span {
          display:inline-flex; align-items:center; gap:8px; padding: 9px 12px; border-radius: 999px;
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
        }
        .hero-panel, .layer-card, .metric-card, .price-card, .workflow-step {
          background: var(--card); border: 1px solid var(--card-border); box-shadow: 0 30px 80px rgba(0,0,0,.32);
          backdrop-filter: blur(18px);
        }
        .hero-panel { border-radius: 28px; padding: 18px; position: relative; overflow: hidden; }
        .panel-top { display:flex; gap: 8px; padding-bottom: 18px; }
        .panel-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.18); }
        .panel-shell { border-radius: 22px; padding: 26px; background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02)); }
        .panel-title { color: var(--muted); text-transform: uppercase; font-size: .78rem; letter-spacing: .14em; }
        .panel-code { padding: 22px 0; display:grid; gap: 14px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
        .muted { color: var(--muted); display:inline-block; width: 82px; }
        .panel-footer { display:flex; align-items:center; justify-content:space-between; color: var(--muted); }
        .hero-glow { position:absolute; inset:auto; width: 360px; height: 360px; filter: blur(70px); opacity: .7; pointer-events:none; }
        .hero-glow-left { left: -80px; top: 40px; background: rgba(139,123,255,.2); }
        .hero-glow-right { right: -100px; top: 180px; background: rgba(77,214,201,.16); }
        .section { padding-top: 70px; padding-bottom: 24px; }
        .section-alt { padding-top: 32px; }
        .section-head { max-width: 760px; margin-bottom: 24px; }
        .section-head.narrow { max-width: 620px; }
        .section-head h2 { font-size: clamp(30px, 4vw, 56px); line-height: 1; margin: 14px 0; letter-spacing: -.04em; }
        .section-head p { color: var(--muted); line-height: 1.7; }
        .layer-grid, .metrics-grid, .pricing-grid { display:grid; gap: 16px; }
        .layer-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
        .layer-card { border-radius: 22px; padding: 20px; }
        .layer-icon { width: 42px; height: 42px; border-radius: 12px; display:grid; place-items:center; background: rgba(255,255,255,.06); margin-bottom: 16px; }
        .layer-card p, .workflow-step p, .price-note { color: var(--muted); line-height: 1.65; }
        .workflow { display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .workflow-step { border-radius: 22px; padding: 22px; display:flex; gap: 16px; }
        .workflow-index { color: var(--accent); font-weight: 700; letter-spacing: .08em; }
        .metrics-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .metric-card { border-radius: 22px; padding: 24px; }
        .metric-value { font-size: clamp(28px, 4vw, 46px); font-weight: 700; letter-spacing: -.04em; }
        .metric-label { margin-top: 6px; color: var(--muted); }
        .pricing-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .price-card { border-radius: 24px; padding: 24px; }
        .price-card.featured { outline: 1px solid rgba(139,123,255,.36); transform: translateY(-8px); }
        .price-header { display:flex; align-items:flex-start; justify-content:space-between; gap: 16px; margin-bottom: 20px; }
        .price-name { font-size: 1.05rem; font-weight: 700; }
        .price-amount { font-size: 2.5rem; font-weight: 700; letter-spacing: -.05em; }
        .feature-list { list-style:none; padding:0; margin:0 0 20px; display:grid; gap: 12px; color: var(--text); }
        .feature-list li { display:flex; align-items:center; gap: 10px; color: var(--muted); }
        .full { width: 100%; }
        .footer {
          padding-top: 42px; padding-bottom: 54px; display:flex; justify-content:space-between; gap: 20px;
          border-top: 1px solid rgba(255,255,255,.06); margin-top: 60px;
        }
        .footer-logo { display:flex; align-items:center; gap: 10px; font-weight: 700; margin-bottom: 10px; }
        .footer p { color: var(--muted); max-width: 480px; line-height: 1.6; }
        @media (max-width: 1100px) {
          .layer-grid, .metrics-grid, .pricing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .hero-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .nav-inner { flex-direction: column; align-items: flex-start; }
          .workflow { grid-template-columns: 1fr; }
          .layer-grid, .metrics-grid, .pricing-grid { grid-template-columns: 1fr; }
          .footer { flex-direction: column; }
          .hero h1 { font-size: clamp(38px, 12vw, 58px); }
        }
      `}</style>

      <header className={navClass}>
        <div className="nav-inner">
          <Link href="/" className="brand">
            <Shield size={18} />
            <span>AstroProtect</span>
          </Link>
          <nav className="nav-links">
            {NAV.map((item) => (
              <Link key={item.id} href={`#${item.id}`} className={active === item.id ? "active" : ""}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="nav-cta">
            <Link href="/login" className="btn btn-secondary">Login</Link>
            <Link href="/register" className="btn btn-primary">Get started</Link>
          </div>
        </div>
      </header>

      <main>
        <Hero />
        <div className="section">
          <div className="metrics-grid">
            {METRICS.map((metric) => (
              <div key={metric.label} className="metric-card">
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
        <Protection />
        <Workflow />
        <Proof />
        <Pricing />
      </main>

      <Footer />
    </div>
  );
}
