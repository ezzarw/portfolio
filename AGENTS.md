# AGENTS.md

## 1. Tujuan Dokumen

Dokumen ini adalah sumber konteks utama untuk AI/agent yang bekerja di repository portfolio personal Aliezzar Wijaya. Seluruh panduan, struktur, arsitektur, dan keputusan desain dicatat di sini sebagai single source of truth.

## 2. Ringkasan Proyek

- **Nama package**: `portfolio-vue`
- **Jenis aplikasi**: Portfolio Personal Aliezzar Wijaya
- **Bahasa UI utama**: Bahasa Indonesia (dengan beberapa istilah teknis standar)
- **Stack**: Vue 3 (Composition API / `<script setup>`), Vite, JavaScript, Tailwind CSS
- **Design Style**: Light Minimalist (Clean, high-signal, anti-slop, inspirasi `ariaf.my.id`)
- **Navigasi**: State lokal reaktif (`activePage`) di `App.vue`
- **Data utama**: JSON lokal di `src/data/`
- **Pemilik GitHub**: `ezzarw`
- **Fokus profil**: Cloud, DevOps, Security, Software Development, dan Agentic AI

## 3. Instruksi Mutlak untuk Agent

1. Baca file terkait sebelum mengedit.
2. Pertahankan Bahasa Indonesia untuk semua teks UI kecuali nama proyek, identifier teknologi, atau metadata standar.
3. Jangan menambahkan komentar kode berlebih / generic boilerplate.
4. Jangan melakukan commit, push, atau operasi remote GitHub tanpa instruksi eksplisit pengguna.
5. Gunakan dependency yang sudah terpasang (Vue 3, Vite, Tailwind CSS, Lucide icons via DynamicIcon).
6. Pertahankan accessibility: semantic HTML, focus visible, aria labels, dan target klik minimal 44px.
7. Jalankan verifikasi (`npm test` / `npm run build`) setelah melakukan modifikasi penting.

## 4. Struktur Repository

```text
portfolio/
├── dist/                          # Hasil build produksi Vite
├── public/
│   ├── favicon.svg
│   ├── manifest.json
│   └── projects/                  # Asset gambar lokal
├── scripts/
│   ├── google-apps-script.js
│   └── sync-certificates.cjs      # Sinkronisasi 15 sertifikat ke CertificateData.json
├── src/
│   ├── components/
│   │   ├── DynamicCta.vue
│   │   ├── DynamicIcon.vue
│   │   └── Layout.vue             # Header profil, status pulse, quick contact, nav tabs, footer
│   ├── data/
│   │   ├── CertificateData.json   # 15 sertifikat terverifikasi
│   │   ├── GearData.json          # Setup hardware & OS
│   │   ├── ProjectData.json       # Repositori & proyek pilihan
│   │   └── SiteConfig.js          # Konfigurasi navigasi, brand, dan external links
│   ├── pages/
│   │   ├── AboutMe.vue            # Bio, fokus, tech stack, dan gear setup
│   │   ├── ContactMe.vue          # Saluran kontak langsung & form pesan
│   │   ├── Home.vue               # Intro singkat, status live, pilar keahlian, recent work
│   │   └── Projects.vue           # Tampilan terpadu: Proyek & Sertifikat dengan filter tab
│   ├── App.test.js                # Pengujian unit Vitest
│   ├── App.vue                    # Root orchestrator navigasi
│   ├── index.css                  # Tailwind imports & clean utility classes
│   └── main.js                    # Entrypoint Vite
├── package.json
└── vite.config.js
```

## 5. Arsitektur Navigasi

Navigasi menggunakan event-driven state `activePage` di `src/App.vue`:

```vue
<Layout :current-page="activePage" @navigate="activePage = $event">
  <Transition name="fade-page" mode="out-in">
    <component :is="currentPageComponent" :key="activePage" @navigate="activePage = $event" />
  </Transition>
</Layout>
```

Routing Map:
- `/` -> `Home.vue`
- `about-me` -> `AboutMe.vue`
- `projects` -> `Projects.vue` (Mencakup Proyek & 15 Sertifikat)
- `contact-me` -> `ContactMe.vue`

Daftar navigasi terpusat di `src/data/SiteConfig.js`.

## 6. Design System & Styling

- **Palet Warna**:
  - Background: `#f8fafc` (`bg-slate-50/60`)
  - Kartu & Kontainer: `#ffffff` (`bg-white`) dengan border `#e2e8f0` (`border-slate-200`)
  - Aksen Garis & Dashed Card: `#cbd5e1` / `#94a3b8`
  - Teks Utama: `#0f172a` (`text-slate-900`)
  - Teks Muted: `#64748b` (`text-slate-500`)
  - Primary Action: `#0f172a` (`bg-slate-900 text-white`)
  - Live Indicator: `#10b981` (`bg-emerald-500`)
- **Tipografi**: Plus Jakarta Sans (konten umum) dan JetBrains Mono (tag, badge, status, metadata).
- **Utility CSS (`src/index.css`)**:
  - `.clean-card`: Kartu putih dengan border slate halus dan shadow tipis.
  - `.clean-button`: Tombol minimalis dengan transisi halus.
  - `.clean-button-primary`: Tombol solid slate-900.
  - `.dashed-card`: Kartu aksen dengan border garis putus-putus.

## 7. Data Proyek & Sertifikat

- **Proyek (`src/data/ProjectData.json`)**: Data proyek open source GitHub dengan kategori domain (`DevOps`, `Security`, `AI`, `Backend`, `CLI`) dan array teknologi nyata.
- **Sertifikat (`src/data/CertificateData.json`)**: 15 sertifikat tersinkronisasi otomatis via `node scripts/sync-certificates.cjs`. Diperbarui otomatis saat pipeline build dijalankan.

## 8. Command Penting

- Dev Server: `npm run dev` (berjalan di `http://localhost:5173/`)
- Test: `npm test` (menjalankan Vitest)
- Sinkronisasi Sertifikat: `npm run sync:certificates`
- Production Build: `npm run build`
