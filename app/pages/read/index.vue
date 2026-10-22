<template>
    <div ref="html">
        <div class="mx-auto container px-4 my-8">
            <div class="flex flex-wrap relative">
                <div class="bg-white px-6 pb-6 pt-5 rounded-md mt-4 w-full lg:w-8/12" ref="leftNormalContainer">
                    <div class="flex items-center justify-between gap-3 border-b border-gray-100 pb-5">
                        <div class="flex items-center gap-2">
                            <span class="-ml-3 h-5 w-1 shrink-0 rounded-full bg-blue-600"></span>
                            <h1 class="text-2xl font-semibold text-gray-800">最新文章</h1>
                        </div>
                        <button type="button" @click="showCategory()"
                            class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-base text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-blue-600"
                            :aria-expanded="isShowCategory">
                            <span class="iconfont icon-category text-base" aria-hidden="true"></span>
                            <span>分类</span>
                            <span class="iconfont icon-arrow-down text-xs transition-transform duration-200"
                                :class="isShowCategory ? 'rotate-180' : ''" aria-hidden="true" />
                        </button>
                    </div>

                    <div v-show="isShowCategory" class="mt-3 border-b border-gray-100 pb-4">
                        <div class="category-scroll flex gap-2 overflow-x-auto">
                            <button type="button" @click="selectCategoryId('')"
                                class="shrink-0 rounded-full border px-4 py-1.5 text-sm transition-all duration-200"
                                :class="categoryId == '' ? 'border-blue-600 bg-blue-600 font-medium text-white shadow-sm shadow-blue-600/20' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50/60 hover:text-blue-600'">
                                全部
                            </button>
                            <button type="button" v-for="item in categoryList" :key="item.id"
                                @click="selectCategoryId(item.id)"
                                class="shrink-0 rounded-full border px-4 py-1.5 text-sm transition-all duration-200"
                                :class="categoryId == item.id ? 'border-blue-600 bg-blue-600 font-medium text-white shadow-sm shadow-blue-600/20' : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50/60 hover:text-blue-600'">
                                {{ item.name }}
                            </button>
                        </div>
                    </div>

                    <ul class="mt-1">
                        <ArticleListItem v-for="item in articleList" :key="item.id" :article="item"
                            :category-name="categoryNameOf(item)" />
                    </ul>

                    <p v-if="!articleList.length && !loading" class="py-14 text-center text-sm text-gray-400">
                        暂无文章
                    </p>

                    <div v-if="loading" class="mt-1" aria-hidden="true">
                        <div v-for="i in 2" :key="i"
                            class="flex gap-4 border-b border-gray-100 py-5 last:border-b-0 sm:gap-5">
                            <div class="min-w-0 flex-1 space-y-3">
                                <div class="h-5 w-8/12 animate-pulse rounded bg-gray-100"></div>
                                <div class="h-4 w-full animate-pulse rounded bg-gray-100"></div>
                                <div class="h-3 w-5/12 animate-pulse rounded bg-gray-100"></div>
                            </div>
                            <div class="h-20 w-28 shrink-0 animate-pulse rounded-lg bg-gray-100 sm:h-24 sm:w-36"></div>
                        </div>
                    </div>

                    <div v-if="empty && !loading" class="flex items-center gap-3 py-10 text-xs text-gray-400">
                        <span class="h-px flex-1 bg-gray-100"></span>
                        已经到底了
                        <span class="h-px flex-1 bg-gray-100"></span>
                    </div>
                </div>

                <!-- 广而告之 -->
                <div class="mt-4 hidden lg:block w-full lg:w-4/12 absolute right-0">
                    <div class="pl-4 w-full" ref="rightNormalContainer">
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
                        <div class="blick mt-4">
                            <adsbygoogle />
                        </div>
                    </div>
                    <div v-bind:style="{
                        width: rightFixedContainerWidth,
                    }" class="h-20 pl-4 my-4 hidden lg:block w-full" ref="rightFixedContainer">
                        <div class="bg-white rounded-md p-6">
                            <div class="flex items-center justify-between gap-3">
                                <div class="flex items-center gap-2">
                                    <span class="-ml-3 h-4 w-1 shrink-0 rounded-full bg-blue-600"></span>
                                    <p class="text-lg font-semibold text-gray-800">AD</p>
                                    <p class="hidden text-xs text-gray-400 lg:inline">广而告之</p>
                                </div>
                                <div class="btn-1">更多</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { api } from "~/api/api";

let isShowCategory = ref(true);
let rightFixedContainerWidth = ref("100%");
let loading = ref(false);
let empty = ref(false);
let page = ref(2);
let size = ref(10);
let categoryId = ref("")
const articleParams = ref("")
let articleList = ref<any[]>([])
let categoryList = ref<any[]>([])
let rightNormalContainer = ref<HTMLInputElement>();
let rightFixedContainer = ref<HTMLInputElement>()

let categoryResult = await api.article.getCategories();
categoryList.value = categoryResult?.data ?? [];

function categoryNameOf(article: any) {
    return categoryList.value.find(category => String(category.id) === String(article.categoryId))?.name || ''
}

const { data: articleData, pending, refresh, error } = await useAsyncData("read_GetList", () => api.article.getList(1, 10, articleParams.value));
if (articleData.value?.success) {
    articleList.value = articleList.value.concat(articleData.value.data.content)
}

onMounted(async () => {
    // await refresh()
    // articleList.value = articleData.value!.data.content
    window.addEventListener("scroll", handleScroll, false);

})

onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
})

async function selectCategoryId(id: string) {
    page.value = 2;
    empty.value = false
    articleList.value = []
    loading.value = true
    categoryId.value = id
    if (id == "") {
        articleParams.value = "";
    } else {
        articleParams.value = categoryId.value;
    }
    await refresh();
    articleList.value = articleData.value?.data?.content ?? []
    loading.value = false
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
function handleScroll() {
    let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
    if (scrollTop > 20) {
        setFloatContainer();
    }
    let documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
    );
    if (documentHeight - scrollTop - window.innerHeight < 60 && !empty.value) {
        loadMore();
    }
}


function showCategory() {
    isShowCategory.value = !isShowCategory.value;
}

async function loadMore() {
    if (loading.value) {
        return;
    }
    loading.value = true;
    const result = (await api.article.getList(page.value, 10, articleParams.value));
    if (result.success) {
        if (result.data.content.length == 0) {
            empty.value = true;
        }
        articleList.value = articleList.value.concat(result.data.content);
        page.value = page.value + 1;
    }
    loading.value = false;
}


usePageSeo({
    title: '技术文章 - ZNGG在线工具',
    description: '分享前端、后端与设计相关的技术文章，记录开发实践、问题排查与效率工具使用经验。',
    keywords: '技术文章,前端开发,后端开发,编程实践,效率工具',
    path: '/read',
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
