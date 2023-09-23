/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const Spot = ({ nullSpot, onClick, size, position, piece, relations, boardPosition, isPossibleMove }) => {
  const [renderPiece, setRenderPiece] = useState(piece)
  const [addAnimation, setAddAnimation] = useState(false)

  return (
    <g onClick={() => {
      setAddAnimation(!addAnimation)
      onClick({ nullSpot, size, position, relations, boardPosition, piece, setRenderPiece, isPossibleMove });
    }}>
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
        fill={!isPossibleMove ? "white" : "lightgreen"}
      />
      {renderPiece && renderPiece}
    </g>
  )
}

export default Spot;
