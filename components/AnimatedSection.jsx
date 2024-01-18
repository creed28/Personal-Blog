import { motion } from 'framer-motion';

const StyledDiv = motion.div;

const AnimatedSection = ({ children, delay = 0 }) => (
  <StyledDiv
    style={{ transitionProperty: 'transform, opacity' }}
    initial={{ translateY: 10, opacity: 0 }}
    animate={{ translateY: 0, opacity: 1 }}
    transition={{ duration: 0.8, delay }}
    mb={6}
  >
    {children}
  </StyledDiv>
);

export default AnimatedSection
