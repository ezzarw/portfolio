<template>
  <div class="space-y-8">
    <header class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <p class="font-mono text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
        Portfolio &amp; Credentials
      </p>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Portofolio &amp; Kredensial
      </h1>
      <p class="mt-3 text-sm text-slate-600">
        Daftar proyek terbuka dan sertifikasi teknis yang telah diselesaikan.
      </p>

      <!-- Tab Switcher -->
      <div class="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          @click="activeTab = 'all'"
          :class="[
            'clean-button text-xs',
            activeTab === 'all' ? 'clean-button-primary' : ''
          ]"
        >
          Semua ({{ normalizedProjects.length + certificates.length }})
        </button>
        <button
          type="button"
          @click="activeTab = 'projects'"
          :class="[
            'clean-button text-xs',
            activeTab === 'projects' ? 'clean-button-primary' : ''
          ]"
        >
          Proyek ({{ normalizedProjects.length }})
        </button>
        <button
          type="button"
          @click="activeTab = 'certificates'"
          :class="[
            'clean-button text-xs',
            activeTab === 'certificates' ? 'clean-button-primary' : ''
          ]"
        >
          Sertifikat ({{ certificates.length }})
        </button>
      </div>
    </header>

    <!-- Dynamic Filters for Projects -->
    <div v-if="activeTab === 'all' || activeTab === 'projects'" class="space-y-3">
      <!-- Filter Topik / Kategori Dinamis -->
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="font-mono text-xs text-slate-400 mr-2">Topik:</span>
        <button
          v-for="topic in availableTopics"
          :key="topic"
          type="button"
          @click="selectedTopic = topic"
          :class="[
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors font-mono',
            selectedTopic === topic
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          ]"
        >
          {{ topic }}
        </button>
      </div>

      <!-- Filter Tech Stack Dinamis -->
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="font-mono text-xs text-slate-400 mr-2">Tech Stack:</span>
        <button
          v-for="tech in availableTechStack"
          :key="tech"
          type="button"
          @click="selectedTech = tech"
          :class="[
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors font-mono',
            selectedTech === tech
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          ]"
        >
          {{ tech }}
        </button>
      </div>
    </div>

    <!-- Projects List View (ariaf.my.id inspired clean list) -->
    <section v-if="activeTab === 'all' || activeTab === 'projects'" class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
        Daftar Proyek ({{ filteredProjects.length }})
      </h2>

      <div v-if="filteredProjects.length > 0" class="divide-y divide-slate-100">
        <article
          v-for="project in filteredProjects"
          :key="project.title"
          class="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group"
        >
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <a
                v-if="project.link"
                :href="project.link"
                target="_blank"
                rel="noreferrer"
                class="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
              >
                {{ project.title }}
              </a>
              <span v-else class="text-sm font-bold text-slate-900">
                {{ project.title }}
              </span>
            </div>
            <p class="text-xs text-slate-600 max-w-xl leading-relaxed">
              {{ project.description }}
            </p>
            <div class="flex flex-wrap gap-1 pt-1">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <a
              v-if="project.link"
              :href="project.link"
              target="_blank"
              rel="noreferrer"
              class="clean-button text-xs py-1 px-2.5 h-auto min-h-0"
            >
              Repository ↗
            </a>
          </div>
        </article>
      </div>

      <p v-else class="py-8 text-center text-xs text-slate-400">
        Tidak ada proyek yang sesuai dengan filter yang dipilih.
      </p>
    </section>

    <!-- Certificates List View -->
    <section v-if="activeTab === 'all' || activeTab === 'certificates'" class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
        Daftar Sertifikat ({{ filteredCertificates.length }})
      </h2>

      <div v-if="filteredCertificates.length > 0" class="divide-y divide-slate-100">
        <article
          v-for="cert in filteredCertificates"
          :key="cert.id || cert.title"
          class="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div class="space-y-1">
            <h3 class="text-sm font-bold text-slate-900">
              {{ cert.title }}
            </h3>
            <p class="text-xs text-slate-500">
              {{ cert.issuer }} <span v-if="cert.issueDate">· {{ cert.issueDate }}</span>
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <a
              v-if="cert.credentialUrl || cert.webViewLink"
              :href="cert.credentialUrl || cert.webViewLink"
              target="_blank"
              rel="noreferrer"
              class="clean-button text-xs py-1 px-2.5 h-auto min-h-0"
            >
              Verifikasi ↗
            </a>
          </div>
        </article>
      </div>

      <p v-else class="py-8 text-center text-xs text-slate-400">
        Tidak ada sertifikat yang ditemukan.
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import projectData from "../data/ProjectData.json";
import certificateData from "../data/CertificateData.json";

const activeTab = ref("all");
const selectedTopic = ref("Semua");
const selectedTech = ref("Semua");
const certCategoryFilter = ref("all");

const normalizedProjects = computed(() => {
  const source = Array.isArray(projectData) ? projectData : projectData?.projects || [];
  return source.map((p) => ({
    ...p,
    title: p.title || p.name,
    link: p.url || p.link,
    topics: Array.isArray(p.topics) ? p.topics : (p.categories || []),
    technologies: Array.isArray(p.techStack) ? p.techStack : (p.technologies || []),
  }));
});

const certificates = computed(() => {
  return Array.isArray(certificateData) ? certificateData : certificateData?.certificates || [];
});

const availableTopics = computed(() => {
  const counts = {};
  normalizedProjects.value.forEach((p) => {
    p.topics.forEach((t) => {
      if (t !== "featured" && t !== "portfolio-showcase") {
        counts[t] = (counts[t] || 0) + 1;
      }
    });
  });
  // Ambil top 5 topik yang paling sering muncul
  const topTopics = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([t]) => t);
  return ["Semua", ...topTopics];
});

const availableTechStack = computed(() => {
  const set = new Set();
  normalizedProjects.value.forEach((p) => p.technologies.forEach((t) => set.add(t)));
  return ["Semua", ...Array.from(set).sort()];
});

const filteredProjects = computed(() => {
  return normalizedProjects.value.filter((p) => {
    const matchTopic = selectedTopic.value === "Semua" || p.topics.includes(selectedTopic.value);
    const matchTech = selectedTech.value === "Semua" || p.technologies.includes(selectedTech.value);
    return matchTopic && matchTech;
  });
});

const filteredCertificates = computed(() => {
  return certificates.value.filter((c) => {
    if (certCategoryFilter.value === "all") return true;
    return (c.category || "").toLowerCase() === certCategoryFilter.value.toLowerCase();
  });
});
</script>
