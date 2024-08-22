<script lang="ts" setup>
import UiDropdown from '@ui/UiDropdown.vue'
import FunnelIcon from '@icons/FunnelIcon.vue'
import type { User } from '@/stores/useDataStore'
import { computed } from 'vue'
type Sort = 'firstName' | 'lastName' | 'dueDate' | 'lastSeen' | 'all'
const props = withDefaults(
  defineProps<{
    sort?: Sort
    filter?: User['userInfo']['status'] | 'all'
  }>(),
  {
    sort: 'all',
    filter: 'all'
  }
)

const emits = defineEmits<{
  (e: 'changeSort', by?: Sort): void
  (e: 'changeFilter', status?: User['userInfo']['status'] | 'all'): void
}>()

const sortValue = computed({
  get() {
    return { ...props }
  },
  set(val) {
    console.log(val)
    if (props.sort !== val.sort) emits('changeSort', val.sort)

    if (props.filter !== val.filter) emits('changeFilter', val.filter)
  }
})
</script>
<template>
  <UiDropdown position="bs" class="text-sm">
    <template #trigger>
      <span class="flex gap-2 items-center">
        <FunnelIcon class="size-4 aspect-square" /> FIlter
      </span>
    </template>

    <div class="p-2 rounded bg-white shadow *:grid">
      <div class="*:p-1 *:px-2 pb-2 *:rounded border-b items-start justify-between">
        <span class="font-light w-full block">SORT BY</span>
        <label class="item"
          >Default <input type="radio" name="sort" value="all" v-model="sortValue.sort"
        /></label>
        <label class="item"
          >First Name <input type="radio" name="sort" value="firstName" v-model="sortValue.sort"
        /></label>
        <label class="item"
          >Last Name <input type="radio" name="sort" value="lastName" v-model="sortValue.sort"
        /></label>
        <label class="item"
          >Due Date <input type="radio" name="sort" value="dueDate" v-model="sortValue.sort"
        /></label>
        <label class="item"
          >Last Seen <input type="radio" name="sort" value="lastSeen" v-model="sortValue.sort"
        /></label>
      </div>
      <div class="*:p-1 *:px-2 *:rounded items-start justify-between">
        <span class="font-light w-full block">SORT BY</span>
        <label class="item"
          >All <input type="radio" name="filter" value="all" v-model="sortValue.filter"
        /></label>
        <label class="item"
          >Active <input type="radio" name="filter" value="active" v-model="sortValue.filter"
        /></label>
        <label class="item"
          >Inactive <input type="radio" name="filter" value="inactive" v-model="sortValue.filter"
        /></label>
      </div>
    </div>
  </UiDropdown>
</template>

<style scoped>
.item {
  @apply hover:bg-neutral flex items-center justify-between min-w-[10rem];

  & > input {
    @apply text-primary size-4;

    accent-color: currentColor;
  }
}
</style>
