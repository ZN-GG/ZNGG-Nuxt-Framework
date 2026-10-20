<template>
    <li class="h-full">
        <NuxtLink :to="'/download/' + item.id"
            class="group flex h-full flex-col overflow-hidden rounded-md border border-gray-100 bg-white transition-colors hover:border-blue-200">
            <div class="relative block aspect-[16/9] overflow-hidden bg-gray-100">
                <img v-if="item.cover" :src="item.cover" :alt="item.title" loading="lazy"
                    class="h-full w-full object-cover object-top" />
                <div v-else class="flex h-full w-full items-center justify-center text-gray-300">
                    <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                        aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                    </svg>
                </div>

                <span class="absolute left-2 top-2 rounded-sm px-1.5 py-0.5 text-[10px] font-medium text-white"
                    :class="item.type === 'SOFTWARE' ? 'bg-blue-600' : 'bg-emerald-600'">
                    {{ item.type === 'SOFTWARE' ? '软件' : '资源' }}
                </span>
                <span v-if="item.version"
                    class="absolute right-2 top-2 rounded-sm bg-gray-900/70 px-1.5 py-0.5 text-[10px] text-white">
                    v{{ item.version }}
                </span>
            </div>

            <div class="flex flex-1 flex-col p-3">
                <p class="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span class="line-clamp-1">{{ categoryLabel }}</span>
                </p>

                <h3 class="mt-1 line-clamp-1 text-[15px] font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                    {{ item.title }}
                </h3>
                <p class="mt-1 line-clamp-2 min-h-[2.5rem] text-[13px] leading-5 text-gray-500">{{ item.summary }}</p>

                <div class="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-gray-100 pt-2 text-[11px] text-gray-400">
                    <span class="flex items-center gap-1">
                        <i class="iconfont icon-browse text-[12px]" aria-hidden="true"></i>
                        {{ item.downloadCount ?? 0 }}
                    </span>
                    <span v-if="sizeLabel">{{ sizeLabel }}</span>
                    <time v-if="displayDate" :datetime="item.updateTime">{{ displayDate }}</time>
                </div>
            </div>
        </NuxtLink>
    </li>
</template>
<script setup lang="ts">
const props = defineProps<{
    item: Record<string, any>
}>()

const displayDate = computed(() =>
    props.item.updateTime ? String(props.item.updateTime).slice(0, 10) : ''
)

const sizeLabel = computed(() => formatSize(Number(props.item.fileSize)))

const categoryLabel = computed(() =>
    props.item.category?.name
    || props.item.categoryName
    || (props.item.type === 'SOFTWARE' ? '软件' : '资源')
)

function formatSize(bytes: number) {
    if (!bytes || Number.isNaN(bytes)) return ''
    const units = ['B', 'KB', 'MB', 'GB']
    let index = 0
    let value = bytes
    while (value >= 1024 && index < units.length - 1) {
        value = value / 1024
        index++
    }
    return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}
</script>
