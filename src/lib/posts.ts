import { loaders, posts as allPosts } from 'virtual:posts';

export type PostMeta = {
  slug: string
  title: string
  date: string
  description?: string
  cover?: string
  tags: string[]
  private: boolean
  readingTime: number
}

export type Post = PostMeta & { html: string }

export const posts: PostMeta[] = [...allPosts].sort((a, b) =>
  b.date.localeCompare(a.date)
)

export const sortOptions = {
  newest: {
    label: 'Newest first',
    compare: (a: PostMeta, b: PostMeta) => b.date.localeCompare(a.date)
  },
  oldest: {
    label: 'Oldest first',
    compare: (a: PostMeta, b: PostMeta) => a.date.localeCompare(b.date)
  },
  shortest: {
    label: 'Shortest read',
    compare: (a: PostMeta, b: PostMeta) => a.readingTime - b.readingTime
  },
  longest: {
    label: 'Longest read',
    compare: (a: PostMeta, b: PostMeta) => b.readingTime - a.readingTime
  }
} as const

export type SortKey = keyof typeof sortOptions

export type PostsSearch = {
  tags?: string[]
  sort?: SortKey
}

declare module '@tanstack/react-router' {
  interface HistoryState {
    postsSearch?: PostsSearch
  }
}

export const allTags: string[] = [
  ...new Set(posts.flatMap(post => post.tags))
].sort((a, b) => a.localeCompare(b))

export async function getPost(slug: string): Promise<Post | undefined> {
  const meta = posts.find(post => post.slug === slug)
  const load = loaders[slug]
  if (!meta || !load) return undefined
  return { ...meta, html: await load() }
}

export const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
