// ============================================================
// AI Frontend Studio — Component Registry
// Bileşen: Hero Section
// Kullanılan araçlar: shadcn/ui (15), GSAP (5), Framer Motion (6), R3F (13)
// ============================================================
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Canvas } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { RotatingBox } from "@/snippets/react-three-fiber";

// ----------------------------------------------------------
// VARYANT A: Tam 3D arka planlı hero
// ----------------------------------------------------------
export function HeroWith3D({
  badge,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: {
  badge?: string;
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6 })
        .from(".hero-title", { y: 60, opacity: 0, duration: 1 }, "-=0.3")
        .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".hero-actions", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen flex items-center overflow-hidden">
      {/* 3D Arka Plan */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.3} />
          <Environment preset="night" />
          <Float speed={1.5} floatIntensity={0.5}>
            <RotatingBox />
          </Float>
        </Canvas>
      </div>

      {/* İçerik */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {badge && (
          <div className="hero-badge mb-6 inline-flex">
            <Badge variant="outline" className="px-4 py-1.5 text-sm gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {badge}
            </Badge>
          </div>
        )}

        <h1 className="hero-title text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
          {title}
        </h1>

        <p className="hero-subtitle text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          {subtitle}
        </p>

        <div className="hero-actions flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="gap-2">
            <a href={ctaPrimary.href}>
              {ctaPrimary.label}
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
          {ctaSecondary && (
            <Button size="lg" variant="outline" asChild>
              <a href={ctaSecondary.href}>{ctaSecondary.label}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------
// VARYANT B: Gradient + Framer Motion (3D olmadan, hafif)
// ----------------------------------------------------------
export function HeroMinimal({
  title,
  subtitle,
  ctaPrimary,
}: {
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
}) {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-xl text-muted-foreground mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button size="lg" asChild>
            <a href={ctaPrimary.href}>{ctaPrimary.label}</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
