<template>
    <li
        class="group -mx-3 rounded-sm border-b border-gray-100 px-3 py-4 transition-colors duration-200 last:border-b-0 hover:bg-gray-50/80 sm:py-5">
        <NuxtLink :to="'/read/post/' + article.id" target="_blank" class="flex gap-4 sm:gap-5">
            <div class="min-w-0 flex-1">
                <h3
                    class="line-clamp-2 text-base font-semibold leading-6 text-gray-800 transition-colors duration-200 group-hover:text-blue-600">
                    {{ article.title }}
                </h3>

                <p v-if="article.summary" class="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
                    {{ article.summary }}
                </p>

                <div class="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-gray-500">
                    <span v-if="categoryName" class="rounded-sm bg-blue-50 px-1.5 py-0.5 text-[11px] text-blue-600">
                        {{ categoryName }}
                    </span>
                    <span v-if="article.user" class="flex items-center gap-1.5">
                        <img v-if="article.user.avatar" :src="article.user.avatar" alt="" loading="lazy"
                            class="h-5 w-5 rounded-full object-cover" />
                        <span v-else
                            class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-[10px] font-medium text-blue-600">
                            {{ (article.user.name || '?').slice(0, 1) }}
                        </span>
                        <span class="text-gray-600">{{ article.user.name }}</span>
                    </span>
                    <template v-if="displayDate">
                        <span v-if="article.user" class="text-gray-300">·</span>
                        <time :datetime="article.updateTime">{{ displayDate }}</time>
                    </template>
                    <span class="text-gray-300">·</span>
                    <span class="flex items-center gap-1">
                        <i class="iconfont icon-browse text-[12px]" aria-hidden="true"></i>
                        <span>{{ article.viewCount ?? 0 }}</span>
                    </span>
                </div>
            </div>

            <div v-if="article.image" class="shrink-0 self-center">
                <div class="h-[72px] w-24 overflow-hidden rounded-sm border border-gray-100 bg-gray-100 sm:h-24 sm:w-36">
                    <img :src="article.image" :alt="article.title" loading="lazy"
                        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
                </div>
            </div>
        </NuxtLink>
    </li>
</template>

<script setup lang="ts">
const props = defineProps<{
    article: Record<string, any>
    categoryName?: string
}>()

const displayDate = computed(() =>
    props.article.updateTime ? String(props.article.updateTime).slice(0, 10) : ''
)
</script>
