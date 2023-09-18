const Spot = (props) => {
  const relations = props.relations

  const handleClick = () => {
    console.log(props)
  }

  return (
    <g onClick={handleClick}>
      <circle
        style={{
          display: props.nullSpot ? 'none' : 'block',
          zIndex: 10,
          cursor: "pointer"
        }}
        cx={props.position.x}
        cy={props.position.y}
        r={props.size}
        // stroke="black"
        strokeWidth="1"
        fill="white"
      />
      {props?.children}
    </g>
  );
}

export default Spot;
