// ============================================================
// AI Frontend Studio — Snippet Kütüphanesi
// Araç: greensock/GSAP (id: 5)
// Kaynak: https://github.com/greensock/GSAP
// ============================================================

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------------
// 1. TEMEL TIMELINE ANIMASYONU
// ----------------------------------------------------------
export function heroEntrance(container: string) {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(`${container} .hero-title`, {
    y: 80,
    opacity: 0,
    duration: 1,
  })
    .from(
      `${container} .hero-subtitle`,
      { y: 40, opacity: 0, duration: 0.8 },
      "-=0.5"
    )
    .from(
      `${container} .hero-cta`,
      { scale: 0.8, opacity: 0, duration: 0.6 },
      "-=0.4"
    );

  return tl;
}

// ----------------------------------------------------------
// 2. SCROLLTRIGGER — PIN + SCRUB
// ----------------------------------------------------------
export function pinSection(trigger: string, animation: gsap.core.Tween) {
  return ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "+=100%",
    pin: true,
    scrub: 1.5,
    animation,
  });
}

// ----------------------------------------------------------
// 3. STAGGERED KART REVEAL
// ----------------------------------------------------------
export function staggerReveal(selector: string) {
  return gsap.from(selector, {
    scrollTrigger: {
      trigger: selector,
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
    y: 60,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: "power2.out",
  });
}

// ----------------------------------------------------------
// 4. YATAY SCROLL GALERİ
// ----------------------------------------------------------
export function horizontalScroll(track: string) {
  const panels = gsap.utils.toArray<HTMLElement>(track);
  const totalWidth = panels.reduce((acc, el) => acc + el.offsetWidth, 0);

  gsap.to(track, {
    x: () => -(totalWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: track,
      pin: true,
      scrub: 1,
      end: () => `+=${totalWidth}`,
    },
  });
}

// ----------------------------------------------------------
// 5. SAYAÇ ANİMASYONU
// ----------------------------------------------------------
export function countUp(
  element: HTMLElement,
  target: number,
  duration = 2,
  prefix = "",
  suffix = ""
) {
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration,
    ease: "power1.out",
    scrollTrigger: { trigger: element, start: "top 80%" },
    onUpdate: () => {
      element.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}`;
    },
  });
}

// ----------------------------------------------------------
// 6. MAGNETIC HOVER BUTONU
// ----------------------------------------------------------
export function magneticHover(el: HTMLElement, strength = 0.3) {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: "power2.out" });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.5)" });
  });
}
