// ============================================================
// AI Frontend Studio — Component Registry
// Bileşen: Pricing Table
// Kullanılan araçlar: shadcn/ui (15), Framer Motion (6), Lucide (105)
// ============================================================
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface PricingTier {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  badge?: string;
}

const tiers: PricingTier[] = [
  {
    name: "Başlangıç",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Kişisel projeler ve denemeler için",
    features: ["3 proje", "5GB depolama", "Temel analitik", "E-posta desteği"],
    cta: "Ücretsiz Başla",
    href: "/signup",
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 19,
    description: "Büyüyen ekipler ve profesyoneller için",
    features: ["Sınırsız proje", "50GB depolama", "Gelişmiş analitik", "Öncelikli destek", "API erişimi", "Özel domain"],
    cta: "Pro'ya Geç",
    href: "/signup?plan=pro",
    highlighted: true,
    badge: "En Popüler",
  },
  {
    name: "Kurumsal",
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: "Büyük organizasyonlar için",
    features: ["Her şey Pro'da var +", "SSO / SAML", "SLA garantisi", "Özel entegrasyonlar", "Özel sözleşme"],
    cta: "Satışla Görüş",
    href: "/contact",
  },
];

export function PricingTable() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Şeffaf Fiyatlandırma</h2>
          <p className="text-muted-foreground text-lg mb-8">Gizli ücret yok. İstediğin zaman iptal et.</p>

          {/* Yıllık/Aylık Toggle */}
          <div className="inline-flex items-center gap-3 bg-muted p-1 rounded-full">
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${!isYearly ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setIsYearly(false)}
            >
              Aylık
            </button>
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isYearly ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              onClick={() => setIsYearly(true)}
            >
              Yıllık
              <span className="ml-1.5 text-xs text-green-500 font-semibold">%35 indirim</span>
            </button>
          </div>
        </div>

        {/* Kart Izgara */}
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className={`relative h-full flex flex-col ${tier.highlighted ? "border-primary shadow-lg shadow-primary/10 scale-105" : ""}`}>
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1">
                      <Zap className="w-3 h-3" />
                      {tier.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-2">
                  <p className="font-semibold text-lg">{tier.name}</p>
                  <div className="flex items-end gap-1 mt-2">
                    <motion.span
                      key={isYearly ? "yearly" : "monthly"}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl font-bold"
                    >
                      ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                    </motion.span>
                    <span className="text-muted-foreground mb-1">/ay</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{tier.description}</p>
                </CardHeader>

                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    className="w-full"
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    <a href={tier.href}>{tier.cta}</a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
