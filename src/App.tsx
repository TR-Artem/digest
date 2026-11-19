import { useEffect, useState } from 'react'
import NewsCard from './components/NewsCard'
import { loadDigest } from './digest'
import { loadRead, saveRead } from './read'
import type { News } from './types'

function App() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('все')
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [read, setRead] = useState<string[]>(loadRead)

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const list = await loadDigest(import.meta.env.VITE_DIGEST_URL ?? '')
        if (!ignore) {
          setNews(list)
        }
      } catch (e) {
        if (!ignore) {
          setError((e as Error).message)
        }
      }
      if (!ignore) {
        setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const tags = [...new Set(news.flatMap((item) => item.tags))].sort((a, b) => a.localeCompare(b, 'ru'))
  const needle = query.trim().toLowerCase()
  const visible = news.filter((item) => {
    const inText =
      item.title.toLowerCase().includes(needle) || item.summary.toLowerCase().includes(needle)
    const inTag = tag === 'все' || item.tags.includes(tag)
    const inRead = !onlyUnread || !read.includes(item.id)
    return inText && inTag && inRead
  })

  function toggleRead(id: string) {
    const next = read.includes(id) ? read.filter((item) => item !== id) : [...read, id]
    setRead(next)
    saveRead(next)
  }

  return (
    <>
      <header className="header">
        <h1>Дайджест новостей</h1>
        <p>Пересказы и теги от модели, новости из Google Таблицы</p>
      </header>
      <main className="main">
        <div className="filters">
          <label htmlFor="search">Поиск</label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Слово из заголовка или пересказа"
          />
          <label htmlFor="tag">Тег</label>
          <select id="tag" value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="все">все</option>
            {tags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label htmlFor="unread" className="checkbox">
            <input
              id="unread"
              type="checkbox"
              checked={onlyUnread}
              onChange={(e) => setOnlyUnread(e.target.checked)}
            />
            Только непрочитанные
          </label>
        </div>

        {loading && <p role="status">Загрузка дайджеста…</p>}
        {error !== '' && <p role="alert">{error}</p>}
        {!loading && error === '' && (
          <p className="counter">
            Показано {visible.length} из {news.length}
          </p>
        )}

        {!loading && error === '' && visible.length === 0 && <p className="empty">Новостей не найдено</p>}

        <div className="cards">
          {visible.map((item) => (
            <NewsCard
              key={item.id}
              news={item}
              read={read.includes(item.id)}
              onToggleRead={() => toggleRead(item.id)}
            />
          ))}
        </div>
      </main>
    </>
  )
}

export default App
