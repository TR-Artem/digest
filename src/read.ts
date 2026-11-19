const KEY = 'digest-read'

export function loadRead(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw === null) {
      return []
    }
    const list: unknown = JSON.parse(raw)
    return Array.isArray(list) ? list.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function saveRead(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids))
}
