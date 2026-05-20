// ============================================================
// AI Frontend Studio — Snippet Kütüphanesi
// Araç: framer/motion (id: 6)
// Kaynak: https://github.com/framer/motion
// ============================================================
"use client";

import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

// ----------------------------------------------------------
// 1. SAYFA GEÇİŞ SARMALAYICI
// ----------------------------------------------------------
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

// ----------------------------------------------------------
// 2. SCROLL İLE GÖRÜNÜR OLAN KART
// ----------------------------------------------------------
export function RevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// ----------------------------------------------------------
// 3. STAGGERED LİSTE
// ----------------------------------------------------------
const listContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const listItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export function StaggerList({ items }: { items: string[] }) {
  return (
    <motion.ul variants={listContainer} initial="hidden" animate="show">
      {items.map((item, i) => (
        <motion.li key={i} variants={listItem}>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}

// ----------------------------------------------------------
// 4. MODAL (AnimatePresence ile)
// ----------------------------------------------------------
export function Modal({ isOpen, onClose, children }: {
  isOpen: boolean; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-6 max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: "-40%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, y: "-40%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ----------------------------------------------------------
// 5. FARE TAKİPLİ IŞIK EFEKTI
// ----------------------------------------------------------
export function SpotlightCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border bg-card"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      style={{
        background: `radial-gradient(300px at ${springX}px ${springY}px, rgba(255,255,255,0.07), transparent)`,
      }}
    >
      {children}
    </motion.div>
  );
}

// ----------------------------------------------------------
// 6. HOVER BÜYÜME BUTONU
// ----------------------------------------------------------
export function PulseButton({ children, onClick }: {
  children: React.ReactNode; onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
    >
      {children}
    </motion.button>
  );
}
