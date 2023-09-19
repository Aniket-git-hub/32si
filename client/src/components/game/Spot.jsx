import { useState } from "react";

const Spot = ({ nullSpot, onClick, size, position, children, relations, boardPosition }) => {
  const [piece, setPiece] = useState(null)

  return (
    <g onClick={() => onClick({ nullSpot, size, position, children, relations, boardPosition, piece, setPiece })}>
      <circle
        style={{
          display: nullSpot ? 'none' : 'block',
          zIndex: 10,
          cursor: "pointer",
        }}
        cx={position?.x}
        cy={position?.y}
        r={size}
        // stroke="black"
        strokeWidth="1"
        fill="white"
      />
      {piece}
    </g>
  )
}

export default Spot;
