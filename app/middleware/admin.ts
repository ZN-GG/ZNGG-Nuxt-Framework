import { userStore } from '~/stores/user';

function notFound() {
    throw createError({
        statusCode: 404,
        statusMessage: '页面不存在',
        fatal: true,
    })
}

export default defineNuxtRouteMiddleware(async () => {
    const token = useCookie('token')

    if (!token.value) {
        return notFound()
    }

    const store = userStore()
    const info = await store.loadInfo()
    if (!info || !store.isAdmin) {
        return notFound()
    }
})
