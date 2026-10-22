<template>
    <div>
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-md bg-white p-6">
            <div>
                <p class="text-xl font-semibold text-gray-800">导航管理</p>
                <p class="mt-1 text-xs text-gray-500">管理导航分类和导航网站。</p>
            </div>
            <div class="flex flex-wrap gap-2">
                <button type="button"
                    class="rounded-sm border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:border-blue-200 hover:text-blue-600"
                    @click="openCategoryCreate">添加分类</button>
                <button type="button" class="btn-normal" @click="openItemCreate">添加网站</button>
            </div>
        </div>

        <div class="mt-4 rounded-md bg-white p-6">
            <div class="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div class="flex items-center gap-2">
                    <span class="-ml-3 h-5 w-1 shrink-0 rounded-full bg-blue-600"></span>
                    <p class="text-lg font-semibold text-gray-800">导航分类</p>
                </div>
                <span class="text-xs text-gray-400">共 {{ categories.length }} 个</span>
            </div>

            <div v-if="loading" class="py-12 text-center text-sm text-gray-400">加载中...</div>
            <div v-else-if="!categories.length" class="py-12 text-center text-sm text-gray-400">暂无分类</div>
            <div v-else class="mt-2 overflow-x-auto">
                <table class="w-full min-w-[640px] text-left text-sm">
                    <thead>
                        <tr class="border-b border-gray-100 text-xs text-gray-400">
                            <th class="py-2 pr-4 font-medium">名称</th>
                            <th class="py-2 pr-4 font-medium">描述</th>
                            <th class="py-2 pr-4 font-medium">排序</th>
                            <th class="py-2 pr-4 font-medium">状态</th>
                            <th class="py-2 pr-4 font-medium">网站数</th>
                            <th class="py-2 text-right font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="category in categories" :key="category.id"
                            class="border-b border-gray-50 last:border-b-0">
                            <td class="py-3 pr-4 font-medium text-gray-700">{{ category.name }}</td>
                            <td class="py-3 pr-4">
                                <span class="line-clamp-1 text-gray-500">{{ category.description || '-' }}</span>
                            </td>
                            <td class="py-3 pr-4 text-gray-500">{{ category.sort ?? 0 }}</td>
                            <td class="py-3 pr-4">
                                <span class="rounded-sm px-2 py-0.5 text-[11px]"
                                    :class="category.state === '0' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'">
                                    {{ category.state === '0' ? '显示' : '隐藏' }}
                                </span>
                            </td>
                            <td class="py-3 pr-4 text-gray-500">{{ (category.itemList || []).length }}</td>
                            <td class="py-3 text-right">
                                <button type="button" class="text-xs text-blue-600 hover:underline"
                                    @click="openCategoryEdit(category)">编辑</button>
                                <button type="button" class="ml-3 text-xs text-red-500 hover:underline"
                                    @click="removeCategory(category)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-4 rounded-md bg-white p-6">
            <div class="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div class="flex items-center gap-2">
                    <span class="-ml-3 h-5 w-1 shrink-0 rounded-full bg-blue-600"></span>
                    <p class="text-lg font-semibold text-gray-800">导航网站</p>
                </div>
                <span class="text-xs text-gray-400">共 {{ navItems.length }} 个</span>
            </div>

            <div v-if="loading" class="py-12 text-center text-sm text-gray-400">加载中...</div>
            <div v-else-if="!navItems.length" class="py-12 text-center text-sm text-gray-400">暂无网站</div>
            <div v-else class="mt-2 overflow-x-auto">
                <table class="w-full min-w-[760px] text-left text-sm">
                    <thead>
                        <tr class="border-b border-gray-100 text-xs text-gray-400">
                            <th class="py-2 pr-4 font-medium">网站</th>
                            <th class="py-2 pr-4 font-medium">分类</th>
                            <th class="py-2 pr-4 font-medium">地址</th>
                            <th class="py-2 pr-4 font-medium">排序</th>
                            <th class="py-2 pr-4 font-medium">状态</th>
                            <th class="py-2 text-right font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in navItems" :key="item.id" class="border-b border-gray-50 last:border-b-0">
                            <td class="py-3 pr-4">
                                <div class="flex items-center gap-2">
                                    <img v-if="item.img" :src="item.img" alt=""
                                        class="h-7 w-7 rounded object-contain" />
                                    <span class="line-clamp-1 font-medium text-gray-700">{{ item.title }}</span>
                                </div>
                            </td>
                            <td class="py-3 pr-4 text-gray-500">{{ item.categoryName || '-' }}</td>
                            <td class="py-3 pr-4">
                                <a :href="item.url" target="_blank" rel="noopener noreferrer"
                                    class="line-clamp-1 text-blue-600 hover:underline">{{ item.url }}</a>
                            </td>
                            <td class="py-3 pr-4 text-gray-500">{{ item.sort ?? 0 }}</td>
                            <td class="py-3 pr-4">
                                <span class="rounded-sm px-2 py-0.5 text-[11px]"
                                    :class="item.state === '0' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'">
                                    {{ item.state === '0' ? '显示' : '隐藏' }}
                                </span>
                            </td>
                            <td class="py-3 text-right">
                                <button type="button" class="text-xs text-blue-600 hover:underline"
                                    @click="openItemEdit(item)">编辑</button>
                                <button type="button" class="ml-3 text-xs text-red-500 hover:underline"
                                    @click="removeItem(item)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-if="showCategoryForm" class="fixed inset-0 z-40 overflow-y-auto bg-black/40 p-4"
            @click.self="closeCategoryForm">
            <div class="mx-auto my-8 w-full max-w-xl rounded-md bg-white p-6">
                <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                    <p class="text-lg font-semibold text-gray-800">
                        {{ editingCategoryId ? '编辑分类' : '添加分类' }}
                    </p>
                    <button type="button" class="text-xl leading-none text-gray-400 hover:text-gray-600"
                        @click="closeCategoryForm">×</button>
                </div>

                <form class="mt-4" @submit.prevent="saveCategory">
                    <div class="grid gap-4">
                        <label>
                            <span :class="labelClass">名称 *</span>
                            <input v-model="categoryForm.name" :class="fieldClass" placeholder="分类名称" />
                        </label>
                        <label>
                            <span :class="labelClass">描述</span>
                            <textarea v-model="categoryForm.description" :class="fieldClass" rows="2"
                                placeholder="分类说明"></textarea>
                        </label>
                        <div class="grid gap-4 sm:grid-cols-2">
                            <label>
                                <span :class="labelClass">排序</span>
                                <input v-model="categoryForm.sort" :class="fieldClass" type="number" />
                            </label>
                            <label>
                                <span :class="labelClass">状态</span>
                                <select v-model="categoryForm.state" :class="fieldClass">
                                    <option value="0">显示</option>
                                    <option value="1">隐藏</option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div class="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4">
                        <button type="button"
                            class="rounded-sm border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                            @click="closeCategoryForm">取消</button>
                        <button type="submit" class="btn-normal" :disabled="savingCategory">
                            {{ savingCategory ? '保存中...' : '保存' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="showItemForm" class="fixed inset-0 z-40 overflow-y-auto bg-black/40 p-4" @click.self="closeItemForm">
            <div class="mx-auto my-8 w-full max-w-2xl rounded-md bg-white p-6">
                <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                    <p class="text-lg font-semibold text-gray-800">{{ editingItemId ? '编辑网站' : '添加网站' }}</p>
                    <button type="button" class="text-xl leading-none text-gray-400 hover:text-gray-600"
                        @click="closeItemForm">×</button>
                </div>

                <form class="mt-4" @submit.prevent="saveItem">
                    <div class="grid max-h-[65vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
                        <label>
                            <span :class="labelClass">分类 *</span>
                            <select v-model="itemForm.categoryId" :class="fieldClass">
                                <option value="">请选择分类</option>
                                <option v-for="category in categories" :key="category.id" :value="category.id">
                                    {{ category.name }}
                                </option>
                            </select>
                        </label>
                        <label>
                            <span :class="labelClass">标题 *</span>
                            <input v-model="itemForm.title" :class="fieldClass" placeholder="网站名称" />
                        </label>
                        <label class="sm:col-span-2">
                            <span :class="labelClass">地址 *</span>
                            <input v-model="itemForm.url" :class="fieldClass" placeholder="https://..." />
                        </label>
                        <label class="sm:col-span-2">
                            <span :class="labelClass">描述</span>
                            <textarea v-model="itemForm.description" :class="fieldClass" rows="2"
                                placeholder="一句话介绍这个网站"></textarea>
                        </label>
                        <div class="sm:col-span-2">
                            <span :class="labelClass">图标</span>
                            <div class="flex flex-wrap items-center gap-2">
                                <input v-model="itemForm.img" :class="[fieldClass, 'flex-1']" placeholder="图片地址" />
                                <label
                                    class="inline-flex cursor-pointer items-center rounded-sm border border-gray-200 px-3 py-2 text-xs text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-600">
                                    <input type="file" class="hidden" accept="image/*" @change="uploadImg" />
                                    {{ imageUploading ? '上传中...' : '上传图标' }}
                                </label>
                            </div>
                            <img v-if="itemForm.img" :src="itemForm.img" alt=""
                                class="mt-2 h-10 w-10 rounded border border-gray-100 object-contain" />
                        </div>
                        <label class="sm:col-span-2">
                            <span :class="labelClass">提示</span>
                            <input v-model="itemForm.tips" :class="fieldClass" placeholder="可选" />
                        </label>
                        <label>
                            <span :class="labelClass">排序</span>
                            <input v-model="itemForm.sort" :class="fieldClass" type="number" />
                        </label>
                        <label>
                            <span :class="labelClass">状态</span>
                            <select v-model="itemForm.state" :class="fieldClass">
                                <option value="0">显示</option>
                                <option value="1">隐藏</option>
                            </select>
                        </label>
                    </div>

                    <div class="mt-5 flex justify-end gap-2 border-t border-gray-100 pt-4">
                        <button type="button"
                            class="rounded-sm border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                            @click="closeItemForm">取消</button>
                        <button type="submit" class="btn-normal" :disabled="savingItem">
                            {{ savingItem ? '保存中...' : '保存' }}
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

useHead({
    title: '导航管理',
    titleTemplate: (title) => `${title} - 管理后台 - ZNGG在线工具`,
})

const { $toast } = useNuxtApp()

const categories = ref<any[]>([])
const loading = ref(true)
const showCategoryForm = ref(false)
const showItemForm = ref(false)
const savingCategory = ref(false)
const savingItem = ref(false)
const imageUploading = ref(false)
const editingCategoryId = ref('')
const editingItemId = ref('')
const categoryForm = ref(createEmptyCategory())
const itemForm = ref(createEmptyItem())

const fieldClass = 'w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none'
const labelClass = 'mb-1 block text-xs text-gray-500'

const navItems = computed(() =>
    categories.value.flatMap(category =>
        (category.itemList || []).map((item: any) => ({
            ...item,
            categoryName: category.name,
        }))
    )
)

onMounted(() => {
    loadNav()
})

function createEmptyCategory() {
    return {
        id: '',
        name: '',
        description: '',
        sort: 100,
        state: '0',
    }
}

function createEmptyItem() {
    return {
        id: '',
        categoryId: '',
        title: '',
        description: '',
        img: '',
        tips: '',
        url: '',
        sort: 100,
        state: '0',
    }
}

function normalizeList(data: any): any[] {
    if (Array.isArray(data)) return data
    return data?.content ?? data?.records ?? []
}

async function loadNav() {
    loading.value = true
    let result = await api.admin.web.getNav()
    if (!result.success) {
        result = await api.web.getNavInfo()
    }
    loading.value = false
    if (!result.success) {
        $toast.error(result.message || '加载失败')
        return
    }
    categories.value = normalizeList(result.data).map((category: any) => ({
        ...category,
        itemList: Array.isArray(category.itemList) ? category.itemList : [],
    }))
}

function openCategoryCreate() {
    editingCategoryId.value = ''
    categoryForm.value = createEmptyCategory()
    showCategoryForm.value = true
}

function openCategoryEdit(category: any) {
    editingCategoryId.value = category.id
    categoryForm.value = {
        id: category.id,
        name: category.name ?? '',
        description: category.description ?? '',
        sort: category.sort ?? 100,
        state: String(category.state ?? '0'),
    }
    showCategoryForm.value = true
}

function closeCategoryForm() {
    if (savingCategory.value) return
    showCategoryForm.value = false
}

async function saveCategory() {
    if (!categoryForm.value.name.trim()) {
        $toast.error('请输入分类名称')
        return
    }
    const payload = {
        id: categoryForm.value.id || undefined,
        name: categoryForm.value.name.trim(),
        description: categoryForm.value.description.trim(),
        sort: Number(categoryForm.value.sort) || 0,
        state: categoryForm.value.state,
    }
    savingCategory.value = true
    const result = editingCategoryId.value
        ? await api.admin.web.updateNavCategory(payload)
        : await api.admin.web.addNavCategory(payload)
    savingCategory.value = false
    if (!result.success) {
        $toast.error(result.message || '保存失败')
        return
    }
    $toast.success(editingCategoryId.value ? '已更新' : '已添加')
    showCategoryForm.value = false
    await loadNav()
}

async function removeCategory(category: any) {
    if (!window.confirm('确定删除分类「' + category.name + '」吗？')) return
    const result = await api.admin.web.removeNavCategory(category.id)
    if (!result.success) {
        $toast.error(result.message || '删除失败')
        return
    }
    $toast.success('已删除')
    await loadNav()
}

function openItemCreate() {
    if (!categories.value.length) {
        $toast.error('请先添加导航分类')
        return
    }
    editingItemId.value = ''
    itemForm.value = {
        ...createEmptyItem(),
        categoryId: categories.value[0]?.id || '',
    }
    showItemForm.value = true
}

function openItemEdit(item: any) {
    editingItemId.value = item.id
    itemForm.value = {
        id: item.id,
        categoryId: item.categoryId ?? '',
        title: item.title ?? '',
        description: item.description ?? '',
        img: item.img ?? '',
        tips: item.tips ?? '',
        url: item.url ?? '',
        sort: item.sort ?? 100,
        state: String(item.state ?? '0'),
    }
    showItemForm.value = true
}

function closeItemForm() {
    if (savingItem.value) return
    showItemForm.value = false
}

async function saveItem() {
    if (!itemForm.value.categoryId) {
        $toast.error('请选择分类')
        return
    }
    if (!itemForm.value.title.trim()) {
        $toast.error('请输入标题')
        return
    }
    if (!itemForm.value.url.trim()) {
        $toast.error('请输入地址')
        return
    }
    const payload = {
        id: itemForm.value.id || undefined,
        categoryId: itemForm.value.categoryId,
        title: itemForm.value.title.trim(),
        description: itemForm.value.description.trim(),
        img: itemForm.value.img.trim(),
        tips: itemForm.value.tips.trim(),
        url: itemForm.value.url.trim(),
        sort: Number(itemForm.value.sort) || 0,
        state: itemForm.value.state,
    }
    savingItem.value = true
    const result = editingItemId.value
        ? await api.admin.web.updateNav(payload)
        : await api.admin.web.addNav(payload)
    savingItem.value = false
    if (!result.success) {
        $toast.error(result.message || '保存失败')
        return
    }
    $toast.success(editingItemId.value ? '已更新' : '已添加')
    showItemForm.value = false
    await loadNav()
}

async function removeItem(item: any) {
    if (!window.confirm('确定删除网站「' + item.title + '」吗？')) return
    const result = await api.admin.web.removeNav(item.id)
    if (!result.success) {
        $toast.error(result.message || '删除失败')
        return
    }
    $toast.success('已删除')
    await loadNav()
}

async function uploadImg(event: Event) {
    const input = event.target as HTMLInputElement
    const rawFile = input.files?.[0]
    if (!rawFile) return
    input.value = ''
    let file: File
    try {
        file = await normalizeImageFile(rawFile, { maxSize: 256, outputType: 'image/png' })
    } catch (error) {
        $toast.error((error as Error).message)
        return
    }
    imageUploading.value = true
    const formData = new FormData()
    formData.append('file', file)
    const result = await api.upload.uploadImage(formData)
    imageUploading.value = false
    if (!result.success) {
        $toast.error(result.message || '上传失败')
        return
    }
    itemForm.value.img = 'https://cdn.zngg.net/upload/image/' + result.message
}
</script>
