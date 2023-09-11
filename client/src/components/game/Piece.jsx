export const Piece = () => {
  return (
      <circle
          cx={props.position.x}
          cy={props.position.y}
          r={props.size}
          // stroke="black"
          strokeWidth="1"
          fill="red"
      />
  )
}
