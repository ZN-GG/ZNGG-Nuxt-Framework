<template>
    <li
        class="group -mx-3 flex gap-4 rounded-lg border-b border-gray-100 px-3 py-4 transition-colors duration-200 last:border-b-0 hover:bg-gray-50/80 sm:gap-5 sm:py-5">
        <div class="min-w-0 flex-1">
            <NuxtLink :to="'/read/post/' + article.id" target="_blank" class="block">
                <h3
                    class="line-clamp-2 text-[17px] font-semibold leading-7 text-gray-800 transition-colors duration-200 group-hover:text-blue-600">
                    {{ article.title }}
                </h3>
            </NuxtLink>

            <p v-if="article.summary" class="mt-1.5 line-clamp-2 text-sm leading-6 text-gray-500">
                {{ article.summary }}
            </p>

            <div class="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-gray-400">
                <span v-if="article.user" class="flex items-center gap-1.5">
                    <img v-if="article.user.avatar" :src="article.user.avatar" alt="" loading="lazy"
                        class="h-5 w-5 rounded-full object-cover" />
                    <span class="text-gray-500">{{ article.user.name }}</span>
                </span>
                <template v-if="displayDate">
                    <span v-if="article.user" class="text-gray-300">·</span>
                    <time :datetime="article.updateTime">{{ displayDate }}</time>
                </template>
                <span class="text-gray-300">·</span>
                <span class="flex items-center gap-1">
                    <i class="iconfont icon-browse text-[13px]" aria-hidden="true"></i>
                    <span>{{ article.viewCount ?? 0 }}</span>
                </span>
            </div>
        </div>

        <div v-if="article.image" class="shrink-0 self-center">
            <div class="h-[72px] w-24 overflow-hidden rounded-lg bg-gray-100 sm:h-24 sm:w-36">
                <img :src="article.image" :alt="article.title" loading="lazy"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
const props = defineProps<{
    article: Record<string, any>
}>()

const displayDate = computed(() =>
    props.article.updateTime ? String(props.article.updateTime).slice(0, 10) : ''
)
</script>
