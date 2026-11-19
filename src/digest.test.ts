import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadDigest } from './digest'

const raw = [
  {
    id: 'old',
    date: '2026-11-16T09:00:00Z',
    source: 'Хабр',
    title: 'Старая новость',
    summary: 'Коротко.',
    tags: 'наука',
    link: 'https://example.org/old',
  },
  {
    id: 'new',
    date: '2026-11-18T09:00:00Z',
    source: '3DNews',
    title: 'Свежая новость',
    summary: 'Коротко.',
    tags: 'ИИ, наука',
    link: 'https://example.org/new',
  },
]

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadDigest', () => {
  it('превращает строку тегов в массив', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ news: raw }), { status: 200 })))
    const news = await loadDigest('https://example.org/exec')
    expect(news[0].tags).toEqual(['ИИ', 'наука'])
  })

  it('ставит свежие новости первыми', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ news: raw }), { status: 200 })))
    const news = await loadDigest('https://example.org/exec')
    expect(news.map((item) => item.id)).toEqual(['new', 'old'])
  })

  it('сообщает код ответа', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })))
    await expect(loadDigest('https://example.org/exec')).rejects.toThrow('Дайджест не загрузился: код 500.')
  })
})
