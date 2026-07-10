"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function buildParticleRing(count = 180) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const seed = 0.61803398875;

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const r = 3.1 + ((i * seed) % 1) * 2.8;
    const wobble = Math.sin(i * 0.37) * 0.18;
    positions[i * 3] = Math.cos(t) * r + wobble;
    positions[i * 3 + 1] = Math.sin(i * 0.29) * 1.6;
    positions[i * 3 + 2] = Math.sin(t) * r - wobble;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}

export default function Valax3DBackdrop({ focus = "hero", visible = true }) {
  const hostRef = useRef(null);
  const apiRef = useRef(null);

  const reducedMotion = typeof window !== "undefined"
    ? window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    : true;

  useEffect(() => {
    const host = hostRef.current;
    if (!host || reducedMotion) return undefined;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050816, 6, 18);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.15, 7.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    host.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const ambient = new THREE.AmbientLight(0x88aaff, 1.05);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.25);
    key.position.set(2.4, 3.4, 5.2);
    scene.add(key);

    const rim = new THREE.PointLight(0x4f8cff, 18, 22);
    rim.position.set(-3.4, 0.9, 4.2);
    scene.add(rim);

    const coreGeo = new THREE.IcosahedronGeometry(1.12, 2);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x7ca7ff,
      roughness: 0.16,
      metalness: 0.2,
      transmission: 0.32,
      thickness: 1.2,
      transparent: true,
      opacity: 0.96,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    root.add(core);

    const shellGeo = new THREE.TorusKnotGeometry(1.92, 0.16, 220, 18);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x172244,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.2,
      roughness: 0.35,
      metalness: 0.62,
      transparent: true,
      opacity: 0.9,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.rotation.x = Math.PI * 0.38;
    root.add(shell);

    const ringGeo = new THREE.RingGeometry(2.25, 2.45, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x61a7ff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    root.add(ring);

    const particleGeo = buildParticleRing();
    const particleMat = new THREE.PointsMaterial({
      color: 0xa9c8ff,
      size: 0.03,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const cloud = new THREE.Points(particleGeo, particleMat);
    root.add(cloud);

    const pointer = { x: 0, y: 0 };
    let targetX = 0;
    let targetY = 0;
    let activeFocus = focus;
    let activeIntensity = visible ? 1 : 0.15;
    let raf = 0;

    const resize = () => {
      const width = host.clientWidth || 1;
      const height = host.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const move = (event) => {
      const rect = host.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const focusMap = {
      hero: { scale: 1.0, core: 0.92, shell: 1.0, ring: 1.0, particles: 1.0 },
      features: { scale: 1.03, core: 1.12, shell: 1.08, ring: 1.12, particles: 1.08 },
      security: { scale: 1.08, core: 1.22, shell: 1.18, ring: 1.2, particles: 1.14 },
      pricing: { scale: 0.96, core: 0.82, shell: 0.9, ring: 0.94, particles: 0.9 },
      idle: { scale: 0.98, core: 0.72, shell: 0.84, ring: 0.88, particles: 0.86 },
    };

    const animate = (now) => {
      const t = now * 0.001;
      const f = focusMap[activeFocus] || focusMap.hero;
      const scale = THREE.MathUtils.lerp(1, f.scale, activeIntensity);

      root.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08);
      targetX += pointer.y * 0.0006;
      targetY += pointer.x * 0.0006;
      root.rotation.x += (targetX - root.rotation.x) * 0.045;
      root.rotation.y += (targetY - root.rotation.y) * 0.055;

      core.rotation.x = t * 0.28;
      core.rotation.y = t * 0.36;
      shell.rotation.z = t * 0.12;
      ring.rotation.z = -t * 0.06;
      cloud.rotation.y = t * 0.025;

      const breathe = 1 + Math.sin(t * 1.6) * 0.018;
      core.scale.setScalar(breathe);

      coreMat.emissiveIntensity = 0.12 + 0.48 * activeIntensity * f.core;
      shellMat.emissiveIntensity = 0.1 + 0.3 * activeIntensity * f.shell;
      ringMat.opacity = 0.12 + 0.16 * activeIntensity * f.ring;
      particleMat.opacity = 0.34 + 0.16 * activeIntensity * f.particles;

      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    resize();
    raf = window.requestAnimationFrame(animate);

    apiRef.current = {
      setFocus(nextFocus, intensity = 1) {
        activeFocus = nextFocus;
        activeIntensity = intensity;
      },
      dispose() {
        window.cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", move);
        particleGeo.dispose();
        particleMat.dispose();
        ringGeo.dispose();
        ringMat.dispose();
        shellGeo.dispose();
        shellMat.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      },
    };

    return () => apiRef.current?.dispose();
  }, [reducedMotion]);

  useEffect(() => {
    apiRef.current?.setFocus(focus, visible ? 1 : 0.15);
  }, [focus, visible]);

  if (reducedMotion) return null;

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
        filter: "saturate(1.06) contrast(1.02)",
      }}
    />
  );
}
