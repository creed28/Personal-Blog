import { createFileRoute, Link } from '@tanstack/react-router';
import { Check, ChevronDown } from 'lucide-react';
import { DropdownMenu } from 'radix-ui';

import AnimatedPage from '@/components/AnimatedPage';
import AnimatedSection from '@/components/AnimatedSection';
import {
  allTags,
  formatDate,
  posts,
  sortOptions,
  type PostsSearch,
  type SortKey
} from '@/lib/posts';
import { pageTitle } from '@/lib/seo';
import { cn } from '@/lib/utils';

const isSortKey = (value: unknown): value is SortKey =>
  typeof value === 'string' && value in sortOptions

export const Route = createFileRoute('/posts/')({
  validateSearch: (search: Record<string, unknown>): PostsSearch => {
    const raw = Array.isArray(search.tags)
      ? search.tags
      : typeof search.tags === 'string'
        ? [search.tags]
        : []
    const tags = raw.filter(
      (tag): tag is string => typeof tag === 'string' && allTags.includes(tag)
    )
    return {
      tags: tags.length > 0 ? tags : undefined,
      sort:
        isSortKey(search.sort) && search.sort !== 'newest'
          ? search.sort
          : undefined
    }
  },
  head: () => ({ meta: [pageTitle('Posts')] }),
  component: PostsPage
})

function PostsPage() {
  const search = Route.useSearch();
  const { tags: selectedTags = [], sort = 'newest' } = search;
  const navigate = Route.useNavigate();

  const visiblePosts = posts
    .filter(
      post =>
        selectedTags.length === 0 ||
        selectedTags.some(tag => post.tags.includes(tag))
    )
    .sort(
      (a, b) => sortOptions[sort].compare(a, b) || b.date.localeCompare(a.date)
    )

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    navigate({
      search: prev => ({ ...prev, tags: next.length > 0 ? next : undefined }),
      replace: true,
      resetScroll: false
    })
  }

  const setSort = (value: SortKey) =>
    navigate({
      search: prev => ({
        ...prev,
        sort: value === 'newest' ? undefined : value
      }),
      replace: true,
      resetScroll: false
    })

  const clearTags = () =>
    navigate({
      search: prev => ({ ...prev, tags: undefined }),
      replace: true,
      resetScroll: false
    })

  return (
    <AnimatedPage>
      <div className="dark:text-[#EEEEEE]">
        <h2 className="articleHeading">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              {allTags.length > 0 && (
                <div
                  role="group"
                  aria-label="Filter by tag"
                  className="flex flex-wrap items-center gap-2"
                >
                  {allTags.map(tag => {
                    const active = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none',
                          active
                            ? 'border-brand bg-brand text-brand-foreground hover:bg-brand-hover'
                            : 'border-black/10 hover:bg-brand-soft dark:border-[#525255]'
                        )}
                      >
                        #{tag}
                      </button>
                    )
                  })}
                  {selectedTags.length > 0 && (
                    <button
                      type="button"
                      onClick={clearTags}
                      className="px-1 text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
              <div className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                <span id="sort-label">Sort</span>
                <DropdownMenu.Root modal={false}>
                  <DropdownMenu.Trigger
                    aria-labelledby="sort-label sort-value"
                    className="flex items-center gap-1 rounded-md border border-black/10 px-2 py-1 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none data-[state=open]:bg-brand-soft dark:border-[#525255] dark:text-[#EEEEEE]"
                  >
                    <span id="sort-value">{sortOptions[sort].label}</span>
                    <ChevronDown size={14} />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      side="bottom"
                      align="end"
                      sideOffset={4}
                      className="z-50 min-w-(--radix-dropdown-menu-trigger-width) rounded-md border border-black/10 bg-page p-1 text-sm shadow-lg dark:border-[#525255] dark:text-[#EEEEEE]"
                    >
                      <DropdownMenu.RadioGroup
                        value={sort}
                        onValueChange={value => setSort(value as SortKey)}
                      >
                        {Object.entries(sortOptions).map(([key, { label }]) => (
                          <DropdownMenu.RadioItem
                            key={key}
                            value={key}
                            className="relative flex cursor-pointer items-center rounded py-1.5 pr-2 pl-7 outline-none select-none data-highlighted:bg-brand-soft"
                          >
                            <DropdownMenu.ItemIndicator className="absolute left-2 text-brand">
                              <Check size={14} />
                            </DropdownMenu.ItemIndicator>
                            {label}
                          </DropdownMenu.RadioItem>
                        ))}
                      </DropdownMenu.RadioGroup>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>

            {visiblePosts.length === 0 ? (
              <p className="text-muted-foreground">
                No posts match the selected tags.
              </p>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2">
                {visiblePosts.map((post, index) => (
                  <li key={post.slug}>
                    <AnimatedSection delay={0.05 * index}>
                      <Link
                        to="/posts/$slug"
                        params={{ slug: post.slug }}
                        state={{ postsSearch: search }}
                        className="group -m-3 block rounded-xl p-3 transition-colors hover:bg-white/40 dark:hover:bg-white/5"
                      >
                        {post.cover && (
                          <img
                            src={post.cover}
                            alt=""
                            loading="lazy"
                            className="mb-3 aspect-video w-full rounded-lg object-cover"
                          />
                        )}
                        <h3 className="font-Rounded1c text-lg font-bold underline-offset-4 group-hover:underline">
                          {post.title}
                          {post.private && (
                            <span className="ml-2 text-xs text-red-500">
                              private
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(post.date)} · {post.readingTime} min read
                        </p>
                        {post.description && (
                          <p className="mt-1 text-sm">{post.description}</p>
                        )}
                        {post.tags.length > 0 && (
                          <p className="mt-2 flex flex-wrap gap-x-2 text-xs text-brand">
                            {post.tags.map(tag => (
                              <span key={tag}>#{tag}</span>
                            ))}
                          </p>
                        )}
                      </Link>
                    </AnimatedSection>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </AnimatedPage>
  );
}
