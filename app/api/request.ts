const version = '20'
const fallbackBase = 'https://api.zngg.net'

function getBaseUrl() {
  const config = useRuntimeConfig()
  return String(config.public.apiBase || fallbackBase).replace(/\/$/, '')
}

function failed(error: unknown): ApiResponse {
  const status = Number((error as any)?.response?.status || (error as any)?.statusCode || 0)
  const name = String((error as any)?.name || '')
  const offline = typeof navigator !== 'undefined' && !navigator.onLine
  const kind: ApiErrorKind = status
    ? 'http'
    : offline
      ? 'offline'
      : name === 'TimeoutError' || name === 'AbortError'
        ? 'timeout'
        : 'network'

  const message = status === 404
    ? '请求的内容不存在'
    : status >= 500
      ? '服务暂时不可用，请稍后重试'
      : status
        ? '请求失败，请稍后重试'
        : offline
          ? '网络不可用，请检查连接'
          : '请求失败，请稍后重试'

  return { success: false, code: status, message, data: null, kind, status }
}

async function request(url: string, options: { method: 'GET' | 'POST' | 'PUT' | 'DELETE', params?: Record<string, any>, body?: any, timeout?: number }) {
  try {
    const token = useCookie('token')
    const headers: Record<string, string> = { version }
    if (token.value) headers.Authorization = token.value

    return await $fetch<ApiResponse>(getBaseUrl() + url, {
      method: options.method,
      headers,
      params: options.params,
      body: options.body,
      timeout: options.timeout ?? 12000,
    })
  } catch (error) {
    return failed(error)
  }
}

const get = (url: string, params = {}) => request(url, { method: 'GET', params })
const post = (url: string, body = {}, options: { timeout?: number } = {}) => request(url, { method: 'POST', body, ...options })
const put = (url: string, body = {}) => request(url, { method: 'PUT', body })
const del = (url: string) => request(url, { method: 'DELETE' })

export default {
  get,
  post,
  put,
  del,
  get baseUrl() {
    return getBaseUrl()
  },
}
