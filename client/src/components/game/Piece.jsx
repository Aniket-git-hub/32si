/* eslint-disable react/prop-types */
const Piece = (props) => {
  if (props.value !== 1 && props.value !== 2) {
    return null;
  }

  let fillColor = props.value === 1 ? 'red' : 'blue';

  return (
    <circle
      style={{
        cursor: "pointer"
      }}
      cx={props.position.x}
      cy={props.position.y}
      r={props.size}
      // stroke="black"
      strokeWidth="1"
      fill={fillColor}
    />
  )
}

export default Piece;