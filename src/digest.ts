import type { News, RawNews } from './types'

export async function loadDigest(url: string): Promise<News[]> {
  if (url === '') {
    throw new Error('Адрес дайджеста не задан: VITE_DIGEST_URL.')
  }
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Дайджест не загрузился: код ${response.status}.`)
  }
  const data: { news: RawNews[] } = await response.json()
  return data.news
    .map((item) => ({
      ...item,
      tags: item.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ''),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
