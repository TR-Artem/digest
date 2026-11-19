import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const news = [
  {
    id: 'mars',
    date: '2026-11-18T09:00:00Z',
    source: 'Хабр',
    title: 'Марс: найдены следы воды',
    summary: 'Аппарат обнаружил лёд под поверхностью.',
    tags: 'наука, космос',
    link: 'https://example.org/mars',
  },
  {
    id: 'ai',
    date: '2026-11-17T09:00:00Z',
    source: '3DNews',
    title: 'Новая модель ИИ',
    summary: 'Компания показала языковую модель.',
    tags: 'ИИ',
    link: 'https://example.org/ai',
  },
  {
    id: 'game',
    date: '2026-11-16T09:00:00Z',
    source: 'iXBT',
    title: 'Выход игры',
    summary: 'Студия объявила дату релиза.',
    tags: 'игры',
    link: 'https://example.org/game',
  },
]

function stubNews(items: unknown[] = news) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ news: items }), { status: 200 })),
  )
}

beforeEach(() => {
  vi.stubEnv('VITE_DIGEST_URL', 'https://example.org/exec')
  stubNews()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('App', () => {
  it('показывает новости от свежих к старым', async () => {
    render(<App />)
    const headings = await screen.findAllByRole('heading', { level: 2 })
    expect(headings.map((h) => h.textContent)).toEqual([
      'Марс: найдены следы воды',
      'Новая модель ИИ',
      'Выход игры',
    ])
    expect(screen.getByText('Показано 3 из 3')).toBeInTheDocument()
  })

  it('ищет по заголовку и пересказу без учёта регистра', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Марс: найдены следы воды')
    await user.type(screen.getByLabelText('Поиск'), 'ЛЁД')
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1)
    expect(screen.getByText('Показано 1 из 3')).toBeInTheDocument()
  })

  it('фильтрует по тегу', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Марс: найдены следы воды')
    await user.selectOptions(screen.getByLabelText('Тег'), 'наука')
    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent('Марс: найдены следы воды')
  })

  it('оставляет только непрочитанные', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Марс: найдены следы воды')
    await user.click(screen.getAllByRole('button', { name: 'Отметить прочитанным' })[0])
    await user.click(screen.getByLabelText('Только непрочитанные'))
    expect(screen.queryByText('Марс: найдены следы воды')).not.toBeInTheDocument()
    expect(screen.getByText('Показано 2 из 3')).toBeInTheDocument()
  })

  it('снимает отметку повторным нажатием и помнит её после перезагрузки', async () => {
    const user = userEvent.setup()
    const first = render(<App />)
    await screen.findByText('Марс: найдены следы воды')
    await user.click(screen.getAllByRole('button', { name: 'Отметить прочитанным' })[0])
    expect(screen.getAllByRole('button', { name: 'Прочитано ✓' })).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: 'Прочитано ✓' }))
    expect(screen.getAllByRole('button', { name: 'Отметить прочитанным' })).toHaveLength(3)
    await user.click(screen.getAllByRole('button', { name: 'Отметить прочитанным' })[0])
    first.unmount()

    render(<App />)
    await screen.findByText('Марс: найдены следы воды')
    expect(screen.getAllByRole('button', { name: 'Прочитано ✓' })).toHaveLength(1)
  })

  it('сообщает код ошибки загрузки', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })))
    render(<App />)
    const message = await screen.findByRole('alert')
    expect(message).toHaveTextContent('Дайджест не загрузился: код 500.')
  })

  it('пишет, когда ничего не найдено', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByText('Марс: найдены следы воды')
    await user.type(screen.getByLabelText('Поиск'), 'квантовый компьютер')
    expect(screen.getByText('Новостей не найдено')).toBeInTheDocument()
  })

  it('показывает сообщение о загрузке', () => {
    render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent('Загрузка дайджеста…')
  })
})
