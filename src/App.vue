<template>
  <Layout
    :current-page="activePage"
    @navigate="activePage = $event"
    @open-palette="isPaletteOpen = true"
  >
    <Transition name="fade-page" mode="out-in">
      <component
        :is="currentPageComponent"
        :key="activePage"
        @navigate="activePage = $event"
      />
    </Transition>
  </Layout>

  <!-- Global Command Palette Modal (Cmd+K) -->
  <CommandPalette
    :is-open="isPaletteOpen"
    @open="isPaletteOpen = true"
    @close="isPaletteOpen = false"
    @navigate="activePage = $event"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import Layout from "./components/Layout.vue";
import CommandPalette from "./components/CommandPalette.vue";
import Home from "./pages/Home.vue";
import AboutMe from "./pages/AboutMe.vue";
import Projects from "./pages/Projects.vue";
import ContactMe from "./pages/ContactMe.vue";

const activePage = ref("/");
const isPaletteOpen = ref(false);

const pagesMap = {
  "/": Home,
  "about-me": AboutMe,
  projects: Projects,
  "contact-me": ContactMe,
};

const currentPageComponent = computed(() => pagesMap[activePage.value] || Home);
</script>

<style>
.fade-page-enter-active,
.fade-page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
