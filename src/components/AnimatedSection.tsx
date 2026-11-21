import type { ReactNode } from 'react';
import { motion } from 'motion/react';

type AnimatedSectionProps = {
  children: ReactNode
  delay?: number
}

const AnimatedSection = ({ children, delay }: AnimatedSectionProps) => (
  <motion.section
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.section>
)

export default AnimatedSection;
