import { AnimatePresence, motion } from 'motion/react';

import { useTheme } from '@/providers/ThemeProvider';
import { Button } from './ui/Button';

const ThemeToggleButton = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className="inline-block"
        key={resolvedTheme}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="toggle"
          size="sm"
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          <img
            src={`/assets/images/${isDark ? 'sun' : 'moon'}-icon.png`}
            alt=""
            width={20}
            height={20}
          />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}

export default ThemeToggleButton;
