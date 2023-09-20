/* eslint-disable react/prop-types */
import { useState } from "react";

const Spot = ({ nullSpot, onClick, size, position, piece, relations, boardPosition }) => {
  const [renderPiece, setRenderPiece] = useState(piece)
  const [isPossibleMove, setIsPossibleMove] = useState(false)


  return (
    <g onClick={() => onClick({ nullSpot, size, position, relations, boardPosition, piece, setRenderPiece, isPossibleMove, setIsPossibleMove })}>
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
        fill={!isPossibleMove ? "white" : "black"}
      />
      {renderPiece && renderPiece}
    </g>
  )
}

export default Spot;
