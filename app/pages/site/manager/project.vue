<template>
    <div>
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-md bg-white p-6">
            <div>
                <p class="text-xl font-semibold text-gray-800">项目管理</p>
                <p class="mt-1 text-xs text-gray-500">添加、编辑和删除开源项目，仅管理员可操作。</p>
            </div>
            <button type="button" class="btn-normal" @click="openCreate">添加项目</button>
        </div>

        <div class="mt-4 rounded-md bg-white p-6">
            <div class="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div class="flex items-center gap-2">
                    <span class="-ml-3 h-5 w-1 shrink-0 rounded-full bg-blue-600"></span>
                    <p class="text-lg font-semibold text-gray-800">项目列表</p>
                </div>
                <span class="text-xs text-gray-400">共 {{ total }} 个</span>
            </div>

            <div v-if="loading" class="py-12 text-center text-sm text-gray-400">加载中...</div>
            <div v-else-if="!list.length" class="py-12 text-center text-sm text-gray-400">暂无项目</div>
            <div v-else class="mt-2 overflow-x-auto">
                <table class="w-full min-w-[760px] text-left text-sm">
                    <thead>
                        <tr class="border-b border-gray-100 text-xs text-gray-400">
                            <th class="py-2 pr-4 font-medium">项目</th>
                            <th class="py-2 pr-4 font-medium">平台</th>
                            <th class="py-2 pr-4 font-medium">语言</th>
                            <th class="py-2 pr-4 font-medium">Stars</th>
                            <th class="py-2 pr-4 font-medium">状态</th>
                            <th class="py-2 pr-4 font-medium">更新时间</th>
                            <th class="py-2 text-right font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list" :key="item.id" class="border-b border-gray-50 last:border-b-0">
                            <td class="py-3 pr-4">
                                <div class="flex items-center gap-2">
                                    <img v-if="item.logo" :src="item.logo" alt=""
                                        class="h-8 w-8 rounded object-cover" />
                                    <div v-else
                                        class="flex h-8 w-8 items-center justify-center rounded bg-blue-50 text-xs font-semibold text-blue-600">
                                        {{ (item.name || '?').slice(0, 1) }}
                                    </div>
                                    <span class="line-clamp-1 font-medium text-gray-700">{{ item.name }}</span>
                                </div>
                            </td>
                            <td class="py-3 pr-4 text-gray-500">{{ platformLabel(item.platform) }}</td>
                            <td class="py-3 pr-4 text-gray-500">{{ item.language || '-' }}</td>
                            <td class="py-3 pr-4 text-gray-500">{{ item.stars ?? 0 }}</td>
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
                    <p class="text-lg font-semibold text-gray-800">{{ editingId ? '编辑项目' : '添加项目' }}</p>
                    <button type="button" class="text-xl leading-none text-gray-400 hover:text-gray-600"
                        @click="closeForm">×</button>
                </div>

                <form class="mt-4" @submit.prevent="save">
                    <div class="grid max-h-[65vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
                        <label>
                            <span :class="labelClass">名称 *</span>
                            <input v-model="form.name" :class="fieldClass" placeholder="项目名称" />
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
                            <span :class="labelClass">平台</span>
                            <select v-model="form.platform" :class="fieldClass">
                                <option value="GITHUB">GitHub</option>
                                <option value="GITEE">Gitee</option>
                                <option value="OTHER">其他</option>
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
                            <textarea v-model="form.summary" :class="fieldClass" rows="2" placeholder="一句话介绍这个项目"></textarea>
                        </label>

                        <div class="sm:col-span-2">
                            <span :class="labelClass">Logo</span>
                            <div class="flex flex-wrap items-center gap-2">
                                <input v-model="form.logo" :class="[fieldClass, 'flex-1']" placeholder="图片地址" />
                                <label
                                    class="inline-flex cursor-pointer items-center rounded-sm border border-gray-200 px-3 py-2 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-600">
                                    <input type="file" class="hidden" accept="image/*" @change="uploadLogo" />
                                    {{ logoUploading ? '上传中...' : '上传 Logo' }}
                                </label>
                            </div>
                            <img v-if="form.logo" :src="form.logo" alt=""
                                class="mt-2 h-16 w-16 rounded border border-gray-100 object-cover" />
                        </div>

                        <label>
                            <span :class="labelClass">仓库地址</span>
                            <input v-model="form.repoUrl" :class="fieldClass" placeholder="https://github.com/..." />
                        </label>
                        <label>
                            <span :class="labelClass">项目主页</span>
                            <input v-model="form.homepageUrl" :class="fieldClass" placeholder="https://..." />
                        </label>
                        <label>
                            <span :class="labelClass">开发语言</span>
                            <input v-model="form.language" :class="fieldClass" placeholder="如 TypeScript" />
                        </label>
                        <label>
                            <span :class="labelClass">License</span>
                            <input v-model="form.license" :class="fieldClass" placeholder="如 MIT" />
                        </label>
                        <label>
                            <span :class="labelClass">Stars</span>
                            <input v-model="form.stars" :class="fieldClass" type="number" min="0" />
                        </label>
                        <label>
                            <span :class="labelClass">Forks</span>
                            <input v-model="form.forks" :class="fieldClass" type="number" min="0" />
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
                            <span :class="labelClass">是否精选</span>
                            <select v-model="form.featured" :class="fieldClass">
                                <option :value="0">普通</option>
                                <option :value="1">精选</option>
                            </select>
                        </label>

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
import { normalizeImageFile } from '~/utils/image'

definePageMeta({
    middleware: ['admin']
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
const logoUploading = ref(false)
const editingId = ref('')
const form = ref(createEmptyForm())

const fieldClass = 'w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none'
const labelClass = 'mb-1 block text-xs text-gray-500'

onMounted(() => {
    Promise.all([loadList(), loadCategories()])
})

function createEmptyForm() {
    return {
        id: '',
        name: '',
        categoryId: '',
        platform: 'GITHUB',
        state: '0',
        summary: '',
        content: '',
        logo: '',
        repoUrl: '',
        homepageUrl: '',
        language: '',
        license: '',
        stars: 0,
        forks: 0,
        tags: '',
        sort: 100,
        featured: 0,
    }
}

function normalizeList(data: any): any[] {
    if (Array.isArray(data)) return data
    return data?.content ?? data?.records ?? []
}

async function loadList() {
    loading.value = true
    const result = await api.admin.project.getList(page.value, 10)
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
    const result = await api.admin.project.getCategories()
    if (result.success) {
        categories.value = normalizeList(result.data)
        return
    }
    const fallback = await api.project.getCategories()
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
        name: item.name ?? '',
        categoryId: item.categoryId ?? item.category?.id ?? '',
        platform: item.platform ?? 'GITHUB',
        state: String(item.state ?? '0'),
        summary: item.summary ?? '',
        content: item.content ?? '',
        logo: item.logo ?? '',
        repoUrl: item.repoUrl ?? '',
        homepageUrl: item.homepageUrl ?? '',
        language: item.language ?? '',
        license: item.license ?? '',
        stars: item.stars ?? 0,
        forks: item.forks ?? 0,
        tags: item.tags ?? '',
        sort: item.sort ?? 100,
        featured: Number(item.featured ?? 0),
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
        name: value.name.trim(),
        categoryId: value.categoryId,
        platform: value.platform,
        state: String(value.state),
        summary: value.summary.trim(),
        content: value.content,
        logo: value.logo.trim(),
        repoUrl: value.repoUrl.trim(),
        homepageUrl: value.homepageUrl.trim(),
        language: value.language.trim(),
        license: value.license.trim(),
        stars: Number(value.stars) || 0,
        forks: Number(value.forks) || 0,
        tags: value.tags.trim(),
        sort: Number(value.sort) || 0,
        featured: Number(value.featured) || 0,
    }
}

async function save() {
    if (!form.value.name.trim()) {
        $toast.error('请输入项目名称')
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

    saving.value = true
    const payload = buildPayload()
    const result = editingId.value
        ? await api.admin.project.update(payload)
        : await api.admin.project.add(payload)
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
    if (!window.confirm('确定删除「' + item.name + '」吗？')) return
    const result = await api.admin.project.remove(item.id)
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

function platformLabel(platform: string) {
    const map: Record<string, string> = {
        GITHUB: 'GitHub',
        GITEE: 'Gitee',
        OTHER: '其他',
    }
    return map[platform] ?? platform ?? '-'
}

async function uploadLogo(event: Event) {
    const input = event.target as HTMLInputElement
    const rawFile = input.files?.[0]
    if (!rawFile) return
    input.value = ''
    let file: File
    try {
        file = await normalizeImageFile(rawFile, { maxSize: 512, outputType: 'image/png' })
    } catch (error) {
        $toast.error((error as Error).message)
        return
    }
    logoUploading.value = true
    const formData = new FormData()
    formData.append('file', file)
    const result = await api.upload.uploadImageCover(formData)
    logoUploading.value = false
    if (!result.success) {
        $toast.error(result.message || '上传失败')
        return
    }
    form.value.logo = 'https://cdn.zngg.net/upload/image/cover/' + result.message
}
</script>
