"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function FeatureFlow({ items, activeIndex = 0 }) {
  const item = items[activeIndex];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 18, alignItems: "stretch" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((it, idx) => (
          <div key={it.title} style={{ borderRadius: 18, padding: "16px 18px", background: idx === activeIndex ? "rgba(32,64,128,0.28)" : "rgba(255,255,255,0.03)", border: idx === activeIndex ? "1px solid rgba(121,152,255,0.34)" : "1px solid rgba(255,255,255,0.06)", color: idx === activeIndex ? "#e8f0ff" : "rgba(255,255,255,0.54)", transition: "all 220ms ease" }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{it.title}</div>
            <div style={{ fontSize: 12, marginTop: 4, opacity: 0.72 }}>{it.short}</div>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={item.title} initial={{ opacity: 0, x: 24, filter: "blur(8px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -18, filter: "blur(8px)" }} transition={{ duration: 0.32, ease: "easeOut" }} style={{ borderRadius: 24, background: "linear-gradient(180deg, rgba(7,12,25,0.92), rgba(3,5,11,0.98))", border: "1px solid rgba(114,146,255,0.16)", padding: 24 }}>
          <div style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)", marginBottom: 12 }}>Active Feature</div>
          <h3 style={{ margin: 0, fontSize: 26, lineHeight: 1.1, letterSpacing: "-0.03em" }}>{item.title}</h3>
          <p style={{ marginTop: 14, marginBottom: 0, color: "rgba(255,255,255,0.62)", lineHeight: 1.8 }}>{item.desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
