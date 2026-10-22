<template>
    <div class="min-h-screen">
        <section class="bg-gray-100">
            <div class="container px-4 mx-auto">
                <div class="md:flex md:-mx-4 md:items-center py-8">
                    <div class="md:w-1/2 px-4">
                        <h1 class="text-2xl text-black">优质网址导航</h1>
                    </div>
                </div>
            </div>
        </section>
        <section>
            <div class="bg-white">
                <div class="container mx-auto px-4">
                    <div 
                        class="flex py-3 space-x-4 flex-none overflow-auto">
                        <div v-for="(item, index) in navLinks?.data" :key="index" @click="selectCategoryId(index)"
                            class="btn-2" :class="categoryId == index ? 'bg-blue-600 text-white' : ''">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="container px-4 mx-auto">
                <div class="py-5">
                    <ul class="w-full flex flex-wrap">
                        <li v-for="item in navLinks?.data[categoryId].itemList" class="w-full md:w-4/12">
                            <div class="transition duration-300 ease-in-out p-2">
                                <a :href="item.url" target="_blank">
                                    <div class="bg-white rounded px-3 py-4 nav-item-anim">
                                        <div class="flex">
                                            <div class="w-2/12 flex items-center">
                                                <img class="w-8 h-8 mx-auto" :src="item.img" alt="" srcset="">
                                            </div>
                                            <div class="px-2">

                                                <div class="flex items-start">
                                                    <div class="grow">
                                                        <p class="text-gray-800 mb-1">{{ item.title }}</p>
                                                        <p class="text-gray-400 text-xs">
                                                            {{ item.description }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
import { api } from "~/api/api";
let categoryId = ref(0)

const { data: navLinks, pending, refresh, error } = await useAsyncData("web_NavLinks", () => api.web.getNavInfo());
if (navLinks.value?.success) {
    console.log(navLinks.value);

}

async function selectCategoryId(id: number) {
    categoryId.value = id
}

usePageSeo({
    title: '优质网址导航 - ZNGG在线工具',
    description: '精选优质网站与常用服务，覆盖开发、设计、效率等分类，帮助你快速找到需要的站点。',
    keywords: '网址导航,优质网站导航,开发工具导航,设计资源导航,效率网站',
    path: '/nav',
})
</script>