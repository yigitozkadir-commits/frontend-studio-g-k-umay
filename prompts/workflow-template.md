# 🧩 Workflow Oluşturma Şablonu

Bu belge, `orchestration/workflows/` klasörüne yeni bir workflow JSON dosyası eklerken kullanılacak şablonu ve kuralları tanımlar.

---

## 📄 Boş Workflow Şablonu

Aşağıdaki yapıyı kopyalayıp `orchestration/workflows/YENI-WORKFLOW.json` olarak kaydet:

```json
{
  "workflow": "workflow-adi",
  "version": "1.0.0",
  "description": "Bu workflow'un ne yaptığını 1-2 cümleyle açıkla.",
  "prerequisites": {
    "framework": "Next.js 14+",
    "language": "TypeScript",
    "styling": "Tailwind CSS",
    "package_manager": "pnpm",
    "additional": "varsa özel gereksinimler"
  },
  "steps": [
    {
      "order": 1,
      "tool_id": 0,
      "name": "Adımın Kısa Adı",
      "purpose": "Bu adımın amacı, neden yapıldığı.",
      "instruction": "Hangi repoya gidileceği ve orada neyin inceleneceğinin detaylı açıklaması.",
      "expected_output": "Bu adım tamamlandığında ne elde edilmiş olmalı."
    }
  ],
  "final_output": "Tüm adımlar tamamlandığında ortaya çıkacak nihai ürünün tanımı.",
  "estimated_time": "Tahmini toplam süre",
  "alternative_setups": [],
  "test_checklist": [
    "Test edilecek madde 1?",
    "Test edilecek madde 2?"
  ]
}
```

---

## 📋 Alan Açıklamaları

### Üst Düzey Alanlar

| Alan | Zorunlu | Tip | Açıklama |
|---|---|---|---|
| `workflow` | ✅ | string | Benzersiz isim. Dosya adıyla aynı olmalı. Küçük harf, tire ile ayrılmış. |
| `version` | ✅ | string | Semver formatı ("1.0.0"). |
| `description` | ✅ | string | 1-3 cümle. Bu workflow'un ne ürettiğini belirt. |
| `prerequisites` | ✅ | object | Başlangıç için gereken teknoloji stack'i. |
| `steps` | ✅ | array | Sıralı adım dizisi (1'den başlar). |
| `final_output` | ✅ | string | Nihai ürünün somut tanımı. |
| `estimated_time` | ⬜ | string | Opsiyonel ama önerilir. |
| `alternative_setups` | ⬜ | array | Opsiyonel. Farklı konfigürasyon varyantları. |
| `test_checklist` | ✅ | array | En az 5 manuel test maddesi. |

### `steps[]` Alanı

| Alt Alan | Zorunlu | Tip | Açıklama |
|---|---|---|---|
| `order` | ✅ | number | 1'den başlayan sıra numarası. |
| `tool_id` | ✅ | number | `orchestration/index.json`'daki araç ID'si. Geçerli bir ID olmalı. |
| `name` | ✅ | string | Adımın kısa, açıklayıcı adı. |
| `purpose` | ✅ | string | Bu adımın amacı. |
| `instruction` | ✅ | string | Detaylı talimat. Hangi repoya gidileceğini ve neye bakılacağını içermeli. |
| `expected_output` | ✅ | string | Adım tamamlandığında ne görmeliyiz? Somut ve test edilebilir olmalı. |
| `related_tool_id` | ⬜ | number | İkincil araç ID'si (örn: form + validasyon). |
| `related_instruction` | ⬜ | string | İkincil araç için talimat. |

---

## 🎯 Tool ID Seçme Rehberi

Workflow'ta kullanacağın araçları seçerken:

### 1. Kategori Eşleştirme

`orchestration/categories.json` dosyasını aç, workflow'un amacına uygun kategorileri bul.

| Workflow Amacı | Olası Kategoriler |
|---|---|
| Sohbet / AI | ai-entegrasyon, real-time, bildirimler, tarayici-depolama |
| Landing Page | animasyonlar, ux-araclari, 3d-webgl, performans |
| 3D / Görsel | 3d-webgl, webgl-shader, 3d-ar, fizik-motorlari |
| Dashboard | veri-gorsellestirme, ui-bilesenler, state-yonetimi, form |
| Animasyon | animasyonlar, mikro-etkilesimler, sayfa-gecisleri, tipografi |
| Form / Veri Girişi | form, metin-editor, drag-drop, dosya-pdf |
| E-Ticaret | ui-bilesenler, auth, harita, gorsel-optimizasyon |

### 2. Priority Sıralaması

Aynı kategorideki araçlardan önce `high` priority olanı seç.

### 3. Çakışma Kontrolü

Seçtiğin aracın `alternatives` alanına bak. Aynı alternatifi başka bir adımda kullanma.

---

## ✅ Workflow Yazım Kuralları

1. Her adımda tam olarak 1 ana `tool_id` kullan. Gerekirse `related_tool_id` ile ikincil ekle.
2. `instruction` yazarken spesifik ol. "Repo'yu incele" değil, "README'deki useChat hook'unu incele" gibi.
3. `expected_output` test edilebilir olsun. "Daha iyi bir arayüz" değil, "Mesajlar streaming geliyor" gibi.
4. Adım sayısını 6-12 arasında tut.
5. `estimated_time` gerçekçi olsun. Her adım için 5-10 dakika hesapla.
6. `test_checklist` en az 5 madde içersin. Her madde "evet/hayır" ile cevaplanabilir olsun.
7. `workflow` ismi benzersiz olsun.

---

## 🧪 Workflow Doğrulama Kontrol Listesi

Yeni bir workflow oluşturduktan sonra şunları kontrol et:

- [ ] `workflow` alanı dosya adıyla aynı mı?
- [ ] Tüm `tool_id`'ler 1-200 arasında ve `index.json`'da mevcut mu?
- [ ] `order` numaraları sıralı ve tekrarsız mı?
- [ ] Her adımda `instruction` alanı dolu mu?
- [ ] `test_checklist` en az 5 madde içeriyor mu?
- [ ] JSON geçerli mi?
- [ ] Aynı kategoriden çakışan alternatif araçlar aynı anda kullanılmış mı?
