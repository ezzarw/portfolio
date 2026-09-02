<template>
  <div class="min-h-screen bg-slate-50/60 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
    <a
      href="#main-content"
      class="clean-button fixed left-4 top-4 z-50 -translate-y-24 focus:translate-y-0 shadow-sm"
    >
      Lewati ke konten
    </a>

    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Profile Header / Sidebar in ariaf.my.id inspired layout -->
      <header class="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-start gap-4">
            <div class="relative shrink-0">
              <img
                src="/avatar.jpg"
                :alt="siteConfig.brand.name"
                class="h-16 w-16 rounded-xl border border-slate-200 object-cover shadow-xs"
              />
              <span class="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span class="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
              </span>
            </div>

            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl font-bold tracking-tight text-slate-900">
                  {{ siteConfig.brand.name }}
                </h1>
                <span class="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                  Online
                </span>
              </div>
              <p class="text-sm font-medium text-slate-500">
                {{ siteConfig.brand.role }}
              </p>
              <div class="mt-2.5 flex items-center gap-3">
                <template v-for="linkKey in siteConfig.footerLinkKeys" :key="linkKey">
                  <a
                    v-if="getSiteLink(linkKey)"
                    :href="getSiteLink(linkKey).href"
                    target="_blank"
                    rel="noreferrer"
                    :aria-label="getSiteLink(linkKey).label"
                    class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <DynamicIcon :name="getSiteLink(linkKey).icon" class="text-sm" />
                  </a>
                </template>
              </div>
            </div>
          </div>

          <!-- Desktop Quick Actions -->
          <div class="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              @click="$emit('open-palette')"
              class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Command Palette (Cmd+K)"
            >
              <DynamicIcon name="search" class="text-xs" />
              <span>Cari</span>
              <kbd class="rounded bg-white px-1 py-0.5 text-[10px] font-mono border border-slate-200 shadow-2xs text-slate-400">⌘K</kbd>
            </button>
            <button
              type="button"
              @click="navigate('contact-me')"
              class="clean-button clean-button-primary text-xs"
            >
              Kontak
            </button>
          </div>
        </div>

        <!-- Navigation Bar (Clean Tabs) -->
        <nav class="mt-6 flex flex-wrap gap-1 border-t border-slate-100 pt-4" aria-label="Navigasi utama">
          <button
            v-for="item in siteConfig.navigation"
            :key="item.id"
            type="button"
            @click="navigate(item.id)"
            :aria-current="isNavbar === item.id ? 'page' : undefined"
            :class="[
              'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all',
              isNavbar === item.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            {{ item.label }}
          </button>
        </nav>
      </header>

      <!-- Main Content Viewport -->
      <main id="main-content" class="min-h-[calc(100vh-320px)]">
        <slot />
      </main>

      <!-- Minimal Clean Footer -->
      <footer class="mt-12 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
        <p>
          Dibuat dengan dedikasi &amp; arsitektur minimalis oleh {{ siteConfig.brand.name }}.
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import DynamicIcon from "./DynamicIcon.vue";
import { getSiteLink, isExternalLink, siteConfig } from "../data/SiteConfig";

const props = defineProps({
  currentPage: {
    type: String,
    default: "/",
  },
});

const emit = defineEmits(["navigate"]);

const isNavbar = computed(() => props.currentPage);
const githubLink = computed(() => getSiteLink("github"));

const navigate = (pageId) => {
  emit("navigate", pageId);
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
