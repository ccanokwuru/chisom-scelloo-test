<script setup lang="ts">
import type { UserActivity } from '@stores/useDataStore'
import InfoIcon from '@icons/InfoIcon.vue'

const props = defineProps<{ activities: UserActivity[] }>()
</script>
<template>
  <div class="sub-user-row">
    <div class="activities">
      <!-- heading -->
      <div class="heading">
        <div>Date</div>
        <div>User Activity</div>
        <div>
          <div class="flex w-full gap-2 items-center">Detail <InfoIcon class="size-3" /></div>
        </div>
      </div>
      <!-- data -->
      <div class="data" v-for="({ description, type, timestamp }, idx) in activities" :key="idx">
        <div>
          {{
            new Intl.DateTimeFormat('en', {
              month: 'short',
              year: 'numeric',
              day: '2-digit'
            }).format(new Date(timestamp))
          }}
        </div>
        <div>{{ type }}</div>
        <div>{{ description }}</div>
      </div>

      <div class="data" v-if="!activities.length">
        <div class="col-span-3 p-5 uppercase text-center">No Record Found</div>
      </div>
    </div>
  </div>
</template>
<style>
.activities {
  @apply grid;
  grid-template-columns: minmax(5rem, auto) 15rem minmax(20rem, 1fr);
  & > * {
    @apply grid grid-cols-subgrid col-span-3 border-b;
    &.heading {
      @apply uppercase col-span-3;
      & > * {
        @apply font-medium p-2;
      }
    }
  }
}
</style>
