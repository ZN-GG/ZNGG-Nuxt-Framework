export default defineEventHandler(async (event) => {
  const baseUrl = 'https://www.zngg.net'
  const apiBase = 'https://api.zngg.net'
  const entries: string[] = []

  const addUrl = (path: string, lastmod: string, changefreq: string, priority: string) => {
    entries.push(
      `<url><loc>${baseUrl}${path}</loc>` +
      (lastmod ? `<lastmod>${lastmod}</lastmod>` : '') +
      `<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
    )
  }

  const fetchPage = async (url: string) => {
    try {
      const result = await $fetch<ApiResponse>(url)
      return result?.success ? result.data : null
    } catch (e) {
      return null
    }
  }

  const dateOf = (value?: string) => value ? String(value).slice(0, 10) : ''

  const toolData = await fetchPage(apiBase + '/portal/tool/1/99')
  const articleData = await fetchPage(apiBase + '/portal/article/1/999')
  const projectData = await fetchPage(apiBase + '/portal/project/1/999')
  const downloadData = await fetchPage(apiBase + '/portal/download/1/999')
  const articleCategories = await fetchPage(apiBase + '/portal/article_category')
  const toolCategories = await fetchPage(apiBase + '/portal/tool_category')

  const tools = toolData?.content ?? []
  const articles = articleData?.content ?? []
  const projects = projectData?.content ?? []
  const downloads = downloadData?.content ?? []

  for (const item of tools) {
    addUrl('/tool/detail/' + item.content, dateOf(item.updateTime), 'monthly', '0.8')
  }
  for (const item of articles) {
    addUrl('/read/post/' + item.id, dateOf(item.updateTime), 'monthly', '0.8')
  }
  for (const item of projects) {
    addUrl('/project/' + item.id, dateOf(item.updateTime), 'monthly', '0.8')
  }
  for (const item of downloads) {
    addUrl('/download/' + item.id, dateOf(item.updateTime), 'monthly', '0.8')
  }
  for (const item of (articleCategories ?? [])) {
    addUrl('/read/category/' + item.id, dateOf(articles[0]?.updateTime), 'weekly', '0.6')
  }
  for (const item of (toolCategories ?? [])) {
    addUrl('/tool/category/' + item.id, dateOf(tools[0]?.updateTime), 'weekly', '0.6')
  }

  const latestArticle = dateOf(articles[0]?.updateTime)
  const latestTool = dateOf(tools[0]?.updateTime)
  const latestProject = dateOf(projects[0]?.updateTime)
  const latestDownload = dateOf(downloads[0]?.updateTime)

  addUrl('/read', latestArticle, 'weekly', '0.8')
  addUrl('/tool', latestTool, 'weekly', '0.8')
  addUrl('/project', latestProject, 'weekly', '0.8')
  addUrl('/download', latestDownload, 'weekly', '0.8')
  addUrl('/', latestArticle, 'weekly', '1.0')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  return '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    entries.join('') +
    '</urlset>'
})
