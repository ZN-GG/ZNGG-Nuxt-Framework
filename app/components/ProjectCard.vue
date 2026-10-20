<template>
    <NuxtLink :to="'/project/' + project.id" class="group block h-full">
        <div
            class="flex h-full flex-col rounded-md border border-gray-100 bg-white p-4 transition-colors hover:border-blue-200">
            <div class="flex items-start gap-3">
                <img v-if="project.logo" :src="project.logo" :alt="project.name" loading="lazy"
                    class="h-10 w-10 shrink-0 rounded object-cover" />
                <div v-else
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-blue-50 font-bold text-blue-600">
                    {{ (project.name || '?').slice(0, 1) }}
                </div>
                <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">
                        <p class="truncate font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                            {{ project.name }}
                        </p>
                        <span class="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                            {{ platformLabel }}
                        </span>
                    </div>
                    <p v-if="project.category?.name" class="mt-0.5 truncate text-[11px] text-gray-400">
                        {{ project.category.name }}
                    </p>
                </div>
            </div>

            <p class="mt-3 line-clamp-2 min-h-[3rem] text-sm leading-6 text-gray-500">
                {{ project.summary }}
            </p>

            <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                <span v-if="project.language" class="flex items-center gap-1">
                    <span class="h-2 w-2 rounded-full bg-blue-500"></span>{{ project.language }}
                </span>
                <span v-if="project.stars" class="flex items-center gap-1">
                    <svg class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6L3.2 9.4l6.1-.9L12 3Z" />
                    </svg>
                    {{ project.stars }}
                </span>
                <span v-if="project.forks">Fork {{ project.forks }}</span>
                <span v-if="project.license">{{ project.license }}</span>
            </div>

            <div v-if="tags.length" class="mt-3 flex flex-wrap gap-1.5">
                <span v-for="tag in tags" :key="tag"
                    class="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">{{ tag }}</span>
            </div>
        </div>
    </NuxtLink>
</template>
<script setup lang="ts">
import { splitTags } from '~/utils/tags'

const props = defineProps<{
    project: Record<string, any>
}>()

const platformLabel = computed(() => {
    const map: Record<string, string> = {
        GITHUB: 'GitHub',
        GITEE: 'Gitee',
        OTHER: '其他',
    }
    return map[props.project.platform] ?? props.project.platform ?? ''
})

const tags = computed(() => splitTags(props.project.tags))
</script>
