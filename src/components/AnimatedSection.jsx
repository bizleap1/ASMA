import React from 'react';
import { motion } from 'framer-motion';

const AnimatedSection = ({ children, className = "", delay = 0, ...props }) => (
  <motion.section
    {...props}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0 }}
    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay }}
    className={className}
  >
    {children}
  </motion.section>
);

export default AnimatedSection;