import type { ReactNode } from 'react';
import { motion, type Variants } from 'motion/react';

const variants: Variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 20 }
}

const AnimatedPage = ({ children }: { children: ReactNode }) => (
  <motion.article
    className="relative"
    initial="hidden"
    animate="enter"
    exit="exit"
    variants={variants}
    transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.2 }}
  >
    {children}
  </motion.article>
)

export default AnimatedPage;
