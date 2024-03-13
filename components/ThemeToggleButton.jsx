import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';

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
        <button
          className={`flex items-center ${
            theme === 'dark'
              ? 'bg-[#fbd38d] hover:bg-[#F6AD55]'
              : 'bg-[#805ad5] hover:bg-[#6B46C1]'
          } p-[10px] rounded-[0.375rem]`}
          onClick={handleThemeToggle}
        >
          <Image
            src={`/assets/images/${theme === 'dark' ? 'sun' : 'moon'}-icon.png`}
            alt="Toggle theme"
            width={20}
            height={20}
          />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

export default ThemeToggleButton
