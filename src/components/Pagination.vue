<script lang="ts" setup>
import DropIcon from '@icons/DropIcon.vue'
import UiDropdown from '@ui/UiDropdown.vue'

const props = withDefaults(
  defineProps<{
    totalIitems: number
    perPage?: number
    currentPage?: number
  }>(),
  {
    perPage: 10,
    currentPage: 1
  }
)

const emits = defineEmits<{
  (e: 'changePage', page: number): void
  (e: 'changeCount', page: number): void
}>()

const counts = [5, 10, 25, 50, 100]
const totalPages = Math.ceil(props.totalItems / props.perPage)

</script>
<template>
  <div class="pagination gap-5">
    <UiDropdown position="t">
      <template #trigger>
        <span class="flex gap-2 items-center">
          Rows Per page: {{ perPage }}
          <DropIcon class="size-3" />
        </span>
      </template>

      <div class="!grid bg-white shadow rounded p-2">
        <button
          type="button"
          class="min-w-[5rem] p-2 py-1 text-left hover:bg-neutral rounded block"
          v-for="count in counts"
          :key="count"
          @click="emits('changeCount', count)"
        >
          {{ count }}
        </button>
      </div>
    </UiDropdown>

    <div>
      {{ (currentPage - 1) * perPage + 1 }} -
      {{ currentPage < totalPages ? currentPage * perPage : totalIitems }} of
      {{ totalIitems }}
    </div>

    <div class="flex gap-5 items center justify">
      <button
        type="button"
        class="p-1 rounded ouline none border-none"
        @click="emits('changePage', currentPage > 1 ? currentPage - 1 : 1)"
      >
        &lang;
      </button>
      <button
        type="button"
        class="p-1 rounded ouline none border-none"
        @click="emits('changePage', currentPage < totalPages ? currentPage + 1 : totalPages)"
      >
        &rang;
      </button>
    </div>
  </div>
</template>

<style scoped>
div {
  @apply ms-auto w-fit;
  display: flex;
  align-items: baseline;
}
</style>
