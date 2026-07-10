"use client";

import { useEffect, useRef, useState } from "react";

export default function useSwipeIndex({ length, initial = 0, lockMs = 650 }) {
  const [index, setIndex] = useState(initial);
  const lockRef = useRef(false);
  const touchRef = useRef({ y: 0, active: false });

  useEffect(() => {
    const onWheel = (e) => {
      if (lockRef.current || Math.abs(e.deltaY) < 14) return;
      lockRef.current = true;
      setIndex((curr) => Math.max(0, Math.min(length - 1, curr + (e.deltaY > 0 ? 1 : -1))));
      window.setTimeout(() => (lockRef.current = false), lockMs);
    };

    const onTouchStart = (e) => {
      touchRef.current = { y: e.touches[0].clientY, active: true };
    };

    const onTouchEnd = (e) => {
      if (!touchRef.current.active || lockRef.current) return;
      const delta = touchRef.current.y - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 42) return;
      lockRef.current = true;
      setIndex((curr) => Math.max(0, Math.min(length - 1, curr + (delta > 0 ? 1 : -1))));
      touchRef.current.active = false;
      window.setTimeout(() => (lockRef.current = false), lockMs);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [length, lockMs]);

  return [index, setIndex];
}
