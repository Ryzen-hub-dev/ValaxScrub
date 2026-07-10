"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function FeatureFlow({ items, activeIndex = 0 }) {
  const item = items[activeIndex];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 18, alignItems: "stretch" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((it, idx) => {
          const active = idx === activeIndex;
          return (
            <motion.div
              key={it.title}
              animate={{ x: active ? 6 : 0, opacity: active ? 1 : 0.72, scale: active ? 1.01 : 1 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{ borderRadius: 18, padding: "16px 18px", background: active ? "linear-gradient(180deg, rgba(111,149,255,0.16), rgba(13,22,44,0.82))" : "rgba(13,22,44,0.66)", border: active ? "1px solid rgba(143,176,255,0.32)" : "1px solid rgba(121,150,255,0.12)", color: "#f5f8ff", boxShadow: active ? "0 14px 28px rgba(0,0,0,0.18)" : "none" }}
            >
              <div style={{ fontSize: 14, fontWeight: 700 }}>{it.title}</div>
              <div style={{ fontSize: 12, marginTop: 4, opacity: 0.72, color: "rgba(245,248,255,0.72)" }}>{it.short}</div>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={item.title} initial={{ opacity: 0, x: 20, filter: "blur(10px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: -14, filter: "blur(10px)" }} transition={{ duration: 0.3, ease: "easeOut" }} style={{ borderRadius: 26, background: "linear-gradient(180deg, rgba(7,12,25,0.92), rgba(2,4,9,0.98))", border: "1px solid rgba(121,150,255,0.14)", padding: 26, boxShadow: "0 22px 70px rgba(0,0,0,0.34)" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,248,255,0.46)", marginBottom: 12 }}>Active feature</div>
          <h3 style={{ margin: 0, fontSize: 28, lineHeight: 1.05, letterSpacing: "-0.04em", color: "#f5f8ff" }}>{item.title}</h3>
          <p style={{ marginTop: 14, marginBottom: 0, color: "rgba(245,248,255,0.66)", lineHeight: 1.82 }}>{item.desc}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
