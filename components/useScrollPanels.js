"use client";

import { useEffect, useState } from "react";

export default function useScrollPanels(panelIds) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const nodes = (panelIds || [])
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          const next = panelIds.indexOf(visible.target.id);
          if (next >= 0) setActiveIndex(next);
        }
      },
      { threshold: [0.25, 0.4, 0.55, 0.7] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [panelIds]);

  return [activeIndex, setActiveIndex];
}
