import {
  createFileRoute,
  Link,
  notFound,
  useLocation
} from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

import AnimatedPage from '@/components/AnimatedPage';
import { formatDate, getPost, sortOptions, type PostsSearch } from '@/lib/posts';
import { pageTitle } from '@/lib/seo';

export const Route = createFileRoute('/posts/$slug')({
  loader: async ({ params }) => {
    const post = await getPost(params.slug)
    if (!post) {
      throw notFound()
    }

    return post
  },
  head: ({ loaderData: post }) => ({
    meta: post
      ? [
          pageTitle(post.title),
          { name: 'description', content: post.description ?? post.title },
          { property: 'og:title', content: post.title },
          { property: 'og:type', content: 'article' },
          ...(post.cover ? [{ property: 'og:image', content: post.cover }] : [])
        ]
      : []
  }),
  component: SinglePostPage
})

function SinglePostPage() {
  const post = Route.useLoaderData();
  const fromSearch = useLocation({
    select: location => location.state.postsSearch
  });

  return (
    <AnimatedPage>
      <div>
        <Breadcrumbs title={post.title} fromSearch={fromSearch} />
        {post.cover && (
          <img
            src={post.cover}
            alt=""
            className="mb-6 aspect-video w-full rounded-lg object-cover"
          />
        )}
        <header className="mb-8">
          <h1 className="font-Rounded1c text-3xl font-bold dark:text-[#EEEEEE]">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time> ·{' '}
            {post.readingTime} min read
            {post.tags.map(tag => (
              <span key={tag}>
                {' · '}
                <Link
                  to="/posts"
                  search={{ tags: [tag] }}
                  className="text-brand underline-offset-4 hover:underline"
                >
                  #{tag}
                </Link>
              </span>
            ))}
          </p>
        </header>
        <div
          className="prose max-w-none dark:prose-invert prose-headings:font-Rounded1c prose-a:text-brand prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </AnimatedPage>
  );
}

type BreadcrumbsProps = {
  title: string
  fromSearch?: PostsSearch
}

function Breadcrumbs({ title, fromSearch }: BreadcrumbsProps) {
  const filterLabel = fromSearch?.tags?.length
    ? fromSearch.tags.map(tag => `#${tag}`).join(', ')
    : fromSearch?.sort && sortOptions[fromSearch.sort]?.label

  const linkClass =
    'underline-offset-4 transition-colors hover:text-brand hover:underline'
  const separator = <ChevronRight size={14} aria-hidden className="shrink-0" />

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex min-w-0 items-center gap-1.5">
        <li className="flex shrink-0 items-center gap-1.5">
          <Link to="/posts" className={`${linkClass} shrink-0`}>
            Posts
          </Link>
          {separator}
        </li>
        {filterLabel && (
          <li className="flex min-w-0 items-center gap-1.5">
            <Link
              to="/posts"
              search={fromSearch}
              className={`${linkClass} truncate`}
            >
              {filterLabel}
            </Link>
            {separator}
          </li>
        )}
        <li
          aria-current="page"
          className="min-w-0 truncate text-foreground dark:text-[#EEEEEE]"
        >
          {title}
        </li>
      </ol>
    </nav>
  );
}
