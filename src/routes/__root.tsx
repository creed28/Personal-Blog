import { lazy, Suspense } from 'react';
import {
  HeadContent,
  Outlet,
  createRootRouteWithContext,
  rootRouteId,
  useMatches
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/Sonner';

const DeskScene =
  Object.values(
    import.meta.glob<{ default: () => React.ReactNode }>(
      '../components/desk-scene/DeskScene.tsx',
      { eager: true }
    )
  )[0]?.default ?? (() => null)

type RouterContext = {
  queryClient: QueryClient
}

const Devtools = import.meta.env.DEV
  ? lazy(async () => {
      const [{ TanStackRouterDevtools }, { ReactQueryDevtools }] =
        await Promise.all([
          import('@tanstack/react-router-devtools'),
          import('@tanstack/react-query-devtools')
        ])
      return {
        default: () => (
          <>
            <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </>
        )
      }
    })
  : () => null

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { title: "Homepage | Hristo's Blog" },
      { name: 'description', content: "Hristo Zagorliev's personal blog" }
    ]
  }),
  component: RootLayout
})

function RootLayout() {
  const showDeskScene = useMatches({
    select: matches => {
      const page = matches.at(-1)
      return (
        page !== undefined &&
        page.routeId !== rootRouteId &&
        page.routeId !== '/posts/$slug' &&
        page.status !== 'error' &&
        page.status !== 'notFound'
      )
    }
  })

  return (
    <>
      <HeadContent />
      <Navbar />
      <main className="mx-auto max-w-204 px-6 pt-24">
        {showDeskScene && <DeskScene />}
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" duration={4000} />
      <Suspense>
        <Devtools />
      </Suspense>
    </>
  );
}
