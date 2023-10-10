import { useState } from "react";

function Spot({ nullSpot, onClick, size, position, piece, relations, boardPosition, isPossibleMove }) {
  const [renderPiece, setRenderPiece] = useState(piece)
  const [addAnimation, setAddAnimation] = useState(false)

  return (
    <g onClick={(e) => {
      setAddAnimation(!addAnimation)
      onClick(e, { nullSpot, size, position, relations, boardPosition, piece, setRenderPiece, isPossibleMove });
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
        stroke="black"
        strokeWidth="1"
        fill={!isPossibleMove ? "white" : "lightgreen"}
        className={isPossibleMove ? "breathing-circle rotating-circle" : ""}
      />
      {piece}
    </g>
  )
}

export default Spot;
