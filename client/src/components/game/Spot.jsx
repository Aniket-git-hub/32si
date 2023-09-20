/* eslint-disable react/prop-types */
import { useState } from "react";

const Spot = ({ nullSpot, onClick, size, position, piece, relations, boardPosition }) => {
  const [renderPiece, setRenderPiece] = useState(piece)
  const [isPossibleMove, setIsPossibleMove] = useState(false)
  const [addAnimation, setAddAnimation] = useState(false)


  return (
    <g onClick={() => {
      setAddAnimation(!addAnimation)
      onClick({ nullSpot, size, position, relations, boardPosition, piece, setRenderPiece, isPossibleMove, setIsPossibleMove })
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
