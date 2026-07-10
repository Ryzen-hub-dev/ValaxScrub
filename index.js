"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Lock, Fingerprint, BarChart3, Key, Zap, Code2,
  FileCode2, Activity, Check, Minus, X,
} from "lucide-react";
import PublicNav from "./components/PublicNav";
import PublicFooter from "./components/PublicFooter";
import WaveBackground from "./components/WaveBackground";
import Valax3DBackdrop from "./components/Valax3DBackdrop";
import useActiveSection from "./components/useActiveSection";
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
      <div style={{ color: "var(--accent)", marginBottom: 2 }}><Icon size={18} /></div>
      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", color: "var(--text)", minWidth: 60, textAlign: "center" }}>
        {loading ? (
          <span style={{ display: "inline-block", width: 56, height: 28, borderRadius: 6, background: "rgba(var(--fg-rgb),0.06)", animation: "pulse 1.4s ease-in-out infinite" }} />
        ) : formatNumber(counted)}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function CompareIcon({ type, text }) {
  if (type === "check")   return <span style={{ color: "var(--accent)", display: "flex", alignItems: "center", gap: 6 }}><Check size={15} />{text}</span>;
  if (type === "cross")   return <span style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: 6 }}><X size={15} />{text}</span>;
  if (type === "partial") return <span style={{ color: "#f59e0b", display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 16 }}>⚡</span>{text}</span>;
  if (type === "speed")   return <span style={{ color: "#22c55e", fontWeight: 600 }}>{text}</span>;
  return <span style={{ color: "rgba(var(--fg-rgb),0.45)" }}>{text}</span>;
}

export default function HomeClient({ session }) {
  const [stats, setStats] = useState(null);
  const activeSection = useActiveSection(["hero", "features", "why", "security", "compare", "pricing"]);
  useEffect(() => { fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {}); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes twinkle { 0%,100%{opacity:.2} 50%{opacity:.7} }
        .section-pill {
          display: inline-flex; align-items: center;
          background: rgba(var(--fg-rgb),0.06);
          border: 1px solid rgba(var(--fg-rgb),0.1);
          border-radius: 999px; padding: 4px 14px;
          font-size: 11px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: rgba(var(--fg-rgb),0.5); margin-bottom: 20px;
        }
        .compare-row:hover { background: rgba(var(--fg-rgb),0.03); }
        @keyframes floatOrb {
          0%,100% { transform: translate(0,0); }
          50% { transform: translate(-14px,18px); }
        }
        .hero-orb { animation: floatOrb 9s ease-in-out infinite; }
        .hero-orb-alt { animation: floatOrb 11s ease-in-out infinite reverse; }
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

      <WaveBackground opacity={0.22} />

      <div style={{ position: "relative", zIndex: 2 }}>
      <PublicNav session={session} />

      {/* ── Hero ── */}
      <section
        id="hero"
        style={{
          position: "relative",
          textAlign: "center",
          padding: "168px 24px 110px",
          overflow: "hidden",
        }}
      >
        <Valax3DBackdrop focus={activeSection === "security" ? "security" : activeSection === "pricing" ? "pricing" : activeSection === "features" ? "features" : "hero"} visible />
        <div className="bg-grid-fade" />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 45% at 50% 0%, var(--accent-glow), transparent)", pointerEvents: "none" }} />
        <div className="glow-orb hero-orb" style={{ width: 320, height: 320, top: -60, left: "18%", background: "var(--accent)", opacity: 0.22 }} />
        <div className="glow-orb hero-orb-alt" style={{ width: 260, height: 260, top: 60, right: "14%", background: "var(--accent-secondary, var(--accent))", opacity: 0.18 }} />
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ position: "relative", maxWidth: 780, margin: "0 auto" }}>
          <motion.div variants={fadeUp} custom={0} className="section-pill" style={{ margin: "0 auto 26px" }}>
            Zero scripts cracked · Since day one
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} style={{ fontSize: "clamp(46px,7.5vw,88px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", marginBottom: 24 }}>
            Your code, sealed<br />
            <span className="gradient-text" style={{ backgroundImage: "var(--accent-gradient, var(--accent))" }}>behind a signal</span><br />
            no one can trace.
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} style={{ color: "rgba(var(--fg-rgb),0.5)", fontSize: 17.5, lineHeight: 1.75, maxWidth: 500, margin: "0 auto 42px" }}>
            {config.site.description}
          </motion.p>
          <motion.div variants={fadeUp} custom={3} style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={session ? "/dashboard" : "/login"} className="btn btn-primary btn-lg">
              Get Started Free <span style={{ fontSize: 18 }}>→</span>
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              See how it works
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats banner ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
        style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 100px" }}>
        <div className="glass" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", padding: "28px 16px", gap: 0 }}>
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

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}
          className="features-grid"
        >
          {CORE_FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} variants={fadeUp} custom={i} className="lift-card"
                style={{ background: "rgba(var(--fg-rgb),0.03)", border: "1px solid rgba(var(--fg-rgb),0.07)", borderRadius: 16, padding: "28px 24px", cursor: "default" }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-glow)", border: "1px solid rgba(var(--fg-rgb),0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", marginBottom: 18 }}>
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.01em" }}>{f.title}</h3>
                <p style={{ color: "rgba(var(--fg-rgb),0.45)", fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
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
            <motion.div key={item.num} variants={fadeUp} custom={i} className="lift-card"
              style={{ background: "rgba(var(--fg-rgb),0.03)", border: "1px solid rgba(var(--fg-rgb),0.07)", borderRadius: 16, padding: "32px 28px", position: "relative", overflow: "hidden", cursor: "default" }}
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
            Built-In <span style={{ color: "var(--accent)" }}>Fortress-Level</span> Security
          </h2>
          <p style={{ color: "rgba(var(--fg-rgb),0.45)", fontSize: 15, maxWidth: 540, margin: "0 auto" }}>
            Every layer of Valax is designed to protect your intellectual property from reverse engineering, cracking, and unauthorized access.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }} className="security-grid"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 240, height: 240, borderRadius: 20, background: "var(--accent-glow)", border: "1px solid var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 80px var(--accent-glow)" }}>
              <Image src="/logo.png" alt="Valax Security" width={120} height={120} style={{ filter: "drop-shadow(0 0 24px rgba(59,130,246,0.6))" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {SECURITY_ITEMS.map((item) => (
              <div key={item.title} style={{ display: "flex", gap: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", flexShrink: 0, marginTop: 6, boxShadow: "0 0 8px rgba(34,197,94,0.5)" }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 5 }}>{item.title}</div>
                  <div style={{ color: "rgba(var(--fg-rgb),0.45)", fontSize: 13.5, lineHeight: 1.7 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Compare ── */}
      <section id="compare" style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 120px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 12 }}>
            Valax vs <span style={{ color: "var(--accent)" }}>Luarmor</span>
          </h2>
          <p style={{ color: "rgba(var(--fg-rgb),0.45)", fontSize: 15 }}>See why developers are switching to Valax.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          style={{ background: "rgba(var(--fg-rgb),0.02)", border: "1px solid rgba(var(--fg-rgb),0.08)", borderRadius: 16, overflow: "hidden" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 24px", borderBottom: "1px solid rgba(var(--fg-rgb),0.08)", background: "rgba(var(--fg-rgb),0.03)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--fg-rgb),0.3)" }}>Feature</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--fg-rgb),0.3)" }}>Valax</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(var(--fg-rgb),0.3)" }}>Luarmor</div>
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div key={row.feature} className="compare-row"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 24px", borderBottom: i < COMPARE_ROWS.length - 1 ? "1px solid rgba(var(--fg-rgb),0.05)" : "none", transition: "background 0.15s" }}
            >
              <div style={{ fontSize: 14, color: "rgba(var(--fg-rgb),0.55)" }}>{row.feature}</div>
              <div style={{ fontSize: 14 }}><CompareIcon type={row.vType} text={row.valax} /></div>
              <div style={{ fontSize: 14 }}><CompareIcon type={row.lType} text={row.luarmor} /></div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 120px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>Simple, Transparent Pricing</h2>
          <p style={{ color: "rgba(var(--fg-rgb),0.45)", fontSize: 15 }}>Start free, scale as you grow.</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}
          style={{ display: "grid", gridTemplateColumns: "1fr 1.08fr 1fr", gap: 20, alignItems: "start" }} className="pricing-grid"
        >
          {pricingData.plans.map((plan, i) => {
            const isPro = plan.popular;
            return (
              <motion.div key={plan.id} variants={fadeUp} custom={i} className={isPro ? "" : "lift-card"}
                style={{
                  background: "rgba(var(--fg-rgb),0.03)",
                  border: `1px solid ${isPro ? "rgba(var(--fg-rgb),0.15)" : "rgba(var(--fg-rgb),0.07)"}`,
                  borderRadius: 18, padding: "28px 26px",
                  position: "relative",
                  boxShadow: isPro ? "0 0 40px var(--accent-glow)" : "none",
                }}
              >
                {isPro && (
                  <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999 }}>
                    Most Popular
                  </div>
                )}
                <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{plan.name}</div>
                <div style={{ color: "rgba(var(--fg-rgb),0.4)", fontSize: 13, marginBottom: 20 }}>{plan.subtitle}</div>
                <div style={{ marginBottom: 20 }}>
                  {plan.price === 0 ? (
                    <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.04em", color: "var(--accent)" }}>Free</div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
                      <span style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.04em" }}>${plan.price}</span>
                      <span style={{ color: "rgba(var(--fg-rgb),0.4)", fontSize: 14, marginBottom: 10 }}>/mo</span>
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 28 }}>
                  {plan.features.filter((f) => f.included).map((f) => (
                    <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13 }}>
                      <Check size={13} style={{ color: "var(--accent)", flexShrink: 0 }} />
                      <span style={{ color: "rgba(var(--fg-rgb),0.7)" }}>
                        {f.label}
                        {f.detail && (
                          <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: "var(--accent)", background: "var(--accent-glow)", padding: "1px 7px", borderRadius: 10 }}>
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
