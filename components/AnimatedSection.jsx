'use client'

import { motion } from 'framer-motion';

const AnimatedSection = ({ children, delay = 0 }) => {
  return (
    <motion.section
      style={{ transitionProperty: 'transform, opacity' }}
      initial={{ translateY: 10, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      mb={6}
    > 
      {children} 
    </motion.section>
  )
}

export default AnimatedSection
