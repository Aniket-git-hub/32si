import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

const Spot = ({ x, y, isPossibleMove, onClick, children }) => {
  return (
    <g onClick={onClick}>
      {/* Background interaction circle */}
      <motion.circle
        cx={x}
        cy={y}
        r="20"
        fill="transparent"
        stroke="rgba(255,255,255,0.2)"
        style={{
          strokeWidth: isPossibleMove ? 3 : 2
        }}
        whileHover={{
          scale: 1.1,
          strokeWidth: 3,
          stroke: "rgba(255,255,255,0.4)"
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 10
        }}
      />

      {/* Possible move indicator */}
      <AnimatePresence>
        {isPossibleMove && (
          <motion.circle
            key="possible-move"
            cx={x}
            cy={y}
            r="12"
            fill="rgba(0, 255, 0, 0.5)"
            initial={{
              scale: 0,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1,
              boxShadow: "0 0 10px rgba(0, 255, 0, 0.6)"
            }}
            exit={{
              scale: 0,
              opacity: 0
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          />
        )}
      </AnimatePresence>

      {/* Children (pieces) with entry/exit animations */}
      <AnimatePresence>
        {children && (
          <motion.g
            initial={{
              opacity: 0,
              scale: 0.5
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            exit={{
              opacity: 0,
              scale: 0.5
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            {children}
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
};

export default Spot;