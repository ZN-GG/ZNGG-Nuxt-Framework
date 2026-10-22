<template>
    <div ref="html">
        <div class="mx-auto container px-4 my-8 min-h-screen mt-20">
            <h1 class="sr-only">ZNGG在线工具 - 免费在线工具、技术文章与资源下载</h1>
            <!-- 今日推荐 -->
            <!-- <div ref="container" class="bg-white p-6 rounded-md my-4">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <p class="font-semibold text-2xl">今日推荐</p>
                    </div>
                    <div>
                        <div class="btn-1">更多</div>
                    </div>
                </div>
            </div> -->
            <!-- 在线工具 -->
            <div class="bg-white px-6 py-5 rounded-md mt-8 mb-4">
                <div class="flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                        <span class="-ml-3 h-5 w-1 shrink-0 rounded-full bg-blue-600"></span>
                        <p class="text-xl font-semibold text-gray-800">在线工具</p>
                    </div>
                    <div class="flex">
                        <NuxtLink to="/tool">
                            <div class="btn-1">更多</div>
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="w-full flex flex-wrap justify-between -mb-4">
                <NuxtLink :to="'/tool/detail/' + item.content" v-for="(item, index) in toolList" :key="index"
                    target="_blank" class="w-4/12 md:w-2/12 flex mb-4"
                    :class="[(index + 6) % 6 == 0 ? 'md:pr-1 md:pl-0' : '', (index + 1) % 6 == 0 ? 'md:pl-1 md:pr-0' : '', ((index + 7) % 6 != 0) && ((index + 1) % 6 != 0) ? 'md:px-1' : '', (index + 2) % 3 == 0 ? 'px-1' : '', (index + 3) % 3 == 0 ? 'pr-2' : '', (index + 1) % 3 == 0 ? 'pl-2' : '']">
                    <div class="w-full relative tool-border">
                        <div class="tool-box absolute">
                            <div class="tool-icon" :style="'background-image: url(/img/' + item.image + ');'">
                            </div>
                            <p class="tool-title" v-text="item.title"></p>
                            <p class="tool-des" v-text="item.summary"></p>
                        </div>
                    </div>
                </NuxtLink>
                <div v-for="item in 11" class="w-4/12 md:w-2/12"></div>
            </div>
            <!-- 最新文章 -->
            <div class="flex flex-wrap relative">
                <div class="bg-white px-6 pb-6 pt-5 rounded-md mt-4 w-full lg:w-8/12" ref="leftNormalContainer">
                    <div class="flex items-center justify-between gap-3 border-b border-gray-100 pb-5">
                        <div class="flex items-center gap-2">
                            <span class="-ml-3 h-5 w-1 shrink-0 rounded-full bg-blue-600"></span>
                            <p class="text-xl font-semibold text-gray-800">最新文章</p>
                        </div>
                        <nuxt-link to="read" class="btn-1">更多</nuxt-link>
                    </div>
                    <ul class="mt-1">
                        <ArticleListItem v-for="item in articleList" :key="item.id" :article="item"
                            :category-name="articleCategoryName(item)" />
                    </ul>
                    <p v-if="!articleList.length" class="py-12 text-center text-sm text-gray-400">暂无文章</p>
                </div>

                <!-- 广而告之 -->
                <div class="mt-4 w-full lg:w-4/12 lg:absolute lg:right-0">
                    <div class="lg:pl-4 w-full" ref="rightNormalContainer">
                        <div class="w-full py-5 rounded text-center bg-gradient-to-r from-cyan-500 to-blue-500">
                            <nuxt-link to="/nav">
                                <div class="mx-auto">
                                    <p class="text-xl font-semibold text-white">优质网址导航</p>
                                </div>
                            </nuxt-link>
                        </div>
                        <div class="w-full my-4 py-5 rounded text-center bg-gradient-to-r from-violet-500 to-fuchsia-500">
                            <nuxt-link to="/tool/detail/FlvPlayer">
                                <div class="mx-auto">
                                    <p class="text-xl font-semibold text-white">FLV播放器</p>
                                </div>
                            </nuxt-link>
                        </div>
                        <div class="w-full my-4 py-5 rounded text-center bg-gradient-to-r from-orange-500 to-fuchsia-700">
                            <nuxt-link to="/tool/detail/ScreenRec">
                                <div class="mx-auto">
                                    <p class="text-xl font-semibold text-white">PC在线录屏</p>
                                </div>
                            </nuxt-link>
                        </div>
                    </div>

                    <div class="lg:pl-4 w-full" ref="rightNormalContainer">
                        <div class="w-full my-4 rounded-md bg-white p-4">
                            <div class="mb-3 flex items-center gap-2 border-b border-gray-100 pb-4">
                                <span class="-ml-3 h-4 w-1 shrink-0 rounded-full bg-blue-600"></span>
                                <p class="text-lg font-semibold text-gray-800">关于我们</p>
                            </div>
                            <a href="http://beian.miit.gov.cn/" class="text-xs text-gray-500 transition-colors hover:text-blue-600">
                                豫ICP备17050064号-4
                            </a>
                        </div>
                    </div>
                    <div v-bind:style="{ width: rightFixedContainerWidth }" class="h-20 pl-4 my-4 hidden lg:block w-full"
                        ref="rightFixedContainer">
                        <div class="bg-white rounded-md p-6">
                            <div class="flex items-center justify-between gap-3">
                                <div class="flex items-center gap-2">
                                    <span class="-ml-3 h-4 w-1 shrink-0 rounded-full bg-blue-600"></span>
                                    <p class="text-lg font-semibold text-gray-800">AD</p>
                                    <p class="hidden text-xs text-gray-400 lg:inline">悬浮小框框</p>
                                </div>
                                <div class="btn-1">更多</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 项目推荐 / 资源下载 -->
            <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div class="rounded-md bg-white px-6 pb-6 pt-5">
                    <div class="flex items-center justify-between gap-3 border-b border-gray-100 pb-5">
                        <div class="flex items-center gap-2">
                            <span class="-ml-3 h-5 w-1 shrink-0 rounded-full bg-blue-600"></span>
                            <p class="text-xl font-semibold text-gray-800">项目推荐</p>
                        </div>
                        <NuxtLink to="/project" class="btn-1">更多</NuxtLink>
                    </div>
                    <ul v-if="projectList.length" class="mt-1 divide-y divide-gray-100">
                        <li v-for="projectItem in projectList" :key="projectItem.id">
                            <NuxtLink :to="'/project/' + projectItem.id"
                                class="group -mx-2 flex items-start gap-3 rounded-sm px-2 py-3 transition-colors hover:bg-gray-50">
                                <img v-if="projectItem.logo" :src="projectItem.logo" :alt="projectItem.name"
                                    loading="lazy" class="h-10 w-10 shrink-0 rounded object-cover" />
                                <div v-else
                                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-blue-50 text-sm font-semibold text-blue-600">
                                    {{ (projectItem.name || '?').slice(0, 1) }}
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center gap-2">
                                        <p
                                            class="truncate text-sm font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                                            {{ projectItem.name }}
                                        </p>
                                        <span v-if="projectItem.platform"
                                            class="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                                            {{ platformLabel(projectItem.platform) }}
                                        </span>
                                    </div>
                                    <p v-if="projectItem.summary"
                                        class="mt-1 line-clamp-1 text-xs leading-5 text-gray-500">
                                        {{ projectItem.summary }}
                                    </p>
                                    <div
                                        class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-gray-400">
                                        <span v-if="projectItem.language" class="flex items-center gap-1">
                                            <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                            {{ projectItem.language }}
                                        </span>
                                        <span v-if="projectItem.stars" class="flex items-center gap-1">
                                            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"
                                                aria-hidden="true">
                                                <path
                                                    d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6L3.2 9.4l6.1-.9L12 3Z" />
                                            </svg>
                                            {{ compactNumber(projectItem.stars) }}
                                        </span>
                                        <span v-if="projectItem.forks">Fork {{ compactNumber(projectItem.forks) }}</span>
                                        <span v-if="projectItem.license">{{ projectItem.license }}</span>
                                    </div>
                                </div>
                                <ChevronRight
                                    class="mt-1 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-blue-600"
                                    aria-hidden="true" />
                            </NuxtLink>
                        </li>
                    </ul>
                    <p v-else class="py-10 text-center text-sm text-gray-400">项目正在整理中，敬请期待</p>
                </div>

                <div class="rounded-md bg-white px-6 pb-6 pt-5">
                    <div class="flex items-center justify-between gap-3 border-b border-gray-100 pb-5">
                        <div class="flex items-center gap-2">
                            <span class="-ml-3 h-5 w-1 shrink-0 rounded-full bg-blue-600"></span>
                            <p class="text-xl font-semibold text-gray-800">资源下载</p>
                        </div>
                        <NuxtLink to="/download" class="btn-1">更多</NuxtLink>
                    </div>
                    <ul v-if="downloadList.length" class="mt-1 divide-y divide-gray-100">
                        <li v-for="downloadItem in downloadList" :key="downloadItem.id">
                            <NuxtLink :to="'/download/' + downloadItem.id"
                                class="group -mx-2 flex items-center gap-3 rounded-sm px-2 py-3 transition-colors hover:bg-gray-50">
                                <div
                                    class="relative h-14 w-20 shrink-0 overflow-hidden rounded border border-gray-100 bg-gray-50">
                                    <img v-if="downloadItem.cover" :src="downloadItem.cover"
                                        :alt="downloadItem.title" loading="lazy"
                                        class="h-full w-full object-cover object-top" />
                                    <div v-else
                                        class="flex h-full w-full items-center justify-center text-gray-300">
                                        <Download class="h-5 w-5" aria-hidden="true" />
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center gap-2">
                                        <p
                                            class="truncate text-sm font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                                            {{ downloadItem.title }}
                                        </p>
                                        <span
                                            class="shrink-0 rounded-sm bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600">
                                            {{ downloadItem.type === 'SOFTWARE' ? '软件' : '资源' }}
                                        </span>
                                    </div>
                                    <p v-if="downloadItem.summary"
                                        class="mt-1 line-clamp-1 text-xs leading-5 text-gray-500">
                                        {{ downloadItem.summary }}
                                    </p>
                                    <div
                                        class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-gray-400">
                                        <span v-if="downloadItem.version">v{{ downloadItem.version }}</span>
                                        <span v-if="downloadItem.fileSize">{{ formatSize(downloadItem.fileSize) }}</span>
                                        <span>{{ downloadItem.downloadCount ?? 0 }} 次下载</span>
                                    </div>
                                </div>
                                <ChevronRight
                                    class="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-blue-600"
                                    aria-hidden="true" />
                            </NuxtLink>
                        </li>
                    </ul>
                    <p v-else class="py-10 text-center text-sm text-gray-400">暂无下载资源</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ChevronRight, Download } from '@lucide/vue';
import { api } from '~/api/api';


let isRightFixedContainer = ref(false), rightFixedContainerRight = ref(0), rightFixedContainerWidth = ref("100%");
let rightNormalContainer = ref<HTMLInputElement>();
let rightFixedContainer = ref<HTMLInputElement>()

const toolList = ref<any[]>([])
const articleList = ref<any[]>([])
const projectList = ref<any[]>([])
const downloadList = ref<any[]>([])

const { data: toolData, pending: toolPending, refresh: ToolRefresh, error: toolError } = await useAsyncData("index_GetToolList", () => api.tool.getList(1, 12, ""));
if (toolData.value?.success) {
    toolList.value = toolList.value.concat(toolData.value.data.content)
}

const { data: articleData, pending: articlePending, refresh: ArticleRefresh, error: articleError } = await useAsyncData("index_GetArticleList", () => api.article.getList(1, 10, ""));
if (articleData.value?.success) {
    articleList.value = articleList.value.concat(articleData.value.data.content)
}

const { data: articleCategoryData } = await useAsyncData("index_GetArticleCategories", () => api.article.getCategories());
const articleCategories = computed<any[]>(() => articleCategoryData.value?.data ?? []);

const { data: projectData } = await useAsyncData("index_GetProjectList", () => api.project.getList(1, 4));
if (projectData.value?.success) {
    projectList.value = projectData.value.data.content
}

const { data: downloadData } = await useAsyncData("index_GetDownloadList", () => api.download.getList(1, 4));
if (downloadData.value?.success) {
    downloadList.value = downloadData.value.data.content
}

onMounted(async () => {
    // await ToolRefresh()
    // await ArticleRefresh()
    // toolList.value = toolData.value!.data.content
    // articleList.value = articleData.value!.data.content
    window.addEventListener("scroll", handleScroll, false);
})
onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
})

function handleScroll() {
    let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
    if (scrollTop > 20) {
        setFloatContainer();
    }
}



function setFloatContainer() {

    if (rightNormalContainer.value!.getBoundingClientRect().bottom <= 0) {
        rightFixedContainer.value!.style.position = "fixed";
        rightFixedContainer.value!.style.top = "5.5rem";
        rightFixedContainerWidth.value = rightNormalContainer.value!.offsetWidth + "px";
    } else if (rightNormalContainer.value!.getBoundingClientRect().bottom > 0) {
        rightFixedContainerWidth.value = "100%";
        rightFixedContainer.value!.style.top = "";
        rightFixedContainer.value!.style.position = "absolute";
    }
}

function articleCategoryName(item: any) {
    return articleCategories.value.find(category => String(category.id) === String(item.categoryId))?.name || ''
}

function platformLabel(platform: string) {
    const map: Record<string, string> = {
        GITHUB: 'GitHub',
        GITEE: 'Gitee',
        OTHER: '其他',
    }
    return map[platform] ?? platform ?? ''
}

function compactNumber(value: any) {
    const number = Number(value)
    if (!number || Number.isNaN(number)) return '0'
    if (number >= 10000) {
        return (number / 10000).toFixed(1).replace(/\.0$/, '') + '万'
    }
    return String(number)
}

function formatSize(bytes: any) {
    const value = Number(bytes)
    if (!value || Number.isNaN(value)) return ''
    const units = ['B', 'KB', 'MB', 'GB']
    let index = 0
    let size = value
    while (size >= 1024 && index < units.length - 1) {
        size = size / 1024
        index++
    }
    return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

usePageSeo({
    title: 'ZNGG在线工具 - 在线工具、技术文章与资源下载',
    description: 'ZNGG在线工具是一个持续提供高质量内容输出的平台，汇集免费在线工具、技术文章、开源项目推荐与软件资源下载。',
    keywords: '在线工具,免费在线工具,技术文章,开源项目,软件下载,资源下载,ZNGG',
    path: '/',
})
</script>
