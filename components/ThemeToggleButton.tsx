import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from './Button';

const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        className='inline-block'
        key={theme}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant={theme === 'dark' ? 'dark' : 'light'}
          size='xsm'
          onClick={handleThemeToggle}
        >
          <Image
            src={`/assets/images/${theme === 'dark' ? 'sun' : 'moon'}-icon.png`}
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