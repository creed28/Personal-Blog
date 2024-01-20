'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ThemeToggleButton = () => {
  const [isToggle, setIsToggle] = useState(null);

  const toggleTheme = () => {
    setIsToggle(!isToggle);
  };

  useEffect(() => {
    if(isToggle){
      document.documentElement.classList.add('dark');
    } else{
      document.documentElement.classList.remove('dark');
    }

  }, [isToggle]);

  return (
    <AnimatePresence mode='wait' initial={false}>
      <motion.div
        style={{ display: 'inline-block' }}
        key={isToggle}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <button
          className={`flex items-center ${
            isToggle
              ? 'bg-[#fbd38d] hover:bg-[#F6AD55]'
              : 'bg-[#805ad5] hover:bg-[#6B46C1]'
          } p-[10px] rounded-[0.375rem]`}
          onClick={toggleTheme}
        >
          <Image
            src={`/assets/images/${isToggle ? 'sun' : 'moon'}-icon.png`}
            alt="Toggle theme"
            width={20}
            height={20}
          />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeToggleButton
