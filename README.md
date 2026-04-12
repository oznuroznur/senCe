# senCe-front

senCe-front, Next.js tabanli bir prediction market (tahmin piyasasi) arayuzu prototipidir. Uygulama, Clerk ile kimlik dogrulama, mock veri ile market listeleme/detay ekranlari ve leaderboard deneyimi sunar.

## Teknoloji Yigini

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Clerk (auth)
- Vercel Analytics
- Radix UI tabanli UI bilesenleri
- Lucide ikonlar

## Projede Su An Neler Var?

### 1) Sayfalar

- `/`:
  - Ana sayfa
  - Sol/yan alanda trend ve gundem kartlari
  - Featured market bolumu
  - Kategori filtreli tum marketler listesi
- `/markets/[slug]`:
  - Dinamik market detay sayfasi
  - YES/NO dagilimi, trend grafigi, outcome listesi
  - Sag panelde prediction panel + ilgili marketler
- `/leaderboard`:
  - En iyi kullanicilar tablosu
  - Ozet istatistik kartlari
- `/sign-in/[[...sign-in]]`:
  - Clerk SignIn ekrani
- `/sign-up/[[...sign-up]]`:
  - Clerk SignUp ekrani

### 2) Kimlik Dogrulama ve Middleware

- Clerk provider, tum uygulama seviyesinde layout icinde kullaniliyor.
- `proxy.ts` icinde `clerkMiddleware` aktif.
- Auth durumu `Navbar` uzerinden:
  - Signed-out: Log In / Sign Up
  - Signed-in: UserButton

### 3) Veri Katmani (Mock)

`lib/mock-data.ts` icinde su anda:

- Tipler:
  - `Market`, `MarketOutcome`, `ChartDataPoint`, `LeaderboardUser` vb.
- Sabitler:
  - `categories`, `navCategories`
  - `featuredMarket`, `markets`, `nbaChampionMarket`
  - `breakingNews`, `hotTopics`, `relatedMarkets`, `leaderboard`, `comments`
- Yardimci fonksiyonlar:
  - `formatNumber(num)`
  - `getMarketBySlug(slug)`

Not: Uygulama su an backend API yerine mock verilerle calisiyor.

### 4) Ana Bilesenler

- `Navbar`: logo, arama kutusu, kategori navigasyonu, auth aksiyonlari
- `FeaturedMarket`: one cikan market gorunumu
- `HomeSidebar`: breaking news + hot topics
- `MarketList`: kategori filtreli market grid
- `MarketCard`: tekil market karti
- `PredictionPanel`: markette yes/no secimi ve tahmin paneli
- `LeaderboardTable`: liderlik tablosu
- `PercentageBar`: yuzde dagilim gostergesi

### 5) UI Altyapisi

`components/ui` altinda kapsamli bir Radix + Tailwind tabanli tasarim sistemi bulunuyor:

- Form ve input bilesenleri
- Dialog/sheet/drawer/popover
- Tablo, tabs, accordion, tooltip
- Toast/sonner, chart, calendar vb.

Bu yapi, uygulamanin yeni ekranlarini hizli gelistirmeye uygun bir temel sagliyor.

## Dizin Ozeti

- `app/`: App Router sayfalari ve route yapisi
- `components/`: Projeye ozgu bilesenler
- `components/ui/`: yeniden kullanilabilir UI primitive'leri
- `lib/`: mock veri ve yardimci fonksiyonlar
- `hooks/`: ortak React hook'lari
- `public/`: statik dosyalar
- `styles/`: ek global stiller

## Kurulum ve Calistirma

## Gereksinimler

- Node.js 18+
- npm

## Adimlar

1. Bagimliliklari kurun:

```bash
npm install
```

2. Gelistirme sunucusunu baslatin:

```bash
npm run dev
```

3. Tarayicida acin:

- `http://localhost:3000`

## Scriptler

- `npm run dev`: gelistirme modu
- `npm run build`: production build
- `npm run start`: production sunucusu
- `npm run lint`: ESLint calistirir

## Ortam Degiskenleri (Auth icin)

Clerk kullanildigi icin `.env.local` icinde en az su degiskenler gerekir:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

Ihtiyaca gore Clerk dashboard yonlendirmeleri de eklenebilir (sign-in/sign-up redirect URL'leri).

## Mevcut Durum ve Sonraki Adimlar

Mevcut durumda proje, UI/UX prototipleme ve urun akislarini dogrulama icin hazir bir frontend temelidir.

Tipik sonraki adimlar:

1. Mock veri yerine gercek API entegrasyonu
2. Prediction islemleri icin backend + veritabani
3. Market olusturma/yonetim ekranlari
4. Test altyapisi (unit + e2e)
5. Role-based auth ve yetkilendirme
