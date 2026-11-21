import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';

import './styles/style.css';
import { routeTree } from './routeTree.gen';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './providers/ThemeProvider';
import StatusPage from './components/StatusPage';
import { Button } from './components/ui/Button';

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultNotFoundComponent: () => (
    <StatusPage
      title={
        <>
          <span className="text-5xl">404</span> Not found
        </>
      }
      message="Sorry, the page you're looking for doesn't exist."
    />
  ),
  defaultErrorComponent: ({ reset }) => (
    <StatusPage
      title={<span className="text-5xl">Oops...</span>}
      message="Something went wrong!"
      action={<Button onClick={reset}>Try again</Button>}
    />
  )
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
