// ============================================================
// AI Frontend Studio — Snippet Kütüphanesi
// Araç: darkroomengineering/lenis (id: 28)
// Kaynak: https://github.com/darkroomengineering/lenis
// ============================================================
"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

// ----------------------------------------------------------
// 1. TEK SEFERLIK LENIS KURULUMU (root layout için)
// ----------------------------------------------------------
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // GSAP ScrollTrigger ile senkronize et
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return lenisRef;
}

// ----------------------------------------------------------
// 2. SCROLL İLERLEME HOOK'U
// ----------------------------------------------------------
export function useScrollProgress() {
  const progress = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", ({ progress: p, velocity: v }: { progress: number; velocity: number }) => {
      progress.current = p;
      velocity.current = v;
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return { progress, velocity };
}

// ----------------------------------------------------------
// 3. ANCHOR LINK İLE SMOOTH SCROLL
// ----------------------------------------------------------
export function scrollTo(target: string | HTMLElement, offset = 0) {
  // Lenis global instance üzerinden çağır
  const lenis = (window as any).__lenis as Lenis | undefined;
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
  } else {
    // Fallback
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView({ behavior: "smooth" });
  }
}

// ----------------------------------------------------------
// 4. GLOBAL LENIS PROVIDER BİLEŞENİ
// ----------------------------------------------------------
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 });
    (window as any).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
}
