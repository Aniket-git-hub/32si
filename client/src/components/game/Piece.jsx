export const Piece = (props) => {
  return (
    <circle
      cx={props.position.x}
      cy={props.position.y}
      r={props.size}
      // stroke="black"
      strokeWidth="1"
      fill={props.value === 1 ? 'red' : 'blue'}
    />
  )
}
