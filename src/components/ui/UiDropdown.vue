<script lang="ts" setup>
import { ref } from 'vue'
import { onClickOutside } from "@vueuse/core";

type Props = {
  position?: 't' | 'b' | 'l' | 'r' | 'tl' | 'tr' | 'bl' | 'br' | 'be' | 'bs' | 'te' | 'ts'
}
const props = withDefaults(defineProps<Props>(), { position: 'b' })

const show = ref(false)
// @ts-ignore
const target = ref<HTMLDivElement>()
const button = ref<HTMLButtonElement>()



onClickOutside(target, (e) => {
  show.value = false;
});

const positionClass = {
  b: '-bottom-2 left-0 translate-y-[100%] -translate-x-[50%]',
  l: '-left-2 top-0 -translate-x-[100%] -translate-y-[50%]',
  r: '-right-2 top-0 translate-x-[100%] -translate-y-[50%]',
  t: '-top-2 left-0 translate-y-[-100%] -translate-x-[50%]',
  tl: '-top-2 -left-2 -translate-y-[100%] -translate-x-[100%]',
  tr: '-top-2 -right-2 translate-y-[-100%] -translate-x-[-100%]',
  bl: '-bottom-2 -left-2 translate-y-[100%] -translate-x-[100%]',
  br: '-bottom-2 -right-2 translate-y-[100%] translate-x-[100%]',
  ts: '-top-2 left-0 -translate-y-[100%]',
  te: '-top-2 right-0 -translate-y-[100%]',
  bs: '-bottom-2 left-0 translate-y-[100%]',
  be: '-bottom-2 right-0 translate-y-[100%]'
}
</script>
<template>
  <div class="drop-wrapper" ref="target" @click="show = false">
    <button
      type="button"
      class="toggle my-0"
      aria-expanded="false"
      @click.stop="
        () => {
          show = !show
        }
      "
      ref="button"
    >
      <slot name="trigger"></slot>
    </button>

    <Transition name="fade">
      <div v-if="show" @click="show = false" class="absolute inset-0">
        <menu class="drops-container" :class="positionClass[position] ?? ''">
          <slot></slot>
        </menu>
      </div>
    </Transition>
  </div>
</template>
<style>
.drop-wrapper {
  @apply relative flex w-min flex-col;

  .toggle {
    @apply flex h-full max-w-fit items-center gap-x-1 leading-6;
  }

  .drops-container {
    @apply absolute z-[calc(999_*_999)] min-w-fit;

    .drops {
      @apply absolute grid max-h-[15rem] w-fit gap-1 overflow-clip overflow-y-auto rounded-2xl border-slate-700/5 bg-white p-3 shadow-lg;
    }
  }
}
</style>
