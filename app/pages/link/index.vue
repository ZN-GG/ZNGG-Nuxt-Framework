<template>
    <div class="bg-white min-h-screen">
        <section class="bg-gray-100">
            <div class="container px-4 mx-auto">
                <div class="md:flex md:-mx-4 md:items-center py-8">
                    <div class="md:w-1/2 px-4">
                        <h1 class="text-2xl text-black">友情链接</h1>
                    </div>
                </div>
            </div>
        </section>
        <section>
            <div class="container px-4 mx-auto">
                <div class="py-5">
                    <ul class="w-full flex flex-wrap">
                        <li v-for="item in friendLinks?.data" class="w-full md:w-4/12">
                            <div class="hover:bg-gray-100 hover:text-gray-700 transition duration-300 ease-in-out p-3">
                                <a :href="item.url" target="_blank">
                                    <div class="flex items-start">
                                        <div class="grow">
                                            <p class="text-gray-800 font-bold mb-1">{{ item.name }}</p>
                                            <p class="text-gray-500">
                                                {{ item.description }}
                                            </p>
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

const { data: friendLinks, pending, refresh, error } = await useAsyncData("web_FriendLinks", () => api.web.getFriendLinks());
if (friendLinks.value?.success) {
    console.log(friendLinks.value);
    
}

usePageSeo({
    title: '友情链接 - ZNGG在线工具',
    description: '友情链接与优质网站推荐，收录值得关注的个人博客、工具站与技术社区。',
    keywords: '友情链接,优质网站推荐,个人博客,技术社区',
    path: '/link',
})
</script>