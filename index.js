"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lock, Fingerprint, BarChart3, Key, Zap, Code2,
  FileCode2, Activity, Check, X,
} from "lucide-react";
import PublicNav from "./components/PublicNav";
import PublicFooter from "./components/PublicFooter";
import WaveBackground from "./components/WaveBackground";
import Valax3DBackdrop from "./components/Valax3DBackdrop";
import useActiveSection from "./components/useActiveSection";
import useSwipeIndex from "./components/useSwipeIndex";
import LuaVersionRail from "./components/LuaVersionRail";
import FeatureFlow from "./components/FeatureFlow";
import config from "./config.json";
import pricingData from "./pricing.json";

const CORE_FEATURES = [
  {
    icon: Lock,
    title: "5-Pass Multi-Layer Obfuscation",
    desc: "Five transformation passes: control flow flattening, string encryption, opaque predicates, dead code injection, and constant blinding. Unreadable. Unreversible.",
  },
  {
    icon: Fingerprint,
    title: "Triple-Factor HWID Lock",
    desc: "Bind scripts to hardware ID, IP address, and device fingerprint simultaneously. Prevent sharing with instant revocation and multi-device management.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Live dashboard with execution tracking, geographic distribution, error monitoring, and usage patterns. Know exactly who runs your scripts.",
  },
  {
    icon: Key,
    title: "Advanced Key System",
    desc: "Generate, revoke, and manage license keys with custom expiry, IP limits, and tier-based access control. Full API integration.",
  },
  {
    icon: Zap,
    title: "Lightning Loader",
    desc: "15ms average script delivery. Edge-cached, compressed, and optimized for instant execution across all environments.",
  },
  {
    icon: Code2,
    title: "Developer API",
    desc: "Full REST API for automation. Manage scripts, keys, users, and analytics programmatically. Webhooks for real-time events.",
  },
];

const WHY_ITEMS = [
  {
    num: "01",
    title: "Zero Scripts Cracked",
    desc: "Our multi-pass obfuscation has never been reversed. Period. We challenge anyone to try.",
  },
  {
    num: "02",
    title: "Sub-15ms Delivery",
    desc: "Edge-cached globally. Your scripts load faster than a blink, anywhere in the world.",
  },
  {
    num: "03",
    title: "Modern Dashboard",
    desc: "Beautiful, responsive, real-time. Manage everything from a single premium interface.",
  },
  {
    num: "04",
    title: "Developer-First API",
    desc: "REST API with webhooks, SDKs, and comprehensive docs. Automate your entire workflow.",
  },
];

const SECURITY_ITEMS = [
  {
    title: "5-Pass Multi-Layer Obfuscation",
    desc: "Control flow flattening, opaque predicates, string encryption, and constant blinding — applied in five independent transformation passes.",
  },
  {
    title: "Anti-Tamper Runtime Checks",
    desc: "Self-verifying code integrity. If any bytecode modification is detected at runtime, the script self-destructs.",
  },
  {
    title: "Triple-Factor Device Lock",
    desc: "Hardware ID + IP address + browser/device fingerprint — three independent binding factors that all must match.",
  },
  {
    title: "Encrypted Script Delivery",
    desc: "End-to-end encrypted loader pipeline. Scripts are never transmitted in plaintext. AES-256-GCM at rest, TLS 1.3 in transit.",
  },
];

const COMPARE_ROWS = [
  { feature: "Obfuscation Engine",    valax: "5-Pass Multi-Layer",  luarmor: "Standard",      vType: "check",   lType: "check"   },
  { feature: "HWID Locking",          valax: "Triple-Factor",       luarmor: "Single",         vType: "check",   lType: "check"   },
  { feature: "Key System",            valax: "Advanced + API",      luarmor: "Basic",          vType: "check",   lType: "check"   },
  { feature: "Real-Time Analytics",   valax: "Full Dashboard",      luarmor: "Limited",        vType: "check",   lType: "partial" },
  { feature: "Developer API",         valax: "REST + Webhooks",     luarmor: "Basic",          vType: "check",   lType: "partial" },
  { feature: "Modern UI",             valax: "Premium Dark",        luarmor: "Outdated",       vType: "check",   lType: "cross"   },
  { feature: "Script Delivery Speed", valax: "15ms",                luarmor: "~100ms",         vType: "speed",   lType: "neutral" },
  { feature: "Detection Resistance",  valax: "Anti-Tamper",         luarmor: "Basic",          vType: "check",   lType: "partial" },
  { feature: "Custom Loader",         valax: "White-Label",         luarmor: "No",             vType: "check",   lType: "cross"   },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: "easeOut" },
  }),
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

const LUA_VERSION_ITEMS = ["Lua 5.1", "Lua 5.2", "Lua 5.3", "Lua 5.4", "Luau"];
const FLOW_ITEMS = [
  { title: "Control-flow shaping", short: "Structure-aware flattening", desc: "Reorders execution paths to preserve behavior while collapsing readable logic into controlled branches." },
  { title: "String layer masking", short: "Runtime-safe string concealment", desc: "Targets sensitive literals and reconstructs them late in the pipeline to reduce static extraction value." },
  { title: "Anti-tamper checks", short: "Integrity-aware runtime guarding", desc: "Verifies transformation continuity and flags suspicious binary or script mutation patterns." },
  { title: "Loader minimization", short: "Fast bootstrap, low overhead", desc: "Keeps the delivery layer small, so the obfuscation itself doesn’t become the performance bottleneck." },
];

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toLocaleString();
}

function useCountUp(target, duration = 1400) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (target == null) return;
    if (target === 0) { setDisplay(0); return; }
    const start = performance.now();
    let raf;
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
      else setDisplay(target);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return display;
}

function StatItem({ icon: Icon, value, label, loading }) {
  const counted = useCountUp(loading ? null : value);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "0 32px" }}>
      <div style={{ color: "#8fb0ff", marginBottom: 2 }}><Icon size={18} /></div>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", color: "#f5f8ff", minWidth: 60, textAlign: "center" }}>
        {loading ? (
          <span style={{ display: "inline-block", width: 56, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.05)", animation: "pulse 1.4s ease-in-out infinite" }} />
        ) : formatNumber(counted)}
      </div>
      <div style={{ fontSize: 13, color: "rgba(245,248,255,0.64)", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function CompareIcon({ type, text }) {
  if (type === "check")   return <span style={{ color: "#8fb0ff", display: "flex", alignItems: "center", gap: 6 }}><Check size={15} />{text}</span>;
  if (type === "cross")   return <span style={{ color: "#ff6b6b", display: "flex", alignItems: "center", gap: 6 }}><X size={15} />{text}</span>;
  if (type === "partial") return <span style={{ color: "#f0b25d", display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 16 }}>⚡</span>{text}</span>;
  if (type === "speed")   return <span style={{ color: "#9effb8", fontWeight: 600 }}>{text}</span>;
  return <span style={{ color: "rgba(245,248,255,0.52)" }}>{text}</span>;
}

export default function HomeClient({ session }) {
  const [stats, setStats] = useState(null);
  const activeSection = useActiveSection(["hero", "features", "why", "security", "compare", "pricing"]);
  const [luaIndex] = useSwipeIndex({ length: LUA_VERSION_ITEMS.length, initial: 0 });
  const [featureIndex] = useSwipeIndex({ length: FLOW_ITEMS.length, initial: 0 });
  useEffect(() => { fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {}); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:.85} }
        .section-pill {
          display: inline-flex; align-items: center;
          background: rgba(13, 22, 44, 0.8);
          border: 1px solid rgba(121, 150, 255, 0.14);
          border-radius: 999px; padding: 5px 14px;
          font-size: 11px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          color: rgba(245,248,255,0.76); margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }
        .compare-row:hover { background: rgba(255,255,255,0.025); }
        @keyframes floatOrb {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(-14px,18px); }
        }
        .hero-orb { animation: floatOrb 9s ease-in-out infinite; }
        .hero-orb-alt { animation: floatOrb 11s ease-in-out infinite reverse; }
        .glass-card {
          background: linear-gradient(180deg, rgba(8,13,27,0.9), rgba(3,5,12,0.96));
          border: 1px solid rgba(121,150,255,0.12);
          box-shadow: 0 24px 80px rgba(0,0,0,0.34);
          backdrop-filter: blur(12px);
        }
        .lift-card {
          transition: transform 220ms ease, border-color 220ms ease, background 220ms ease;
        }
        .lift-card:hover { transform: translateY(-3px); border-color: rgba(121,150,255,0.26) !important; }
        .btn { border-radius: 18px !important; border: 0 !important; }
        .btn-primary { background: linear-gradient(180deg, #6f95ff, #2d57d6) !important; color: #fff !important; box-shadow: 0 18px 40px rgba(45,87,214,0.24); }
        .btn-secondary { background: rgba(13, 22, 44, 0.92) !important; color: #f5f8ff !important; border: 1px solid rgba(121,150,255,0.14) !important; }
        .gradient-text { background: linear-gradient(180deg, #f7fbff, #8fb0ff); -webkit-background-clip: text; background-clip: text; color: transparent; }
        @media (max-width: 768px) {
          .public-nav-links { display: none !important; }
          .public-nav-mobile-menu { display: flex !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) {
          .public-nav-mobile-menu { display: none !important; }
        }
      `}</style>

      <WaveBackground opacity={0.18} />

      <div style={{ position: "relative", zIndex: 2 }}>
      <PublicNav session={session} />

      {/* ── Hero ── */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100vh",
          textAlign: "center",
          padding: "122px 24px 84px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Valax3DBackdrop
          stage={activeSection === "security" ? "security" : activeSection === "pricing" ? "pricing" : activeSection === "features" ? "features" : activeSection === "why" ? "flow" : "lua"}
          visible
        />
        <div className="bg-grid-fade" />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 45% at 50% 0%, rgba(79,110,255,0.18), transparent)", pointerEvents: "none" }} />
        <div className="glow-orb hero-orb" style={{ width: 320, height: 320, top: -60, left: "18%", background: "#2556d8", opacity: 0.2 }} />
        <div className="glow-orb hero-orb-alt" style={{ width: 260, height: 260, top: 60, right: "14%", background: "#0f1d42", opacity: 0.22 }} />
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 1180, margin: "0 auto" }}>
          <motion.div variants={fadeUp} custom={0} className="section-pill" style={{ margin: "0 auto 22px" }}>
            Lua versions · slide to switch
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} style={{ fontSize: "clamp(46px,7.5vw,92px)", fontWeight: 900, lineHeight: 0.98, letterSpacing: "-0.05em", marginBottom: 18 }}>
            Hide the logic.
            <br />
            <span style={{ color: "#7ea6ff" }}>Deliver the result.</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} style={{ color: "rgba(235,242,255,0.58)", fontSize: 17, lineHeight: 1.8, maxWidth: 680, margin: "0 auto 34px" }}>
            A focused Lua obfuscation system built for five runtimes, with a clean delivery layer and no ornamental noise.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={session ? "/dashboard" : "/login"} className="btn btn-primary btn-lg">
              Start Free <span style={{ fontSize: 18 }}>→</span>
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              View workflow
            </a>
          </motion.div>
          <div style={{ marginTop: 34, maxWidth: 1120, marginLeft: "auto", marginRight: "auto" }}>
            <LuaVersionRail activeIndex={luaIndex} />
          </div>
        </motion.div>
      </section>

      {/* ── Stats banner ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
        style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 100px" }}>
        <div className="glass-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", padding: "28px 16px", gap: 0, borderRadius: 22 }}>
          <StatItem icon={FileCode2} value={stats?.scripts ?? 0}    label="Scripts protected"  loading={!stats} />
          <div style={{ width: 1, height: 40, background: "rgba(var(--fg-rgb),0.07)", flexShrink: 0 }} />
          <StatItem icon={Key}       value={stats?.keys ?? 0}       label="Keys issued"        loading={!stats} />
          <div style={{ width: 1, height: 40, background: "rgba(var(--fg-rgb),0.07)", flexShrink: 0 }} />
          <StatItem icon={Activity}  value={stats?.executions ?? 0} label="Executions logged"  loading={!stats} />
        </div>
      </motion.div>

      {/* ── Core Features ── */}
      <section id="features" style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px 120px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-pill">Core Features</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14 }}>
            Everything You Need to<br />
            <span style={{ color: "var(--accent)" }}>Ship Securely</span>
          </h2>
          <p style={{ color: "rgba(var(--fg-rgb),0.45)", fontSize: 15, maxWidth: 500, margin: "0 auto" }}>
            From military-grade obfuscation to real-time threat detection — Valax is the complete script protection platform.
          </p>
        </motion.div>

        <div style={{ marginTop: 8 }}>
          <FeatureFlow items={FLOW_ITEMS} activeIndex={featureIndex} />
        </div>
      </section>

      {/* ── Why Valax ── */}
      <section id="why" style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px 120px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-pill">Why Valax</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14 }}>
            Built Different. <span style={{ color: "var(--accent)" }}>Built Better.</span>
          </h2>
          <p style={{ color: "rgba(var(--fg-rgb),0.45)", fontSize: 15, maxWidth: 540, margin: "0 auto" }}>
            Valax isn&apos;t just another script platform. It&apos;s a complete ecosystem designed from the ground up for security, speed, and developer experience.
          </p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="why-grid"
        >
          {WHY_ITEMS.map((item, i) => (
            <motion.div key={item.num} variants={fadeUp} custom={i} className="lift-card glass-card"
              style={{ borderRadius: 16, padding: "32px 28px", position: "relative", overflow: "hidden", cursor: "default" }}
            >
              <div style={{ position: "absolute", top: 16, right: 24, fontSize: 64, fontWeight: 900, color: "rgba(var(--fg-rgb),0.05)", lineHeight: 1, userSelect: "none" }}>{item.num}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.01em" }}>{item.title}</h3>
              <p style={{ color: "rgba(var(--fg-rgb),0.45)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Security ── */}
      <section id="security" style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px 120px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-pill">Security</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14 }}>
            Built-In <span style={{ color: "#8fb0ff" }}>Fortress-Level</span> Security
          </h2>
          <p style={{ color: "rgba(245,248,255,0.58)", fontSize: 15, maxWidth: 540, margin: "0 auto" }}>
            Every layer is sequenced to keep the output hard to read without making the interface feel heavy.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "stretch" }} className="security-grid"
        >
          <motion.div className="glass-card lift-card" style={{ borderRadius: 22, padding: 28 }} whileHover={{ y: -3 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,248,255,0.42)" }}>Security Layers</div>
              <div style={{ borderRadius: 999, padding: "7px 12px", background: "rgba(143,176,255,0.12)", color: "#dbe7ff", fontSize: 12, fontWeight: 700 }}>Live</div>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              {SECURITY_ITEMS.map((item, idx) => (
                <div key={item.title} style={{ display: "grid", gridTemplateColumns: "22px 1fr", gap: 14, alignItems: "start", padding: "14px 14px", borderRadius: 16, background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: idx === 0 ? "#8fb0ff" : idx === 1 ? "#9effb8" : idx === 2 ? "#f0b25d" : "#7ea6ff", marginTop: 7, boxShadow: `0 0 10px ${idx === 1 ? "rgba(158,255,184,0.45)" : "rgba(143,176,255,0.35)"}` }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: "#f5f8ff" }}>{item.title}</div>
                    <div style={{ color: "rgba(245,248,255,0.58)", fontSize: 13.5, lineHeight: 1.72 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="glass-card lift-card" style={{ borderRadius: 22, padding: 28, position: "relative", overflow: "hidden" }} whileHover={{ y: -3 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(245,248,255,0.42)", marginBottom: 18 }}>Obfuscation Pulse</div>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                ["Control flow", "Flattened + re-routed"],
                ["Strings", "Late-bound and masked"],
                ["Runtime", "Tamper-aware checks"],
                ["Delivery", "Low-footprint bootstrap"],
              ].map(([a, b]) => (
                <div key={a} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "13px 14px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(121,150,255,0.08)" }}>
                  <span style={{ color: "#f5f8ff", fontWeight: 600 }}>{a}</span>
                  <span style={{ color: "rgba(245,248,255,0.58)" }}>{b}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Compare ── */}
      <section id="compare" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 120px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-pill">Compare</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 12 }}>
            Valax vs <span style={{ color: "#8fb0ff" }}>Luarmor</span>
          </h2>
          <p style={{ color: "rgba(245,248,255,0.58)", fontSize: 15 }}>The comparison panel stays readable, but the emphasis follows your scroll.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="glass-card" style={{ borderRadius: 20, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 24px", borderBottom: "1px solid rgba(121,150,255,0.12)", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,248,255,0.42)" }}>Feature</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,248,255,0.42)" }}>Valax</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(245,248,255,0.42)" }}>Luarmor</div>
          </div>
          <div style={{ display: "grid", gap: 0 }}>
            {COMPARE_ROWS.map((row, i) => (
              <motion.div key={row.feature} className="compare-row"
                whileHover={{ x: 6 }}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 24px", borderBottom: i < COMPARE_ROWS.length - 1 ? "1px solid rgba(121,150,255,0.08)" : "none", transition: "background 0.15s" }}
              >
                <div style={{ fontSize: 14, color: "rgba(245,248,255,0.58)" }}>{row.feature}</div>
                <div style={{ fontSize: 14 }}><CompareIcon type={row.vType} text={row.valax} /></div>
                <div style={{ fontSize: 14 }}><CompareIcon type={row.lType} text={row.luarmor} /></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px 120px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-pill">Pricing</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>Simple, Transparent Pricing</h2>
          <p style={{ color: "rgba(245,248,255,0.58)", fontSize: 15 }}>Plans stay quiet, readable, and aligned with the rest of the page.</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}
          style={{ display: "grid", gridTemplateColumns: "1fr 1.08fr 1fr", gap: 20, alignItems: "stretch" }} className="pricing-grid"
        >
          {pricingData.plans.map((plan, i) => {
            const isPro = plan.popular;
            return (
              <motion.div key={plan.id} variants={fadeUp} custom={i} className={isPro ? "glass-card" : "glass-card lift-card"}
                whileHover={{ y: -4 }}
                style={{
                  borderRadius: 20,
                  padding: "28px 26px",
                  position: "relative",
                  boxShadow: isPro ? "0 0 44px rgba(111,149,255,0.14)" : "none",
                }}
              >
                {isPro && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#6f95ff", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999 }}>
                    Most Popular
                  </div>
                )}
                <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{plan.name}</div>
                <div style={{ color: "rgba(245,248,255,0.52)", fontSize: 13, marginBottom: 20 }}>{plan.subtitle}</div>
                <div style={{ marginBottom: 20 }}>
                  {plan.price === 0 ? (
                    <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.04em", color: "#8fb0ff" }}>Free</div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
                      <span style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.04em", color: "#f5f8ff" }}>${plan.price}</span>
                      <span style={{ color: "rgba(245,248,255,0.52)", fontSize: 14, marginBottom: 10 }}>/mo</span>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 28 }}>
                  {plan.features.filter((f) => f.included).map((f) => (
                    <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}>
                      <Check size={13} style={{ color: "#8fb0ff", flexShrink: 0 }} />
                      <span style={{ color: "rgba(245,248,255,0.74)" }}>
                        {f.label}
                        {f.detail && (
                          <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: "#8fb0ff", background: "rgba(143,176,255,0.12)", padding: "1px 7px", borderRadius: 10 }}>
                            {f.detail}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href={session ? "/dashboard/upgrade" : "/login"}
                  className={isPro ? "btn btn-primary" : "btn btn-secondary"}
                  style={{ display: "flex", width: "100%" }}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── Final CTA ── */}
      <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
        style={{ textAlign: "center", padding: "0 24px 140px" }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 18 }}>
            Ready to Protect<br /><span style={{ color: "var(--accent)" }}>Your Scripts?</span>
          </h2>
          <p style={{ color: "rgba(var(--fg-rgb),0.45)", fontSize: 16, marginBottom: 36 }}>
            {config.site.description}
          </p>
          <Link href={session ? "/dashboard" : "/login"} className="btn btn-primary btn-lg">
            Get Started Free <span style={{ fontSize: 18 }}>→</span>
          </Link>
        </div>
      </motion.section>

      <PublicFooter />
      </div>
    </div>
  );
}
