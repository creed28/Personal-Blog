## Getting Started

First, install all the packages:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

This starts Vite on [http://localhost:3000](http://localhost:3000).

## Stack

- [React 19](https://react.dev/) - Library for building user interfaces.
- [Vite](https://vite.dev/) - Fast dev server and bundler.
- [TanStack Router](https://tanstack.com/router) - Type-safe, file-based routing with automatic code-splitting.
- [TanStack Query](https://tanstack.com/query) - Async state management (contact form).
- [TypeScript](https://www.typescriptlang.org/) - Strongly typed programming language that builds on JavaScript.
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework.
- [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/) - Accessible component primitives.
- [Motion](https://motion.dev/) - Animation library for React.
- [Three.js](https://threejs.org/) - WebGL 3D library, for the desk scene.
- [unified](https://unifiedjs.com/) (remark / rehype) - Markdown to HTML at build time.
- [Shiki](https://shiki.style/) - Syntax highlighting.
- [Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography) - Article styles.

## Writing posts

Posts are markdown files in `content/posts/`. Give each post its own folder; the
folder name becomes the URL (`content/posts/hello-world/index.md` → `/posts/hello-world`).
A single `content/posts/<slug>.md` file also works.

```md
---
title: My post # required
date: 2026-11-14 # required, YYYY-MM-DD
description: Shown in the post list and meta tags
cover: ./cover.jpg # optional, relative to this file
tags: [books, fitness]
private: true # optional, default false: hidden from the live site (see below)
---

Regular **markdown** (GitHub-flavoured: tables, task lists, footnotes) and raw HTML.

![Alt text](./photo.jpg)
```

- **Images:** put them next to `index.md` and use a relative path. They are bundled
  and fingerprinted by Vite and get `width`/`height` + lazy loading automatically.
  Absolute paths (`/assets/...`) point at `public/`.
- **Code blocks** are syntax-highlighted at build time (Shiki, light + dark themes).

### Private posts

The whole `content/` folder is git-ignored: no post, public or private, is ever
committed, so deleting a post here really deletes its source. Posts reach Vercel
only as compiled HTML inside the build (see [Deployment](#deployment-vercel)).

| Where the post lives               | Live site | Git / GitHub | Vercel                     |
| ---------------------------------- | --------- | ------------ | -------------------------- |
| `content/posts/`                   | shown     | never        | compiled into the build    |
| `content/posts/` + `private: true` | hidden    | never        | left out of the build      |
| `content/private/`                 | hidden    | never        | left out of the build      |

Private posts show up in `npm run dev` with a "private" badge. To publish one,
move its folder to `content/posts/` (or drop `private: true`).

**Back up `content/` yourself** (an external drive, iCloud, an encrypted
archive): this machine holds the only copy.

Markdown is compiled to HTML at build time by [`plugins/markdown.ts`](plugins/markdown.ts),
so no markdown parser is shipped to the browser.

## Deployment (Vercel)

Posts aren't in the repo, so Vercel can't build the site from GitHub. Build it
on this machine and upload only the result:

```bash
npm i -g vercel   # once
vercel link       # once: connect this folder to the Vercel project
npm run deploy    # pull settings → build locally → upload .vercel/output
```

`vercel deploy --prebuilt` uploads only the built files. Your markdown never
leaves this machine. `vercel.json` turns off deploys on git push
(`git.deploymentEnabled: false`), so a push can't replace the live site with
one that has no posts.

**Removing a post:** delete its folder, then run `npm run deploy`. Older Vercel
deployments keep their own URLs (`<project>-<hash>.vercel.app`) and still contain
the post, so delete them under **Deployments** in the Vercel dashboard, or with
`vercel rm <url>`.

Only the build is served. Markdown sources are never reachable from the site, and
private posts are never built into it. To check locally:

```bash
npm run build   # type-checks and builds the static site into dist/
npm run preview # serves dist/ on http://localhost:3000
```

Because `dist/` is plain static files, Netlify, Cloudflare Pages or GitHub Pages
work just as well; they only need the same "unknown path → `index.html`" rewrite.

### Other scripts

| Script              | Description                       |
| ------------------- | --------------------------------- |
| `npm run typecheck` | Type-check the app and the config |
| `npm run lint`      | Lint with ESLint                  |
| `npm run format`    | Format with Prettier              |

## Project structure

```
content/posts/     Blog posts (markdown + images), git-ignored, local only
content/private/   Private posts, git-ignored (dev only)
plugins/           Vite plugin that compiles markdown at build time
src/
  routes/          File-based routes (TanStack Router); routeTree.gen.ts is generated
  components/      App components (ui/ holds shadcn-style primitives)
  providers/       Theme provider
  lib/             Posts API, query client, utilities
  styles/          Tailwind v4 stylesheet
```
