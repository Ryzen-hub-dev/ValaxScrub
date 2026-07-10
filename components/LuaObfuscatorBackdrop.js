"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LuaObfuscatorBackdrop({ stage = 0, visible = true }) {
  const hostRef = useRef(null);
  const apiRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduced) return undefined;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x02040b, 8, 24);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.8, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(host.clientWidth || 1, host.clientHeight || 1, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const ambient = new THREE.AmbientLight(0x1d3cff, 1.2);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0x6f92ff, 2.6);
    key.position.set(2, 3, 6);
    scene.add(key);

    const cardGeo = new THREE.BoxGeometry(1.25, 1.75, 0.08);
    const cards = [];
    const mats = [];

    for (let i = 0; i < 5; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x05070d,
        emissive: 0x1236a6,
        emissiveIntensity: 0.08,
        roughness: 0.25,
        metalness: 0.82,
        transparent: true,
        opacity: 0.92,
      });
      const mesh = new THREE.Mesh(cardGeo, mat);
      mesh.position.x = (i - 2) * 0.85;
      mesh.rotation.y = (i - 2) * 0.08;
      mesh.position.y = Math.sin(i * 0.8) * 0.08;
      root.add(mesh);
      cards.push(mesh);
      mats.push(mat);
    }

    const wiresGeo = new THREE.BufferGeometry();
    const points = [];
    for (let i = 0; i < 120; i++) {
      const a = (i / 120) * Math.PI * 2;
      points.push(Math.cos(a) * 3.4, Math.sin(a * 2) * 0.22, Math.sin(a) * 2.4);
    }
    wiresGeo.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    const wires = new THREE.Points(wiresGeo, new THREE.PointsMaterial({ color: 0x6f92ff, size: 0.03, transparent: true, opacity: 0.45 }));
    root.add(wires);

    let raf = 0;
    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const stageState = [
      { tilt: -0.14, spread: 0.0, glow: 0.12 },
      { tilt: -0.05, spread: 0.2, glow: 0.2 },
      { tilt: 0.02, spread: 0.36, glow: 0.28 },
      { tilt: 0.07, spread: 0.16, glow: 0.22 },
      { tilt: 0.12, spread: 0.0, glow: 0.16 },
    ];

    const animate = (now) => {
      const t = now * 0.001;
      const s = stageState[stage] || stageState[0];
      root.rotation.y = Math.sin(t * 0.25) * 0.12;
      root.rotation.x = s.tilt + Math.sin(t * 0.45) * 0.03;
      cards.forEach((card, i) => {
        card.position.z = Math.sin(t * 0.8 + i) * 0.14 + s.spread * i * 0.18;
        card.rotation.z = Math.sin(t * 0.6 + i) * 0.03;
        mats[i].emissiveIntensity = s.glow + Math.max(0, 0.04 * (stage === i ? 4 : 1));
      });
      wires.rotation.y = t * 0.06;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize, { passive: true });
    resize();
    raf = requestAnimationFrame(animate);

    apiRef.current = { dispose() {} };
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      cardGeo.dispose();
      wiresGeo.dispose();
      mats.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [stage]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 240ms ease",
      }}
    />
  );
}
