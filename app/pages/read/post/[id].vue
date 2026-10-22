<template>
    <div ref="html">
        <div class="mx-auto container my-8 mt-20">
            <PageBreadcrumb v-if="isSuccess" :items="breadcrumbItems" class="pt-2 mb-2 lg:w-8/12" />
            <div class="relative  lg:block left-button-box">
                <div class="absolute pt-10" style="left: -62px; top: 0;">
                    <div class="h-96 w-18 fixed">
                        <ul class="mx-auto">
                            <li @click="clickLike"
                                class="relative bg-white text-center rounded-full p-1 w-11 h-11 shadow-xl hover:text-blue-600"
                                :class="userInteract?.like ? 'text-blue-600' : 'text-gray-500'" alt="点赞"><i
                                    class="iconfont icon-Likevotethumbup mx-auto"></i>
                                <p class="mt-2 text-sm">{{ userInteract?.likeCount }}</p>
                            </li>
                            <li @click="clickCollect"
                                class="relative bg-white text-center rounded-full p-1 w-11 h-11 shadow-xl hover:text-blue-600"
                                :class="userInteract?.collect ? 'text-blue-600' : 'text-gray-500'" alt="收藏"><i
                                    class="iconfont icon-favorites-fill mx-auto"></i>
                                <p class="mt-2 text-sm">{{ userInteract?.collectCount }}</p>
                            </li>
                            <!-- <li @click="showPoster(true)"
                                class="bg-white text-center rounded-full p-1 w-11 h-11 shadow-xl text-gray-500 hover:text-black">
                                <i class="iconfont icon-pic-fill mx-auto "></i>
                            </li> -->
                        </ul>
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap relative">
                <div class="bg-white px-6 pb-6 pt-5 rounded-md mt-2 w-full lg:w-8/12">
                    <div v-if="isSuccess" class="">
                        <div class="">
                            <h1 class="font-semibold w-full text-2xl lg:text-3xl">
                                {{ article.title }}
                            </h1>
                            <div class="flex py-4 w-fll justify-between items-center">
                                <div class="flex items-center">
                                    <img v-if="article.user?.avatar" :src="article.user.avatar"
                                        class="w-10 h-10 rounded-full" alt="" />
                                    <div v-else
                                        class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                        {{ (article.user?.name || '?').slice(0, 1) }}
                                    </div>
                                    <div class="ml-2">
                                        <p class="custom-font-16" v-text="article.user?.name || 'ZNGG'"></p>
                                        <p class="custom-font-14 text-gray-500">
                                            {{ article.updateTime }}&nbsp;&nbsp;&nbsp;&nbsp;<span
                                                class="block md:inline-block">阅读：{{ article.viewCount }}</span>
                                            <span class="hidden md:inline">&nbsp;·&nbsp;</span>
                                            <span>{{ wordCount }} 字 · 约 {{ readingMinutes }} 分钟</span>
                                        </p>
                                    </div>
                                </div>
                                <div class="">
                                    <NuxtLink v-if="categoryId" :to="'/read/category/' + categoryId">
                                        <p class="btn-2 w-auto">{{ article.category?.name }}</p>
                                    </NuxtLink>
                                    <p v-else class="btn-2 w-auto">{{ article.category?.name }}</p>
                                </div>
                            </div>
                            <div v-if="labels.length" class="flex flex-wrap gap-2 pb-4">
                                <NuxtLink v-for="label in labels" :key="label"
                                    :to="'/read/tag/' + encodeURIComponent(label)"
                                    class="rounded bg-gray-100 px-2.5 py-1 text-xs text-gray-500 transition-colors hover:bg-blue-600 hover:text-white">
                                    #{{ label }}
                                </NuxtLink>
                            </div>
                            <div v-show="!isSuccessViewer && !isSpeader" class="block w-full animate-pulse">
                                <div class="flex mt-6 mb-2">
                                    <div class="w-2/12"></div>
                                    <div class="w-10/12 h-6 bg-gray-200">
                                    </div>
                                </div>
                                <div class="w-full h-6 bg-gray-200 my-6">
                                </div>
                                <div class="w-full h-64 bg-gray-200 my-6">
                                </div>
                                <div class="w-full h-6 bg-gray-200 my-6">
                                </div>
                                <div class="w-8/12 h-6 bg-gray-200 my-6">
                                </div>
                            </div>
                            <div v-if="isSpeader" is="'style'">{{ themes.juejin.style }}</div>
                            <div v-show="isSpeader" class="markdown-body overflow-auto"
                                v-bind:class="isSpeader ? '' : 'opacity-0'" v-html="mdHTMl"></div>
                            <div ref="posterDocument">
                                <Viewer v-show="isSuccessViewer" v-if="isRender && !isSpeader" id="markdown-body"
                                    :value="articleHtmlContent" :plugins="plugins" @change="handleChange" />
                            </div>
                        </div>
                    </div>
                    <div class="h-80 relative" v-else>
                        <div class="absolute empty items-center text-2xl">
                            <span class="iconfont icon-cry" style="font-size: 24px" />
                            <p class="text-gray-700">没有找到该文章！</p>
                            <p>
                                <a href="/" class="text-blue-600 custom-font-14 my-4">返回首页</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div v-if="isSuccess" class="bg-white px-6 pb-6 pt-5 rounded-md mt-4 w-full lg:w-8/12">
                    <div v-if="relatedArticles.length">
                        <div class="mb-2 flex items-center gap-2 border-b border-gray-100 pb-5">
                            <span class="-ml-3 h-4 w-1 shrink-0 rounded-full bg-blue-600"></span>
                            <p class="text-lg font-semibold text-gray-800">相关阅读</p>
                        </div>
                        <ul class="divide-y divide-gray-100">
                            <li v-for="(item, index) in relatedArticles" :key="item.id">
                                <NuxtLink :to="'/read/post/' + item.id" target="_blank"
                                    class="group flex items-start gap-3 py-3">
                                    <span
                                        class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-100 text-xs text-gray-500 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                        {{ index + 1 }}
                                    </span>
                                    <span class="min-w-0 flex-1">
                                        <span
                                            class="line-clamp-1 text-[15px] font-medium text-gray-700 transition-colors group-hover:text-blue-600">
                                            {{ item.title }}
                                        </span>
                                        <span v-if="item.summary" class="mt-1 line-clamp-1 text-xs text-gray-400">
                                            {{ item.summary }}
                                        </span>
                                    </span>
                                    <span class="ml-2 hidden shrink-0 text-xs text-gray-400 sm:block">
                                        {{ (item.updateTime || '').slice(0, 10) }}
                                    </span>
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>

                    <div v-if="relatedArticles.length && (adjacent.prev || adjacent.next)"
                        class="my-4 h-px bg-gray-100"></div>

                    <div v-if="adjacent.prev || adjacent.next" class="mt-4 grid gap-3"
                        :class="adjacent.prev && adjacent.next ? 'sm:grid-cols-2' : ''">
                        <NuxtLink v-if="adjacent.prev" :to="'/read/post/' + adjacent.prev.id"
                            class="group rounded border border-gray-100 p-4 transition-colors hover:border-blue-200">
                            <p class="text-xs text-gray-400">上一篇</p>
                            <p class="mt-1 line-clamp-1 text-sm font-medium text-gray-700 group-hover:text-blue-600">
                                {{ adjacent.prev.title }}
                            </p>
                        </NuxtLink>
                        <NuxtLink v-if="adjacent.next" :to="'/read/post/' + adjacent.next.id"
                            class="group rounded border border-gray-100 p-4 transition-colors hover:border-blue-200"
                            :class="adjacent.prev ? 'sm:text-right' : ''">
                            <p class="text-xs text-gray-400">下一篇</p>
                            <p class="mt-1 line-clamp-1 text-sm font-medium text-gray-700 group-hover:text-blue-600">
                                {{ adjacent.next.title }}
                            </p>
                        </NuxtLink>
                    </div>

                    <div v-if="(relatedArticles.length || adjacent.prev || adjacent.next) && relatedTools.length"
                        class="my-4 h-px bg-gray-100"></div>

                    <div v-if="relatedTools.length" class="mt-1">
                        <div class="mb-3 flex items-center gap-2 border-b border-gray-100 pb-5">
                            <span class="-ml-3 h-4 w-1 shrink-0 rounded-full bg-blue-600"></span>
                            <p class="text-lg font-semibold text-gray-800">相关工具</p>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <NuxtLink v-for="tool in relatedTools" :key="tool.slug"
                                :to="'/tool/detail/' + tool.slug" target="_blank"
                                class="rounded bg-gray-100 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-600 hover:text-white">
                                {{ tool.name }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="mt-2 hidden lg:block w-full lg:w-4/12 absolute right-0">
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
                        <div v-show="docMenu.length > 0" class="bg-white rounded-md">
                            <div class="flex justify-between items-center p-5">
                                <div class="flex items-center">
                                    <p class="text-lg font-semibold text-gray-800">目录</p>
                                    <p class="
                      hidden
                      lg:inline
                      leading-8
                      mx-4
                      text-sm text-gray-400
                    ">
                                        Contents
                                    </p>
                                </div>
                            </div>
                            <hr class="mx-5" />
                            <div>
                                <ul class="article-contents overflow-y-auto py-2 px-5" ref="articleContents">
                                    <li v-for="(item, index) in docMenu" :key="item.id" :class="`level_${item.level}`"
                                        class="leading-9 relative">
                                        <a :href="'#' + item.id" :class="{ 'text-blue-600 active': tocActive === index }">{{
                                            item.text }}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="isShowPoster" class="
              modal-show
              flex
              items-center
              w-full
              h-full
              fixed
              top-0
              left-0
              z-40
              bg-gray-500
              opacity-100
              justify-center
            ">
                <div class="modal-content bg-white w-96 p-4 relative rounded-md">
                    <div><span class=" hover:cursor-pointer right-0 top-0 absolute m-2 w-5 h-5 iconfont icon-close"
                            @click="closePoster()" />
                    </div>
                    <div class="relative mt-4">
                        <div class="overflow-hidden poster-content">
                            <div class=" overflow-hidden h-80">
                                <img style="width: 100%;" :src="posterImage">
                            </div>
                            <div class="poster-content-mask"></div>
                            <div class=" absolute w-full" style="top: 320px;">
                                <hr class="mb-2">
                                <div class="flex">
                                    <div><img class=" w-20"
                                            :src="http.baseUrl + '/api/common/createQRCode?url=https://www.zngg.net/read/post/' + article?.id + '&width=160&height=160'"
                                            + alt="" srcset="">
                                    </div>
                                    <div class="pl-4">
                                        <p class="text-gray-500">扫描二维码获取文章详情</p>
                                        <p class="text-gray-500 text-xs mt-3">更多精彩内容尽在：WWW.ZNGG.NET</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { api } from "../../../api/api";
import http from '~/api/request';
import { userStore } from '~/stores/user';
import { splitTags } from '~/utils/tags';
import { getArticleCategoryCopy, toolNames } from '~/config/articleCategories';

definePageMeta({
    key: (route) => String(route.params.id),
})

import "highlight.js/styles/atom-one-dark.css";
//import "~/assets/fonts/katex.min.css";

const { Viewer } = await import("@bytemd/vue-next");


// import { Viewer } from '@bytemd/vue-next';
const breaks = (await import('@bytemd/plugin-breaks')).default;
const gemoji = (await import('@bytemd/plugin-gemoji')).default;
const gfm = (await import('@bytemd/plugin-gfm')).default;
const highlight = (await import('@bytemd/plugin-highlight')).default;
const math = (await import('@bytemd/plugin-math-ssr')).default;
const medium = (await import('@bytemd/plugin-medium-zoom')).default;
const mermaid = (await import('@bytemd/plugin-mermaid')).default;
const frontmatter = (await import('@bytemd/plugin-frontmatter')).default;
const { marked } = await import('marked');

const themes = (await import('~/assets/theme')).themes;

const isSuccess = ref(false)
const isSuccessViewer = ref(false)
const isRender = ref(false)
const scrollToTop = ref(true);
const rightFixedContainerWidth = ref("100%");
const docMenu = ref<any[]>([]);
const tocActive = ref(0);
const route = useRoute()
const currentId = String(route.params.id)
let rightNormalContainer = ref<HTMLInputElement>();
let rightFixedContainer = ref<HTMLInputElement>()
let articleContents = ref<HTMLInputElement>()
const isSpeader = ref(false)
const headers = useRequestHeaders(['user-agent']);
const userAgent = headers['user-agent'] || (import.meta.client ? navigator.userAgent : '');
const DomToImage = (await import('dom-to-image')).default;
let posterDocument = ref<HTMLDivElement>();
let posterImage = ref("")
const article = ref()
const articleSimple = ref("")
const categoryId = ref("")
const isShowPoster = ref(false)
const loginStatus = ref(false)
const token = useCookie("token")
const store = userStore();
if (typeof (token.value) != 'undefined') {
    loginStatus.value = true;
}
const plugins = [
    breaks(),
    frontmatter(),
    {

        viewerEffect({ file }) {
            if (typeof (file.value) != "object") {
                return
            }
            let theme = "juejin";
            const $style = document.createElement('style');

            try {
                $style.innerHTML = themes[file.value.frontmatter.theme]?.style ?? themes.juejin.style;
            } catch (e) {
                $style.innerHTML = themes.juejin.style;
            }

            document.head.appendChild($style);
            return () => {
                $style.remove();
            };
        },
    },
    gemoji(),
    gfm(),
    highlight(),
    math(),
    medium(),
    mermaid(),
];
const articleHtmlContent = ref()
let mdHTMl = ""
const userInteract = ref()
const { data: categoryData } = await useAsyncData("read_Detail_Categories", () => api.article.getCategories())
const { data: articleData, pending, refresh, error } = await useAsyncData("read_Detail_" + currentId, () => api.article.getDetail(currentId));
if (articleData.value?.success === false && (articleData.value.status === 404 || articleData.value.code === 404)) {
    throw createError({ statusCode: 404, statusMessage: '文章不存在', fatal: true })
}

if (articleData.value?.success) {
    mdHTMl = marked.parse(articleData.value!.data.content || "");
    article.value = articleData.value!.data
    articleSimple.value = (article.value.content || "").substr(0, 240)
    isSuccess.value = true;
    if (userAgent.indexOf("Baiduspider") != -1) {
        isSpeader.value = true
    }

    const category = article.value.category
    if (category?.id) {
        categoryId.value = String(category.id)
    } else if (category?.name) {
        const matched = (categoryData.value?.data ?? []).find((item: any) => item.name === category.name)
        categoryId.value = matched ? String(matched.id) : ''
    }
}

const relatedArticles = ref<any[]>([])
const adjacent = ref<{ prev: any, next: any }>({ prev: null, next: null })

if (articleData.value?.success && categoryId.value) {
    const relatedResult = await api.article.getList(1, 21, categoryId.value)
    if (relatedResult.success) {
        const all = relatedResult.data?.content ?? []
        const currentIndex = all.findIndex((item: any) => String(item.id) === currentId)
        if (currentIndex > -1) {
            adjacent.value = {
                prev: currentIndex > 0 ? all[currentIndex - 1] : null,
                next: currentIndex < all.length - 1 ? all[currentIndex + 1] : null,
            }
        }
        relatedArticles.value = all
            .filter((item: any) => String(item.id) !== currentId)
            .slice(0, 5)
    }
}
onMounted(() => {

    if (articleData.value?.success) {
        handleChange(article.value.content)
        isRender.value = true;
        isSuccessViewer.value = true;
    }
    window.addEventListener("scroll", handleScroll, false); // 监听滚动事件，然后用handleScroll这个方法进行相应的处理
    setTimeout(() => {
        initTop();
    }, 1);

    api.article.getUserInteract((route.params.id).toString()).then(res => {
        userInteract.value = res?.data
        console.log(res);
    })

})
onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
})

function initTop() {
    // 生成目录
    let markMenu = [];
    const articleDom = document.querySelector("#markdown-body");
    //console.log(articleDom);

    if (articleDom) {
        for (let ele of articleDom.children) {
            const i = ["h1", "h2", "h3", "h4", "h5", "h6"].indexOf(
                ele.tagName.toLowerCase()
            );
            if (i > -1 && ele.textContent) {
                ele.setAttribute("id", "markMenu_" + markMenu.length);
                ele.setAttribute("name", "markMenu_" + markMenu.length);
                markMenu.push({
                    level: i,
                    text: ele.textContent,
                    id: "markMenu_" + markMenu.length,
                    name: "markMenu_" + markMenu.length,
                });
            }
        }
    }
    //docMenu为目录数据
    docMenu.value = markMenu;

    const hash = location.hash.slice(1)
    if (hash) {
        document.getElementById(hash)?.scrollIntoView()
    }
}

// 点赞
function clickLike() {
    if (!loginStatus.value) {
        store.$patch({
            showLogin: true
        })
        return
    }
    
    if (userInteract.value.like) {
        api.article.getDeleteLike((route.params.id).toString()).then(res => {
            if (res.success) {
                userInteract.value.like = false
                userInteract.value.likeCount = userInteract.value.likeCount - 1
            }
        })
    } else {
        api.article.getAddLike((route.params.id).toString()).then(res => {
            if (res.success) {
                userInteract.value.like = true
                userInteract.value.likeCount = userInteract.value.likeCount + 1
            }
        })
    }


}

// 收藏
function clickCollect() {
    if (!loginStatus.value) {
        store.$patch({
            showLogin: true
        })
        return
    }
    
    if (userInteract.value.collect) {
        api.article.getDeleteCollect((route.params.id).toString()).then(res => {
            if (res.success) {
                userInteract.value.collect = false
                userInteract.value.collectCount = userInteract.value.collectCount - 1
            }
        })
    } else {
        api.article.getAddCollect((route.params.id).toString()).then(res => {
            if (res.success) {
                userInteract.value.collect = true
                userInteract.value.collectCount = userInteract.value.collectCount + 1
            }
        })
    }

}

function showPoster(status: boolean) {
    isShowPoster.value = status

    // let images = posterDocument.value!.getElementsByTagName("img");
    // for (let index = 0; index < images.length; index++) {
    //     images[index].setAttribute('crossOrigin', 'anonymous');
    // }
    DomToImage
        .toPng(posterDocument.value!)
        .then((e: string) => {
            posterImage.value = e;
        })
        .catch((err: any) => {
            console.log(err);

        });
}

function closePoster() {
    isShowPoster.value = false
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
        setContentsActive();
    }
}
function handleChange(v: any) {
    articleHtmlContent.value = v;
}

function setContentsActive() {
    if (!articleContents.value) {
        return
    }
    // 获取所有锚点元素
    const titleNavList = document.querySelectorAll(
        "#markdown-body h1,#markdown-body h2,#markdown-body h3,#markdown-body h4,#markdown-body h5,#markdown-body h6"
    );

    // 计算所有锚点元素的 offsetTop 的高度
    const offsetTopList: any[] = [];
    titleNavList.forEach((item) => {
        offsetTopList.push((item as any).offsetTop);
    });

    // 获取当前文档流的 scrollTop
    const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
    // 定义当前所在的目录下标
    let navIndex = 0;
    // 比较当前文章滚动的距离scrollTop与各锚点标题的offsetTop ,当scrollTop超过当前元素的scrollTop,则定位到当前标题
    for (let n = 0; n < offsetTopList.length; n++) {
        if (scrollTop >= offsetTopList[n]) {
            navIndex = n;
        }
    }
    //当前高亮的目录索引,默认为0
    tocActive.value = navIndex;

    let cateList = Array.prototype.slice.call(
        articleContents.value!.querySelectorAll("li")
    );
    for (let i = 0; i < cateList.length; i++) {
        if (navIndex === i) {
            const top = getElementTop(
                cateList[i],
                articleContents.value!
            );
            articleContents.value!.scrollTop =
                top - articleContents.value!.offsetHeight / 2;
        }
    }
}
function getElementTop(el: { offsetTop: any; }, by: HTMLInputElement) {
    let top = el.offsetTop;
    if (by) {
        top = top - by.offsetTop;
    }
    return top;
}


const labels = computed(() => splitTags(article.value?.labels))
const wordCount = computed(() => String(article.value?.content ?? '').replace(/\s/g, '').length)
const readingMinutes = computed(() => Math.max(1, Math.ceil(wordCount.value / 400)))
const categoryCopy = computed(() => getArticleCategoryCopy(article.value?.category?.name))
const relatedTools = computed(() => (categoryCopy.value.toolSlugs ?? []).map(slug => ({
    slug,
    name: toolNames[slug] ?? slug,
})))
const breadcrumbItems = computed(() => {
    const items: { label: string, to?: string }[] = [{ label: '文章', to: '/read' }]
    if (article.value?.category?.name) {
        items.push(categoryId.value
            ? { label: article.value.category.name, to: '/read/category/' + categoryId.value }
            : { label: article.value.category.name })
    }
    if (article.value?.title) {
        items.push({ label: article.value.title })
    }
    return items
})

useHead({
    link: [
        { rel: 'stylesheet', href: '/fonts/katex.min.css' },
        { rel: 'stylesheet', href: '/css/bytemd.css' }
    ],
})

usePageSeo(() => ({
    title: article.value ? `${article.value.title} - 文章 - ZNGG在线工具` : '文章不存在 - ZNGG在线工具',
    description: article.value?.summary || 'ZNGG在线工具技术文章',
    keywords: article.value
        ? [article.value.category?.name, ...labels.value, '技术文章', 'ZNGG'].filter(Boolean).join(',')
        : '技术文章',
    path: '/read/post/' + currentId,
    image: article.value?.image || undefined,
    type: 'article',
    jsonLd: article.value ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.value.title,
        description: article.value.summary,
        image: article.value.image ? [article.value.image] : undefined,
        datePublished: article.value.updateTime,
        dateModified: article.value.updateTime,
        author: {
            '@type': 'Person',
            name: article.value.user?.name || 'ZNGG',
        },
        publisher: {
            '@type': 'Organization',
            name: 'ZNGG在线工具',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.zngg.net/logo-black.png',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://www.zngg.net/read/post/' + currentId,
        },
        articleSection: article.value.category?.name,
        wordCount: wordCount.value,
    } : undefined,
}))
</script>

<style scoped>
.container {
    width: 100%;
    padding-right: 1rem
        /* 16px */
    ;
    padding-left: 1rem
        /* 16px */
    ;
}



@media (min-width: 640px) {
    .container {
        max-width: 640px;
        padding-right: 2rem
            /* 32px */
        ;
        padding-left: 2rem
            /* 32px */
        ;
    }
}

@media (min-width: 768px) {
    .container {
        max-width: 768px;
    }
}

@media (min-width: 1024px) {
    .container {
        max-width: 1024px;
        padding-right: 4rem
            /* 64px */
        ;
        padding-left: 4rem
            /* 64px */
        ;
    }
}

.container {
    max-width: 1236px;
}

.empty {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.article-contents {
    max-height: 460px;
}

.article-contents::-webkit-scrollbar {
    width: 6px;
    height: 80px;
}

.article-contents::-webkit-scrollbar-track {
    box-shadow: none;
    border-radius: 4px;
}

.article-contents::-webkit-scrollbar-thumb {
    background-color: #e4e6eb;
    outline: none;
    border-radius: 4px;
}

.article-contents .level_1 {
    padding-left: 10px;
}

.article-contents .level_2 {
    padding-left: 20px;
}

.article-contents .level_3 {
    padding-left: 30px;
}

.article-contents .level_4 {
    padding-left: 40px;
}

.article-contents .level_5 {
    padding-left: 50px;
}

.article-contents .level_6 {
    padding-left: 60px;
}

.article-contents .active:before {
    content: "";
    position: absolute;
    left: -21px;
    margin-top: 10px;
    width: 4px;
    height: 16px;
    background: #1e80ff;
    border-radius: 0 4px 4px 0;
}

.left-button-box i {
    font-size: 24px;
}

.left-button-box ul>li {
    margin-bottom: 32px;
}

.poster-content {
    position: relative;
    height: 400px;

}

.poster-content-mask {
    position: absolute;
    width: 100%;
    top: 0;
    height: 100%;
    background-image: linear-gradient(to bottom, #00000000, #50000000, #70000000, #ffffff, #ffffff);
}
</style>
