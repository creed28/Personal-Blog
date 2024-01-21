'use client'

import { motion } from "framer-motion";

const variants = {
    hidden: { opacity: 0, x: 0, y: 20 },
    enter: { opacity: 1, x: 0, y: 0},
    exit: { opacity: 0, x: 0, y: 20}
}

const AnimatedPage = ({ children }) => {
  return (
    <motion.article 
      className="relative" 
      initial='hidden' 
      animate='enter' 
      exit='exit' 
      variants={variants} 
      transition={{duration: 0.4, type: 'easeInOut'}}>
        {children}
    </motion.article>
  )
}

export default AnimatedPage
