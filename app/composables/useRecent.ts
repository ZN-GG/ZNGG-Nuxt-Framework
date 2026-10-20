type RecentType = 'tool' | 'article' | 'project' | 'download'

export type RecentItem = {
  type: RecentType
  id: string
  title: string
  route: string
  meta?: string
  ts: number
}

const KEY = 'zngg:recent'

export function useRecent() {
  const items = useState<RecentItem[]>('recent-items', () => [])
  const loaded = useState('recent-items-loaded', () => false)

  const load = () => {
    if (!import.meta.client || loaded.value) return
    loaded.value = true
    try {
      const raw = window.localStorage.getItem(KEY)
      items.value = raw ? JSON.parse(raw) : []
    } catch {
      items.value = []
    }
  }

  const persist = () => {
    if (!import.meta.client) return
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items.value))
    } catch {
      // Storage can be unavailable in private mode; recents are optional.
    }
  }

  const add = (item: Omit<RecentItem, 'ts'>) => {
    load()
    items.value = [
      { ...item, ts: Date.now() },
      ...items.value.filter((entry) => entry.route !== item.route),
    ].slice(0, 8)
    persist()
  }

  onMounted(load)

  return { items, add, load }
}
