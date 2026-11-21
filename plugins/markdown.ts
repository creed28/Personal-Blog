import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import { parse as parseYaml } from 'yaml';
import { imageSize } from 'image-size';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Root } from 'hast';


type Frontmatter = {
  title: string
  date: string
  description?: string
  cover?: string
  tags: string[]
  private: boolean
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const WORDS_PER_MINUTE = 200
const isRelative = (src: string) =>
  !/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(src) && src.length > 0

function parseFrontmatter(source: string, file: string) {
  const match = FRONTMATTER_RE.exec(source)
  const data = (match ? parseYaml(match[1]) : {}) as Record<string, unknown>
  const body = match ? source.slice(match[0].length) : source

  const fail = (msg: string) => {
    throw new Error(`[markdown] ${path.relative(process.cwd(), file)}: ${msg}`)
  }

  if (typeof data.title !== 'string' || !data.title.trim()) {
    fail('frontmatter needs a `title`')
  }
  const date =
    data.date instanceof Date ? data.date.toISOString() : String(data.date)
  if (Number.isNaN(Date.parse(date))) {
    fail('frontmatter needs a valid `date` (e.g. 2026-01-31)')
  }

  const frontmatter: Frontmatter = {
    title: String(data.title),
    date: date.slice(0, 10),
    description:
      typeof data.description === 'string' ? data.description : undefined,
    cover: typeof data.cover === 'string' ? data.cover : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    private: data.private === true
  }

  return { frontmatter, body }
}

class ImageImports {
  private readonly imports = new Map<string, string>()

  constructor(private readonly dir: string) {}

  add(src: string) {
    const file = path.resolve(this.dir, decodeURI(src))
    if (!existsSync(file)) {
      throw new Error(`[markdown] image not found: ${file}`)
    }
    let name = this.imports.get(src)
    if (!name) {
      name = `__img${this.imports.size}`
      this.imports.set(src, name)
    }
    return { token: `%%${name}%%`, file }
  }

  statements() {
    return [...this.imports]
      .map(([src, name]) => `import ${name} from ${JSON.stringify(src)};`)
      .join('\n')
  }
}

function toJsExpression(value: string) {
  return (
    value
      .split(/%%(__img\d+)%%/)
      .map((part, i) => (i % 2 ? part : JSON.stringify(part)))
      .filter(part => part !== '""')
      .join(' + ') || '""'
  )
}

function rehypeLocalImages(images: ImageImports) {
  return (tree: Root) => {
    visit(tree, 'element', node => {
      if (node.tagName !== 'img') return
      const src = node.properties.src
      if (typeof src !== 'string' || !isRelative(src)) return

      const { token, file } = images.add(src)
      node.properties.src = token
      node.properties.loading ??= 'lazy'
      node.properties.decoding ??= 'async'

      // Intrinsic dimensions prevent layout shift while images load.
      if (node.properties.width == null && node.properties.height == null) {
        try {
          const { width, height } = imageSize(readFileSync(file))
          if (width && height) Object.assign(node.properties, { width, height })
        } catch {
          // Unknown format (e.g. some SVGs) – just skip the dimensions.
        }
      }
    })
  }
}

async function renderHtml(markdown: string, images: ImageImports) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeShiki, {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false
    })
    .use(rehypeLocalImages, images)
    .use(rehypeStringify)
    .process(markdown)
  return String(file)
}

const CONTENT_DIR = 'content'
const POSTS_DIR = 'content/posts'
const PRIVATE_DIR = 'content/private'
const VIRTUAL_ID = 'virtual:posts'
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID

function findPosts(dir: string) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .flatMap(entry => {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        return [
          { slug: entry.name.slice(0, -3), file: path.join(dir, entry.name) }
        ]
      }
      const index = path.join(dir, entry.name, 'index.md')
      return entry.isDirectory() && existsSync(index)
        ? [{ slug: entry.name, file: index }]
        : []
    })
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

export default function markdown(): Plugin {
  let isBuild = false
  let root = process.cwd()

  const postsModule = () => {
    const published = findPosts(path.join(root, POSTS_DIR)).map(entry => ({
      ...entry,
      forcePrivate: false
    }))

    const unpublished = isBuild
      ? []
      : findPosts(path.join(root, PRIVATE_DIR)).map(entry => ({
          ...entry,
          forcePrivate: true
        }))

    const seen = new Set<string>()
    for (const { slug, file } of [...published, ...unpublished]) {
      if (seen.has(slug)) {
        throw new Error(`[markdown] duplicate post slug "${slug}" (${file})`)
      }
      seen.add(slug)
    }

    const entries = [...published, ...unpublished].filter(
      ({ file }) =>
        !isBuild ||
        !parseFrontmatter(readFileSync(file, 'utf8'), file).frontmatter.private
    )
    const id = (file: string) =>
      JSON.stringify('/' + path.relative(root, file).split(path.sep).join('/'))

    return [
      ...entries.map(
        ({ file }, i) => `import __meta${i} from ${id(file + '?meta')};`
      ),
      `export const posts = [${entries
        .map(
          ({ slug, forcePrivate }, i) =>
            `{ ...__meta${i}, slug: ${JSON.stringify(slug)}${
              forcePrivate ? ', private: true' : ''
            } }`
        )
        .join(', ')}];`,
      `export const loaders = {${entries
        .map(
          ({ slug, file }) =>
            `${JSON.stringify(slug)}: () => import(${id(file)}).then(m => m.html)`
        )
        .join(', ')}};`
    ].join('\n')
  }

  return {
    name: 'blog-markdown',
    enforce: 'pre',
    configResolved(config) {
      isBuild = config.command === 'build'
      root = config.root
    },
    configureServer(server) {
      const contentDir = path.join(root, CONTENT_DIR)
      const refresh = (file: string) => {
        if (!file.startsWith(contentDir)) return
        const graph = server.environments.client.moduleGraph
        const mod = graph.getModuleById(RESOLVED_VIRTUAL_ID)
        if (mod) graph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.add(contentDir)
      for (const event of ['add', 'unlink', 'addDir', 'unlinkDir'] as const) {
        server.watcher.on(event, refresh)
      }
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_VIRTUAL_ID : null
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_ID) return postsModule()

      const [file, query = ''] = id.split('?')
      if (!file.endsWith('.md')) return null

      const source = readFileSync(file, 'utf8')
      const { frontmatter, body } = parseFrontmatter(source, file)
      const images = new ImageImports(path.dirname(file))
      const metaOnly = new URLSearchParams(query).has('meta')

      const cover =
        frontmatter.cover && isRelative(frontmatter.cover)
          ? images.add(frontmatter.cover).token
          : frontmatter.cover

      const words = body.split(/\s+/).filter(Boolean).length
      const meta = {
        ...frontmatter,
        readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE))
      }

      const html = metaOnly ? '' : await renderHtml(body, images)

      return [
        images.statements(),
        `export const frontmatter = { ...${JSON.stringify(meta)}, cover: ${
          cover ? toJsExpression(cover) : 'undefined'
        } };`,
        metaOnly ? '' : `export const html = ${toJsExpression(html)};`,
        `export default ${metaOnly ? 'frontmatter' : '{ frontmatter, html }'};`
      ].join('\n')
    }
  }
}
