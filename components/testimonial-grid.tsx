// ============================================================
// AI Frontend Studio — Component Registry
// Bileşen: Testimonial Grid
// Kullanılan araçlar: shadcn/ui (15), Framer Motion (6), Swiper (17)
// ============================================================
"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar?: string;
  rating: number;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Ayşe Kaya",
    role: "Ürün Müdürü",
    company: "TechCorp",
    rating: 5,
    quote: "Bu araç geliştirme sürecimizi %40 hızlandırdı. Ekibimiz artık çok daha verimli çalışıyor.",
  },
  {
    name: "Mehmet Demir",
    role: "CTO",
    company: "StartupXYZ",
    rating: 5,
    quote: "Entegrasyon süreci inanılmaz kolaydı. Destek ekibi her adımda yanımızdaydı.",
  },
  {
    name: "Sara Yıldız",
    role: "Frontend Geliştirici",
    company: "Agency Pro",
    rating: 5,
    quote: "Kod kalitemiz ve teslimat hızımız ikisi birden arttı. Kesinlikle tavsiye ediyorum.",
  },
  {
    name: "Can Öztürk",
    role: "Kurucu",
    company: "DesignStudio",
    rating: 5,
    quote: "Müşterilerimize sunduğumuz kalite standartlarını tamamen değiştirdi.",
  },
  {
    name: "Zeynep Arslan",
    role: "UI/UX Tasarımcı",
    company: "Creative Labs",
    rating: 5,
    quote: "Tasarım ile kodun bu kadar uyumlu çalışmasını daha önce hiç görmedim.",
  },
  {
    name: "Ali Çelik",
    role: "Baş Mühendis",
    company: "ScaleUp",
    rating: 5,
    quote: "Performans metrikleri muhteşem. Kullanıcı memnuniyetimiz zirveye çıktı.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------
// VARYANT A: Masonry Grid (Masaüstü)
// ----------------------------------------------------------
export function TestimonialGrid() {
  const col1 = testimonials.filter((_, i) => i % 3 === 0);
  const col2 = testimonials.filter((_, i) => i % 3 === 1);
  const col3 = testimonials.filter((_, i) => i % 3 === 2);

  const TestimonialCard = ({ t, delay }: { t: Testimonial; delay: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="mb-4">
        <CardContent className="pt-6">
          <StarRating rating={t.rating} />
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">"{t.quote}"</p>
          <div className="flex items-center gap-3 mt-4">
            <Avatar className="w-8 h-8">
              {t.avatar && <AvatarImage src={t.avatar} />}
              <AvatarFallback className="text-xs">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Kullanıcılarımız Ne Diyor?</h2>
          <p className="text-muted-foreground text-lg">Binlerce mutlu kullanıcı arasına katıl.</p>
        </div>

        {/* Masonry Grid - Masaüstü */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          <div>{col1.map((t, i) => <TestimonialCard key={t.name} t={t} delay={i * 0.1} />)}</div>
          <div className="mt-8">{col2.map((t, i) => <TestimonialCard key={t.name} t={t} delay={i * 0.1 + 0.05} />)}</div>
          <div>{col3.map((t, i) => <TestimonialCard key={t.name} t={t} delay={i * 0.1 + 0.1} />)}</div>
        </div>

        {/* Swiper Slider - Mobil */}
        <div className="md:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            className="pb-10"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.name}>
                <Card>
                  <CardContent className="pt-6">
                    <StarRating rating={t.rating} />
                    <p className="mt-3 text-sm text-muted-foreground">"{t.quote}"</p>
                    <div className="flex items-center gap-3 mt-4">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{t.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
