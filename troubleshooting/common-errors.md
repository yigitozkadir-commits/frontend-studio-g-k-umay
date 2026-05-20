# 🔧 AI Frontend Studio — Hata Rehberi

Sık karşılaşılan hatalar, nedenleri ve kesin çözümleri.

---

## 📦 GSAP (id: 5)

### ❌ Hata: "ScrollTrigger is not defined"
**Neden:** GSAP'ın ScrollTrigger plugin'i import edilip register edilmeden kullanılmış.
```ts
// ✅ Doğru
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

### ❌ Hata: ScrollTrigger animasyonları Next.js'te çalışmıyor
**Neden:** Server-side render sırasında `window` objesi yok.
```ts
// ✅ Doğru — sadece client'ta çalıştır
"use client";
import { useEffect } from "react";
useEffect(() => {
  // GSAP kodları buraya
}, []);
```

### ❌ Hata: Lenis + ScrollTrigger senkron çalışmıyor
**Neden:** ScrollTrigger varsayılan scroll event'i dinliyor, Lenis'inkini değil.
```ts
// ✅ Doğru — lenis.on ile ScrollTrigger'ı güncelle
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

---

## ⚡ Framer Motion (id: 6)

### ❌ Hata: "AnimatePresence children must have unique keys"
**Neden:** AnimatePresence içindeki bileşenlerde `key` prop eksik.
```tsx
// ✅ Doğru
<AnimatePresence>
  {isOpen && <motion.div key="modal">...</motion.div>}
</AnimatePresence>
```

### ❌ Hata: `useInView` çalışmıyor, element hiç görünmüyor
**Neden:** `once: true` ile birlikte başlangıç değeri yanlış ayarlanmış.
```tsx
// ✅ Doğru
const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: "-100px" });
return (
  <motion.div
    ref={ref}
    initial={{ opacity: 0 }}
    animate={isInView ? { opacity: 1 } : { opacity: 0 }} // ← ikisi de belirtilmeli
  />
);
```

### ❌ Hata: Next.js App Router'da layout animasyonları çalışmıyor
**Neden:** AnimatePresence'ın `layout.tsx` içinde olması gerekiyor.
```tsx
// ✅ app/layout.tsx içinde
"use client";
import { AnimatePresence } from "framer-motion";
export default function Layout({ children }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
```

---

## 🌊 Lenis (id: 28)

### ❌ Hata: Sayfa çift scroll yapıyor
**Neden:** Hem Lenis hem de tarayıcı native scroll aktif.
```ts
// ✅ Doğru — body overflow'u ayarla
document.body.style.overflow = "hidden"; // sadece Lenis yönetsin
// VEYA Lenis'i wrapper div üzerinde kur, body üzerinde değil
```

### ❌ Hata: Mobilde Lenis çok yavaş
**Neden:** `touchMultiplier` varsayılanı mobilde ağır hissettiriyor.
```ts
// ✅ Doğru
const lenis = new Lenis({
  duration: 0.8,        // mobilde daha kısa tut
  touchMultiplier: 1.5, // varsayılan 2, düşür
  smoothTouch: false,   // iOS native scroll için kapat
});
```

---

## 🎲 React Three Fiber (id: 13)

### ❌ Hata: "THREE.WebGLRenderer: Context Lost"
**Neden:** Sayfada birden fazla Canvas var, GPU context limiti aşıldı.
```tsx
// ✅ Doğru — tek bir Canvas kullan, içeriği paylaş
// Birden fazla Canvas yerine bir Canvas içinde birden fazla group kullan
```

### ❌ Hata: GLTF modeli yüklenmiyor (CORS hatası)
**Neden:** Model farklı bir origin'den sunuluyor.
```ts
// ✅ Doğru — modeli /public klasörüne koy
useGLTF("/models/product.glb"); // public/models/product.glb
// VEYA useGLTF.preload() ile önceden yükle
```

### ❌ Hata: Performans düşük, FPS 30'un altında
**Neden:** Gereksiz re-render veya ağır geometry.
```tsx
// ✅ Doğru
// 1. useFrame içinde state set etme
// 2. Geometry'yi useMemo ile cache'le
const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 2), []);
// 3. dispose={null} ekle (bellek sızıntısını önler)
<primitive object={scene} dispose={null} />
```

---

## 🗄️ TanStack Query (id: 36)

### ❌ Hata: "No QueryClient set, use QueryClientProvider"
**Neden:** QueryClientProvider, bileşen ağacının dışında kalmış.
```tsx
// ✅ Doğru — root layout'a ekle
// app/layout.tsx
import { QueryProvider } from "@/snippets/state-management";
export default function RootLayout({ children }) {
  return <QueryProvider>{children}</QueryProvider>;
}
```

### ❌ Hata: Her sayfa geçişinde veri tekrar çekiliyor
**Neden:** `staleTime` varsayılanı 0, her render'da eski sayılıyor.
```ts
// ✅ Doğru — QueryClient'ı ayarla
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5 }, // 5 dakika
  },
});
```

---

## 🔐 NextAuth (id: 146)

### ❌ Hata: "NEXTAUTH_SECRET is not set"
**Neden:** .env.local dosyasında secret eksik.
```bash
# .env.local
NEXTAUTH_SECRET=en-az-32-karakter-rastgele-string
NEXTAUTH_URL=http://localhost:3000
```

### ❌ Hata: OAuth callback URL hatası
**Neden:** Provider panelinde izin verilen URL eklenmemiş.
```
# Google Console'a eklenecek URL:
http://localhost:3000/api/auth/callback/google
https://yourdomain.com/api/auth/callback/google
```

---

## 🎨 Tailwind CSS (id: 16)

### ❌ Hata: Dinamik class'lar çalışmıyor (örn: `text-${color}-500`)
**Neden:** Tailwind JIT template string içindeki class'ları bulamıyor.
```ts
// ❌ Yanlış
const cls = `text-${color}-500`;

// ✅ Doğru — tam class adını yaz veya safelist'e ekle
const colorMap = { red: "text-red-500", blue: "text-blue-500" };
const cls = colorMap[color];
```

### ❌ Hata: Dark mode class'ları çalışmıyor
**Neden:** `tailwind.config.ts`'de darkMode ayarı eksik.
```ts
// ✅ Doğru
export default {
  darkMode: "class", // next-themes için "class" olmalı
  // ...
};
```

---

## 🏗️ Next.js 14 App Router (id: 117)

### ❌ Hata: "useState/useEffect is not allowed in Server Component"
**Neden:** Client hook'u Server Component içinde kullanılmış.
```tsx
// ✅ Dosyanın en üstüne ekle
"use client";
```

### ❌ Hata: Hydration mismatch
**Neden:** Server ve client render çıktıları farklı (genelde theme veya tarih).
```tsx
// ✅ Doğru — suppressHydrationWarning veya dynamic import
import dynamic from "next/dynamic";
const ThemeToggle = dynamic(() => import("./ThemeToggle"), { ssr: false });
```

---

## 📊 Nivo Charts (id: 196)

### ❌ Hata: "window is not defined" (SSR hatası)
**Neden:** Nivo grafikleri SVG/Canvas kullandığından SSR'da çalışmıyor.
```tsx
// ✅ Doğru — dynamic import ile SSR kapat
const ResponsiveBar = dynamic(
  () => import("@nivo/bar").then((m) => m.ResponsiveBar),
  { ssr: false }
);
```

### ❌ Hata: Grafik responsive değil, sabit genişlikte kalıyor
**Neden:** Parent container'ın yüksekliği tanımlı değil.
```tsx
// ✅ Doğru — parent'a explicit yükseklik ver
<div style={{ height: 400 }}>
  <ResponsiveBar data={data} />
</div>
```
