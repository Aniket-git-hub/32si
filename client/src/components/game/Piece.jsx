const Piece = ({ value, position, size }) => {
  if (value !== 1 && value !== 2) {
    return null
  }

  let fillColor = value === 1 ? "red" : "blue"

  return (
    <g>
      <circle
        style={{
          cursor: "pointer",
          transition: 'all .5 ease-in-out'
        }}
        cx={position.x}
        cy={position.y}
        r={size}
        stroke="black"
        strokeWidth="1"
        fill={fillColor}
      />
    </g>
  )
}

export default Piece
