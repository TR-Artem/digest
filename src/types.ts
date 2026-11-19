export type News = {
  id: string
  date: string
  source: string
  title: string
  summary: string
  tags: string[]
  link: string
}

export type RawNews = {
  id: string
  date: string
  source: string
  title: string
  summary: string
  tags: string
  link: string
}
