<template>
    <div>
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-md bg-white p-6">
            <div>
                <p class="text-xl font-semibold text-gray-800">应用管理</p>
                <p class="mt-1 text-xs text-gray-500">添加、编辑和删除下载资源，仅管理员可操作。</p>
            </div>
            <button type="button" class="btn-normal" @click="openCreate">添加应用</button>
        </div>

        <div class="mt-4 rounded-md bg-white p-6">
            <div class="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div class="flex items-center gap-2">
                    <span class="-ml-3 h-5 w-1 shrink-0 rounded-full bg-blue-600"></span>
                    <p class="text-lg font-semibold text-gray-800">应用列表</p>
                </div>
                <span class="text-xs text-gray-400">共 {{ total }} 个</span>
            </div>

            <div v-if="loading" class="py-12 text-center text-sm text-gray-400">加载中...</div>
            <div v-else-if="!list.length" class="py-12 text-center text-sm text-gray-400">暂无应用</div>
            <div v-else class="mt-2 overflow-x-auto">
                <table class="w-full min-w-[760px] text-left text-sm">
                    <thead>
                        <tr class="border-b border-gray-100 text-xs text-gray-400">
                            <th class="py-2 pr-4 font-medium">应用</th>
                            <th class="py-2 pr-4 font-medium">分类</th>
                            <th class="py-2 pr-4 font-medium">类型</th>
                            <th class="py-2 pr-4 font-medium">版本</th>
                            <th class="py-2 pr-4 font-medium">状态</th>
                            <th class="py-2 pr-4 font-medium">更新时间</th>
                            <th class="py-2 text-right font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list" :key="item.id" class="border-b border-gray-50 last:border-b-0">
                            <td class="py-3 pr-4">
                                <div class="flex items-center gap-2">
                                    <img v-if="item.cover" :src="item.cover" alt=""
                                        class="h-8 w-8 rounded object-cover" />
                                    <span class="line-clamp-1 font-medium text-gray-700">{{ item.title }}</span>
                                </div>
                            </td>
                            <td class="py-3 pr-4 text-gray-500">
                                {{ item.category?.name || categoryName(item.categoryId) || '-' }}
                            </td>
                            <td class="py-3 pr-4 text-gray-500">{{ item.type === 'SOFTWARE' ? '软件' : '资源' }}</td>
                            <td class="py-3 pr-4 text-gray-500">{{ item.version || '-' }}</td>
                            <td class="py-3 pr-4">
                                <span class="rounded-sm px-2 py-0.5 text-[11px]"
                                    :class="item.state === '0' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'">
                                    {{ item.state === '0' ? '已上架' : '草稿' }}
                                </span>
                            </td>
                            <td class="py-3 pr-4 text-gray-400">{{ (item.updateTime || '').slice(0, 10) || '-' }}</td>
                            <td class="py-3 text-right">
                                <button type="button" class="text-xs text-blue-600 hover:underline"
                                    @click="openEdit(item)">编辑</button>
                                <button type="button" class="ml-3 text-xs text-red-500 hover:underline"
                                    @click="remove(item)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="totalPages > 1" class="mt-4 flex items-center justify-end gap-3 text-xs text-gray-500">
                <button type="button" class="rounded-sm border border-gray-200 px-3 py-1 disabled:opacity-40"
                    :disabled="page <= 1" @click="goPage(page - 1)">上一页</button>
                <span>{{ page }} / {{ totalPages }}</span>
                <button type="button" class="rounded-sm border border-gray-200 px-3 py-1 disabled:opacity-40"
                    :disabled="page >= totalPages" @click="goPage(page + 1)">下一页</button>
            </div>
        </div>

        <div v-if="showForm" class="fixed inset-0 z-40 overflow-y-auto bg-black/40 p-4" @click.self="closeForm">
            <div class="mx-auto my-8 w-full max-w-3xl rounded-md bg-white p-6">
                <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                    <p class="text-lg font-semibold text-gray-800">{{ editingId ? '编辑应用' : '添加应用' }}</p>
                    <button type="button" class="text-xl leading-none text-gray-400 hover:text-gray-600"
                        @click="closeForm">×</button>
                </div>

                <form class="mt-4" @submit.prevent="save">
                    <div class="grid max-h-[65vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
                        <label>
                            <span :class="labelClass">标题 *</span>
                            <input v-model="form.title" :class="fieldClass" placeholder="应用名称" />
                        </label>
                        <label>
                            <span :class="labelClass">分类 *</span>
                            <select v-model="form.categoryId" :class="fieldClass">
                                <option value="">请选择分类</option>
                                <option v-for="category in categories" :key="category.id" :value="category.id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </label>
                        <label>
                            <span :class="labelClass">类型</span>
                            <select v-model="form.type" :class="fieldClass">
                                <option value="SOFTWARE">软件</option>
                                <option value="RESOURCE">资源</option>
                            </select>
                        </label>
                        <label>
                            <span :class="labelClass">状态</span>
                            <select v-model="form.state" :class="fieldClass">
                                <option value="0">上架</option>
                                <option value="1">草稿</option>
                            </select>
                        </label>
                        <label class="sm:col-span-2">
                            <span :class="labelClass">简介 *</span>
                            <textarea v-model="form.summary" :class="fieldClass" rows="2" placeholder="一句话介绍这个应用"></textarea>
                        </label>

                        <div class="sm:col-span-2">
                            <span :class="labelClass">封面</span>
                            <div class="flex flex-wrap items-center gap-2">
                                <input v-model="form.cover" :class="[fieldClass, 'flex-1']" placeholder="图片地址" />
                                <label
                                    class="inline-flex cursor-pointer items-center rounded-sm border border-gray-200 px-3 py-2 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-600">
                                    <input type="file" class="hidden" accept="image/*" @change="uploadCover" />
                                    {{ coverUploading ? '上传中...' : '上传封面' }}
                                </label>
                            </div>
                            <img v-if="form.cover" :src="form.cover" alt=""
                                class="mt-2 h-20 w-32 rounded border border-gray-100 object-cover" />
                        </div>

                        <div class="sm:col-span-2">
                            <div class="mb-1 flex items-center justify-between gap-2">
                                <span class="text-xs text-gray-500">界面预览</span>
                                <label
                                    class="inline-flex cursor-pointer items-center rounded-sm border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-600">
                                    <input type="file" class="hidden" accept="image/*" multiple
                                        @change="uploadScreenshots" />
                                    {{ screenshotsUploading ? '上传中...' : '上传多张图片' }}
                                </label>
                            </div>
                            <textarea v-model="form.screenshots" :class="fieldClass" rows="3"
                                placeholder="每行一个图片地址，上传后会自动填充"></textarea>
                            <div v-if="screenshotUrls.length" class="mt-2 flex flex-wrap gap-2">
                                <div v-for="(url, index) in screenshotUrls" :key="url + index" class="relative">
                                    <img :src="url" alt=""
                                        class="h-16 w-24 rounded border border-gray-100 object-cover" />
                                    <button type="button"
                                        class="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs leading-none text-white"
                                        @click="removeScreenshot(index)">×</button>
                                </div>
                            </div>
                        </div>

                        <label>
                            <span :class="labelClass">版本</span>
                            <input v-model="form.version" :class="fieldClass" placeholder="如 1.0.0" />
                        </label>
                        <label>
                            <span :class="labelClass">平台</span>
                            <input v-model="form.platform" :class="fieldClass" placeholder="如 Windows / macOS / Linux" />
                        </label>
                        <label>
                            <span :class="labelClass">标签</span>
                            <input v-model="form.tags" :class="fieldClass" placeholder="多个标签用逗号分隔" />
                        </label>
                        <label>
                            <span :class="labelClass">排序</span>
                            <input v-model="form.sort" :class="fieldClass" type="number" />
                        </label>
                        <label>
                            <span :class="labelClass">存储方式</span>
                            <select v-model="form.storageType" :class="fieldClass">
                                <option value="EXTERNAL">外链下载</option>
                                <option value="LOCAL">本地文件</option>
                            </select>
                        </label>
                        <label>
                            <span :class="labelClass">{{ form.storageType === 'EXTERNAL' ? '外链地址 *' : '文件地址' }}</span>
                            <input v-model="form.fileUrl" :class="fieldClass"
                                :placeholder="form.storageType === 'EXTERNAL' ? 'https://...' : '上传后自动填写'" />
                        </label>

                        <div class="sm:col-span-2">
                            <div class="flex flex-wrap items-center gap-2">
                                <label
                                    class="inline-flex cursor-pointer items-center rounded-sm border border-gray-200 px-3 py-2 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-600">
                                    <input type="file" class="hidden" @change="uploadFile" />
                                    {{ fileUploading ? '上传中...' : '上传应用文件' }}
                                </label>
                                <span v-if="form.fileName" class="text-xs text-gray-400">
                                    {{ form.fileName }} {{ sizeLabel(form.fileSize) }}
                                </span>
                            </div>
                        </div>

                        <label class="sm:col-span-2">
                            <span :class="labelClass">详情内容（Markdown）</span>
                            <textarea v-model="form.content" :class="fieldClass" rows="8"
                                placeholder="支持 Markdown 格式"></textarea>
                        </label>
                    </div>

                    <div class="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4">
                        <button type="button"
                            class="rounded-sm border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                            @click="closeForm">取消</button>
                        <button type="submit" class="btn-normal" :disabled="saving">
                            {{ saving ? '保存中...' : '保存' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { api } from '~/api/api'
import { splitUrls } from '~/utils/tags'
import { normalizeImageFile } from '~/utils/image'

definePageMeta({
    middleware: ['admin']
})

useHead({
    title: '应用管理',
    titleTemplate: (title) => `${title} - 管理后台 - ZNGG在线工具`,
})

const { $toast } = useNuxtApp()

const list = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(true)
const page = ref(1)
const total = ref(0)
const totalPages = ref(1)
const showForm = ref(false)
const saving = ref(false)
const coverUploading = ref(false)
const screenshotsUploading = ref(false)
const fileUploading = ref(false)
const editingId = ref('')
const form = ref(createEmptyForm())
const screenshotUrls = computed(() => splitUrls(form.value.screenshots))

const fieldClass = 'w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none'
const labelClass = 'mb-1 block text-xs text-gray-500'

onMounted(() => {
    Promise.all([loadList(), loadCategories()])
})

function createEmptyForm() {
    return {
        id: '',
        title: '',
        categoryId: '',
        type: 'SOFTWARE',
        state: '0',
        summary: '',
        content: '',
        cover: '',
        screenshots: '',
        version: '',
        platform: '',
        tags: '',
        sort: 100,
        storageType: 'EXTERNAL',
        fileUrl: '',
        fileName: '',
        fileSize: '',
        fileHash: '',
    }
}

function normalizeList(data: any): any[] {
    if (Array.isArray(data)) return data
    return data?.content ?? data?.records ?? []
}

async function loadList() {
    loading.value = true
    const result = await api.admin.download.getList(page.value, 10)
    loading.value = false
    if (!result.success) {
        $toast.error(result.message || '加载失败')
        return
    }
    const data = result.data || {}
    list.value = normalizeList(data)
    total.value = Number(data.totalElements ?? data.total ?? list.value.length) || 0
    totalPages.value = Number(data.totalPages ?? data.pages ?? 1) || 1
}

async function loadCategories() {
    const result = await api.admin.download.getCategories()
    if (result.success) {
        categories.value = normalizeList(result.data)
        return
    }
    const fallback = await api.download.getCategories()
    if (fallback.success) {
        categories.value = normalizeList(fallback.data)
    }
}

function openCreate() {
    editingId.value = ''
    form.value = createEmptyForm()
    showForm.value = true
}

function openEdit(item: any) {
    editingId.value = item.id
    form.value = {
        ...createEmptyForm(),
        id: item.id,
        title: item.title ?? '',
        categoryId: item.categoryId ?? item.category?.id ?? '',
        type: item.type ?? 'SOFTWARE',
        state: String(item.state ?? '0'),
        summary: item.summary ?? '',
        content: item.content ?? '',
        cover: item.cover ?? '',
        screenshots: item.screenshots ?? '',
        version: item.version ?? '',
        platform: item.platform ?? '',
        tags: item.tags ?? '',
        sort: item.sort ?? 100,
        storageType: item.storageType ?? 'EXTERNAL',
        fileUrl: item.fileUrl ?? '',
        fileName: item.fileName ?? '',
        fileSize: item.fileSize ?? '',
        fileHash: item.fileHash ?? '',
    }
    showForm.value = true
}

function closeForm() {
    if (saving.value) return
    showForm.value = false
}

function buildPayload() {
    const value = form.value
    return {
        id: value.id || undefined,
        title: value.title.trim(),
        categoryId: value.categoryId,
        type: value.type,
        state: String(value.state),
        summary: value.summary.trim(),
        content: value.content,
        cover: value.cover.trim(),
        screenshots: value.screenshots,
        version: value.version.trim(),
        platform: value.platform.trim(),
        tags: value.tags.trim(),
        sort: Number(value.sort) || 0,
        storageType: value.storageType,
        fileUrl: value.fileUrl.trim(),
        fileName: value.fileName,
        fileSize: value.fileSize === '' ? undefined : Number(value.fileSize),
        fileHash: value.fileHash,
    }
}

async function save() {
    if (!form.value.title.trim()) {
        $toast.error('请输入标题')
        return
    }
    if (!form.value.categoryId) {
        $toast.error('请选择分类')
        return
    }
    if (!form.value.summary.trim()) {
        $toast.error('请填写简介')
        return
    }
    if (!form.value.fileUrl.trim()) {
        $toast.error(form.value.storageType === 'EXTERNAL' ? '请填写外链地址' : '请上传应用文件')
        return
    }
    if (form.value.screenshots.length > 2000) {
        $toast.error('界面预览图片过多')
        return
    }

    saving.value = true
    const payload = buildPayload()
    const result = editingId.value
        ? await api.admin.download.update(payload)
        : await api.admin.download.add(payload)
    saving.value = false

    if (!result.success) {
        $toast.error(result.message || '保存失败')
        return
    }
    $toast.success(editingId.value ? '已更新' : '已添加')
    showForm.value = false
    await loadList()
}

async function remove(item: any) {
    if (!window.confirm('确定删除「' + item.title + '」吗？')) return
    const result = await api.admin.download.remove(item.id)
    if (!result.success) {
        $toast.error(result.message || '删除失败')
        return
    }
    $toast.success('已删除')
    if (list.value.length === 1 && page.value > 1) {
        page.value -= 1
    }
    await loadList()
}

async function goPage(next: number) {
    if (next < 1 || next > totalPages.value) return
    page.value = next
    await loadList()
}

function categoryName(id: string) {
    return categories.value.find(category => category.id === id)?.name || ''
}

function sizeLabel(bytes: any) {
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

async function uploadCover(event: Event) {
    const input = event.target as HTMLInputElement
    const rawFile = input.files?.[0]
    if (!rawFile) return
    input.value = ''
    let file: File
    try {
        file = await normalizeImageFile(rawFile)
    } catch (error) {
        $toast.error((error as Error).message)
        return
    }
    coverUploading.value = true
    const formData = new FormData()
    formData.append('file', file)
    const result = await api.upload.uploadImage(formData)
    coverUploading.value = false
    if (!result.success) {
        $toast.error(result.message || '上传失败')
        return
    }
    form.value.cover = 'https://cdn.zngg.net/upload/image/' + result.message
}

async function uploadScreenshots(event: Event) {
    const input = event.target as HTMLInputElement
    const files = Array.from(input.files || [])
    if (!files.length) return
    screenshotsUploading.value = true
    const urls: string[] = []
    let failed = 0
    for (const rawFile of files) {
        try {
            const file = await normalizeImageFile(rawFile)
            const formData = new FormData()
            formData.append('file', file)
            const result = await api.upload.uploadImage(formData)
            if (result.success) {
                urls.push('https://cdn.zngg.net/upload/image/' + result.message)
            } else {
                failed += 1
            }
        } catch {
            failed += 1
        }
    }
    screenshotsUploading.value = false
    input.value = ''
    if (!urls.length) {
        $toast.error('图片上传失败，请使用 JPG 或 PNG 格式')
        return
    }
    if (failed) {
        $toast.info(`${failed} 张图片处理失败`)
    }
    const next = [...splitUrls(form.value.screenshots), ...urls].join('\n')
    if (next.length > 2000) {
        $toast.error('图片地址总长度超出限制')
        return
    }
    form.value.screenshots = next
}

function removeScreenshot(index: number) {
    const urls = [...screenshotUrls.value]
    urls.splice(index, 1)
    form.value.screenshots = urls.join('\n')
}

async function uploadFile(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return
    fileUploading.value = true
    const formData = new FormData()
    formData.append('file', file)
    const result = await api.admin.download.uploadFile(formData)
    fileUploading.value = false
    if (!result.success) {
        $toast.error(result.message || '上传失败')
        return
    }
    const data: any = result.data
    form.value.fileUrl = data?.fileName || (typeof data === 'string' ? data : (data?.url || result.message))
    form.value.fileName = data?.originalName || file.name
    form.value.fileSize = String(data?.size ?? file.size)
    form.value.fileHash = data?.hash || ''
    form.value.storageType = 'LOCAL'
    input.value = ''
}
</script>
