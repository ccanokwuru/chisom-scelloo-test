<script setup lang="ts">
import type { Tab } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  tabs: Tab[]
  active_tab?: string
}>()
const emits = defineEmits<{
  (e: 'change', tab: string): void
}>()

const active = computed(
  () => props.active_tab ?? props.tabs[0].name
)
</script>

<template>
  <div class="tabs">
    <button
      type="button"
      class="tab p-3 text-sm"
      v-for="({ name, to, label }, idx) in tabs"
      :key="idx"
      @click="emits('change', name)"
      :class="{ active: name === active }"
    >
      {{ label }}
      <RouterLink v-if="to" class="absolute inset-0" :to="to" />
    </button>
  </div>
</template>
<style scoped>
div {
  display: flex;
  align-items: baseline;
}
</style>
