"use client";

import { motion, AnimatePresence } from "framer-motion";

const versions = [
  { key: "Lua 5.1", title: "Lua 5.1", support: "Legacy stable", desc: "Keeps older execution paths predictable while preserving the least noisy output profile." },
  { key: "Lua 5.2", title: "Lua 5.2", support: "Balanced", desc: "A clean middle ground when compatibility matters more than aggressive transformation density." },
  { key: "Lua 5.3", title: "Lua 5.3", support: "Strong support", desc: "Better numeric handling and tighter string shaping for modern pipelines." },
  { key: "Lua 5.4", title: "Lua 5.4", support: "Modern", desc: "The sharpest fit for newer runtimes, with stronger runtime checks and cleaner sequencing." },
  { key: "Luau", title: "Luau", support: "Targeted", desc: "Compact output and runtime-aware transforms tuned for Roblox-style workflows." },
];

export default function LuaVersionRail({ activeIndex = 0 }) {
  const item = versions[activeIndex];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 10, marginBottom: 22 }}>
        {versions.map((v, idx) => (
          <motion.div
            key={v.key}
            animate={{ y: idx === activeIndex ? -2 : 0, scale: idx === activeIndex ? 1.02 : 1, opacity: idx === activeIndex ? 1 : 0.72 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ borderRadius: 18, padding: "12px 14px", textAlign: "center", background: idx === activeIndex ? "linear-gradient(180deg, rgba(111,149,255,0.22), rgba(13,22,44,0.86))" : "rgba(13,22,44,0.72)", border: idx === activeIndex ? "1px solid rgba(143,176,255,0.42)" : "1px solid rgba(121,150,255,0.12)", color: "#f5f8ff", boxShadow: idx === activeIndex ? "0 16px 34px rgba(0,0,0,0.22)" : "none", backdropFilter: "blur(10px)" }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.02em" }}>{v.key}</div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={item.key} initial={{ opacity: 0, y: 16, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(10px)" }} transition={{ duration: 0.32, ease: "easeOut" }} style={{ borderRadius: 28, background: "linear-gradient(180deg, rgba(7,12,25,0.92), rgba(2,4,9,0.98))", border: "1px solid rgba(121,150,255,0.14)", padding: 28, boxShadow: "0 22px 70px rgba(0,0,0,0.38)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,248,255,0.46)", marginBottom: 10 }}>Runtime window</div>
              <h2 style={{ margin: 0, fontSize: "clamp(30px, 4vw, 52px)", lineHeight: 1.02, letterSpacing: "-0.05em", color: "#f5f8ff" }}>{item.title}</h2>
            </div>
            <div style={{ borderRadius: 999, padding: "8px 14px", background: "rgba(143,176,255,0.10)", color: "#f5f8ff", fontSize: 12, fontWeight: 700, border: "1px solid rgba(143,176,255,0.16)" }}>{item.support}</div>
          </div>
          <p style={{ marginTop: 18, marginBottom: 0, color: "rgba(245,248,255,0.66)", lineHeight: 1.82, maxWidth: 640 }}>{item.desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
