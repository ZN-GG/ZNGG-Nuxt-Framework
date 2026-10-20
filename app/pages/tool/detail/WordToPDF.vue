<template>
    <div class="convert-bg"></div>
    <div class="office-bg pb-28">
        <div class="container mx-auto">
            <div class="bg-white px-6 rounded-2xl relative shadow-lg">
                <div class="pt-4 text-center">
                    <h1 class="text-2xl font-bold">Word 转 PDF</h1>
                    <p class="mt-2 text-sm text-gray-500">
                        仅支持 .docx，转换在浏览器本地完成，文件不会上传到服务器
                    </p>
                </div>

                <div v-show="!fileName" class="upload-box py-6">
                    <div class="border-gray-500 border-2 border-dashed relative h-72">
                        <input ref="inputElement" type="file" accept=".docx" style="opacity: 0;position: absolute;cursor: pointer;width: 100%;height: 100%;left: 0;top: 0;"
                            @change="selectFile">
                        <div class="in-upload-box">
                            <img src="/img/office/upload-btn.svg" class="mx-auto w-32 h-32 mb-4" alt="">
                            <div @click="inputElement?.click()"
                                class="btn-3 bg-blue-600 text-white py-2 text-center hover:bg-blue-800 cursor-pointer px-8">
                                选择 .docx 文件
                            </div>
                        </div>
                    </div>
                    <p v-if="error" class="mt-4 text-center text-sm text-red-500">{{ error }}</p>
                    <p class="mt-4 text-center text-xs text-gray-400">
                        复杂排版（文本框、浮动图片、页眉页脚）可能无法完全还原
                    </p>
                </div>

                <div v-show="fileName" class="py-6">
                    <div class="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                        <p class="min-w-0 break-words font-bold">{{ fileName }}</p>
                        <div class="flex shrink-0 items-center gap-2">
                            <button type="button" class="btn-1 px-4 py-2" @click="reset">重新选择</button>
                            <button type="button"
                                class="rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-800 disabled:opacity-60"
                                :disabled="rendering" @click="exportPdf">
                                {{ rendering ? '渲染中...' : '导出 PDF' }}
                            </button>
                        </div>
                    </div>

                    <p class="mt-3 text-xs text-gray-400">
                        点击“导出 PDF”后，在打印窗口的目标打印机中选择“另存为 PDF”。
                    </p>
                    <p v-if="error" class="mt-3 text-sm text-red-500">{{ error }}</p>

                    <div id="docx-print-area" ref="previewRef" class="docx-preview-box mt-4 overflow-auto bg-gray-100 p-4">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
const inputElement = ref<HTMLInputElement>()
const previewRef = ref<HTMLElement>()
const fileName = ref('')
const rendering = ref(false)
const error = ref('')

async function selectFile(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    input.value = ''
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.docx')) {
        error.value = '仅支持 .docx 文件，请先将 .doc 另存为 .docx'
        return
    }
    if (file.size > 30 * 1024 * 1024) {
        error.value = '文件过大，建议不超过 30MB'
        return
    }

    fileName.value = file.name
    error.value = ''
    rendering.value = true
    await nextTick()

    try {
        const { renderAsync } = await import('docx-preview')
        const buffer = await file.arrayBuffer()
        if (previewRef.value) {
            previewRef.value.innerHTML = ''
            await renderAsync(buffer, previewRef.value, undefined, {
                inWrapper: false,
                breakPages: true,
                ignoreWidth: false,
                ignoreHeight: false,
                renderHeaders: true,
                renderFooters: true,
                experimental: true,
            })
        }
    } catch (e) {
        error.value = '文档解析失败，请确认文件为有效的 .docx'
        console.error(e)
    } finally {
        rendering.value = false
    }
}

function exportPdf() {
    if (!fileName.value || rendering.value) return
    window.print()
}

function reset() {
    fileName.value = ''
    error.value = ''
    if (previewRef.value) {
        previewRef.value.innerHTML = ''
    }
}

useHead({
    title: "Word转PDF",
    titleTemplate: (title) => `${title} - 工具 - ZNGG在线工具`,
    meta: [
        { name: 'Keywords', content: 'word转pdf,word to pdf,docx转pdf' },
        { name: 'description', content: '在线Word转PDF工具，仅支持 .docx，浏览器本地转换，文件不上传，免费无需登录。' }
    ],
})
</script>
<style scoped>
.convert-bg {
    height: 130px;
    background: url(/img/office/office_banner.svg) bottom no-repeat;
    background-color: #f1f3fe;
}

.office-bg {
    background-color: #f1f3fe;
}

.in-upload-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.docx-preview-box {
    max-height: 70vh;
}

:deep(.docx-wrapper) {
    background: transparent;
    padding: 0;
}

:deep(.docx) {
    margin: 0 auto 16px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
}

@media print {
    :global(body *) {
        visibility: hidden;
    }

    #docx-print-area,
    #docx-print-area * {
        visibility: visible;
    }

    #docx-print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        max-height: none;
        overflow: visible;
        padding: 0;
        background: #fff;
    }

    @page {
        size: A4;
        margin: 12mm;
    }
}
</style>
