<template>
  <Teleport to="body">
    <Transition name="palette-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-sm"
        @click.self="close"
        @keydown.esc="close"
      >
        <div
          class="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl transition-all"
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
        >
          <!-- Search Header Input -->
          <div class="flex items-center border-b border-slate-100 px-4 py-3">
            <span class="text-slate-400 font-mono text-sm mr-3">❯</span>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Cari proyek, sertifikat, atau ketik 'resume', 'email'..."
              class="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
              @keydown.down.prevent="navigateResults(1)"
              @keydown.up.prevent="navigateResults(-1)"
              @keydown.enter.prevent="executeActive"
            />
            <button
              type="button"
              @click="close"
              class="rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-400 hover:bg-slate-100 border border-slate-200"
            >
              ESC
            </button>
          </div>

          <!-- Command Items List -->
          <div class="max-h-80 overflow-y-auto p-2 divide-y divide-slate-50">
            <div v-if="filteredCommands.length === 0" class="p-6 text-center text-xs text-slate-400 font-mono">
              Tidak ada hasil yang cocok untuk "{{ query }}"
            </div>

            <div
              v-for="(item, idx) in filteredCommands"
              :key="item.id"
              :class="[
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs cursor-pointer transition-colors',
                selectedIndex === idx ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
              ]"
              @mouseenter="selectedIndex = idx"
              @click="executeItem(item)"
            >
              <div class="flex items-center gap-2.5 truncate">
                <span :class="['font-mono text-[10px] px-1.5 py-0.5 rounded border shrink-0', selectedIndex === idx ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200']">
                  {{ item.category }}
                </span>
                <span class="font-medium truncate">{{ item.title }}</span>
              </div>
              <span :class="['font-mono text-[10px] shrink-0 ml-2', selectedIndex === idx ? 'text-slate-300' : 'text-slate-400']">
                {{ item.hint }}
              </span>
            </div>
          </div>

          <!-- Footer Shortcut Hints -->
          <div class="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-4 py-2 text-[10px] font-mono text-slate-400">
            <div class="flex items-center gap-3">
              <span><kbd class="rounded bg-white px-1 py-0.5 border border-slate-200 shadow-2xs">↑↓</kbd> navigasi</span>
              <span><kbd class="rounded bg-white px-1 py-0.5 border border-slate-200 shadow-2xs">↵</kbd> pilih</span>
            </div>
            <span>Aliezzar Systems Command Bar</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import projectData from "../data/ProjectData.json";
import certificateData from "../data/CertificateData.json";
import notesData from "../data/NotesData.json";

const emit = defineEmits(["navigate", "close", "open"]);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const query = ref("");
const selectedIndex = ref(0);
const inputRef = ref(null);

const baseCommands = [
  {
    id: "action-resume",
    category: "Aksi",
    title: "Download Resume [PDF]",
    hint: "1-Page CV",
    action: () => {
      const a = document.createElement("a");
      a.href = "/resume.pdf";
      a.download = "Aliezzar_Wijaya_Resume.pdf";
      a.click();
    },
  },
  {
    id: "action-email",
    category: "Aksi",
    title: "Salin Email (aliezzar42@gmail.com)",
    hint: "Copy to Clipboard",
    action: async () => {
      await navigator.clipboard.writeText("aliezzar42@gmail.com");
      alert("Email berhasil disalin ke clipboard: aliezzar42@gmail.com");
    },
  },
  {
    id: "nav-home",
    category: "Navigasi",
    title: "Halaman Utama (Home)",
    hint: "Lompat ke Beranda",
    action: () => emit("navigate", "/"),
  },
  {
    id: "nav-projects",
    category: "Navigasi",
    title: "Portofolio & Sertifikat",
    hint: "Lompat ke Showcase",
    action: () => emit("navigate", "projects"),
  },
  {
    id: "nav-about",
    category: "Navigasi",
    title: "Tentang Aliezzar",
    hint: "Lompat ke Bio & Stack",
    action: () => emit("navigate", "about-me"),
  },
  {
    id: "nav-contact",
    category: "Navigasi",
    title: "Hubungi / Kontak",
    hint: "Lompat ke Kontak",
    action: () => emit("navigate", "contact-me"),
  },
];

const dynamicCommands = computed(() => {
  const list = [...baseCommands];

  const projects = Array.isArray(projectData) ? projectData : projectData?.projects || [];
  projects.forEach((p) => {
    list.push({
      id: `proj-${p.id || p.name}`,
      category: "Proyek",
      title: p.title || p.name,
      hint: (p.topics || []).slice(0, 2).join(", ") || "GitHub",
      action: () => {
        if (p.url || p.link) {
          window.open(p.url || p.link, "_blank");
        } else {
          emit("navigate", "projects");
        }
      },
    });
  });

  const certs = Array.isArray(certificateData) ? certificateData : certificateData?.certificates || [];
  certs.forEach((c) => {
    list.push({
      id: `cert-${c.id || c.title}`,
      category: "Sertifikat",
      title: c.title,
      hint: c.issuer || "Credential",
      action: () => {
        if (c.credentialUrl || c.webViewLink) {
          window.open(c.credentialUrl || c.webViewLink, "_blank");
        } else {
          emit("navigate", "projects");
        }
      },
    });
  });

  const notes = Array.isArray(notesData) ? notesData : notesData?.notes || [];
  notes.forEach((n) => {
    list.push({
      id: `note-${n.id || n.title}`,
      category: "Catatan",
      title: n.title,
      hint: n.excerpt ? n.excerpt.slice(0, 25) + "..." : "Notion",
      action: () => {
        if (n.url) {
          window.open(n.url, "_blank");
        } else {
          emit("navigate", "/");
        }
      },
    });
  });

  return list;
});

const filteredCommands = computed(() => {
  const q = query.value.toLowerCase().trim();
  if (!q) return dynamicCommands.value.slice(0, 15);
  return dynamicCommands.value
    .filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.hint.toLowerCase().includes(q)
    )
    .slice(0, 15);
});

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      query.value = "";
      selectedIndex.value = 0;
      nextTick(() => inputRef.value?.focus());
    }
  }
);

watch(filteredCommands, () => {
  selectedIndex.value = 0;
});

const close = () => {
  emit("close");
};

const navigateResults = (dir) => {
  const len = filteredCommands.value.length;
  if (len === 0) return;
  selectedIndex.value = (selectedIndex.value + dir + len) % len;
};

const executeActive = () => {
  const item = filteredCommands.value[selectedIndex.value];
  if (item) executeItem(item);
};

const executeItem = (item) => {
  item.action();
  close();
};

const handleGlobalKeydown = (e) => {
  // Cmd+K or Ctrl+K toggle
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (props.isOpen) {
      close();
    } else {
      emit("open");
    }
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
});
</script>

<style scoped>
.palette-fade-enter-active,
.palette-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.palette-fade-enter-from,
.palette-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
