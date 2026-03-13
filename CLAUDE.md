# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Start dev server (localhost:3000)
npm run build    # Production build
npm test         # Run tests (interactive watch mode)
npm run deploy   # Build and deploy to GitHub Pages (gh-pages)
```

## Environment

The app requires `.env` with:
- `REACT_APP_PROXY_URL` — URL of the backend proxy server (e.g. `https://newsapp-red-five.vercel.app`)
- `REACT_APP_NEWS_API_KEY` — NewsAPI.org API key

The frontend never calls NewsAPI directly; all requests go through the proxy to avoid CORS and key exposure.

## Architecture

**React 18 SPA** using Create React App, deployed to GitHub Pages at `https://bhalinder63.github.io/news_app`.

### Data flow

`useFetchNews` hook (`src/hooks/useFetchNews.js`) handles all API calls:
- Calls `${REACT_APP_PROXY_URL}/api/news?...` with query params forwarded to NewsAPI
- Supports two modes: `top-headlines` (by country + category) or `everything` (search query)
- Implements pagination (PAGE_SIZE=5) and exposes `loadMore` for infinite scroll

`News` component uses `IntersectionObserver` on a sentinel `<div>` to trigger `loadMore` automatically as the user scrolls.

### State management

All state is local (no Redux/Context). State is lifted to `App`:
- `darkMode` — persisted in `localStorage`, applied via Bootstrap's `data-bs-theme` attribute on `<html>`
- `country` — persisted in `localStorage`, passed down to `useFetchNews`
- `searchQuery` — set by `Navbar`, consumed by `News` via `useFetchNews`

Bookmarks are stored directly in `localStorage` as a JSON array (keyed by `newsUrl`), read/written in `Newsitems` component.

### Routing

React Router v6 with `basename={process.env.PUBLIC_URL}` for GitHub Pages compatibility. Routes map category names directly to paths (`/business`, `/technology`, etc.). The `key` prop on `<News>` ensures full remount when navigating between categories.

### Styling

All custom styles are in `src/index.css` using a `nm-` prefix namespace (e.g. `nm-card`, `nm-navbar`, `nm-grid`). Bootstrap 5 is loaded via CDN in `public/index.html` and used for layout primitives and dark mode theming — do not import Bootstrap via npm.
