// Modules produced by plugins/markdown.ts
declare module '*.md' {
  import type { PostMeta } from '@/lib/posts'
  export const frontmatter: Omit<PostMeta, 'slug'>
  export const html: string
  const post: { frontmatter: Omit<PostMeta, 'slug'>; html: string }
  export default post
}

declare module '*.md?meta' {
  import type { PostMeta } from '@/lib/posts'
  export const frontmatter: Omit<PostMeta, 'slug'>
  export default frontmatter
}

declare module 'virtual:posts' {
  import type { PostMeta } from '@/lib/posts'
  export const posts: PostMeta[]
  export const loaders: Record<string, () => Promise<string>>
}
