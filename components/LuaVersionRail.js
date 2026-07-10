"use client";

import { motion, AnimatePresence } from "framer-motion";

const versions = [
  { key: "Lua 5.1", title: "Lua 5.1", support: "Fully supported", desc: "Best fit for legacy executors and older script pipelines. Stable obfuscation profile, minimal runtime surprises." },
  { key: "Lua 5.2", title: "Lua 5.2", support: "Supported", desc: "Balanced compatibility for mixed environments. Recommended when you need clean runtime output and predictable transforms." },
  { key: "Lua 5.3", title: "Lua 5.3", support: "Supported", desc: "Modern numeric model support, stronger control-flow shaping, and better string-layer handling." },
  { key: "Lua 5.4", title: "Lua 5.4", support: "Supported", desc: "Best for newer runtimes. Supports tighter transforms, stronger anti-tamper sequencing, and smoother deobfuscation resistance." },
  { key: "Luau", title: "Luau", support: "Supported", desc: "Optimized for Roblox-style workflows. Tailored runtime paths, compact output, and fast delivery structure." },
];

export default function LuaVersionRail({ activeIndex = 0 }) {
  const item = versions[activeIndex];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 12, marginBottom: 24 }}>
        {versions.map((v, idx) => (
          <div key={v.key} style={{ borderRadius: 18, padding: "12px 14px", textAlign: "center", background: idx === activeIndex ? "rgba(28,64,140,0.34)" : "rgba(255,255,255,0.03)", border: idx === activeIndex ? "1px solid rgba(109,154,255,0.42)" : "1px solid rgba(255,255,255,0.06)", color: idx === activeIndex ? "#dbe7ff" : "rgba(255,255,255,0.58)", transition: "all 220ms ease", backdropFilter: "blur(10px)" }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{v.key}</div>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={item.key} initial={{ opacity: 0, y: 18, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(8px)" }} transition={{ duration: 0.34, ease: "easeOut" }} style={{ borderRadius: 26, background: "linear-gradient(180deg, rgba(9,16,32,0.88), rgba(4,7,14,0.96))", border: "1px solid rgba(114,146,255,0.16)", padding: 28, boxShadow: "0 24px 80px rgba(0,0,0,0.42)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", marginBottom: 8 }}>Lua Runtime Window</div>
              <h2 style={{ margin: 0, fontSize: "clamp(30px, 4vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.04em" }}>{item.title}</h2>
            </div>
            <div style={{ borderRadius: 999, padding: "8px 14px", background: "rgba(78,114,255,0.14)", color: "#cfe0ff", fontSize: 12, fontWeight: 700, border: "1px solid rgba(121,150,255,0.18)" }}>{item.support}</div>
          </div>
          <p style={{ marginTop: 18, marginBottom: 0, color: "rgba(255,255,255,0.62)", lineHeight: 1.8, maxWidth: 640 }}>{item.desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
