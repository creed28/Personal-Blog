import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from './Button';

const ThemeToggleButton = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        className='inline-block'
        key={resolvedTheme}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant='toggle'
          size='sm'
          onClick={handleThemeToggle}
        >
          <Image
            src={`/assets/images/${resolvedTheme === 'dark' ? 'sun' : 'moon'}-icon.png`}
            alt="Toggle theme"
            width={20}
            height={20}
          />
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}

export default ThemeToggleButton
