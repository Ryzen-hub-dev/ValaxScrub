"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Lock, Fingerprint, BarChart3, Key, Zap, Code2, FileCode2, Activity, Check, X } from "lucide-react";
import PublicNav from "./components/PublicNav";
import PublicFooter from "./components/PublicFooter";
import WaveBackground from "./components/WaveBackground";
import LuaObfuscatorBackdrop from "./components/LuaObfuscatorBackdrop";
import useScrollPanels from "./components/useScrollPanels";
import config from "./config.json";
import pricingData from "./pricing.json";

const LUA_PANELS = [
  { id: "lua51", title: "Lua 5.1", desc: "Legacy runtime coverage with stable obfuscation paths and compatibility-first transforms." },
  { id: "lua52", title: "Lua 5.2", desc: "Modernized bytecode handling with consistent loader shielding and runtime binding." },
  { id: "lua53", title: "Lua 5.3", desc: "Integer-safe transforms, controlled string sealing, and anti-tamper layers tuned for 5.3." },
  { id: "lua54", title: "Lua 5.4", desc: "Latest classic Lua pipeline support with stronger structure flattening and delivery protection." },
  { id: "luau", title: "Luau", desc: "Optimized for Luau-style workloads with fast load, script-specific obfuscation, and platform fit." },
];

const CORE_FEATURES = [
  { icon: Lock, title: "Deep Obfuscation", desc: "Multi-pass transforms built for Lua payload protection, not generic visual flair." },
  { icon: Fingerprint, title: "Runtime Binding", desc: "Tie payloads to deployment context, loader state, and delivery policy." },
  { icon: BarChart3, title: "Trace Analytics", desc: "Track execution and delivery events without disturbing the user flow." },
  { icon: Key, title: "License Control", desc: "Generate, revoke, and scope access with a clean operational surface." },
  { icon: Zap, title: "Fast Loader", desc: "Small, direct, and tuned for first-frame responsiveness." },
  { icon: Code2, title: "Developer API", desc: "Automation-ready API hooks for scale, support, and deployment." },
];

function useCountUp(target, duration = 1400) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (target == null) return;
    const start = performance.now();
    let raf = 0;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return display;
}

function StatItem({ icon: Icon, value, label, loading }) {
  const counted = useCountUp(loading ? null : value);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "0 24px" }}>
      <div style={{ color: "var(--accent)" }}><Icon size={18} /></div>
      <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{loading ? "—" : counted}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,.56)" }}>{label}</div>
    </div>
  );
}

export default function HomeClient({ session }) {
  const [stats, setStats] = useState(null);
  const [panelIndex, setPanelIndex] = useScrollPanels(["lua51", "lua52", "lua53", "lua54", "luau"]);
  const [featureIndex, setFeatureIndex] = useState(0);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #02030a 0%, #050b18 40%, #000 100%)", color: "#fff" }}>
      <style>{`
        :root { --accent:#0f4cff; --accent-glow:rgba(15,76,255,.22); }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .glass { background: rgba(5,10,20,.62); border: 1px solid rgba(120,160,255,.12); backdrop-filter: blur(18px); }
        .board { border-radius: 18px; background: rgba(7,10,18,.78); border: 1px solid rgba(90,130,255,.14); box-shadow: 0 16px 50px rgba(0,0,0,.35); }
        .btn { border-radius: 0; border: 1px solid rgba(120,160,255,.18); background: rgba(8,14,28,.9); color: #fff; padding: 14px 18px; text-decoration: none; display:inline-flex; align-items:center; gap:10px; transition:.18s ease; }
        .btn:hover { transform: translateY(-1px); border-color: rgba(120,160,255,.35); background: rgba(13,20,38,.96); }
        .btn-primary { background: linear-gradient(180deg, #0e3df0 0%, #081e67 100%); }
        .btn-secondary { background: rgba(7,10,18,.88); }
        .panel { min-height: 82vh; display:flex; align-items:center; padding: 32px 24px; scroll-snap-align: start; }
        .snap { scroll-snap-type: y mandatory; }
        .pill { display:inline-flex; align-items:center; padding:5px 14px; border-radius:999px; border:1px solid rgba(110,145,255,.18); background: rgba(9,13,24,.8); color: rgba(255,255,255,.64); font-size:11px; letter-spacing:.14em; text-transform:uppercase; }
        .feature-card { border-radius: 18px; background: rgba(7,10,18,.78); border: 1px solid rgba(90,130,255,.12); padding: 22px; }
        .feature-card:hover { border-color: rgba(90,130,255,.24); }
      `}</style>

      <WaveBackground opacity={0.08} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <PublicNav session={session} />

        <section className="panel snap" id="hero" style={{ position: "relative", overflow: "hidden" }}>
          <LuaObfuscatorBackdrop stage={panelIndex} visible />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 20%, rgba(14,61,240,.22), transparent 42%), linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.75))" }} />
          <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 28, alignItems: "center" }}>
            <div>
              <div className="pill">Lua Obfuscator · Deep runtime protection</div>
              <h1 style={{ fontSize: "clamp(46px,7vw,86px)", lineHeight: 1.02, margin: "18px 0 18px", letterSpacing: "-0.05em" }}>
                Dark-first Lua protection<br />for shipping code that stays sealed.
              </h1>
              <p style={{ maxWidth: 620, color: "rgba(255,255,255,.62)", lineHeight: 1.8, fontSize: 17, marginBottom: 30 }}>{config.site.description}</p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href={session ? "/dashboard" : "/login"} className="btn btn-primary">Get Started Free</Link>
                <a href="#panels" className="btn btn-secondary">Scroll through runtime windows</a>
              </div>
            </div>

            <div className="board" style={{ padding: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div className="glass" style={{ padding: 14, borderRadius: 16 }}>
                  <div style={{ color: "rgba(255,255,255,.55)", fontSize: 12 }}>Supported versions</div>
                  <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4 }}>5</div>
                </div>
                <div className="glass" style={{ padding: 14, borderRadius: 16 }}>
                  <div style={{ color: "rgba(255,255,255,.55)", fontSize: 12 }}>Theme</div>
                  <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4 }}>Blue / Black</div>
                </div>
              </div>
              <div style={{ color: "rgba(255,255,255,.66)", fontSize: 14, lineHeight: 1.8 }}>
                Scroll down to switch the runtime window. The animation will reverse when you scroll up, keeping the panel order stable and deliberate.
              </div>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px 96px" }}>
          <div className="board" style={{ padding: "24px 18px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
            <StatItem icon={FileCode2} value={stats?.scripts ?? 0} label="Scripts protected" loading={!stats} />
            <StatItem icon={Key} value={stats?.keys ?? 0} label="Keys issued" loading={!stats} />
            <StatItem icon={Activity} value={stats?.executions ?? 0} label="Executions logged" loading={!stats} />
          </div>
        </section>

        <section id="panels" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 104px" }}>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <div className="pill">Supported Lua runtimes</div>
            <h2 style={{ margin: "16px 0 0", fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-0.04em" }}>One window at a time, driven by scroll</h2>
          </div>
          <div className="board" style={{ position: "sticky", top: 16, overflow: "hidden" }}>
            <LuaObfuscatorBackdrop stage={panelIndex} visible />
            <div style={{ position: "relative", zIndex: 1, padding: 28, minHeight: 420, display: "grid", gridTemplateColumns: "1fr", alignItems: "center" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 12, marginBottom: 18 }}>
                {LUA_PANELS.map((p, i) => (
                  <button key={p.id} onClick={() => setPanelIndex(i)} className="btn" style={{ padding: "12px 10px", justifyContent: "center", opacity: panelIndex === i ? 1 : .56, background: panelIndex === i ? "linear-gradient(180deg, #0e3df0 0%, #081e67 100%)" : "rgba(7,10,18,.88)" }}>
                    {p.title}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 22, alignItems: "center" }}>
                <div>
                  <div className="pill">Window {panelIndex + 1} / 5</div>
                  <h3 style={{ fontSize: 40, margin: "14px 0 10px", letterSpacing: "-0.04em" }}>{LUA_PANELS[panelIndex].title}</h3>
                  <p style={{ color: "rgba(255,255,255,.64)", lineHeight: 1.8, margin: 0 }}>{LUA_PANELS[panelIndex].desc}</p>
                </div>
                <div className="board" style={{ padding: 18, background: "rgba(3,6,12,.72)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {["Loader shield", "Bytecode guard", "String sealing", "API fit"].map((k) => (
                      <div key={k} className="glass" style={{ padding: 14, borderRadius: 14 }}>
                        <div style={{ color: "rgba(255,255,255,.52)", fontSize: 12 }}>{k}</div>
                        <div style={{ marginTop: 5, fontWeight: 700 }}>Active</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: 420 }} />
        </section>

        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 110px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div className="pill">Core Features</div>
            <h2 style={{ margin: "16px 0 0", fontSize: "clamp(28px,4vw,50px)", letterSpacing: "-0.04em" }}>Interactive reveal on scroll</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {CORE_FEATURES.map((f, i) => {
              const Icon = f.icon;
              const active = featureIndex === i;
              return (
                <motion.div key={f.title} onMouseEnter={() => setFeatureIndex(i)} onFocus={() => setFeatureIndex(i)} tabIndex={0} className="feature-card" style={{ transform: active ? "translateY(-4px)" : "none", borderColor: active ? "rgba(90,130,255,.32)" : undefined }}>
                  <div style={{ width: 42, height: 42, borderRadius: 14, display: "grid", placeItems: "center", background: active ? "linear-gradient(180deg, #0e3df0 0%, #081e67 100%)" : "rgba(14,61,240,.16)", marginBottom: 16 }}><Icon size={20} /></div>
                  <h3 style={{ margin: "0 0 10px", fontSize: 18 }}>{f.title}</h3>
                  <p style={{ margin: 0, color: "rgba(255,255,255,.62)", lineHeight: 1.75 }}>{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px 120px" }}>
          <div className="board" style={{ padding: 28 }}>
            <h2 style={{ marginTop: 0, fontSize: 36, letterSpacing: "-0.04em" }}>Pricing stays clean in the same dark system</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
              {pricingData.plans.map((plan) => (
                <div key={plan.id} className="feature-card">
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{plan.name}</div>
                  <div style={{ color: "rgba(255,255,255,.54)", fontSize: 13, margin: "4px 0 14px" }}>{plan.subtitle}</div>
                  <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 18 }}>{plan.price === 0 ? "Free" : `$${plan.price}`}</div>
                  <Link href={session ? "/dashboard/upgrade" : "/login"} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>{plan.cta}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ textAlign: "center", padding: "0 24px 120px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <h2 style={{ fontSize: "clamp(30px,5vw,56px)", letterSpacing: "-0.04em" }}>Ready to protect Lua the way it should be protected?</h2>
            <p style={{ color: "rgba(255,255,255,.62)", lineHeight: 1.8 }}>{config.site.description}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
              <Link href={session ? "/dashboard" : "/login"} className="btn btn-primary">Get Started Free</Link>
              <a href="#hero" className="btn btn-secondary">Back to top</a>
            </div>
          </div>
        </section>

        <PublicFooter />
      </div>
    </div>
  );
}
