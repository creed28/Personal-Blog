import { createFileRoute, Link } from '@tanstack/react-router';
import { BookOpen, Clapperboard, Dumbbell, SprayCan } from 'lucide-react';
import { IoIosArrowForward } from 'react-icons/io';

import AnimatedPage from '@/components/AnimatedPage';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/Button';
import { nowItems, nowUpdated, type NowKind } from '@/constants/now';
import { allTags, formatDate, posts } from '@/lib/posts';

export const Route = createFileRoute('/')({
  component: HomePage
})

const nowIcons: Record<NowKind, typeof BookOpen> = {
  reading: BookOpen,
  watching: Clapperboard,
  wearing: SprayCan,
  training: Dumbbell
}

function HomePage() {
  return (
    <AnimatedPage>
      <div className="grid gap-8 md:grid-cols-5 dark:text-[#EEEEEE]">
        <div className="md:col-span-3">
          <AnimatedSection>
            <FeaturedPost />
          </AnimatedSection>
        </div>
        <div className="flex flex-col gap-8 md:col-span-2">
          <AnimatedSection delay={0.1}>
            <Stats />
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <Now />
          </AnimatedSection>
        </div>
      </div>
    </AnimatedPage>
  );
}

function FeaturedPost() {
  const post = posts[0];

  if (!post) {
    return (
      <>
        <h2 className="articleHeading mt-0">Latest post</h2>
        <div className="rounded-xl border border-dashed border-black/15 p-6 text-center text-muted-foreground dark:border-white/15">
          The first post is on its way.
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="articleHeading mt-0">Latest post</h2>
      <Link
        to="/posts/$slug"
        params={{ slug: post.slug }}
        className="group -m-3 block rounded-xl p-3 transition-colors hover:bg-white/40 dark:hover:bg-white/5"
      >
        {post.cover ? (
          <img
            src={post.cover}
            alt=""
            className="mb-4 aspect-video w-full rounded-lg object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="mb-4 aspect-video w-full rounded-lg bg-brand-soft"
          />
        )}
        <h3 className="font-Rounded1c text-2xl font-bold underline-offset-4 group-hover:underline">
          {post.title}
          {post.private && (
            <span className="ml-2 text-xs text-red-500">private</span>
          )}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatDate(post.date)} · {post.readingTime} min read
        </p>
        {post.description && (
          <p className="mt-2 leading-relaxed">{post.description}</p>
        )}
        {post.tags.length > 0 && (
          <p className="mt-2 flex flex-wrap gap-x-2 text-xs text-brand">
            {post.tags.map(tag => (
              <span key={tag}>#{tag}</span>
            ))}
          </p>
        )}
      </Link>
      <Button asChild variant="social" className="mt-4 -ml-2 inline-flex">
        <Link to="/posts">
          All posts
          <IoIosArrowForward className="mt-0.5" />
        </Link>
      </Button>
    </>
  );
}

function Stats() {
  const totalMinutes = posts.reduce((sum, post) => sum + post.readingTime, 0);
  const firstYear = posts.at(-1)?.date.slice(0, 4);

  const stats = [
    { value: posts.length, label: posts.length === 1 ? 'post' : 'posts' },
    { value: allTags.length, label: allTags.length === 1 ? 'topic' : 'topics' },
    { value: totalMinutes, label: 'min of reading' },
    ...(firstYear ? [{ value: firstYear, label: 'writing since' }] : [])
  ]

  return (
    <>
      <h2 className="articleHeading mt-0">At a glance</h2>
      <dl className="grid grid-cols-2 gap-3">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="rounded-xl bg-white/40 p-3 dark:bg-white/5"
          >
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="font-Rounded1c text-2xl font-bold text-brand">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function Now() {
  return (
    <>
      <h2 className="articleHeading mt-0">Now</h2>
      <ul className="flex flex-col gap-3">
        {nowItems.map(item => {
          const value = item.value.trim()
          const rewatching = item.rewatching?.trim()
          if (!value && !rewatching) return null

          const Icon = nowIcons[item.kind]
          return (
            <li key={item.kind} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Icon size={16} aria-hidden />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                {value && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="font-semibold">
                      {value}
                      {item.detail && (
                        <span className="font-normal text-muted-foreground">
                          {' '}
                          · {item.detail}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                {rewatching && (
                  <div>
                    <p className="text-xs text-muted-foreground">Rewatching</p>
                    <p className="font-semibold">{rewatching}</p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Updated {formatDate(nowUpdated)}
      </p>
    </>
  );
}
