<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  total_pages:number
  active_page?:  string|number
}>()
const emits = defineEmits<{
  (e: 'change', page: string|number): void
}>()

const active = computed(
  () => props.active_page?? 1
)
</script>
<template>
  <div class="pagination">
    <button
      type="button"
      class="p-3 text-sm"
      v-for="page in total_pages"
      :key="page"
      @click="emits('change', page)"
      :class="{ active: page === active }"
    >
      {{ label }}
    </button>
  </div>
</template>

<style scoped>
div {
  display: flex;
  align-items: baseline;
}
</style>