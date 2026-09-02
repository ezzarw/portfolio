<template>
  <div class="space-y-8">
    <header class="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <p class="font-mono text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
        Direct Contact
      </p>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        Kontak &amp; Diskusi
      </h1>
      <p class="mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
        Terbuka untuk diskusi proyek, konsultasi infrastruktur, kolaborasi CTF, atau peluang kerja.
      </p>
    </header>

    <div class="grid gap-6 sm:grid-cols-[0.8fr_1.2fr]">
      <!-- Quick channels -->
      <aside class="space-y-3">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 font-mono">
            Kanal Langsung
          </h2>
          <div class="space-y-2">
            <template v-for="linkKey in siteConfig.contactLinkKeys" :key="linkKey">
              <a
                v-if="getSiteLink(linkKey)"
                :href="getSiteLink(linkKey).href"
                target="_blank"
                rel="noreferrer"
                class="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 transition-colors"
              >
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-700">
                  <DynamicIcon :name="getSiteLink(linkKey).icon" class="text-sm" />
                </span>
                <div class="min-w-0">
                  <p class="text-[11px] font-bold text-slate-500 font-mono">{{ getSiteLink(linkKey).label }}</p>
                  <p class="text-xs font-semibold text-slate-900 truncate">{{ getSiteLink(linkKey).value }}</p>
                </div>
              </a>
            </template>
          </div>
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-xs text-slate-600">
          <p>Waktu respons umum: 1-2 hari kerja.</p>
        </div>
      </aside>

      <!-- Message Form -->
      <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
          Kirim Pesan
        </h2>

        <form @submit.prevent="sendEmail" class="space-y-4">
          <div>
            <label for="form_name" class="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama
            </label>
            <input
              id="form_name"
              type="text"
              required
              v-model="formData.form_name"
              placeholder="Nama kamu"
              class="clean-input"
            />
          </div>

          <div>
            <label for="email" class="block text-xs font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              v-model="formData.email"
              placeholder="email@example.com"
              class="clean-input"
            />
          </div>

          <div>
            <label for="message" class="block text-xs font-semibold text-slate-700 mb-1.5">
              Pesan
            </label>
            <textarea
              id="message"
              rows="4"
              required
              v-model="formData.message"
              placeholder="Ceritakan tentang proyek atau ide yang ingin didiskusikan..."
              class="clean-input resize-y"
            />
          </div>

          <div v-if="status === 'success'" class="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            Pesan kamu berhasil dikirim! Saya akan segera merespons.
          </div>

          <div v-if="status === 'error'" class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
            Gagal mengirim pesan. Silakan coba lagi atau kirim via email langsung.
          </div>

          <button
            type="submit"
            :disabled="status === 'loading'"
            class="clean-button clean-button-primary w-full text-xs"
          >
            {{ status === 'loading' ? "Mengirim..." : "Kirim Pesan" }}
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import emailjs from "@emailjs/browser";
import DynamicIcon from "../components/DynamicIcon.vue";
import { getSiteLink, siteConfig } from "../data/SiteConfig";

const status = ref("idle");
const formData = ref({ form_name: "", email: "", message: "" });

const sendEmail = async () => {
  status.value = "loading";

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAIL_SERVICE || process.env.REACT_APP_EMAIL_SERVICE,
      import.meta.env.VITE_EMAIL_TEMPLATE || process.env.REACT_APP_EMAIL_TEMPLATE,
      {
        from_name: formData.value.form_name,
        message: formData.value.message,
        email: formData.value.email,
      },
      import.meta.env.VITE_EMAIL_JS_USER_ID || process.env.REACT_APP_EMAIL_JS_USER_ID
    );
    status.value = "success";
    formData.value = { form_name: "", email: "", message: "" };
  } catch (error) {
    status.value = "error";
  }
};
</script>
