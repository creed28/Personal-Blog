import { useEffect, useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';
import type { DeskSceneController } from './scene';

type Status = 'loading' | 'ready' | 'failed';

const DeskScene = () => {
  const { resolvedTheme } = useTheme();
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<DeskSceneController | null>(null);
  const themeRef = useRef(resolvedTheme);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    themeRef.current = resolvedTheme;
    sceneRef.current?.setTheme(resolvedTheme);
  }, [resolvedTheme])

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    import('./scene')
      .then(({ createDeskScene }) =>
        createDeskScene(host, {
          theme: themeRef.current,
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
            .matches
        })
      )
      .then(scene => {
        if (cancelled) return scene.dispose();
        sceneRef.current = scene;
        scene.setTheme(themeRef.current);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('failed');
      })

    return () => {
      cancelled = true
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [])

  if (status === 'failed') return null;

  return (
    <div
      role="img"
      aria-label="3D illustration of Hristo sitting at his desk, writing in a diary"
      className="relative mx-auto mb-4 h-75 w-full sm:h-95 md:h-110"
    >
      <div
        ref={hostRef}
        className={cn(
          'absolute inset-0 transition-opacity duration-700',
          status === 'ready' ? 'opacity-100' : 'opacity-0'
        )}
      />
      {status === 'loading' && (
        <LoaderCircle
          aria-hidden
          className="absolute top-1/2 left-1/2 size-8 -translate-1/2 animate-spin text-[#525252] dark:text-[#EEEEEE]"
        />
      )}
    </div>
  );
}

export default DeskScene;
