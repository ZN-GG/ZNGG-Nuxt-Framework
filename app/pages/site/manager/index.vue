<template>
    <div></div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['admin']
})

await navigateTo('/site/manager/download', { replace: true })
</script>
