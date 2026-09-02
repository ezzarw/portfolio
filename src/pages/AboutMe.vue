<template>
  <div class="space-y-8">
    <!-- Header Summary -->
    <header class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <p class="font-mono text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
        About Me
      </p>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Tentang saya
      </h1>
      <p class="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
        Saya Aliezzar Wijaya, praktisi Cloud, DevOps, dan Keamanan Sistem dari SMK Telkom Sidoarjo (SIJA). Berfokus pada arsitektur yang bersih, otomatisasi deployment, dan ketahanan infrastruktur.
      </p>
    </header>

    <!-- Background & Current Focus Grid -->
    <section class="grid gap-6 sm:grid-cols-2">
      <article class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-base font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">
          Cerita singkat
        </h2>
        <div class="space-y-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
          <p>
            Ketertarikan saya berawal dari rasa penasaran tentang bagaimana sebuah sistem bekerja, dan bagaimana membuatnya lebih baik. Dari sana saya mulai bereksperimen dengan Linux, bahasa pemrograman, infrastruktur, keamanan siber, sampai agentic AI.
          </p>
          <p>
            Saya paling menikmati proyek yang punya dampak nyata: deployment lebih sederhana, proses manual menjadi otomatis, atau data lebih mudah dipahami.
          </p>
          <p>
            Di luar teknis, saya menyukai tantangan Capture the Flag dan eksperimen tools open source untuk mengasah pemecahan masalah secara terstruktur.
          </p>
        </div>
      </article>

      <aside class="dashed-card p-6 flex flex-col justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">
            Sedang didalami
          </h2>
          <ul class="space-y-2.5">
            <li
              v-for="(item, index) in currentQuests"
              :key="item"
              class="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-700"
            >
              <span class="font-mono text-xs text-blue-600 font-bold">0{{ index + 1 }}.</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-200">
          <span class="font-mono text-[11px] text-slate-500">Prinsip: Sederhanakan sebelum optimasi.</span>
        </div>
      </aside>
    </section>

    <!-- Toolbox / Skill Matrix -->
    <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
        Toolbox &amp; Area Kerja
      </h2>
      <div class="grid gap-4 sm:grid-cols-3">
        <div v-for="area in focusAreas" :key="area.title" class="space-y-2">
          <h3 class="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
            {{ area.title }}
          </h3>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="item in area.items"
              :key="item"
              class="clean-badge text-xs"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Setup / Gear -->
    <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
        Peralatan &amp; Lingkungan Kerja
      </h2>
      <div class="grid gap-3 sm:grid-cols-2">
        <div
          v-for="group in gearData.gearType"
          :key="group.gear"
          class="rounded-lg border border-slate-100 bg-slate-50/70 p-3.5"
        >
          <p class="font-mono text-xs font-bold text-slate-800">{{ group.gear }}</p>
          <p class="mt-1 text-xs text-slate-600 leading-relaxed">
            {{ group.gearList.map((item) => item.item).join(", ") }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import gearData from "../data/GearData.json";

const focusAreas = [
  {
    title: "Infrastructure",
    items: ["Docker", "Kubernetes", "CI/CD", "Linux", "Nginx"],
  },
  {
    title: "Development",
    items: ["Golang", "Python", "PHP", "Vue.js", "Automation"],
  },
  {
    title: "Security",
    items: ["CTF", "Digital Forensics", "Hardening", "Web Security"],
  },
];

const currentQuests = [
  "Kubernetes & CI/CD Pipelines",
  "Golang untuk tooling & CLI",
  "Digital Forensics & Incident Analysis",
  "Agentic AI autonomous workflows",
];
</script>
