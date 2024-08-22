<script setup lang="ts">
import { computed, ref } from 'vue'
import type { User } from '@stores/useDataStore'
import MoreIcon from '@icons/MoreIcon.vue'
import UiDropdown from '@ui/UiDropdown.vue'
import CircleDownIcon from '@icons/CircleDownIcon.vue'
import SubUserRow from '@components/SubUserRow.vue'

type RowData = { user?: User; heading?: boolean; selected?: boolean }
const props = defineProps<RowData>()

const emits = defineEmits<{
  (e: 'select', userId?: string): void
}>()
const show = ref(false)
const recentInv = computed(
  () =>
    props.user?.inventory.sort((a, b) => {
      if (!a || !a.dueDate) return 1
      if (!b || !b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })[0]
)
</script>
<template>
  <div class="user-row">
    <div class="row border-b" :class="{ selected: selected }">
      <div>
        <div class="flex gap-2 items-center">
          <input
            type="checkbox"
            name=""
            id=""
            class="size-4"
            @change="emits('select', user?.userId)"
            :checked="selected"
            :class="{ '!text-primary': selected }"
          />
          <CircleDownIcon
            class="transition-all duration-300 cursor-pointer"
            :class="{ 'rotate-180': show }"
            v-if="!heading"
            @click="show = !show"
          />
        </div>
      </div>
      <div v-if="heading" class="data uppercase">
        <div>Name</div>
        <div>uSER Status</div>
        <div>pAYMENT Status</div>
        <div>Amount</div>
      </div>
      <div v-else class="data whitespace-pre-wrap text-pretty">
        <div class="">
          <div class="capitalize">
            {{ user?.userInfo.name.first ?? '' }} {{ user?.userInfo.name.middle ?? '' }}
            {{ user?.userInfo.name.last ?? '' }}
          </div>
          <div>{{ user?.userInfo.email }}</div>
        </div>
        <div class="text-sm">
          <small
            class="rounded-full px-2 gap-1 capitalize flex items-center w-fit"
            :class="{
              'text-info bg-info-neutral *:bg-info': user?.userInfo.status === 'active',
              'text-primary-dark bg-neutral *:bg-primary-dark': user?.userInfo.status === 'inactive'
            }"
          >
            <span class="size-1 rounded-full"></span>
            {{ user?.userInfo.status }}
          </small>
          <small v-if="user?.lastSeen">
            Last login:
            {{
              new Intl.DateTimeFormat('en', {
                month: 'short',
                year: 'numeric',
                day: '2-digit'
              }).format(new Date(user.lastSeen))
            }}
          </small>
        </div>
        <div>
          <small
            class="rounded-full px-2 gap-1 capitalize flex items-center w-fit"
            :class="{
              'text-positive bg-positive-neutral *:bg-positive':
                recentInv?.paymentStatus === 'paid',
              'text-negative bg-negative-neutral *:bg-negative':
                recentInv?.paymentStatus === 'overdue',
              'text-warning bg-warning-neutral *:bg-warning-1':
                recentInv?.paymentStatus === 'unpaid'
            }"
          >
            <span class="size-1 rounded-full"></span>
            {{
              recentInv?.paymentStatus === 'paid'
                ? 'paid'
                : recentInv?.paymentStatus === 'unpaid'
                  ? 'unpaid'
                  : 'overdue'
            }}
          </small>
          <small v-if="user?.lastSeen">
            {{
              recentInv?.paymentStatus === 'paid'
                ? 'Paid on'
                : recentInv?.paymentStatus === 'unpaid'
                  ? 'Dues on'
                  : 'Dued on'
            }}
            <span v-if="recentInv?.dueDate">
              {{
                new Intl.DateTimeFormat('en', {
                  month: 'short',
                  year: 'numeric',
                  day: '2-digit'
                }).format(new Date(recentInv.dueDate))
              }}
            </span>
          </small>
        </div>
        <div class="text-right">
          <span> {{ recentInv?.currencySymbol ?? '' }} {{ recentInv?.price ?? '' }} </span>
          <small>
            {{ recentInv?.currencyIsoCode ?? '' }}
          </small>
        </div>
      </div>
      <div class="flex justify-end gap-2">
        
        <UiDropdown position="be">
          <template #trigger>          
            <MoreIcon />
          </template>
          <div class="p-20 rounded bg-white shadow"></div>
        </UiDropdown>
      </div>
    </div>

    <Transition name="fade">
      <div class="sub-row" v-if="user && !heading && show">
        <SubUserRow :activities="user.activities" />
      </div>
    </Transition>
  </div>
</template>

<style>
.user-row {
  @apply grid border-b-[1px] text-sm break-all relative transition-all duration-300 grid-cols-subgrid;

  & > * {
    @apply grid grid-cols-subgrid col-span-6 relative;
    &.row {
      &.selected::after {
        @apply absolute w-1 h-full bg-primary;
        inset-inline-start: 0;
        content: '';
      }

      & > * {
        @apply items-start p-2 h-full;
      }
    }
    &.sub-row {
      & > * {
        @apply col-span-6;
        &:first-child {
          @apply col-start-2;
        }
      }
    }
  }

  input {
    @apply cursor-pointer;
    accent-color: currentColor;
  }

  .data {
    @apply grid grid-cols-subgrid col-span-4 !p-0;
    & > * {
      @apply p-2 h-full grid;
    }
  }
}
</style>
