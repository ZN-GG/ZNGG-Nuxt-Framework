<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="!online"
      class="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-warning/30 bg-surface px-4 py-2 text-xs text-ink shadow-pop lg:bottom-6"
      role="status"
      aria-live="polite"
    >
      <span class="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
      网络不可用，已显示缓存内容
    </div>
  </Transition>
</template>
<script setup lang="ts">
const online = useOnline()
</script>
