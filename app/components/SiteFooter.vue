<template>
  <footer class="mt-10 border-t border-white/5 bg-[#1f1f1f] text-gray-500">
    <div class="mx-auto container px-4">
      <div class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <nav class="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-400" aria-label="页脚导航">
          <NuxtLink to="/tool" class="transition-colors hover:text-white">在线工具</NuxtLink>
          <NuxtLink to="/read" class="transition-colors hover:text-white">技术文章</NuxtLink>
          <NuxtLink to="/project" class="transition-colors hover:text-white">项目推荐</NuxtLink>
          <NuxtLink to="/download" class="transition-colors hover:text-white">资源下载</NuxtLink>
          <NuxtLink to="/discover?tab=nav" class="transition-colors hover:text-white">网址导航</NuxtLink>
          <NuxtLink to="/discover?tab=links" class="transition-colors hover:text-white">友情链接</NuxtLink>
        </nav>

        <p class="hidden items-center gap-1.5 text-xs text-gray-500 sm:flex">
          来不及找到心仪的内容？按
          <kbd class="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-sans text-white">Ctrl</kbd>
          <span class="text-gray-600">+</span>
          <kbd class="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-sans text-white">D</kbd>
          收藏本站
        </p>
      </div>

      <div class="flex flex-col gap-2 border-t border-white/10 py-4 text-[11px] text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>© {{ year }} ZNGG在线工具</span>
          <span class="text-gray-700" aria-hidden="true">|</span>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer"
            class="transition-colors hover:text-gray-300">豫ICP备17050064号-4</a>
        </div>
        <button type="button" class="self-start text-[11px] text-gray-500 transition-colors hover:text-gray-300 sm:self-auto"
          @click="scrollToTop">
          回到顶部 ↑
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()

function scrollToTop() {
  if (typeof window === 'undefined') return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
}
</script>
