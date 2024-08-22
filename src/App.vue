<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserDataStore, type User, type UserInventory } from '@stores/useDataStore'
import type { Tab } from '@/types'
import UiTabs from '@ui/UiTabs.vue'
import UserRow from '@components/UserRow.vue'
import Filter from '@components/Filter.vue'
import SearchIcon from '@icons/SearchIcon.vue'
import Pagination from '@components/Pagination.vue'

const tabs: Tab[] = [
  { name: 'all', label: 'All' },
  { name: 'paid', label: 'Paid' },
  { name: 'unpaid', label: 'Unpaid' },
  { name: 'overdue', label: 'Overdue' }
]

const route = computed(() => useRoute())
const router = useRouter()
const tab = computed(() => route.value.query?.tab?.toString())
const page = computed(() => route.value.query?.page?.toString())

const table = ref<HTMLDivElement>()

const active_tab = ref<string | undefined>(tab.value ?? tabs[0].name)
const active_page = ref<string | number | undefined>(page.value ?? 1)
const {
  filterUsers,
  filterUsersByStatus,
  searchUser,
  sortUsersByDate,
  sortUsersByName,
  all_users,
  makePaid
} = useUserDataStore()
const users = computed(() => useUserDataStore().users)
const filter = computed(() => useUserDataStore().filter)

const selected_users = ref<User['userId'][]>([])
const all_users_selected = ref(false)

const changeTab = (t?: string) => {
  const f = t as UserInventory['paymentStatus'] | 'all' | undefined
  active_tab.value = f
  router.push({ ...route.value, query: { ...route.value.query, tab: t } })
  filterUsers(f)
  reset()
}
const changepage = (p?: string | number) => {
  active_page.value = p
  router.push({ ...route.value, query: { ...route.value.query, page: p } })
  reset()
}

const reset = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
  table.value?.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}

const selectUser = (userId?: string) => {
  if (!userId) return
  const exists = selected_users.value.includes(userId)
  selected_users.value = exists
    ? selected_users.value.filter((u) => u !== userId)
    : [...selected_users.value, userId]
  all_users_selected.value = all_users_selected.value ? false : all_users_selected.value
}
const selectAllUser = () => {
  selected_users.value = !all_users_selected.value ? users.value.map(({ userId }) => userId) : []
  all_users_selected.value = !all_users_selected.value
}
const total_payable = computed(() => {
  let inventory: UserInventory[] = []
  all_users.forEach((user) => {
    inventory = [...inventory, ...user.inventory]
  })
  return inventory
    .map(({ price, paymentStatus }) => (paymentStatus !== 'paid' ? price : 0))
    .reduce((a, b) => a + b)
})

const search = ref<string>()
watch(search, (current, old) => {
  searchUser(current ?? '')
})
</script>

<template>
  <div class="layout">
    <header>
      <h1 class="font-semibold text-lg uppercase">Table Heading</h1>
      <div
        class="flex flex-wrap-reverse gap-2 gap-x-5 justify-between text-sm items-center border-b border-[var(--_primary-light)]"
      >
        <UiTabs :tabs="tabs" :active_tab="active_tab" @change="changeTab" />
        <div>
          Total payable amount:
          <span class="text-lg font-light"
            ><span class="text-primary font-semibold">{{
              new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(
                total_payable
              )
            }}</span>
            USD</span
          >
        </div>
      </div>
    </header>
    <main>
      <!-- head & search -->
      <div class="flex gap-2 gap-x-5 flex-wrap p-3 items-center z-20 sticky top-0">
        <Filter
          class="border rounded p-1.5 px-3 h-full"
          :filter="filter.status"
          @changeSort="
            (e) =>
              e && e !== 'all'
                ? e === 'firstName' || e === 'lastName'
                  ? sortUsersByName(e)
                  : sortUsersByDate(e)
                : filterUsers(filter.payment)
          "
          @changeFilter="filterUsersByStatus"
        />
        <div class="grow">
          <div class="flex max-w-[30rem] rounded-lg gap-2 p-2 px-3 items-center bg-neutral">
            <SearchIcon class="min-w-5 aspect-square" />
            <input
              type="text"
              v-model="search"
              placeholder="Search Users by Name, Email or Date"
              class="bg-transparent w-0 border-none outline-none grow placeholder:text-primary-light placeholder:text-sm"
            />
          </div>
        </div>
        <button
          class="btn bg-primary p-2 px-3 uppercase text-white"
          @click="
            () => {
              selected_users.forEach((userId) => makePaid(userId))
              all_users_selected = false
              selected_users = []
            }
          "
        >
          Pay Dues
        </button>
      </div>
      <!-- heading -->
      <div class="border overflow-x-auto data-table" ref="table">
        <UserRow
          heading
          class="bg-neutral font-semibold sticky"
          @select="selectAllUser"
          :selected="all_users_selected"
        />
        <UserRow
          v-for="(user, idx) in users"
          :key="user.userId"
          :selected="selected_users.includes(user.userId)"
          @select="selectUser"
          :user="user"
          class="hover:bg-neutral"
        />
      </div>
      <div class="p-3 bg-neutral">
        <Pagination :totalIitems="127" />
      </div>
    </main>
    <footer></footer>
  </div>
</template>

<style scoped>
.layout {
  @apply grid content-start text-pretty;
  --_padding: 0.25rem;
  --_offset: minmax(var(--_padding), 1fr);
  --_repeats: 12;
  --_repeat-percent: 8%;
  --_width: calc(
    min(var(--_repeat-percent, 8%), calc(1280px / var(--_repeats, 12))) -
      (var(--_padding) / var(--_repeats, 12))
  );

  @apply bg-neutral;

  grid-template-columns:
    [full-start] var(--_offset) [bleed-start] 1fr [content-start] repeat(
      var(--_repeats, 12),
      var(--_width, var(--_repeat-percent, 8%))
    )
    [content-end] 1fr [bleed-end] var(--_offset) [full-end];

  grid-template-rows:
    [layout-start header-start] auto
    [header-end page-start] 1fr
    [page-end footer-start] auto
    [footer-end layout-end];

  main {
    grid-row: page;
    @apply bg-white rounded-lg shadow ring-[var(--_primary-light)] overflow-clip w-[99%] mx-auto;
  }
  header {
    grid-row: header;
    grid-column: full;
    @apply bg-inherit gap-2 my-5 pt-5 sticky top-0 grid grid-cols-subgrid z-50;
    & > * {
      grid-column: content;
    }
  }
  footer {
    grid-row: footer;
    @apply grid gap-2 my-5;
  }

  & > * {
    grid-column: content;
  }

  @media (width > 700px) {
    --_padding: 2rem;
  }
}

.data-table {
  @apply grid;
  grid-template-columns:
    [row-start checbox-start] auto
    [checkbox-end name-start] minmax(15rem, 1fr)
    [name-end status-start] minmax(10rem, 1fr)
    [status-end payment-start] minmax(10rem, 1fr)
    [payment-end amount-start] minmax(5rem, 100px)
    [amount-end more-start] auto
    [more-end row-end];

  & > * {
    grid-column: row;
  }
}
</style>
