<template>
    <div class="prose prose-sm max-w-none markdown-body prose-img:rounded-lg prose-img:border prose-img:border-gray-100 prose-img:shadow-sm"
        v-html="html"></div>
</template>
<script setup lang="ts">
const props = defineProps<{
    content?: string
}>()

const { marked } = await import('marked')

const html = computed(() => {
    if (!props.content) return ''
    try {
        return marked.parse(props.content) as string
    } catch (e) {
        return ''
    }
})
</script>
