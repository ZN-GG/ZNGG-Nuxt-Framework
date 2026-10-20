type SearchType = 'tool' | 'article' | 'project' | 'download'

type SearchDoc = {
  type: SearchType
  id: string
  title: string
  summary: string
  tags: string[]
  category: string
  route: string
  updatedAt: string
  meta: Record<string, string | number | undefined>
  text: string
}

type SearchResponse = {
  query: string
  total: number
  groups: Record<SearchType, SearchDoc[]>
  degraded: boolean
}

const TTL = 5 * 60 * 1000
const SHORT_TTL = 60 * 1000

let cache: { at: number; docs: SearchDoc[]; degraded: boolean } | null = null

const split = (value: unknown) =>
  String(value || '')
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean)

const stripMarkdown = (value: unknown) =>
  String(value || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const textOf = (item: any) => {
  const summary = stripMarkdown(item.summary || item.description || '')
  if (summary) return summary.slice(0, 180)
  return stripMarkdown(item.content || '').slice(0, 180)
}

const categoryOf = (item: any, fallback: string) =>
  item.category?.name || item.categoryName || fallback

async function fetchList(base: string, path: string) {
  const response = await $fetch<any>(base + path, {
    headers: { version: '20' },
    timeout: 8000,
  })
  return Array.isArray(response?.data?.content) ? response.data.content : []
}

async function buildIndex(base: string) {
  if (cache && Date.now() - cache.at < (cache.degraded ? SHORT_TTL : TTL)) {
    return cache
  }

  const [tools, articles, projects, downloads] = await Promise.allSettled([
    fetchList(base, '/portal/tool/1/60'),
    fetchList(base, '/portal/article/1/999'),
    fetchList(base, '/portal/project/1/999'),
    fetchList(base, '/portal/download/1/999'),
  ])

  const docs: SearchDoc[] = []
  const failed = [tools, articles, projects, downloads].some((result) => result.status === 'rejected')

  const push = (result: PromiseSettledResult<any[]>, type: SearchType, map: (item: any) => Omit<SearchDoc, 'type' | 'text'>) => {
    if (result.status !== 'fulfilled') return
    for (const item of result.value) {
      const normalized = map(item)
      docs.push({
        ...normalized,
        type,
        text: [
          normalized.title,
          normalized.summary,
          normalized.category,
          normalized.tags.join(' '),
        ].join(' ').toLowerCase(),
      })
    }
  }

  push(tools, 'tool', (item) => {
    const slug = String(item.content || item.slug || item.id)
    return {
      id: String(item.id ?? slug),
      title: item.title || item.name || '未命名工具',
      summary: textOf(item),
      tags: split(item.tags),
      category: categoryOf(item, '在线工具'),
      route: `/tool/detail/${encodeURIComponent(slug)}`,
      updatedAt: item.updateTime || '',
      meta: { category: categoryOf(item, '在线工具') },
    }
  })

  push(articles, 'article', (item) => ({
    id: String(item.id),
    title: item.title || '未命名文章',
    summary: textOf(item),
    tags: split(item.labels),
    category: categoryOf(item, '文章'),
    route: `/read/post/${item.id}`,
    updatedAt: item.updateTime || '',
    meta: { author: item.user?.name || 'ZNGG', date: String(item.updateTime || '').slice(0, 10) },
  }))

  push(projects, 'project', (item) => ({
    id: String(item.id),
    title: item.name || '未命名项目',
    summary: textOf(item),
    tags: split(item.tags),
    category: categoryOf(item, '开源项目'),
    route: `/project/${item.id}`,
    updatedAt: item.updateTime || '',
    meta: { platform: item.platform, stars: item.stars, language: item.language },
  }))

  push(downloads, 'download', (item) => ({
    id: String(item.id),
    title: item.title || '未命名资源',
    summary: textOf(item),
    tags: split(item.tags),
    category: categoryOf(item, '软件资源'),
    route: `/download/${item.id}`,
    updatedAt: item.updateTime || '',
    meta: { platform: item.platform, version: item.version, size: item.fileSize },
  }))

  if (docs.length === 0 && failed) {
    throw createError({ statusCode: 503, statusMessage: '搜索服务暂不可用' })
  }

  cache = { at: Date.now(), docs, degraded: failed }
  return cache
}

function score(doc: SearchDoc, query: string) {
  const title = doc.title.toLowerCase()
  if (title === query) return 120
  if (title.startsWith(query)) return 100
  if (title.includes(query)) return 80
  if (doc.tags.some((tag) => tag.toLowerCase().includes(query))) return 55
  if (doc.category.toLowerCase().includes(query)) return 45
  if (doc.route.toLowerCase().includes(query)) return 40
  if (doc.summary.toLowerCase().includes(query)) return 25
  return 0
}

export default defineEventHandler(async (event): Promise<SearchResponse> => {
  const { q = '', type = '', limit = '8' } = getQuery(event)
  const query = String(q || '').trim().toLowerCase()
  const take = Math.min(Math.max(Number(limit) || 8, 1), 30)
  const allowed: SearchType[] = ['tool', 'article', 'project', 'download']
  const requested = allowed.includes(type as SearchType) ? (type as SearchType) : null

  const empty: Record<SearchType, SearchDoc[]> = {
    tool: [], article: [], project: [], download: [],
  }

  if (!query) {
    return { query: '', total: 0, groups: empty, degraded: false }
  }

  try {
    const config = useRuntimeConfig()
    const index = await buildIndex(config.public.apiBase as string)
    const matched = index.docs
      .map((doc) => ({ doc, score: score(doc, query) }))
      .filter((entry) => entry.score > 0 && (!requested || entry.doc.type === requested))
      .sort((a, b) => b.score - a.score || String(b.doc.updatedAt).localeCompare(String(a.doc.updatedAt)))

    const groups = { ...empty }
    for (const entry of matched) {
      if (groups[entry.doc.type].length < take) {
        groups[entry.doc.type].push(entry.doc)
      }
    }

    const total = matched.length
    setHeader(event, 'cache-control', 'public, max-age=60, stale-while-revalidate=300')
    return { query: String(q), total, groups, degraded: index.degraded }
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 503,
      statusMessage: '搜索服务暂不可用',
    })
  }
})
