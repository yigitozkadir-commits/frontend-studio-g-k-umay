# AI Workflow Generator

Verilen görev açıklamasından otomatik workflow JSON üretir. 200 araçtan en uygun kombinasyonu seçer.

## Kullanım

```bash
node ai-workflow-generator/index.js "e-ticaret ürün sayfası"
node ai-workflow-generator/index.js "müzik çalar uygulaması"
node ai-workflow-generator/index.js "gerçek zamanlı işbirliği aracı"
node ai-workflow-generator/index.js "portfolio ve animasyonlu CV sitesi"
```

## Nasıl Çalışır?

1. Görev açıklaması anahtar kelime analizi ile ilgili kategorilere eşlenir
2. Her kategoriden araçlar öncelik ve eşleşme puanına göre sıralanır
3. Alternatif çakışmaları otomatik giderilir
4. shadcn/ui + Tailwind her zaman temel olarak eklenir
5. Lucide ikonlar + next-themes her zaman sonuna eklenir
6. Workflow JSON üretilir, onay sonrası `orchestration/workflows/` altına kaydedilir

## Desteklenen Görev Tipleri

| Anahtar Kelimeler | Kategoriler |
|---|---|
| sohbet, chat, ai, gpt, bot | ai-entegrasyon, real-time |
| landing, tanıtım, hero | animasyonlar, ux-araclari |
| dashboard, panel, analitik | veri-gorsellestirme, state-yonetimi |
| 3d, three, webgl, model | 3d-webgl, webgl-shader |
| animasyon, scroll, parallax | animasyonlar, mikro-etkilesimler |
| e-ticaret, sepet, ödeme | ui-bilesenler, auth, form |
| harita, konum, gps | harita, real-time |
| müzik, video, ses, player | multimedya, webrtc |
| form, kayıt, giriş, auth | form, auth, bildirimler |
| portföy, yaratıcı | animasyonlar, 3d-webgl |

## Çıktı Örneği

```json
{
  "workflow": "muzik-calari-uygulamasi",
  "generated": true,
  "steps": [
    { "order": 1, "tool_id": 16, "name": "Tailwind CSS Kurulumu" },
    { "order": 2, "tool_id": 15, "name": "shadcn/ui Entegrasyonu" },
    { "order": 3, "tool_id": 57, "name": "Howler.js Entegrasyonu" },
    ...
  ]
}
```
