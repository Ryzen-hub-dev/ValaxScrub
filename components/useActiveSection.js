"use client";

import { useEffect, useState } from "react";

export default function useActiveSection(sectionIds) {
  const [activeSection, setActiveSection] = useState(sectionIds?.[0] || "hero");

  useEffect(() => {
    const nodes = (sectionIds || [])
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const candidate = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (candidate?.target?.id) setActiveSection(candidate.target.id);
      },
      { threshold: [0.18, 0.3, 0.45, 0.6, 0.75] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}
