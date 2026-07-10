"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
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
  Terminal,
} from "lucide-react";
import { ArcRotateCamera, Color3, Color4, Engine, MeshBuilder, Scene, Vector3, Animation, StandardMaterial, PointLight, HemisphericLight, ShaderMaterial, VertexBuffer, AbstractMesh, Effect } from "@babylonjs/core";

const NAV = [
  { id: "protection", label: "Protection" },
  { id: "workflow", label: "Workflow" },
  { id: "proof", label: "Proof" },
  { id: "pricing", label: "Pricing" },
];

const LAYERS = [
  { icon: Shield, title: "Hard to pick apart", text: "Layered checks, runtime guards, and a layout that never gives everything away at once." },
  { icon: Fingerprint, title: "Identity stays bound", text: "Signals move together, so access feels deliberate instead of noisy." },
  { icon: Cpu, title: "Light on the critical path", text: "The page stays quick because the heavy work sits off the main rhythm." },
  { icon: Layers3, title: "Built like a system", text: "Every section does one job and the whole page reads as one machine." },
  { icon: Gauge, title: "Clear enough to trust", text: "You can see what is happening without digging through clutter." },
];

const METRICS = [
  { value: "10+", label: "Protection layers" },
  { value: "24/7", label: "Always-on runtime" },
  { value: "99.9%", label: "Deterministic output" },
  { value: "< 1s", label: "Perceived load time" },
];

const PLAN = [
  { name: "Starter", price: "$0", note: "Try the flow without friction.", features: ["Core protection", "Basic runtime checks", "Standard support"], href: "/register", featured: false },
  { name: "Pro", price: "$29", note: "For projects that ship often.", features: ["Everything in Starter", "Priority updates", "Usage analytics"], href: "/register", featured: true },
  { name: "Team", price: "$59", note: "For teams that want consistency.", features: ["Everything in Pro", "Team controls", "Dedicated support"], href: "/register", featured: false },
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    }, { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.25, 0.4, 0.6] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function useBabylonHeroScene({ activeSection, scrollProgress, pointer }) {
  const mountRef = useRef(null);
  useEffect(() => {
    if (!mountRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(canvas);

    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, adaptToDeviceRatio: true });
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.02, 0.03, 0.05, 0);
    scene.fogMode = Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.045;
    scene.fogColor = new Color3(0.03, 0.04, 0.07);

    const camera = new ArcRotateCamera("heroCam", Math.PI / 2.2, Math.PI / 2.2, 7.8, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 6.4;
    camera.upperRadiusLimit = 9.2;
    camera.wheelPrecision = 40;
    camera.panningSensibility = 0;
    camera.inertialAlphaOffset = 0;
    camera.inertialBetaOffset = 0;

    const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
    hemi.intensity = 1.2;
    hemi.diffuse = new Color3(0.95, 0.96, 1.0);
    hemi.groundColor = new Color3(0.05, 0.06, 0.09);

    const key = new PointLight("key", new Vector3(2.5, 3, 2), scene);
    key.intensity = 40;
    key.diffuse = new Color3(0.58, 0.48, 1.0);

    const fill = new PointLight("fill", new Vector3(-2, -1, 3), scene);
    fill.intensity = 24;
    fill.diffuse = new Color3(0.31, 0.85, 0.8);

    Effect.ShadersStore.heroVertexShader = `precision highp float; attribute vec3 position; attribute vec3 normal; attribute vec2 uv; uniform mat4 worldViewProjection; varying vec3 vNormal; varying vec2 vUV; void main(void){ vNormal=normal; vUV=uv; gl_Position=worldViewProjection*vec4(position,1.0); }`;
    Effect.ShadersStore.heroFragmentShader = `precision highp float; varying vec3 vNormal; varying vec2 vUV; uniform float time; uniform float glow; uniform vec3 colorA; uniform vec3 colorB; void main(void){ float band = 0.5 + 0.5 * sin((vUV.x * 9.0) + time * 1.8); float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0,0.0,1.0))), 2.4); vec3 base = mix(colorA, colorB, band); base += fresnel * glow * 0.38; gl_FragColor = vec4(base, 1.0); }`;

    const core = MeshBuilder.CreateIcoSphere("core", { radius: 1.02, subdivisions: 4 }, scene);
    const coreMat = new ShaderMaterial("coreMat", scene, { vertex: "hero", fragment: "hero" }, { attributes: ["position", "normal", "uv"], uniforms: ["worldViewProjection", "time", "glow", "colorA", "colorB"] });
    coreMat.setColor3("colorA", Color3.FromHexString("#8b7bff"));
    coreMat.setColor3("colorB", Color3.FromHexString("#4dd6c9"));
    coreMat.setFloat("glow", 1.1);
    core.material = coreMat;

    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ring = MeshBuilder.CreateTorus(`ring${i}`, { diameter: 3.6 - i * 0.28, thickness: 0.04, tessellation: 160 }, scene);
      const m = new StandardMaterial(`ringMat${i}`, scene);
      m.emissiveColor = new Color3(0.55, 0.48, 1.0);
      m.diffuseColor = new Color3(0.2, 0.2, 0.26);
      m.alpha = 0.75;
      ring.material = m;
      ring.rotation.set(i === 0 ? 1.55 : 0, i === 1 ? 1.55 : 0, i === 2 ? 1.55 : 0);
      rings.push(ring);
    }

    const orbitDots = MeshBuilder.CreateSphere("dots", { diameter: 0.08, segments: 12 }, scene);
    orbitDots.isVisible = false;
    const dots = [];
    for (let i = 0; i < 18; i++) {
      const clone = orbitDots.clone(`dot-${i}`);
      const dotMat = new StandardMaterial(`dotMat-${i}`, scene);
      dotMat.emissiveColor = i % 2 ? new Color3(0.31, 0.85, 0.8) : new Color3(0.72, 0.67, 1.0);
      dotMat.diffuseColor = Color3.Black();
      clone.material = dotMat;
      dots.push(clone);
    }

    const states = {
      protection: { radius: 7.2, speed: 0.0024, scale: 1.04, glow: 1.15 },
      workflow: { radius: 7.8, speed: 0.0018, scale: 0.98, glow: 0.95 },
      proof: { radius: 6.9, speed: 0.0015, scale: 1.0, glow: 1.28 },
      pricing: { radius: 7.5, speed: 0.0017, scale: 0.94, glow: 0.9 },
    };

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    const clock = scene.getEngine().getDeltaTime ? null : null;
    let time = 0;
    const tick = () => {
      const state = states[activeSection] || states.protection;
      time += engine.getDeltaTime() * 0.001;
      const px = pointer?.x ?? 0.5;
      const py = pointer?.y ?? 0.5;
      const mx = (px - 0.5) * 2;
      const my = (py - 0.5) * 2;

      camera.radius += (state.radius - camera.radius) * 0.04;
      camera.alpha += mx * 0.0015;
      camera.beta += (-my * 0.001) - (camera.beta - Math.PI / 2.2) * 0.01;

      core.scaling.setAll(1 + (state.scale - 1) * 0.8 + Math.sin(time * 1.2) * 0.02);
      core.rotation.x += 0.002 + state.speed * 1.8;
      core.rotation.y += 0.003 + state.speed * 2.4;
      core.rotation.z += state.speed * 0.7;
      coreMat.setFloat("time", time);
      coreMat.setFloat("glow", state.glow);

      rings.forEach((ring, index) => {
        const dir = index % 2 === 0 ? 1 : -1;
        ring.rotation.x += state.speed * dir * 0.8;
        ring.rotation.y += state.speed * dir * 1.1;
        ring.rotation.z += state.speed * dir * 1.4;
        ring.scaling.setAll(1 + Math.sin(time * 0.7 + index) * 0.01);
      });

      dots.forEach((dot, index) => {
        const a = time * (0.4 + index * 0.01) + index * 0.34;
        const r = 2.5 + (index % 6) * 0.14;
        dot.position.x = Math.cos(a) * r;
        dot.position.y = Math.sin(a * 1.4) * 0.8;
        dot.position.z = Math.sin(a) * r * 0.28;
        dot.scaling.setAll(0.9 + Math.sin(time * 2 + index) * 0.08);
      });

      scene.render();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", onResize);
      dots.forEach((dot) => dot.dispose());
      orbitDots.dispose();
      rings.forEach((ring) => ring.dispose());
      core.dispose();
      coreMat.dispose();
      scene.dispose();
      engine.dispose();
    };
  }, [activeSection, pointer, scrollProgress]);

  return mountRef;
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

function Hero({ activeSection, pointer, setPointer, scrollProgress }) {
  const ref = useRef(null);
  const sceneMountRef = useBabylonHeroScene({ activeSection, scrollProgress, pointer });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const springY = useSpring(y, { stiffness: 90, damping: 20 });
  const springOpacity = useSpring(opacity, { stiffness: 90, damping: 22 });

  return (
    <section ref={ref} className="hero" onMouseMove={(e) => {
      const box = e.currentTarget.getBoundingClientRect();
      setPointer({ x: (e.clientX - box.left) / box.width, y: (e.clientY - box.top) / box.height });
    }}>
      <motion.div className="hero-glow hero-glow-left" style={{ y: springY, opacity: springOpacity }} />
      <motion.div className="hero-glow hero-glow-right" style={{ y: springY, opacity: springOpacity }} />

      <div className="hero-grid">
        <div className="hero-copy">
          <SectionLabel>AstroProtect-inspired build</SectionLabel>
          <h1>Keep the page sharp.<br />Keep the copy calm.</h1>
          <p className="hero-lead">A cleaner landing page with the same deep, technical mood — less marketing noise, more product weight.</p>
          <div className="hero-actions">
            <FloatingButton href="/register" className="btn-primary">Start now</FloatingButton>
            <FloatingButton href="#protection" className="btn-secondary">See the structure</FloatingButton>
          </div>
          <div className="hero-badges">
            <span><Sparkles size={14} /> No filler</span>
            <span><Terminal size={14} /> Built for a dark UI</span>
            <span><Shield size={14} /> Motion with restraint</span>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-top"><span className="panel-dot" /><span className="panel-dot" /><span className="panel-dot" /></div>
          <div className="panel-shell">
            <div className="panel-title">Runtime snapshot</div>
            <div ref={sceneMountRef} className="hero-3d-canvas" />
            <div className="panel-footer"><span>Protected layout</span><ChevronRight size={16} /></div>
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
  const steps = [["Drop in your code", "Start with a clean source and move fast."], ["Apply the policy", "Pick the controls you actually need."], ["Ship the result", "Keep the output stable and easy to maintain."]];
  return (
    <section id="workflow" className="section section-alt">
      <div className="section-head narrow">
        <SectionLabel>Workflow</SectionLabel>
        <h2>Feels like a product, not a demo.</h2>
        <p>The page should move with you, not distract you.</p>
      </div>
      <div className="workflow">
        {steps.map(([title, text], index) => (
          <div key={title} className="workflow-step"><div className="workflow-index">0{index + 1}</div><div><h3>{title}</h3><p>{text}</p></div></div>
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
        {METRICS.map((metric) => <div key={metric.label} className="metric-card"><div className="metric-value">{metric.value}</div><div className="metric-label">{metric.label}</div></div>)}
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
            <div className="price-header"><div><div className="price-name">{plan.name}</div><div className="price-note">{plan.note}</div></div><div className="price-amount">{plan.price}</div></div>
            <ul className="feature-list">{plan.features.map((feature) => <li key={feature}><Check size={14} /> {feature}</li>)}</ul>
            <FloatingButton href={plan.href} className={plan.featured ? "btn-primary full" : "btn-secondary full"}>Choose {plan.name}</FloatingButton>
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
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = useMemo(() => (scrolled ? "nav scrolled" : "nav"), [scrolled]);

  return (
    <div className="page-shell">
      <style jsx global>{`
        :root { --bg: #05070c; --bg2: #090d16; --card: rgba(13, 18, 31, 0.72); --card-border: rgba(255,255,255,0.08); --text: #eef2ff; --muted: rgba(238,242,255,0.66); --accent: #8b7bff; --accent2: #4dd6c9; }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: radial-gradient(circle at top left, rgba(139,123,255,.18), transparent 34%), radial-gradient(circle at top right, rgba(77,214,201,.12), transparent 32%), linear-gradient(180deg, var(--bg), var(--bg2)); color: var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        a { color: inherit; text-decoration: none; }
        .page-shell { min-height: 100vh; position: relative; overflow: hidden; }
        .nav { position: sticky; top: 0; z-index: 20; display: flex; justify-content: center; padding: 18px 20px; backdrop-filter: blur(10px); transition: background .2s ease, border-color .2s ease; }
        .nav.scrolled { background: rgba(5,7,12,.72); border-bottom: 1px solid rgba(255,255,255,.05); }
        .nav-inner { width: min(1180px, 100%); display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .brand { display:flex; align-items:center; gap:10px; font-weight:700; letter-spacing:.02em; }
        .nav-links { display:flex; gap: 18px; flex-wrap: wrap; color: var(--muted); }
        .nav-links a { position: relative; padding-bottom: 4px; }
        .nav-links a.active, .nav-links a:hover { color: var(--text); }
        .nav-links a.active::after { content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); }
        .nav-cta { display:flex; gap: 10px; }
        .hero, .section, .footer { width: min(1180px, 100%); margin: 0 auto; padding: 0 20px; }
        .hero { padding-top: 62px; padding-bottom: 42px; position: relative; }
        .hero-grid { display:grid; grid-template-columns: 1.18fr .82fr; gap: 28px; align-items: center; }
        .hero h1 { font-size: clamp(44px, 6vw, 88px); line-height: .95; margin: 12px 0 18px; letter-spacing: -0.05em; }
        .hero-lead { max-width: 640px; color: var(--muted); font-size: 1.05rem; line-height: 1.7; }
        .section-label { display:inline-flex; align-items:center; gap:8px; padding: 8px 12px; border: 1px solid rgba(255,255,255,.08); border-radius: 999px; color: var(--muted); background: rgba(255,255,255,.03); font-size: .8rem; letter-spacing: .08em; text-transform: uppercase; }
        .hero-actions, .footer-links { display:flex; gap: 12px; flex-wrap: wrap; }
        .btn { display:inline-flex; align-items:center; gap:10px; justify-content:center; padding: 13px 18px; border-radius: 999px; border: 1px solid rgba(255,255,255,.1); background: rgba(255,255,255,.04); transition: transform .2s ease, border-color .2s ease, background .2s ease; }
        .btn:hover { transform: translateY(-1px); border-color: rgba(255,255,255,.22); }
        .btn-primary { background: linear-gradient(135deg, rgba(139,123,255,.96), rgba(77,214,201,.9)); color: #041018; }
        .btn-secondary { color: var(--text); }
        .hero-badges { display:flex; gap: 10px; flex-wrap: wrap; margin-top: 18px; color: var(--muted); }
        .hero-badges span { display:inline-flex; align-items:center; gap:8px; padding: 9px 12px; border-radius: 999px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); }
        .hero-panel, .layer-card, .metric-card, .price-card, .workflow-step { background: var(--card); border: 1px solid var(--card-border); box-shadow: 0 30px 80px rgba(0,0,0,.32); backdrop-filter: blur(18px); }
        .hero-panel { border-radius: 28px; padding: 18px; position: relative; overflow: hidden; }
        .panel-top { display:flex; gap: 8px; padding-bottom: 18px; }
        .panel-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,.18); }
        .panel-shell { border-radius: 22px; padding: 26px; background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02)); }
        .panel-title { color: var(--muted); text-transform: uppercase; font-size: .78rem; letter-spacing: .14em; margin-bottom: 14px; }
        .hero-3d-canvas { position: relative; width: 100%; height: 340px; border-radius: 20px; overflow: hidden; background: radial-gradient(circle at 50% 35%, rgba(139,123,255,.16), transparent 42%), linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.015)); }
        .hero-3d-canvas canvas { display:block; width:100% !important; height:100% !important; }
        .panel-footer { display:flex; align-items:center; justify-content:space-between; color: var(--muted); margin-top: 16px; }
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
        .footer { padding-top: 42px; padding-bottom: 54px; display:flex; justify-content:space-between; gap: 20px; border-top: 1px solid rgba(255,255,255,.06); margin-top: 60px; }
        .footer-logo { display:flex; align-items:center; gap: 10px; font-weight: 700; margin-bottom: 10px; }
        .footer p { color: var(--muted); max-width: 480px; line-height: 1.6; }
        @media (max-width: 1100px) { .layer-grid, .metrics-grid, .pricing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .hero-grid { grid-template-columns: 1fr; } }
        @media (max-width: 720px) { .nav-inner { flex-direction: column; align-items: flex-start; } .workflow { grid-template-columns: 1fr; } .layer-grid, .metrics-grid, .pricing-grid { grid-template-columns: 1fr; } .footer { flex-direction: column; } .hero h1 { font-size: clamp(38px, 12vw, 58px); } }
      `}</style>

      <header className={navClass}>
        <div className="nav-inner">
          <Link href="/" className="brand"><Shield size={18} /><span>AstroProtect</span></Link>
          <nav className="nav-links">
            {NAV.map((item) => <Link key={item.id} href={`#${item.id}`} className={active === item.id ? "active" : ""}>{item.label}</Link>)}
          </nav>
          <div className="nav-cta">
            <Link href="/login" className="btn btn-secondary">Login</Link>
            <Link href="/register" className="btn btn-primary">Get started</Link>
          </div>
        </div>
      </header>

      <main>
        <Hero activeSection={active} pointer={pointer} setPointer={setPointer} scrollProgress={scrollProgress} />
        <div className="section">
          <div className="metrics-grid">
            {METRICS.map((metric) => <div key={metric.label} className="metric-card"><div className="metric-value">{metric.value}</div><div className="metric-label">{metric.label}</div></div>)}
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
