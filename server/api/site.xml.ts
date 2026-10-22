export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const baseUrl = String(config.public.siteUrl || 'https://www.zngg.net').replace(/\/$/, '')
  const apiBase = String(config.public.apiBase || 'https://api.zngg.net').replace(/\/$/, '')
  const entries: string[] = []

  const escapeXml = (value: string) =>
    String(value).replace(/[<>&'"]/g, (char) => {
      const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }
      return map[char]
    })

  const addUrl = (path: string, lastmod: string, changefreq: string, priority: string) => {
    entries.push(
      `<url><loc>${escapeXml(baseUrl + path)}</loc>` +
      (lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : '') +
      `<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
    )
  }

  const fetchPage = async (url: string) => {
    try {
      const result = await $fetch<ApiResponse>(url, {
        headers: { version: '20' },
        timeout: 10000,
      })
      return result?.success ? result.data : null
    } catch (e) {
      return null
    }
  }

  const dateOf = (value?: string) => value ? String(value).slice(0, 10) : ''

  const latestOf = (items: any[]) => items.reduce((latest: string, item: any) => {
    const date = dateOf(item?.updateTime)
    return date > latest ? date : latest
  }, '')

  const [toolData, articleData, projectData, downloadData, articleCategories, toolCategories] = await Promise.all([
    fetchPage(apiBase + '/portal/tool/1/99'),
    fetchPage(apiBase + '/portal/article/1/999'),
    fetchPage(apiBase + '/portal/project/1/999'),
    fetchPage(apiBase + '/portal/download/1/999'),
    fetchPage(apiBase + '/portal/article_category'),
    fetchPage(apiBase + '/portal/tool_category'),
  ])

  const tools = toolData?.content ?? []
  const articles = articleData?.content ?? []
  const projects = projectData?.content ?? []
  const downloads = downloadData?.content ?? []

  if (!toolData && !articleData && !projectData && !downloadData) {
    setResponseStatus(event, 503)
    setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
    return 'Sitemap temporarily unavailable'
  }

  for (const item of tools) {
    addUrl('/tool/detail/' + encodeURIComponent(String(item.content || '')), dateOf(item.updateTime), 'monthly', '0.8')
  }
  for (const item of articles) {
    addUrl('/read/post/' + encodeURIComponent(String(item.id)), dateOf(item.updateTime), 'monthly', '0.8')
  }
  for (const item of projects) {
    addUrl('/project/' + encodeURIComponent(String(item.id)), dateOf(item.updateTime), 'monthly', '0.8')
  }
  for (const item of downloads) {
    addUrl('/download/' + encodeURIComponent(String(item.id)), dateOf(item.updateTime), 'monthly', '0.8')
  }

  const latestArticle = latestOf(articles)
  const latestTool = latestOf(tools)
  const latestProject = latestOf(projects)
  const latestDownload = latestOf(downloads)

  for (const item of (articleCategories ?? [])) {
    addUrl('/read/category/' + encodeURIComponent(String(item.id)), latestArticle, 'weekly', '0.6')
  }
  for (const item of (toolCategories ?? [])) {
    addUrl('/tool/category/' + encodeURIComponent(String(item.id)), latestTool, 'weekly', '0.6')
  }

  addUrl('/read', latestArticle, 'weekly', '0.8')
  addUrl('/tool', latestTool, 'weekly', '0.8')
  addUrl('/project', latestProject, 'weekly', '0.8')
  addUrl('/download', latestDownload, 'weekly', '0.8')
  addUrl('/discover', '', 'weekly', '0.7')
  addUrl('/nav', '', 'monthly', '0.5')
  addUrl('/link', '', 'monthly', '0.5')

  const latestHome = [latestArticle, latestTool, latestProject, latestDownload].sort().pop() || ''
  addUrl('/', latestHome, 'daily', '1.0')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  return '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    entries.join('') +
    '</urlset>'
})
