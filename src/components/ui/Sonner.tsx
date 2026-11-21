import type { CSSProperties } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useTheme } from '@/providers/ThemeProvider';

export const Toaster = ({ toastOptions, ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const accent = isDark ? '#f0a47a' : '#a3482a';
  const accentText = isDark ? '#244148' : '#FFFFFF';

  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      style={
        {
          '--normal-bg': isDark ? '#313134' : '#F5F0E8',
          '--normal-text': isDark ? '#E6E6E6' : '#1A202C',
          '--normal-border': isDark ? '#3a3a3d' : '#E6DED2',
          '--toast-accent': accent,
          '--toast-accent-text': accentText
        } as CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        style: {
          borderLeft: '4px solid var(--toast-accent)',
          ...toastOptions?.style
        },
        classNames: {
          ...toastOptions?.classNames,
          icon: `text-[var(--toast-accent)] ${toastOptions?.classNames?.icon ?? ''}`,
          actionButton: `!bg-[var(--toast-accent)] !text-[var(--toast-accent-text)] ${toastOptions?.classNames?.actionButton ?? ''}`
        }
      }}
      {...props}
    />
  );
}
