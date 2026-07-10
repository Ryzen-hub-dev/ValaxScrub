"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Cpu,
  Fingerprint,
  Gauge,
  Layers3,
  Shield,
  Sparkles,
  Zap,
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
    title: "Layered protection",
    text: "Multiple passes, distinct transforms, and runtime checks keep the surface hard to read and harder to break.",
  },
  {
    icon: Fingerprint,
    title: "Identity locked",
    text: "Keys, sessions, and device signals move together so access feels strict without feeling clunky.",
  },
  {
    icon: Cpu,
    title: "Fast runtime",
    text: "Heavy work stays out of the critical path, preserving a snappy product feel under load.",
  },
  {
    icon: Layers3,
    title: "Built like a system",
    text: "The UI is structured like a live control surface, not a marketing page with extra noise.",
  },
  {
    icon: Gauge,
    title: "Clear telemetry",
    text: "Operators can see what is happening without digging through buried controls or vague summaries.",
  },
  {
    icon: Zap,
    title: "Deliberate motion",
    text: "Motion is used to guide attention, create depth, and keep the interface feeling engineered.",
  },
];

const METRICS = [
  { label: "Active protections", value: 12 },
  { label: "Signals tracked", value: 98 },
  { label: "Median response", value: 14 },
];

const STEPS = [
  { k: "01", title: "Signal", text: "The hero establishes the visual core immediately and leaves room for the rest of the page to unfold." },
  { k: "02", title: "Depth", text: "Glass panels, shadows, and perspective create a layered surface that feels physical." },
  { k: "03", title: "Control", text: "Feature blocks and comparisons appear like part of the same machine, not separate sections." },
  { k: "04", title: "Commit", text: "The final CTA closes the loop with calm confidence instead of hype." },
];

const PLANS = [
  { name: "Starter", price: "$0", note: "For testing the pipeline.", featured: false, points: ["Core protection", "Basic telemetry", "Community support"] },
  { name: "Pro", price: "$29", note: "For live products.", featured: true, points: ["Advanced transforms", "Live signals", "Priority support"] },
  { name: "Studio", price: "$79", note: "For teams shipping at speed.", featured: false, points: ["Multiple projects", "Dedicated help", "High-trust workflows"] },
];

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function Stat({ icon: Icon, label, value }) {
  const counted = useCountUp(value);
  return (
    <div className="stat">
      <div className="stat-icon"><Icon size={16} /></div>
      <div className="stat-value">{counted.toLocaleString()}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="section-title">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export default function HomeClient({ session }) {
  const [active, setActive] = useState("protection");
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef(null);
  const rotX = useSpring(useTransform(useMotionValue(mouse.y), [0, 1], [16, -16]), { stiffness: 120, damping: 18 });
  const rotY = useSpring(useTransform(useMotionValue(mouse.x), [0, 1], [-18, 18]), { stiffness: 120, damping: 18 });

  useEffect(() => {
    const nodes = NAV.map((item) => document.getElementById(item.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(hit.target.id);
      },
      { threshold: [0.22, 0.38, 0.55] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const haloStyle = useMemo(
    () => ({ left: `${mouse.x * 100}%`, top: `${mouse.y * 100}%` }),
    [mouse]
  );

  return (
    <div className="ap-page">
      <style>{`
        :root {
          --bg: #05070c;
          --bg2: #070b14;
          --panel: rgba(255,255,255,.045);
          --panel-strong: rgba(255,255,255,.07);
          --line: rgba(180,205,255,.12);
          --line-strong: rgba(180,205,255,.2);
          --text: rgba(245,248,255,.98);
          --muted: rgba(201,212,238,.68);
          --accent: #7c5cff;
          --accent2: #ff6b9d;
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: var(--bg); color: var(--text); }
        .ap-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 0%, rgba(124,92,255,.16), transparent 28%),
            radial-gradient(circle at 15% 25%, rgba(255,107,157,.08), transparent 20%),
            linear-gradient(180deg, #05070c 0%, #04050a 40%, #030409 100%);
          overflow: hidden;
        }
        .ap-noise {
          position: fixed; inset: 0; pointer-events: none; opacity: .05; z-index: 0;
          background-image: linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px);
          background-size: 34px 34px;
          mix-blend-mode: overlay;
        }
        .ap-halo {
          position: fixed; width: 560px; height: 560px; border-radius: 50%; pointer-events:none; z-index:0;
          transform: translate(-50%, -50%); filter: blur(14px);
          background: radial-gradient(circle, rgba(124,92,255,.14), transparent 66%);
        }
        .shell { position: relative; z-index: 1; }
        .nav {
          position: sticky; top: 0; z-index: 30; backdrop-filter: blur(18px);
          background: rgba(4,7,12,.55); border-bottom: 1px solid rgba(255,255,255,.05);
        }
        .nav-inner, .wrap { max-width: 1180px; margin: 0 auto; padding: 0 24px; }
        .nav-inner { height: 78px; display:flex; align-items:center; justify-content:space-between; gap: 24px; }
        .brand { display:flex; align-items:center; gap: 12px; text-decoration:none; color: var(--text); font-weight: 800; letter-spacing: -.03em; }
        .brand-mark {
          width: 38px; height: 38px; border-radius: 13px; display:grid; place-items:center;
          background: linear-gradient(180deg, rgba(124,92,255,.9), rgba(55,40,140,.95));
          box-shadow: 0 14px 38px rgba(124,92,255,.25);
        }
        .nav-links { display:flex; gap: 8px; align-items:center; }
        .nav-links a {
          padding: 10px 14px; border-radius: 999px; text-decoration:none; color: var(--muted);
          border: 1px solid transparent; transition: .2s ease;
        }
        .nav-links a.active, .nav-links a:hover { color: var(--text); border-color: var(--line); background: rgba(255,255,255,.03); }
        .btn {
          display:inline-flex; align-items:center; gap: 10px; text-decoration:none; font-weight: 700;
          padding: 14px 18px; border-radius: 999px; transition: transform .2s ease, background .2s ease, border-color .2s ease;
        }
        .btn:hover { transform: translateY(-1px); }
        .btn-primary {
          background: linear-gradient(180deg, rgba(124,92,255,1), rgba(82,58,197,1)); color: white; box-shadow: 0 18px 48px rgba(124,92,255,.22);
        }
        .btn-secondary { border: 1px solid var(--line); color: var(--text); background: rgba(255,255,255,.03); }
        .hero { padding: 92px 24px 84px; }
        .hero-grid {
          max-width: 1180px; margin: 0 auto; display:grid; grid-template-columns: 1.05fr .95fr; gap: 44px; align-items:center;
        }
        .eyebrow {
          display:inline-flex; align-items:center; gap: 8px; padding: 8px 12px; border: 1px solid var(--line);
          border-radius: 999px; background: rgba(255,255,255,.025); color: var(--muted); font-size: 11px; letter-spacing: .2em; text-transform: uppercase;
        }
        h1 {
          margin: 18px 0 18px; font-size: clamp(52px, 7vw, 98px); line-height: .93; letter-spacing: -.07em; max-width: 11ch;
        }
        .lead { color: var(--muted); line-height: 1.85; font-size: 16px; max-width: 58ch; }
        .hero-actions { display:flex; gap: 12px; flex-wrap:wrap; margin-top: 30px; }
        .hero-panel {
          position: relative; height: 640px; display:grid; place-items:center; perspective: 1200px;
        }
        .core {
          position: relative; width: 380px; height: 380px; transform-style: preserve-3d;
          filter: drop-shadow(0 0 70px rgba(124,92,255,.18));
        }
        .ring, .ring:before, .ring:after, .orbit, .grid, .grid:before {
          position:absolute; inset: 0; border-radius: 50%;
        }
        .ring { border: 1px solid rgba(170,190,255,.18); background: radial-gradient(circle at 50% 36%, rgba(124,92,255,.2), rgba(12,18,34,.08) 58%, transparent 66%); }
        .ring.r2 { inset: 28px; transform: rotateX(66deg) rotateZ(18deg); border-color: rgba(170,190,255,.28); }
        .ring.r3 { inset: 66px; transform: rotateY(72deg) rotateZ(-14deg); border-color: rgba(170,190,255,.36); }
        .grid {
          inset: 52px; border-radius: 28px; border: 1px solid rgba(180,205,255,.12);
          background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.012));
          transform: translateZ(36px) rotateX(11deg) rotateY(-16deg);
        }
        .grid:before, .grid:after {
          content:""; position:absolute; inset: 0; border-radius: inherit; background-image: linear-gradient(rgba(124,92,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,.16) 1px, transparent 1px); background-size: 28px 28px; opacity: .8; mask: linear-gradient(180deg, #000 50%, transparent);
        }
        .grid:after { inset: 18px; opacity: .38; transform: rotate(9deg); }
        .orb {
          position:absolute; border-radius: 50%; background: radial-gradient(circle at 35% 35%, rgba(255,255,255,.96), rgba(124,92,255,.75) 28%, rgba(124,92,255,.1) 62%, transparent 72%);
          box-shadow: 0 0 46px rgba(124,92,255,.35);
        }
        .orb.a { width: 96px; height: 96px; top: 14%; left: 12%; }
        .orb.b { width: 76px; height: 76px; right: 12%; bottom: 20%; }
        .orb.c { width: 54px; height: 54px; left: 50%; bottom: 12%; transform: translateX(-50%); }
        .section { padding: 0 24px 112px; }
        .section-title { max-width: 760px; margin-bottom: 34px; }
        .section-title h2 { margin: 12px 0 12px; font-size: clamp(32px, 4.6vw, 58px); line-height: 1.02; letter-spacing: -.055em; }
        .section-title p { margin: 0; color: var(--muted); line-height: 1.8; max-width: 62ch; }
        .panel {
          max-width: 1180px; margin: 0 auto; padding: 28px; border-radius: 28px; border: 1px solid var(--line);
          background: linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.018)); backdrop-filter: blur(18px);
        }
        .stats { display:grid; grid-template-columns: repeat(3,1fr); gap: 1px; overflow:hidden; }
        .stat { padding: 26px 20px; text-align:center; background: rgba(255,255,255,.02); }
        .stat-icon { width: 40px; height: 40px; margin: 0 auto 12px; border-radius: 12px; display:grid; place-items:center; background: rgba(124,92,255,.12); color: #c5b9ff; }
        .stat-value { font-size: 30px; font-weight: 900; letter-spacing: -.04em; }
        .stat-label { color: var(--muted); font-size: 13px; margin-top: 6px; }
        .grid-3 { display:grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .card {
          position: relative; min-height: 250px; padding: 28px; border-radius: 24px; border: 1px solid var(--line);
          background: linear-gradient(180deg, rgba(255,255,255,.044), rgba(255,255,255,.02)); overflow:hidden;
        }
        .card:before {
          content:""; position:absolute; inset:-20% auto auto 42%; width: 220px; height: 220px; background: radial-gradient(circle, rgba(124,92,255,.14), transparent 64%); pointer-events:none;
        }
        .card-icon { width: 42px; height: 42px; border-radius: 12px; display:grid; place-items:center; background: rgba(124,92,255,.12); color:#d6d0ff; margin-bottom: 18px; }
        .card h3 { margin: 0 0 10px; font-size: 22px; line-height: 1.14; letter-spacing: -.03em; }
        .card p { margin: 0; color: var(--muted); line-height: 1.75; }
        .timeline { display:grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .step { padding: 22px; border-radius: 22px; border: 1px solid var(--line); background: rgba(255,255,255,.03); }
        .step kbd { display:inline-grid; place-items:center; width: 44px; height: 44px; border-radius: 14px; margin-bottom: 18px; background: rgba(124,92,255,.12); border: 1px solid rgba(170,190,255,.16); color: #d7d0ff; font-weight: 800; }
        .step h3 { margin: 0 0 10px; font-size: 18px; }
        .step p { margin: 0; color: var(--muted); line-height: 1.72; }
        .compare { overflow:hidden; border-radius: 26px; border: 1px solid var(--line); background: rgba(255,255,255,.03); }
        .compare-head, .compare-row { display:grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 16px; padding: 18px 22px; }
        .compare-head { color: rgba(222,232,255,.45); font-size: 11px; letter-spacing:.16em; text-transform:uppercase; border-bottom: 1px solid var(--line); }
        .compare-row { border-bottom: 1px solid rgba(255,255,255,.06); }
        .compare-row:last-child { border-bottom:none; }
        .pill { display:inline-flex; align-items:center; gap: 8px; }
        .pill.ok { color: #c7d6ff; }
        .pill.no { color: rgba(255,145,145,.85); }
        .pricing { display:grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .plan { padding: 28px; border-radius: 24px; border: 1px solid var(--line); background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.018)); }
        .plan.featured { border-color: rgba(124,92,255,.28); box-shadow: 0 20px 60px rgba(124,92,255,.14); transform: translateY(-8px); }
        .plan h3 { margin: 0 0 6px; font-size: 22px; }
        .plan .note { color: var(--muted); font-size: 13px; margin-bottom: 16px; }
        .price { font-size: 54px; font-weight: 900; letter-spacing: -.06em; margin-bottom: 16px; }
        .plan ul { list-style:none; padding:0; margin:0 0 24px; display:grid; gap: 10px; }
        .plan li { display:flex; gap: 10px; color: rgba(230,236,248,.86); line-height: 1.5; }
        .final { text-align:center; padding-bottom: 140px; }
        .final .panel { max-width: 760px; padding: 44px 24px; }
        .final h2 { margin: 14px auto 14px; font-size: clamp(34px, 5vw, 64px); line-height: 1.02; letter-spacing: -.055em; max-width: 12ch; }
        .final p { margin: 0 auto 28px; max-width: 56ch; color: var(--muted); line-height: 1.8; }
        @media (max-width: 980px) {
          .hero-grid, .grid-3, .timeline, .pricing { grid-template-columns: 1fr; }
          .nav-links { display:none; }
          .hero { padding-top: 72px; }
          .hero-panel { height: 470px; }
          .plan.featured { transform:none; }
          .stats { grid-template-columns: 1fr; }
          .compare-head, .compare-row { grid-template-columns: 1.15fr 1fr 1fr; }
        }
      `}</style>

      <div className="ap-noise" />
      <div className="ap-halo" style={haloStyle} />

      <div className="shell">
        <header className="nav">
          <div className="nav-inner">
            <Link href="/" className="brand">
              <span className="brand-mark"><Sparkles size={16} /></span>
              <span>Astro-style Core</span>
            </Link>
            <nav className="nav-links">
              {NAV.map((item) => (
                <a key={item.id} href={`#${item.id}`} className={active === item.id ? "active" : ""}>{item.label}</a>
              ))}
            </nav>
            <Link href={session ? "/dashboard" : "/login"} className="btn btn-secondary">Login</Link>
          </div>
        </header>

        <section className="hero" ref={heroRef} onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          setMouse({ x, y });
        }}>
          <div className="hero-grid">
            <div>
              <div className="eyebrow"><Sparkles size={12} /> protection engine</div>
              <h1>Protect everything with depth, motion, and control.</h1>
              <p className="lead">A sharp, cinematic landing page with a real 3D center, layered glass surfaces, and interaction that feels designed rather than decorated.</p>
              <div className="hero-actions">
                <Link href={session ? "/dashboard" : "/login"} className="btn btn-primary">Get started <ArrowRight size={16} /></Link>
                <a href="#workflow" className="btn btn-secondary">See the workflow <ChevronRight size={16} /></a>
              </div>
            </div>

            <div className="hero-panel">
              <motion.div className="core" style={{ rotateX: rotX, rotateY: rotY }}>
                <div className="ring" />
                <div className="ring r2" />
                <div className="ring r3" />
                <div className="grid" />
                <div className="orb a" />
                <div className="orb b" />
                <div className="orb c" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="section">
          <SectionTitle eyebrow="Live signals" title="A control surface, not a brochure." text="The numbers are treated like part of the composition so the page feels operational without turning sterile." />
          <div className="panel stats">
            {METRICS.map((m) => <Stat key={m.label} icon={m.label.includes("response") ? Gauge : m.label.includes("signals") ? Cpu : Shield} {...m} />)}
          </div>
        </section>

        <section className="section" id="workflow">
          <div className="wrap">
            <SectionTitle eyebrow="Workflow" title="The page unfolds like a system reveal." text="Every section advances the same story: establish the core, expand the layers, then close with a clean decision point." />
            <div className="timeline">
              {STEPS.map((s) => (
                <div key={s.k} className="step">
                  <kbd>{s.k}</kbd>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="protection">
          <div className="wrap">
            <SectionTitle eyebrow="Protection" title="Built from layers that work together." text="Each block keeps the visual language tight while still showing enough depth to feel premium." />
            <div className="grid-3">
              {LAYERS.map((layer) => {
                const Icon = layer.icon;
                return (
                  <article key={layer.title} className="card">
                    <div className="card-icon"><Icon size={18} /></div>
                    <h3>{layer.title}</h3>
                    <p>{layer.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section" id="proof">
          <div className="wrap">
            <SectionTitle eyebrow="Proof" title="Quiet confidence, backed by structure." text="The comparison keeps the tone restrained and direct, so the product reads as serious and real." />
            <div className="compare">
              <div className="compare-head"><div>Capability</div><div>Astro-style core</div><div>Generic stack</div></div>
              {[
                ["Depth", "3D + glass + motion", "Flat panels"],
                ["Hierarchy", "Cinematic, clear", "Mixed"],
                ["Interaction", "Intentional, tactile", "Basic hover"],
                ["System feel", "Unified product story", "Disconnected UI"],
              ].map((row) => (
                <div key={row[0]} className="compare-row">
                  <div>{row[0]}</div>
                  <div><span className="pill ok"><Check size={14} /> {row[1]}</span></div>
                  <div><span className="pill no">{row[2]}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="pricing">
          <div className="wrap">
            <SectionTitle eyebrow="Pricing" title="Simple tiers, no filler." text="The pricing cards are designed to read quickly and feel expensive without shouting." />
            <div className="pricing">
              {PLANS.map((plan) => (
                <article key={plan.name} className={`plan ${plan.featured ? "featured" : ""}`}>
                  <h3>{plan.name}</h3>
                  <div className="note">{plan.note}</div>
                  <div className="price">{plan.price}</div>
                  <ul>
                    {plan.points.map((point) => (
                      <li key={point}><Check size={15} style={{ color: "#b7c7ff", flexShrink: 0, marginTop: 2 }} /> <span>{point}</span></li>
                    ))}
                  </ul>
                  <Link href={session ? "/dashboard" : "/login"} className={plan.featured ? "btn btn-primary" : "btn btn-secondary"} style={{ width: "100%", justifyContent: "center" }}>
                    {plan.featured ? "Choose Pro" : "Start here"}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section final">
          <div className="panel">
            <div className="eyebrow" style={{ margin: "0 auto" }}>Final call</div>
            <h2>Bring the core into your workflow.</h2>
            <p>Keep the page clean, deep, and responsive — with enough motion to feel premium and enough restraint to feel real.</p>
            <Link href={session ? "/dashboard" : "/login"} className="btn btn-primary">Begin the experience <ArrowRight size={16} /></Link>
          </div>
        </section>
      </div>
    </div>
  );
}
