# AI Frontend Studio — İnteraktif Sihirbaz

Sorular sorarak en uygun workflow'u seçip projeyi başlatır.

## Kullanım

```bash
# Bağımlılıkları kur (ilk seferinde)
npm install -g inquirer chalk ora execa

# Sihirbazı başlat
node wizard/index.js
```

## Sihirbaz Akışı

```
1. "Ne yapmak istiyorsun?" → Amaç seçimi
2. "Hangi özellikler gerekiyor?" → Çoklu seçim
3. "Proje kapsamı?" → Basit / Orta / Kapsamlı
4. "Ne kadar zamanın var?" → Süre tahmini
   ↓
🎯 En uygun workflow önerilir
📦 Bundle bütçesi gösterilir
📋 Versiyon stack'i gösterilir
   ↓
5. "Ne yapmak istiyorsun?" →
   → Projeyi oluştur (CLI'yi çağırır)
   → Adımları göster ve çık
   → Farklı workflow seç
   → Çık
```

## Puanlama Sistemi

Sihirbaz her workflow'u şu kriterlere göre puanlar:

- Amaç eşleşmesi: +100 puan
- 3D gereksinimi eşleşmesi: +30 puan
- AI gereksinimi eşleşmesi: +50 puan
- Figma gereksinimi: +50 puan
- Karmaşıklık tercihi: +5 ile +20 arası
