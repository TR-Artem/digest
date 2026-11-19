# Дайджест новостей · модуль 4

React + TypeScript + Vite. Лента новостей из Google Таблицы через веб-приложение Apps Script.

## Запуск

```
npm install
# в .env указать VITE_DIGEST_URL=адрес веб-приложения Apps Script
npm run dev
```

Проверки:

```
npx tsc -b
npm run lint -- --deny-warnings
CI=true npm test
npm run build
```

## Что внутри

- `src/digest.ts` — загрузка, разбор тегов, сортировка по дате.
- `src/App.tsx` — лента, поиск, тег, «только непрочитанные», счётчик.
- `src/read.ts` — отметки «прочитано» в `localStorage` (ключ `digest-read`).
- `src/components/NewsCard.tsx` — карточка новости.
- `tasks/` — задания агенту, `AGENTS.md` — правила проекта, `ai-log.md` — журнал.
