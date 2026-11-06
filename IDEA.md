# 🚀 ARCHITECTURE & AI AGENT GUIDE: ASTROFOLIO (PORTFOLIO ALIEZZAR WIJAYA)

> **DOKUMEN INI ADALAH SINGLE SOURCE OF TRUTH (SSOT) UNTUK SETIAP AGENTIC AI & DEVELOPER**
> Panduan teknis komprehensif, arsitektur sistem, aturan pengembangan (*rules of engagement*), konvensi kode, profil identitas pemilik, serta roadmap fitur untuk pengembangan portofolio ini.

---

## 👤 1. PROFIL IDENTITAS PEMILIK (OWNER IDENTITY)
Setiap perubahan data profil, bio, dan representasi harus konsisten dengan identitas berikut:

- **Nama Lengkap**: Aliezzar Wijaya
- **Pendidikan**: SMK Telkom Sidoarjo (Angkatan 2024 – 2028), Jurusan Sistem Informasi Jaringan dan Aplikasi (SIJA).
- **Spesialisasi / Fokus**: Software Engineer, DevOps, dan DevSecOps (Beginner / Junior).
- **Pekerjaan Saat Ini**: Associate Software Engineer di **SEVIMA** (diterima lewat program Beasiswa SEMESTA Tech Career Batch 8; kickoff proyek 7 Desember 2026).
- **Aktivitas Komunitas**: Aktif di **Skomda Cyber Security**, **IMPHNEN**, dan **KTCG** (Komunitas Teknologi Cipta Generasi).
- **Profil Sosial & Tautan Resmi**:
  - GitHub: [https://github.com/ezzarw](https://github.com/ezzarw)
  - LinkedIn: [https://id.linkedin.com/in/aliezzar-wijaya-7a9a56356](https://id.linkedin.com/in/aliezzar-wijaya-7a9a56356)
- **Bahasa Utama Website**: Bahasa Indonesia (ringkas, profesional, modern, lugas, tanpa kalimat berbunga-bunga/filler).

---

## 🧱 2. STACK & ARSITEKTUR TEKNIS (TECHNICAL STACK)

- **Core Framework**: [Astro v5](https://astro.build) (Mode `static` SSG — Static Site Generation).
- **Bahasa**: TypeScript (`strict: true`) + Vanilla JS untuk interaktivitas client-side ringan.
- **Styling**: Vanilla Modern CSS (CSS Variables, Flexbox, CSS Grid, Scroll-driven animations). Menggunakan font *Instrument Sans* & *JetBrains Mono*.
- **Penyimpanan Data Lokal**: JSON statis di direktori `src/data/`:
  - `profile.json`: Identitas, SEO, avatar, favicon, sosial, bio, stats, dan daftar logo komunitas.
  - `jobs.json`: Riwayat pekerjaan & pengalaman karier.
  - `education.json`: Riwayat institusi pendidikan formal & bootcamp.
  - `projects.json`: Database showcase proyek.
  - `skills.json`: Matriks keahlian teknologi.
  - `testimonials.json`: Rekomendasi / testimoni profesional.
- **Media & Aset**: Semua gambar (avatar, favicon, logo komunitas, logo tech stack, thumbnail project) **wajib format `.webp`** dan di-*serve* lokal dari direktori `public/`.
- **Dev-Only Admin Studio**: Disediakan endpoint middleware (`/api/dev/projects` dan `/api/dev/upload`) via integrasi Vite dev server plugin `src/integrations/dev-admin.ts` dan antarmuka `/admin` (`src/pages/admin.astro`).

---

## 🛡️ 3. DEV-ONLY STUDIO (`/admin`) & DEVSECOPS ISOLATION

Fitur studio admin dirancang dengan prinsip **Zero Production Attack Surface**:
1. **Akses Terbatas**: Halaman `src/pages/admin.astro` memiliki guard `if (!import.meta.env.DEV) return Astro.redirect('/');`.
2. **Pembersihan Build**: Hook plugin `astro:build:done` di `src/integrations/dev-admin.ts` secara otomatis menghapus direktori `dist/admin` saat proses build production, memastikan tidak ada artefak file admin yang bocor ke hosting publik.
3. **API Upload & Data**: Endpoint `/api/dev/projects` dan `/api/dev/upload` hanya dipasang pada `astro:server:setup` (middleware dev server Vite), sehingga saat di-deploy ke Vercel/Netlify/Cloudflare Pages, route backend ini murni tidak ada.
4. **Manajemen Kategori Proyek**: Input kategori proyek di admin studio menggunakan input berbasis datalist yang fleksibel. User dapat memilih opsi standar (`Web App`, `Mobile App`, `DevOps & Infra`, `Cyber Security`, `API & Backend`) atau **mengetik kategori baru secara bebas**. Kategori baru otomatis disinkronkan ke filter tab proyek di portofolio.

---
## ⚠️ 4. PERATURAN KERJA UNTUK AGENTIC AI (AGENT RULES OF ENGAGEMENT)

Bagi AI Agent mana pun yang memodifikasi repositori ini, patuhi aturan mutlak berikut:

### Rule 1: Wajib Verifikasi Build & Tipe Setiap Selesai Edit
Setiap kali melakukan perubahan file (`.astro`, `.ts`, `.json`, `.css`), jalankan validasi berikut di terminal:
```bash
npm run check && npm run build
```
Jika ada error tipe TypeScript atau kegagalan kompilasi Astro, **perbaiki seketika itu juga**. Dilarang menganggap tugas selesai sebelum build exit code `0`.

### Rule 2: Semua Aset Gambar Wajib WebP & Dioptimasi
- Jangan menyimpan atau mereferensikan file raw `.png`, `.jpg`, atau `.svg` berukuran besar untuk foto/thumbnail/logo.
- Gunakan ImageMagick (`magick`) untuk mengonversi ke format `.webp` dengan resolusi dan kompresi proporsional ke dalam folder `public/assets/` atau `public/projects/`.
- Pertahankan rasio aspek dan gunakan transparansi jika berupa logo/ikon.

### Rule 3: Jaga Integritas Komunitas & Data Riil
- Bagian komunitas **hanya boleh berisi 3 komunitas aktif pemilik**: `Skomda Cyber Security`, `IMPHNEN`, dan `KTCG`. Jangan tambahkan entitas sembarangan.
- Riwayat kerja SEVIMA menggunakan sistem deteksi tanggal client-side (`startDate: "2026-12-07"`). Sebelum 7 Desember 2026, status tampil sebagai `Incoming` (`Starts Dec 7, 2026`). Setelah tanggal tersebut, otomatis berubah menjadi `Current` (`Dec 2026 — Now`). Jangan merusak logika transisi tanggal ini di `Experience.astro` dan `index.astro`.

### Rule 4: Zero External Runtime Tracking
- Repositori ini bersifat self-hosted dan privasi-ramah. Jangan memasukkan library analitik berat pihak ketiga (Google Analytics, Mixpanel, tracker cookies) kecuali diminta secara eksplisit oleh pemilik.

### Rule 5: GitOps & Atomic Changes
- Setiap task harus selesai utuh sebelum berpindah ke task lain. Jangan meninggalkan file temporary atau perubahan setengah jalan.
- Simpan file rahasia atau kredensial di luar repo; jangan pernah melakukan commit file `.env` atau credential tokens.

---

## 📁 5. STRUKTUR DIREKTORI & REFERENSI FILE

```plaintext
astrofolio/
├── docs/                     # Dokumentasi referensi & screenshot template
├── public/                   # Static assets publik (self-hosted)
│   ├── assets/
│   │   ├── avatar.webp       # Foto profil utama Aliezzar Wijaya
│   │   ├── favicon.webp      # Favicon web 64x64
│   │   ├── communities/      # Logo WebP: skomda-cyber, imphnen, ktcg
│   │   ├── education/        # Logo WebP: smk-telkom, adinusa
│   │   └── logos/            # Logo institusi/perusahaan: sevima.webp
│   ├── projects/             # Thumbnail showcase proyek (.webp)
│   ├── techstack/            # Ikon orbit teknologi (.webp)
│   └── fonts/                # Web fonts woff2 lokal
├── src/
│   ├── components/           # Komponen UI Astro
│   │   ├── Hero.astro        # Intro, floating orbit icons (14 tech), bio, stats
│   │   ├── Companies.astro   # Marquee komunitas aktif (Skomda, IMPHNEN, KTCG)
│   │   ├── Experience.astro  # Riwayat karier & logika durasi SEVIMA
│   │   ├── Projects.astro    # Showcase proyek dinamis dengan filter kategori
│   │   ├── Education.astro   # Riwayat pendidikan SMK Telkom & Bootcamp Adinusa
│   │   └── ...
│   ├── data/                 # Data statis JSON (profile, jobs, education, projects)
│   ├── integrations/         # Astro custom integrations (dev-admin.ts)
│   ├── layouts/Base.astro    # Master layout, SEO tags, link rel icon webp
│   ├── pages/
│   │   ├── index.astro       # Landing page utama portofolio
│   │   └── admin.astro       # Dev-only Project Studio (CRUD form & upload)
│   └── styles/global.css     # CSS Variables, tema modern, utility classes
├── astro.config.mjs          # Konfigurasi Astro + integrasi devAdminPlugin
├── package.json              # Dependensi & NPM scripts (dev, build, check)
├── tsconfig.json             # Konfigurasi strict TypeScript
└── IDEA.md                   # File petunjuk ini (Single Source of Truth)
```

---

## 🧭 6. DETAIL TEKNIS KOMPONEN PENTING

### A. Hero Orbit Icons (`src/components/Hero.astro`)
Ikon teknologi yang mengorbit avatar dibagi menjadi 2 orbit lingkaran konsentris CSS:
1. **Inner Orbit (5 ikon inti, rotasi 72°)**: `react`, `golang`, `postgresql`, `mysql`, `redis`.
2. **Outer Orbit (9 ikon DevSecOps/Tools, rotasi 40°)**: `docker`, `laravel`, `podman`, `ghidra`, `nmap`, `burpsuite`, `owasp-zap`, `wireshark`, `hermes`.
*Catatan: Semua aset ikon diambil dari `public/techstack/<name>.webp`.*

### B. Projects Showcase (`src/components/Projects.astro` & `src/data/projects.json`)
Struktur item pada `projects.json`:
```json
{
  "title": "Stoodify - AI Study Assistant",
  "status": "In Development",
  "desc": "Platform asisten belajar AI berbasis Go, Gin, dan GORM...",
  "category": "Web App",
  "tags": ["Go", "Gin", "PostgreSQL", "Docker"],
  "wins": ["Optimasi latency query dengan caching Redis"],
  "img": "stoodify",
  "live": "https://stoodify.app",
  "cta": "Lihat Demo",
  "src": "https://github.com/ezzarw/stoodify"
}
```

### C. Education (`src/data/education.json`)
Menampilkan riwayat formal di **SMK Telkom Sidoarjo** (SIJA, 2024–2028) dan pelatihan **ADINUSA** (Cloud & DevOps Bootcamp, 2024) lengkap dengan ringkasan kurikulum teknis.

---

## 📋 7. ROADMAP & IDE PENGEMBANGAN BERIKUTNYA

Jika agent selanjutnya diminta melanjutkan pengembangan, berikut daftar prioritas fitur:

1. **Manajemen Proyek Mandiri**: Gunakan studio `/admin` saat dev mode untuk mengisi karya-karya nyata tanpa perlu mengedit file JSON secara manual.
2. **Certifications & CTF Writeups Section**: Menambahkan bagian sertifikasi dan pencapaian kompetisi CTF (Cyber Security) di halaman utama.
3. **Integrasi Neon Postgres (Opsional / Future)**: Jika pemilik ingin migrasi dari JSON statis ke live cloud database dengan Neon Postgres + S3 Object Storage untuk media project.
4. **Dark / Light Theme Toggle**: Menyempurnakan transisi tema dengan CSS token yang ramah mata.

---
*Dokumen ini dibuat dan diperbarui untuk memastikan konsistensi rekayasa perangkat lunak berstandar tinggi bagi seluruh autonomous AI agents.*
