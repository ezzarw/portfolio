<template>
  <button
    v-if="cta.type === 'page'"
    type="button"
    @click="$emit('navigate', cta.target)"
    :class="[
      'clean-button text-xs',
      cta.variant === 'primary' ? 'clean-button-primary' : ''
    ]"
  >
    <span>{{ cta.label }}</span>
    <span v-if="cta.arrow" aria-hidden="true">→</span>
  </button>

  <a
    v-else-if="cta.type === 'link' && (cta.href || getSiteLink(cta.linkKey))"
    :href="cta.href || getSiteLink(cta.linkKey).href"
    :target="cta.href && cta.href.startsWith('/') ? undefined : '_blank'"
    :download="cta.download || undefined"
    rel="noreferrer"
    :class="[
      'clean-button text-xs',
      cta.variant === 'primary' ? 'clean-button-primary' : ''
    ]"
  >
    <DynamicIcon
      v-if="cta.linkKey && getSiteLink(cta.linkKey) && getSiteLink(cta.linkKey).icon"
      :name="getSiteLink(cta.linkKey).icon"
      class="text-sm"
    />
    <span>{{ cta.label || getSiteLink(cta.linkKey).label }}</span>
    <span v-if="cta.arrow" aria-hidden="true">↗</span>
  </a>
</template>

<script setup>
import DynamicIcon from "./DynamicIcon.vue";
import { getSiteLink } from "../data/SiteConfig";

defineProps({
  cta: {
    type: Object,
    required: true,
  },
});

defineEmits(["navigate"]);
</script>
