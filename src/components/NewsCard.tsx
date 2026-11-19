import type { News } from '../types'

type NewsCardProps = {
  news: News
  read: boolean
  onToggleRead: () => void
}

function NewsCard({ news, read, onToggleRead }: NewsCardProps) {
  return (
    <article className={read ? 'card card--read' : 'card'}>
      <h2>
        <a href={news.link} target="_blank" rel="noreferrer">
          {news.title}
        </a>
      </h2>
      <p className="meta">
        {news.source} · {new Date(news.date).toLocaleString('ru')}
      </p>
      <p className="summary">{news.summary}</p>
      <ul className="tags">
        {news.tags.map((tag) => (
          <li key={tag} className="tag">
            {tag}
          </li>
        ))}
      </ul>
      <button onClick={onToggleRead}>{read ? 'Прочитано ✓' : 'Отметить прочитанным'}</button>
    </article>
  )
}

export default NewsCard
