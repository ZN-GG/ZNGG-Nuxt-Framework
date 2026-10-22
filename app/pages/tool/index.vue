<template>
    <div class="mx-auto container px-4 my-8 min-h-screen mt-20">
        <div class="bg-white px-6 pb-6 pt-5 rounded-md mt-8 mb-4">
            <div class="flex flex-wrap items-center justify-between gap-5">
                <h1 class="text-2xl font-semibold text-gray-800">在线工具</h1>
                <div
                    class="category-scroll flex w-full gap-2 overflow-x-auto pb-1 md:w-auto md:flex-wrap md:justify-end md:overflow-visible md:pb-0">
                    <button type="button" :class="filterClass(categoryId == '')" @click="selectCategoryId('')">
                        全部
                    </button>
                    <button type="button" v-for="(item, index) in toolCategoryList" :key="index"
                        :class="filterClass(categoryId == item.id)" @click="selectCategoryId(item.id)">
                        {{ item.name }}
                    </button>
                </div>
            </div>
        </div>
        <div class="w-full flex flex-wrap justify-between">
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
        <div v-show="loading" class="w-full flex flex-wrap justify-between">
            <div v-for="(item, index) in 4" class="w-4/12 md:w-2/12 flex mb-4 animate-pulse"
                :class="[(item + 5) % 6 == 0 ? 'md:pr-1 md:pl-0' : '', (item) % 6 == 0 ? 'md:pl-1 md:pr-0' : '', ((item + 6) % 6 != 0) && ((item) % 6 != 0) ? 'md:px-1' : '', (item + 1) % 3 == 0 ? 'px-1' : '', (item + 2) % 3 == 0 ? 'pr-2' : '', (item) % 3 == 0 ? 'pl-2' : '']">
                <div class="w-full relative tool-border">
                    <div class="tool-box absolute">
                        <div class="tool-icon bg-gray-200">
                        </div>
                        <p class="tool-title bg-gray-200 h-4 w-6/12"></p>
                        <p class="tool-title bg-gray-200 h-4 w-6/12"></p>
                    </div>
                </div>
            </div>
            <div v-for="item in 2" class="w-4/12 md:w-2/12"></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { api } from '~/api/api';

let loading = ref(false);
let empty = ref(false);
let page = ref(2);
let categoryId = ref("")

// 初始化工具分类
let toolCategoryList = ref<any[]>([])
let toolCategoryResult = await api.tool.getCategories();
toolCategoryList.value = toolCategoryResult.data;

const toolParams = ref("")

const toolList = ref<any>([])
const { data: toolData, pending: toolPending, refresh: ToolRefresh, error: toolError } = await useAsyncData("tool_GetToolList", () => api.tool.getList(1, 24, toolParams.value));
if (toolData.value!.success) {
    toolList.value = toolList.value.concat(toolData.value!.data.content)
}

onMounted(async () => {
    // await ToolRefresh()
    // toolList.value = toolData.value!.data.content
})


function filterClass(active: boolean) {
    return active
        ? 'shrink-0 rounded-full border border-blue-600 bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm shadow-blue-600/20 transition-colors duration-200 hover:bg-blue-700'
        : 'shrink-0 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/60 hover:text-blue-600'
}

async function selectCategoryId(id: string) {
    page.value = 2;
    empty.value = false
    toolList.value = []
    loading.value = true
    categoryId.value = id
    if (id == "") {
        toolParams.value = "";
    } else {
        toolParams.value = categoryId.value;
    }
    await ToolRefresh();
    toolList.value = toolData.value!.data.content
    loading.value = false
}


usePageSeo({
    title: '在线工具 - ZNGG在线工具',
    description: '免费在线工具集合，涵盖编码转换、图片处理、视频下载、开发调试等实用工具，打开即用，无需安装。',
    keywords: '在线工具,免费在线工具,格式转换工具,图片处理工具,视频下载工具,开发调试工具',
    path: '/tool',
})
</script>

<style scoped>
.category-scroll {
    scrollbar-width: none;
}

.category-scroll::-webkit-scrollbar {
    display: none;
}
</style>