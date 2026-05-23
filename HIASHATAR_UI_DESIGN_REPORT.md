# HIASHATAR — Han'ın Muhafızları
## Türk Dünyasında Moğol Oyunu: Derinlemesine UI Tasarım Raporu

---

## 📋 ÖZET

**Hiashatar** (Han'ın Muhafızları), Moğol İmparatorluğu'nun seçkin muhafız birliği "Kheshig"'den ilham alan 10×10 korumalı satranç varyantıdır. Bu rapor, oyunun UI/UX mimarisini, tasarım felsefesini, bileşenlerini ve Türk-Moğol kültürel öğeleri detaylı şekilde analiz eder.

---

## 🎯 OYUN ÖZELLIKLERI

### Temel Mekanikler
| Özellik | Detay |
|---------|-------|
| **Tahta Boyutu** | 10×10 kare (standart satrançtan 2 sütun/satır daha geniş) |
| **Taş Sayısı** | Her oyuncu 20 taş (Piyonlar: 10, Diğer taşlar: 10) |
| **Özel Mekanik** | Hia (Muhafız) koruma sistemi — korunan taşlara saldırı yasak |
| **Mori İstisnası** | Atlar (Mori), Hia koruma alanını yok sayabilir |
| **Zorluk Seviyeleri** | Yabani (2 hamle derinliği), Savaşçı (4 hamle), Bahadır (6 hamle) |
| **Oyun Modları** | PvB (İnsan vs Bot), PvP (İnsan vs İnsan), BvB (Bot vs Bot) |

### 7 Taş Türü (Moğol/Türk Adlandırması)

```
♔ NOIN (Han/Kral)        — 1 kare her yönde, değer: 20.000
👑 BERSE (Vezir)         — Sınırsız yön, değer: 900
🏎️ TERGE (Kale/Araba)    — Yatay-dikey sınırsız, değer: 500
🐪 TEME (Deve/Fil)       — Çapraz sınırsız, değer: 325
🐎 MORI (Bozkır Koşucusu)— L-hareket, Hia'ya bağışık, değer: 320
🛡️ HİA (Muhafız/Kheshig) — Kral+At hibrid, 8 kare etrafını korur, değer: 480
⚔️ CHU (Piyon/Okçu)      — Standart piyon + son satıra Vezir'e terfi, değer: 100
```

---

## 🎨 TASARIM FELSEFESI

### 1. **Bozkır İmparatorluğu Estetiği**

**Renk Paleti:**
- **Ana Vurgı** (#C07830): Altın / Bakır (Moğol alaşımları)
- **Altın** (#E8B84B): Zenginlik, İmparatorluk
- **Yeşim** (#4A8C7A): Doğu kültürü
- **Arka Plan** (#06080A): Gecenin karanlığı (yıldızlı bozkır gökyüzü)
- **Metin** (#F0E8D8): Kemik rengi (antik dokusu)
- **Sessiz** (#7A6A50): Kum renginde nötr tonlar

**Tipografi:**
- **Başlıklar**: Cinzel Decorative (dekoratif, antik)
- **UI Öğeleri**: Cinzel (serifli, resmi)
- **Gövde**: Rajdhani (modern, okunaklı)

### 2. **3D Görselleştirme (Three.js)**

**Piyon Modelleri:**
- El yapımı 3D geometriler (silindir, küre, torus, konus)
- Taş özel malzemeleri: kemik, gümüş, mavi, altın, nefrit
- Beyaz/siyah taşlar için farklı roughness/metalness değerleri
- Gölge diskleri (dinamik gölgelendirme)
- Bloom efekti (ışık alanları)

**Tahta Renderi:**
- 10×10 mozaik desen (alternatif koyu/açık kareler)
- Koordinat etiketleri (a-j columns, 1-10 rows)
- 2000 yıldızlı alan (dinamik nebula animasyonu)
- Orbit kontrolleri (fare/dokunmatik zoom, döndürme)

### 3. **İnteraktif Geri Bildirim**

**Görsel Sinyaller:**
- **Seçim Halkası**: Parlayan altın halka (dönen animasyon)
- **İpucu Diskleri**: Yeşil silindirler (yasal hamle noktaları)
- **Yakalama Göstergesi**: Turuncu diskler
- **Şah Halkası**: Kırmızı halkalar (palsitasyonlu)
- **Son Hamle**: Önceki ve sonraki karelerde transparanlık pulse
- **Shield Zones**: Mavi (beyaz) / kırmızı (siyah) çok hafif diskler

**Ses Tasarımı (SFX):**
- Hamle: Üçgen dalga (320 Hz, hafif)
- Yakalama: Testere dalgası + gürültü
- Şah: Çift ton (660→880 Hz)
- Promo: Müzikal tonal sıra (440-554-660-880 Hz)
- Kazanma: Tetizin çıkış tonu
- Hia Koruma: İki ton (440→330 Hz)

**Haptic Feedback:**
- Basit tıklama: [10] ms vibrasyon
- Yakalama: [15, 10, 25] desen
- Şah: [30, 15, 30] acil uyarı deseni

---

## 📱 UI SAYFALARI VE BİLEŞENLERİ

### **SAYFA 1: GİRİŞ / ANA MENÜ**

```
┌─────────────────────────────────┐
│                                 │
│           🛡️                    │
│       HİASHATAR                 │
│     HAN'IN MUHAFIZLARI          │
│                                 │
│  [YABANI]  [SAVAŞÇI✓] [BAHADIR]│
│                                 │
│  ☑ İnsan vs Bot                │
│  ○ İnsan vs İnsan              │
│  ○ Bot vs Bot                  │
│                                 │
│    ⚔ SAVAŞA BAŞLA ⚔             │
│                                 │
│  [📚 Öğretici] [⚙️ Ayarlar]     │
│                                 │
│  🏆0    📊0    ⚔️0               │
│  GAL.   OYUN   HAMLE            │
└─────────────────────────────────┘
```

**Bileşenler:**
1. **Intro Symbol**: Kalkan emoji, yukarı-aşağı bobbing animasyonu
2. **Başlık**: Gradyan altın metin, büyütülü harfler
3. **Difficulty Buttons**: Seçim pills (açık/koyu tema)
4. **Oyun Modu Radios**: Çoklu seçenek
5. **Play Button**: Full-width, gradyan arka plan, hover efekti
6. **Nav Buttons**: İkinci sıra buton grubu
7. **Stats Row**: 3 sütunlu istatistik göstergesi

**Animasyonlar:**
- Particle float (giriş parçacıkları): 100vh'den sabit hızda yukarı
- Shield bob: 4s döngü, yumuşak elastiklik

---

### **SAYFA 2: OYUN ARAYÜZÜ**

#### **Üst Çubuk (Top Bar)**

```
♔ OYUNCU              SAVAŞÇI
  ALTIN ORDU          SIRA: BEYAZ
                      Hamle 0
                                      00:00   AI ♚
                                              DEMİR ORDU
```

**Bileşenler:**
- Sol: Oyuncu kimliği + taş ikonu (♔)
- Orta: Zorluk seviyesi, turn göstergesi, hamle sayacı
- Sağ: Zamanlayıcı, rakip kimliği

**Styles:**
- Dinamik arka plan (gradient aşağı doğru solma)
- Zemin çizgisi (--border)
- Blur efekti (backdrop-filter)
- Active oyuncu adı: altın rengi

---

#### **Oyun Alanı (Canvas Area)**

```
┌─────────────────────┐
│   [3D Chess Board]  │
│   (Three.js)        │
│                     │
│  [Hints/Rings]      │  
│  [Last Move Pulse]  │
│  [AI Thinking ...]  │
│  [Move Quality 💀]  │
│  [Rewind Controls]  │
│                     │
└─────────────────────┘
```

**Bileşenler:**
- **3D Tahta**: WebGL canvas
- **Taş Modelleri**: Dinamik 3D mesh'ler
- **İpuçları**: Yeşil diskler (0.7 SQ / 0.7)
- **Seçim Halkası**: Altın halka (dönen)
- **Şah Halkası**: Kırmızı halka (palsitasyonlu)
- **Yakalama Parçacıkları**: 20 hızlı top
- **Banner'lar**: 
  - Şah Banner (kırmızı gradyan): "⚔️ ŞAH!"
  - Shield Banner (mavi gradyan): "🛡️ KORUNAN TAŞA EL ATMA!"
- **AI Thinking**: Ortada 3 dot spinner
- **Move Quality**: Emoji feedback (💀 🔥 ⚡ 💡 ⚔️ 👑)
- **Rewind Bar**: 5 buton + konum göstergesi

**Eval Bar:**
- Sol taraf: 16px width, gradient beyaz→siyah
- Dinamik ibre: AI değerlendirmesini gösterir
- Yer: Tahta sola bitişik

---

#### **Alt Çubuk (Bottom Bar)**

```
┌─────────────────────────────────┐
│ [↩] [🤖] [🔄] [💡] [⏪] | [⚙️] [☰]│
│ Geri U   AI A  Çevir F Hint H  │
│            Geçmiş R          │
└─────────────────────────────────┘
```

**Butonlar (7 adet):**
1. **Undo** (↩): Hamleyi geri al
2. **AI** (🤖): AI hamle yap (Accent border)
3. **Flip** (🔄): Tahtayı 180° döndür
4. **Hint** (💡): AI önerisini göster
5. **Rewind** (⏪): Oyun geçmişini göz at
6. **Separator**: Dikey çizgi
7. **Settings** (⚙️): Ayarlar sayfasına git
8. **Menu** (☰): Menüye dön

**Tooltip Sistemи:**
- data-tip özniteliği
- Butonun üstünde, 7px boşluk
- Koyu arka plan, hafif text
- 9px font, 0.5px letter-spacing

---

### **SAYFA 3: AYARLAR**

```
┌──────────────────────────┐
│ ← Geri      ⚙️ AYARLAR   │
├──────────────────────────┤
│ 🎮 OYUN                  │
│  AI Seviyesi: [Savaşçı▼] │
│  Hamle İpuçları: ☑       │
│  Hia Alanlarını Göster: ☑│
│  Eval Bar: ☑             │
│                          │
│ 📊 İSTATİSTİK           │
│  [0] [0] [0] [0]        │
│  GAL. OYU. HAM. SERİ    │
│  [İstatistikleri Sıfırla]│
│                          │
│ 🎨 TEMA                 │
│  [🏕️ Bozkır]            │
│  [🌙 Gece]               │
│  [🟢 Yeşim]              │
│                          │
└──────────────────────────┘
```

**Bölümler:**
1. **Header**: Back button + Title
2. **Game Section**: Dropdown + 3 checkbox
3. **Stats Section**: 2×2 grid + reset button
4. **Theme Section**: 3 pill button

**Theme Seçenekleri:**
- Steppe: --accent #c07830, --gold #e8b84b
- Night: --accent #8060d0, --gold #c0a8f0
- Jade: --accent #3a8c5a, --gold #80e0a0

---

### **SAYFA 4: ÖĞRETİCİ (30 Ders)**

```
┌──────────────────────────────┐
│ ← Geri    📚 KHESHIG EĞİTİMİ │
├──────────────────────────────┤
│ [████████░░░░░░] 50%        │
├──────────────────────────────┤
│                              │
│           🛡️                 │
│        DERS 16 / 30          │
│      Hia — Muhafız           │
│   (Kheshig)                  │
│                              │
│  Hia, Hiashatar'ın ruhudur. │
│  Hem Kral gibi 8 yönde 1     │
│  kare, hem de At gibi L      │
│  şeklinde atlayarak hareket  │
│  edebilir...                 │
│                              │
│  [♔][👑][🏎️][🐪]           │
│  [🐎][🛡️][⚔️][empty]       │
│                              │
├──────────────────────────────┤
│  [◀ Önceki]  [İleri ▶]      │
└──────────────────────────────┘
```

**Bölümler:**
1. **Header**: Back + Title
2. **Progress Bar**: 3px yükseklik, doldurma animasyonu
3. **Lesson Area**: 
   - Icon (60px)
   - Index (DERS X / 30)
   - Title
   - Text (max-width 360px)
   - Piece Grid (3×3 grid, varsa)
4. **Navigation**: Prev/Next butonları

**30 Ders Kategorileri:**
- **Bölüm 1 (Temel)**: 5 ders — Hoş gelişin, Tarih, Tahta, Setup, Taş kuralları
- **Bölüm 2 (Hia Mekaniği)**: 5 ders — Hia hareket, Nüfuz, Mori istisnası, Çift koruma, Zayıflıklar
- **Bölüm 3 (Strateji)**: 6 ders — Açılış, Merkez, Saldırı, Savunma, Piyon yapıları, Son oyun
- **Bölüm 4 (İleri Seviye)**: 9 ders — Değerlendirme, Terfi, Tempo, Tuzaklar, Taş değerleri, Şah mat, Kazanma, Çalışma, Başlat!
- **Özel Ders**: Son ders "Oynamaya Başla" düğmesi

---

## 🎭 MODAL VE NOTIFICATION BILEŞENLERI

### **Achievement Popup**

```
┌─────────────────────┐
│ 🏆 BAŞARI AÇILDI    │
│ İlk Zafer           │
│ Han'ı düşürdün!     │
└─────────────────────┘
```

**Konumu**: Sağ-alt, 14px padding
**Animasyon**: Soldan kaydırma (260px)
**Süre**: 4s gösterim, sonra çıkış

---

### **Toast Notifications**

```
┌───────────────────────┐
│ ✓ İstatistikler       │
│   sıfırlandı          │
└───────────────────────┘
```

**Tipler:**
- `info`: Varsayılan (muted)
- `success`: Yeşim rengi (#5aab80)
- `warning`: Altın (#e8b84b)
- `error`: Kırmızı (#c04040)
- `shield`: Mavi (#6a9aba)

**Konumu**: Alt orta, 90px yukarı
**Animasyon**: Yukarı slide + fade
**Süre**: 2.4s

---

### **Game Over Modal**

```
┌──────────────────────┐
│                      │
│    ŞAH MAT!          │
│  HAN DÜŞÜRÜLDÜ       │
│                      │
│ [YENİ SAVAŞ]         │
│ [ANA MENÜ]           │
│                      │
└──────────────────────┘
```

**Arka Plan**: Radyal gradient + 12px blur
**Title**: Cinzel Decorative, animasyonlu glow
**Butonlar**: Border + transparent, hover overlay

---

## 🎬 ANIMASYON VE TRANSISYON

### **Sayfa Geçişleri**
- **Yöne bağlı**: İleri (+100%) / Geri (-100%) translateX
- **Süre**: 400ms cubic-bezier(0.4, 0, 0.2, 1)
- **Opacity**: Eşzamanlı fade

### **Taş Hareketleri**
- **Hareket**: 380ms Cubic InOut
- **Zıplama**: 190ms Cubic Out + yoyo (y +3.5)
- **Yakalama**: 200ms scale(0,0,0)

### **Seçim Halkası**
- **Spin**: Inner +0.04 rad/frame, Outer -0.6× hızda
- **Opacity**: Sin dalgası 0.6-1.0 aralığında

### **Parçacıklar**
- **Yakalama**: 20 küre, rastgele vx/vz, vy gravity
- **Confetti**: 55 adet, 2-4s düşme, rastgele dönüş
- **Sparkles**: 8 ikon, scale animation
- **Win Burst**: Radyal gradient explosion
- **Dust Cloud**: Daire şekil, 5×'e scale, 360° dönüş

### **Ekran Titremesi**
- **Check**: 4ms offset döngüsü, 400ms süre
- **Puls Efektler**: Sin dalga amplitüdü

---

## 🔊 SES VE HAPTİK

### **SFX Motoru**
- **Bağlam**: Web Audio API (fallback)
- **Oszillatör Türleri**: triangle, sine, square, sawtooth
- **Filtreler**: High-pass noise generation

### **Haptic Patterns**
- İOS/Android vibration API
- Array patterns: [duration1, delay1, duration2, ...]

---

## ♿ ERİŞİLEBİLİRLİK

### **Mevcut Özellikleri**
- Maksimum zoom: 1.0 (sabit)
- Touch-action: none (el gezintisi devre dışı)
- Renk kontrastı: WCAG AA
- Keyboard shortcuts:
  - **U**: Undo
  - **A**: AI hamle
  - **F**: Flip board
  - **H**: Hint
  - **R**: Rewind
  - **ESC**: Exit rewind
  - **Arrow L/R**: Rewind nav

### **Cihaz Optimizasyonu**
- **Responsive breakpoints**:
  - max-width: 380px — Smaller buttons (36px)
  - max-height: 480px — Compact topbar
  - min-width: 600px — Larger buttons (46px)
- **Device Pixel Ratio**: max(1, 1.5 on desktop)
- **Safe Area Insets**: Notch/island desteği

---

## 📊 RENK VE GÖRSEL HİYERARŞİ

### **Renk Ağaçı**
```
Arka Plan (--bg): #06080a [Dark Navy]
├─ Accent (--accent): #c07830 [Copper/Bronze]
│  └─ Lighter: #8a5018, #a26840
├─ Gold (--gold): #e8b84b [Warm Gold]
│  └─ Lighter: #fff6d0
├─ Jade (--jade): #4a8c7a [Teal/Green]
├─ Muted (--muted): #7a6a50 [Sand/Tan]
├─ Danger (--danger): #c04040 [Red]
├─ Hi (highlight): #5aab80 [Green]
├─ Shield (--shield): #6a9aba [Blue]
└─ Border (--border): rgba(192,120,48,.14) [Accent + transparent]
```

### **Görsel Ağırlık**
1. **En Ağır**: Başlık, Şah Mat, Achievement popup
2. **Orta**: Butonlar, Seçim, Uyarılar
3. **Hafif**: Toast, İpuçları, Parçacıklar

---

## 🎮 OYUN MAKANİĞİ VE UI BAĞLANTISI

### **Hamle Kalitesi Göstergesi**
```
Kayıp Puanına Göre Geri Bildirim:
≥200 puan: 💀 (Hata)
≥80 puan: 🔥 (Zayıf)
≥30 puan: ⚡ (Normal)
≥10 puan: 💡 (İyi)
≥0 puan: ⚔️ (Eşit)
<0 puan: 👑 (Harika!)
```

### **Shield Zones Gösterimi**
- Beyaz Hia'lar: Mavi diskler (0x1a5080, 0.4 opacity)
- Siyah Hia'lar: Kırmızı diskler (0x801818, 0.35 opacity)
- Silindir geometrisi: 0.6 SQ radius, 6-sided

### **İstatistik Takip**
- **Vitals**: Wins, Games, Total Moves, Current Streak
- **Depolama**: localStorage ('hia_stats', 'hia_ach')
- **Achievements**: 30+ unlock kilit (5 taş, 10 taş, streak, marathon, vb.)

---

## 🌍 KÜLTÜREL VE TARIHSEL BAĞLAM

### **Moğol Esinlenme**
- **Kheshig**: Han'ın seçkin muhafız çemberi (gerçek tarih)
- **Taş Adlandırması**: Türkçe/Moğolca
  - Noin → Khan/Ruler
  - Berse → Noyan/General
  - Terge → Arba/War Cart
  - Teme → Camel/Beast
  - Mori → Horse/Steppe Runner
  - Chu → Archer/Footman
  - Hia → Guardian/Shield

### **Bozkır Görselliği**
- Yıldızlı gece gökyüzü (nebula)
- Altın ve bakır alaşımları
- Nefrit yeşilliği (doğu lüksü)
- Kum ve kemik tonları

---

## 📐 LAYOUT BİLGİLERİ

### **Sabit Boyutlar**
- `--page-z`: 1000 (sayfa z-index)
- `--bar-h`: 56px (üst çubuk)
- `--bot-h`: 60px (alt çubuk)
- `--border`: 1px solid rgba(192,120,48,.14)

### **Boşluk Kuralları**
- **Padding**: 14-18px (orta)
- **Gap**: 8-12px (grup arası)
- **Border Radius**: 6-24px (kavisli)

### **Typography Scale**
```
.intro-title: clamp(1.6rem, 7vw, 3.2rem)
.intro-sub: 0.78rem
.lesson-title: 1.2rem
.g-name: 0.72rem
.toast2: 0.78rem
```

---

## 🔧 TEKNIK DETAYLAR

### **Yapı**
- **Engine**: Vanilla JS (keine Frameworks)
- **3D**: Three.js r128, OrbitControls, EffectComposer
- **Animation**: Tween.js, CSS animations, requestAnimationFrame
- **Audio**: Web Audio API
- **Storage**: localStorage

### **Performance**
- **Render Target**: 16ms minimum gap (60 FPS target)
- **Mobile**: 32ms gap (30 FPS), 1.0 pixel ratio
- **Desktop**: 16ms gap (60 FPS), max 1.5× pixel ratio
- **Shader**: ACES Filmic Tone Mapping, Soft Shadows

### **Responsive**
- **Breakpoint 1**: max-width 380px (small phones)
- **Breakpoint 2**: max-height 480px (landscape phones)
- **Breakpoint 3**: min-width 600px (tablets)

---

## 📋 ÖZET: UI ÖĞELERI

| Öğe | Adet | Amaç |
|-----|------|------|
| Sayfalar | 4 | Intro, Game, Settings, Tutor |
| Butonlar | 15+ | İnteraktif kontrol |
| Modal'lar | 3 | Game Over, AI Thinking, Rewind |
| Toast Tipi | 5 | Info, Success, Warning, Error, Shield |
| Animasyon | 20+ | Hareket, Feedback, Transition |
| 3D Öğe | 100+ | Taş, Tahta, Işık, Parçacıklar |
| Notification | 10+ | Achievement, Toast, Banner |
| Ders | 30 | Eğitim sistemi |

---

## 🏆 SONUÇ

**Hiashatar**, Türk-Moğol kültürünü modern web oyun tasarımında başarıyla kullanmıştır. 

### Güçlü Yönleri:
✅ Zarif, tutarlı renk sistemi
✅ Kapsamlı eğitim sistemi (30 ders)
✅ Yüksek kalite 3D renderizasyon
✅ Çok katmanlı geri bildirim sistemi (ses + haptic + görsel)
✅ Erişilebilir kayıt sistemi
✅ Cihaz-uyumlu responsive design

### Geliştirme Fırsatları:
⚡ Sosyal özellikleri (leaderboard, çok oyunculu net)
⚡ Tema özelleştirmeleri (daha fazla tema seçeneği)
⚡ Oyun analiz (hamle gösterimi PGN formatında)
⚡ Offline modu (Progressive Web App)

---

**Rapor Tarihi**: 23 Mayıs 2026
**Versiyon**: Hiashatar v3
**Oyun Dili**: Türkçe
**Hedef Platform**: Web (Responsive)

