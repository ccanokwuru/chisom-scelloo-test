<script lang="ts" setup>
import UiDropdown from '@ui/UiDropdown.vue'
import FunnelIcon from '@icons/FunnelIcon.vue'
import type { User } from '@/stores/useDataStore'

const emits = defineEmits<{
  (e: 'change', tab: User['userInfo']['status']): void
}>()
</script>
<template>
  <UiDropdown position="bs">
    <template #trigger>
      <span class="flex gap-2 items-center">
        <FunnelIcon class="size-4 aspect-square" /> FIlter
      </span>
    </template>

    <div class="p-20 rounded bg-white shadow"></div>
  </UiDropdown>
</template>
