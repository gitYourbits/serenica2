import React from 'react'
import { motion } from 'framer-motion'

export const AnimatedText = ({ text, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={className}
        >
            {text}
        </motion.div>
    );
};

export const AnimatedImage = ({ src, alt, className }) => {
    return (
        <motion.img
            src={src}
            alt={alt}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={className}
        />
    );
};

export const AnimatedButton = ({ children, className, onClick }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={className}
        >
            {children}
        </motion.button>
    );
};

export const AnimatedContainer = ({ children, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

function Animated({ children, x, y}) {

    const initialAnimation = {
        opacity: 0,
        ...(x !== undefined && { x: x ? 50 : -50 }), 
        ...(y !== undefined && { y: y ? 50 : -50 }), 
      };

      const whileInViewAnimation = {
        opacity: 1,
        ...(x !== undefined && { x: 0 }), 
        ...(y !== undefined && { y: 0 }), 
        transition: {
          delay: 0.2,
          duration: 0.5,
          ease: 'easeIn',
        },
      };
  return (

    <motion.div
        initial={initialAnimation}
        whileInView={whileInViewAnimation}
        viewport={{ once: true, amount: .5 }}
        style={{
            display: 'inline-block', 
            width: '100%',
            overflow: 'hidden',       
          }}>

            {children}

    </motion.div>
  )
}
export default Animated