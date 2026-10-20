<template>
    <div class="mx-auto container px-4 my-8 min-h-screen mt-20">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div class="lg:col-span-9">
                <div class="bg-white p-6 rounded-md">
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-800">开源项目</h1>
                        <p class="mt-1 text-sm text-gray-500">整理值得关注的开源项目，按分类和平台筛选。</p>
                    </div>

                    <div class="mt-4 flex flex-wrap items-center gap-2">
                        <label class="flex h-9 w-full items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 sm:w-80">
                            <Search class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                            <input v-model="keyword" type="search"
                                class="min-w-0 flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                                placeholder="搜索项目名称、语言或简介" aria-label="搜索项目" />
                        </label>
                        <div class="flex flex-wrap items-center gap-y-1">
                            <div class="btn-1" :class="platform === '' ? 'bg-blue-600 text-white' : ''" @click="selectPlatform('')">
                                全部平台
                            </div>
                            <div class="btn-1" :class="platform === item.value ? 'bg-blue-600 text-white' : ''"
                                v-for="item in platforms" :key="item.value" @click="selectPlatform(item.value)">
                                {{ item.label }}
                            </div>
                            <button v-if="hasFilters" type="button" class="btn-1" @click="clearFilters">
                                清除筛选
                            </button>
                        </div>
                    </div>

                    <div class="mt-5 border-t border-gray-100 pt-4">
                        <div class="flex items-center justify-between">
                            <div class="border-l-4 border-blue-600 pl-2">
                                <p class="font-semibold text-base text-gray-800">项目列表</p>
                            </div>
                            <span class="text-xs text-gray-400">{{ filteredProjects.length }} 个</span>
                        </div>

                        <div v-if="pending" class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div v-for="item in 4" :key="item" class="rounded-md border border-gray-100 p-4 animate-pulse">
                                <div class="flex items-center gap-3">
                                    <div class="h-10 w-10 rounded bg-gray-100"></div>
                                    <div class="flex-1">
                                        <div class="h-4 w-6/12 rounded bg-gray-100"></div>
                                        <div class="mt-2 h-3 w-4/12 rounded bg-gray-100"></div>
                                    </div>
                                </div>
                                <div class="mt-4 h-3 w-full rounded bg-gray-100"></div>
                                <div class="mt-2 h-3 w-8/12 rounded bg-gray-100"></div>
                            </div>
                        </div>

                        <div v-else-if="error" class="py-10 text-center">
                            <p class="text-sm text-gray-600">项目加载失败，请稍后重试。</p>
                            <button type="button" class="btn-normal mt-4" @click="refresh()">重新加载</button>
                        </div>

                        <div v-else-if="filteredProjects.length" class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <ProjectCard v-for="item in filteredProjects" :key="item.id" :project="item" />
                        </div>

                        <div v-else class="py-10">
                            <p class="text-sm font-medium text-gray-700">
                                {{ hasFilters ? '没有找到符合条件的项目' : '项目库正在整理中' }}
                            </p>
                            <p class="mt-1 text-sm text-gray-500">
                                {{ hasFilters ? '换个分类、平台或清除筛选看看。' : '目前还没有发布项目，先看看工具和文章。' }}
                            </p>
                            <div class="mt-4 flex flex-wrap items-center gap-2">
                                <button v-if="hasFilters" type="button" class="btn-normal" @click="clearFilters">
                                    清除筛选
                                </button>
                                <template v-else>
                                    <NuxtLink to="/tool" class="btn-normal">浏览工具</NuxtLink>
                                    <NuxtLink to="/read"
                                        class="inline-flex h-9 items-center rounded-sm border border-gray-200 px-4 text-sm text-gray-600 transition-colors hover:border-blue-200 hover:text-blue-600">
                                        阅读文章
                                    </NuxtLink>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <aside class="space-y-4 lg:col-span-3">
                <div class="bg-white p-5 rounded-md">
                    <div class="border-l-4 border-blue-600 pl-2">
                        <p class="font-semibold text-sm text-gray-800">项目分类</p>
                    </div>
                    <div class="mt-3 space-y-1">
                        <button type="button"
                            class="w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors"
                            :class="categoryId === '' ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-600 hover:bg-gray-50'"
                            @click="selectCategory('')">
                            全部项目
                        </button>
                        <button v-for="item in categories" :key="item.id" type="button"
                            class="w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors"
                            :class="categoryId === String(item.id) ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-600 hover:bg-gray-50'"
                            @click="selectCategory(String(item.id))">
                            {{ item.name }}
                        </button>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-md">
                    <div class="border-l-4 border-blue-600 pl-2">
                        <p class="font-semibold text-sm text-gray-800">关于项目库</p>
                    </div>
                    <p class="mt-3 text-xs leading-5 text-gray-500">
                        收录 GitHub、Gitee 上值得关注的开源项目，按分类和平台整理，方便查找与对比。
                    </p>
                </div>

                <SidebarRecommend />
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Search } from '@lucide/vue'
import { api } from '~/api/api'

const route = useRoute()
const router = useRouter()

const platforms = [
    { label: 'GitHub', value: 'GITHUB' },
    { label: 'Gitee', value: 'GITEE' },
    { label: '其他', value: 'OTHER' },
]

const categoryId = ref(queryString(route.query.categoryId))
const platform = ref(queryString(route.query.platform))
const keyword = ref('')

const { data: categoryData } = await useAsyncData('project_Categories', () => api.project.getCategories())
const categories = computed<any[]>(() => categoryData.value?.data ?? [])

const { data: projectData, pending, error, refresh } = await useAsyncData(
    () => `project_List_${categoryId.value}_${platform.value}`,
    () => api.project.getList(1, 60, {
        categoryId: categoryId.value || undefined,
        platform: platform.value || undefined,
    }),
    { watch: [categoryId, platform] },
)

const projects = computed<any[]>(() => projectData.value?.data?.content ?? [])
const filteredProjects = computed(() => {
    const term = keyword.value.trim().toLowerCase()
    if (!term) return projects.value
    return projects.value.filter((item) =>
        [item.name, item.summary, item.language, item.category?.name].filter(Boolean).join(' ').toLowerCase().includes(term)
    )
})
const hasFilters = computed(() => Boolean(categoryId.value || platform.value || keyword.value.trim()))

watch(() => route.query, (query) => {
    categoryId.value = queryString(query.categoryId)
    platform.value = queryString(query.platform)
})

function queryString(value: unknown) {
    return typeof value === 'string' ? value : ''
}

function selectCategory(value: string) {
    categoryId.value = value
    router.push({ query: { ...(value ? { categoryId: value } : {}), ...(platform.value ? { platform: platform.value } : {}) } })
}

function selectPlatform(value: string) {
    platform.value = value
    router.push({ query: { ...(categoryId.value ? { categoryId: categoryId.value } : {}), ...(value ? { platform: value } : {}) } })
}

function clearFilters() {
    categoryId.value = ''
    platform.value = ''
    keyword.value = ''
    router.push({ query: {} })
}

usePageSeo({
    title: '开源项目推荐 - ZNGG在线工具',
    description: '精选 GitHub、Gitee 上值得关注的开源项目，涵盖前端、后端、开发工具与效率软件，持续更新。',
    keywords: '开源项目推荐,GitHub项目,Gitee项目,开源软件',
    path: '/project',
})
</script>
