import { createFileRoute } from '@tanstack/react-router';

import AnimatedPage from '@/components/AnimatedPage';

export const Route = createFileRoute('/')({
  component: HomePage
});

function HomePage() {
  return <AnimatedPage>Home</AnimatedPage>
}
