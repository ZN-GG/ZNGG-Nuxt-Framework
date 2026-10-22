<template>
    <div>
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-md bg-white p-6">
            <div>
                <p class="text-xl font-semibold text-gray-800">友链管理</p>
                <p class="mt-1 text-xs text-gray-500">添加、编辑和删除友情链接。</p>
            </div>
            <button type="button" class="btn-normal" @click="openCreate">添加友链</button>
        </div>

        <div class="mt-4 rounded-md bg-white p-6">
            <div class="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div class="flex items-center gap-2">
                    <span class="-ml-3 h-5 w-1 shrink-0 rounded-full bg-blue-600"></span>
                    <p class="text-lg font-semibold text-gray-800">友链列表</p>
                </div>
                <span class="text-xs text-gray-400">共 {{ list.length }} 个</span>
            </div>

            <div v-if="loading" class="py-12 text-center text-sm text-gray-400">加载中...</div>
            <div v-else-if="!list.length" class="py-12 text-center text-sm text-gray-400">暂无友链</div>
            <div v-else class="mt-2 overflow-x-auto">
                <table class="w-full min-w-[680px] text-left text-sm">
                    <thead>
                        <tr class="border-b border-gray-100 text-xs text-gray-400">
                            <th class="py-2 pr-4 font-medium">名称</th>
                            <th class="py-2 pr-4 font-medium">链接</th>
                            <th class="py-2 pr-4 font-medium">描述</th>
                            <th class="py-2 pr-4 font-medium">状态</th>
                            <th class="py-2 pr-4 font-medium">更新时间</th>
                            <th class="py-2 text-right font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list" :key="item.id" class="border-b border-gray-50 last:border-b-0">
                            <td class="py-3 pr-4 font-medium text-gray-700">{{ item.name }}</td>
                            <td class="py-3 pr-4">
                                <a :href="item.url" target="_blank" rel="noopener noreferrer"
                                    class="line-clamp-1 text-blue-600 hover:underline">{{ item.url }}</a>
                            </td>
                            <td class="py-3 pr-4">
                                <span class="line-clamp-1 text-gray-500">{{ item.description || '-' }}</span>
                            </td>
                            <td class="py-3 pr-4">
                                <span class="rounded-sm px-2 py-0.5 text-[11px]"
                                    :class="item.state === '0' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'">
                                    {{ item.state === '0' ? '显示' : '隐藏' }}
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
        </div>

        <div v-if="showForm" class="fixed inset-0 z-40 overflow-y-auto bg-black/40 p-4" @click.self="closeForm">
            <div class="mx-auto my-8 w-full max-w-xl rounded-md bg-white p-6">
                <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                    <p class="text-lg font-semibold text-gray-800">{{ editingId ? '编辑友链' : '添加友链' }}</p>
                    <button type="button" class="text-xl leading-none text-gray-400 hover:text-gray-600"
                        @click="closeForm">×</button>
                </div>

                <form class="mt-4" @submit.prevent="save">
                    <div class="grid gap-4">
                        <label>
                            <span :class="labelClass">名称 *</span>
                            <input v-model="form.name" :class="fieldClass" placeholder="网站名称" />
                        </label>
                        <label>
                            <span :class="labelClass">链接 *</span>
                            <input v-model="form.url" :class="fieldClass" placeholder="https://..." />
                        </label>
                        <label>
                            <span :class="labelClass">描述</span>
                            <textarea v-model="form.description" :class="fieldClass" rows="2"
                                placeholder="一句话介绍这个网站"></textarea>
                        </label>
                        <label>
                            <span :class="labelClass">状态</span>
                            <select v-model="form.state" :class="fieldClass">
                                <option value="0">显示</option>
                                <option value="1">隐藏</option>
                            </select>
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

definePageMeta({
    middleware: ['admin']
})

useHead({
    title: '友链管理',
    titleTemplate: (title) => `${title} - 管理后台 - ZNGG在线工具`,
})

const { $toast } = useNuxtApp()

const list = ref<any[]>([])
const loading = ref(true)
const showForm = ref(false)
const saving = ref(false)
const editingId = ref('')
const form = ref(createEmptyForm())

const fieldClass = 'w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none'
const labelClass = 'mb-1 block text-xs text-gray-500'

onMounted(() => {
    loadList()
})

function createEmptyForm() {
    return {
        id: '',
        name: '',
        description: '',
        url: '',
        state: '0',
    }
}

function normalizeList(data: any): any[] {
    if (Array.isArray(data)) return data
    return data?.content ?? data?.records ?? []
}

async function loadList() {
    loading.value = true
    let result = await api.admin.web.getFriendlyLinks()
    if (!result.success) {
        result = await api.web.getFriendLinks()
    }
    loading.value = false
    if (!result.success) {
        $toast.error(result.message || '加载失败')
        return
    }
    list.value = normalizeList(result.data)
}

function openCreate() {
    editingId.value = ''
    form.value = createEmptyForm()
    showForm.value = true
}

function openEdit(item: any) {
    editingId.value = item.id
    form.value = {
        id: item.id,
        name: item.name ?? '',
        description: item.description ?? '',
        url: item.url ?? '',
        state: String(item.state ?? '0'),
    }
    showForm.value = true
}

function closeForm() {
    if (saving.value) return
    showForm.value = false
}

async function save() {
    if (!form.value.name.trim()) {
        $toast.error('请输入名称')
        return
    }
    if (!form.value.url.trim()) {
        $toast.error('请输入链接')
        return
    }

    const payload = {
        id: form.value.id || undefined,
        name: form.value.name.trim(),
        description: form.value.description.trim(),
        url: form.value.url.trim(),
        state: form.value.state,
    }

    saving.value = true
    const result = editingId.value
        ? await api.admin.web.updateFriendlyLink(payload)
        : await api.admin.web.addFriendlyLink(payload)
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
    const result = await api.admin.web.removeFriendlyLink(item.id)
    if (!result.success) {
        $toast.error(result.message || '删除失败')
        return
    }
    $toast.success('已删除')
    await loadList()
}
</script>
