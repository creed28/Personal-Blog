'use client'

import { motion } from 'framer-motion';

type AnimatedSectionProps = {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection = ({ children, delay }: AnimatedSectionProps) => {
  return (
    <motion.section
      style={{ transitionProperty: 'transform, opacity' }}
      initial={{ translateY: 10, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay }}
    > 
      {children} 
    </motion.section>
  )
}

export default AnimatedSection
