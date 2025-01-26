import { motion } from "framer-motion";

const Piece = ({ x, y, color, isSelected }) => (
  <motion.g>
    {/* Shadow effect */}
    <motion.circle
      cx={x}
      cy={y}
      r="15"
      fill="rgba(0,0,0,0.3)"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isSelected ? 1.3 : 1,
        opacity: isSelected ? 0.5 : 0,
        y: isSelected ? 5 : 0
      }}
      transition={{ type: "spring", stiffness: 300 }}
    />

    {/* Main piece */}
    <motion.circle
      cx={x}
      cy={y}
      r="15"
      fill={color}
      initial={{ scale: 0 }}
      animate={{
        scale: isSelected ? 1.2 : 1,
        boxShadow: isSelected
          ? "0 0 10px rgba(255,255,255,0.5)"
          : "none"
      }}
      whileHover={{ scale: 1.1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 10
      }}
      style={{
        cursor: 'pointer',
        border: isSelected ? '2px solid white' : 'none'
      }}
    />
  </motion.g>
);

export default Piece;