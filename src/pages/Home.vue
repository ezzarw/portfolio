<template>
  <div class="space-y-8">
    <!-- Introduction Section -->
    <section class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <p class="font-mono text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
        Profile Brief
      </p>
      <h2 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {{ siteConfig.brand.name }}
      </h2>
      <p class="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
        Fokus membangun arsitektur Backend tangguh, otomatisasi infrastruktur Cloud/DevOps, dan pertahanan Cyber Security.
      </p>

      <!-- Proof Strip for HR / Recruiters -->
      <div class="mt-4 flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-600">
        <span class="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 border border-slate-200">
          <span class="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
          Top 14 CTF Nasional
        </span>
        <span class="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 border border-slate-200">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
          15+ Verified Credentials
        </span>
        <span class="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 border border-slate-200">
          <span class="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
          Go REST API &amp; K8s Cluster
        </span>
      </div>

      <div class="mt-6 flex flex-wrap gap-2.5">
        <DynamicCta
          v-for="cta in siteConfig.homeCtas"
          :key="`${cta.type}-${cta.target || cta.linkKey}`"
          :cta="cta"
          @navigate="$emit('navigate', $event)"
        />
      </div>
    </section>

    <!-- Strengths / Core Pillars in Dashed Cards -->
    <section class="space-y-4" aria-labelledby="pillars-title">
      <div class="flex items-center justify-between">
        <h3 id="pillars-title" class="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
          Keahlian &amp; Fokus Inti
        </h3>
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        <article
          v-for="strength in strengths"
          :key="strength.title"
          class="dashed-card p-5 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {{ strength.number }}
              </span>
            </div>
            <h4 class="text-base font-bold text-slate-900">{{ strength.title }}</h4>
            <p class="mt-2 text-xs leading-relaxed text-slate-600">{{ strength.description }}</p>
          </div>
        </article>
      </div>

      <!-- Secondary / Exploratory Strip: Agentic AI -->
      <div class="rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
        <div class="flex items-center gap-2.5">
          <span class="inline-flex items-center rounded bg-slate-200/80 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 uppercase tracking-wide">
            Eksplorasi &amp; Tooling
          </span>
          <span class="text-xs font-bold text-slate-800">Agentic AI &amp; Autonomous Workflows</span>
        </div>
        <p class="text-[11px] text-slate-500 max-w-xl">
          Mengeksplorasi orkestrasi multi-agent dan automasi workflow cerdas sebagai pengganda efisiensi pengembangan sistem.
        </p>
      </div>
    </section>

    <!-- Notion Engineering Vault Callout Section -->
    <section class="rounded-xl border border-blue-100 bg-blue-50/50 p-6 transition-all hover:border-blue-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="space-y-1">
          <div class="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-2.5 py-0.5 font-mono text-[10px] font-bold text-blue-800">
            <span>LIVE NOTION VAULT</span>
          </div>
          <h3 class="text-base font-bold text-slate-900">Engineering Notes &amp; Incident Playbooks</h3>
          <p class="text-xs text-slate-600 max-w-xl">
            Akses langsung dokumentasi arsitektur, catatan lab K8s, cheatsheet CTF, dan riset sistem yang diperbarui secara berkala di Notion.
          </p>
        </div>
        <a
          :href="siteConfig.links.notionNotes.href"
          target="_blank"
          rel="noopener noreferrer"
          class="clean-button-primary inline-flex items-center justify-center gap-1.5 text-xs font-semibold shrink-0 self-start sm:self-center"
        >
          <span>Buka Notion Vault</span>
          <span>↗</span>
        </a>
      </div>
    </section>

    <!-- Recent Highlights / Quick Vault & Notes Section -->
    <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Catatan &amp; Eksplorasi Terbaru</h3>
          <p class="text-xs text-slate-500">Disinkronkan langsung dari Notion Hub Publik</p>
        </div>
        <a
          :href="siteConfig.links.notionNotes.href"
          target="_blank"
          rel="noreferrer"
          class="font-mono text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Lihat Semua Catatan ↗
        </a>
      </div>

      <div class="mt-4 divide-y divide-slate-100">
        <!-- Live Notion Sync Note Item (Max 3 items with line-clamp) -->
        <a
          v-for="note in notes.slice(0, 3)"
          :key="note.id"
          :href="note.url"
          target="_blank"
          rel="noreferrer"
          class="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-slate-50/80 px-2 rounded-lg transition-colors group"
        >
          <div class="flex items-center gap-3 overflow-hidden">
            <span class="font-mono text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded shrink-0">[Notion Note]</span>
            <span class="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors shrink-0">
              {{ note.title }}
            </span>
            <span class="text-xs text-slate-500 line-clamp-1 truncate">— {{ note.excerpt }}</span>
          </div>
          <span class="font-mono text-xs text-slate-400 self-start sm:self-auto shrink-0">{{ note.date }} ↗</span>
        </a>

        <!-- Recent Activities -->
        <div
          v-for="item in recentActivities"
          :key="item.title"
          class="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-slate-50/80 px-2 rounded-lg transition-colors cursor-pointer"
          @click="$emit('navigate', 'projects')"
        >
          <div class="flex items-center gap-3">
            <span class="font-mono text-xs text-slate-400">[{{ item.tag }}]</span>
            <span class="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
              {{ item.title }}
            </span>
          </div>
          <span class="font-mono text-xs text-slate-400 self-start sm:self-auto">{{ item.date }}</span>
        </div>
      </div>
    </section>

    <!-- Quick CTA Banner -->
    <section class="rounded-xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 class="text-lg font-bold">{{ siteConfig.closingCta.title }}</h3>
        <p class="text-xs text-slate-400 mt-1">Terbuka untuk diskusi proyek infrastruktur, CTF, atau kolaborasi open source.</p>
      </div>
      <button
        type="button"
        @click="$emit('navigate', siteConfig.closingCta.target)"
        class="clean-button bg-white text-slate-900 border-white hover:bg-slate-100 text-xs shrink-0"
      >
        {{ siteConfig.closingCta.label }} →
      </button>
    </section>
  </div>
</template>

<script setup>
import DynamicCta from "../components/DynamicCta.vue";
import { siteConfig } from "../data/SiteConfig";
import notesData from "../data/NotesData.json";

defineEmits(["navigate"]);

const notes = notesData;

const strengths = [
  {
    number: "01",
    title: "Cloud & DevOps",
    description: "Membangun deployment dan infrastruktur yang rapi, otomatis, serta mudah dirawat.",
  },
  {
    number: "02",
    title: "Cyber Security",
    description: "Terbiasa melihat sistem dari sisi keamanan, forensik digital, dan kompetisi CTF.",
  },
  {
    number: "03",
    title: "Backend Engineering",
    description: "Mendesain arsitektur API yang tangguh, performan, dan terintegrasi database secara modular.",
  },
];

const recentActivities = [
  {
    tag: "DevOps",
    title: "Docker Image Optimization Pipeline",
    date: "2026",
  },
  {
    tag: "Security",
    title: "Digital Forensics & CTF Challenge Workflows",
    date: "2026",
  },
  {
    tag: "Tooling",
    title: "CLI Automation & CSV to JSON Parser in Go",
    date: "2025",
  },
];
</script>
