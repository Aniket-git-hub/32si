function Spot(props) {
  const relations = props.relations
  
  const handleClick = () => {
    console.log(props)
  }

  return (
    <circle
      style={{
        display: props.nullSpot ? 'none' : 'block', 
        zIndex: 10,
      }}
      onClick={handleClick}
      cx={props.position.x}
      cy={props.position.y}
      r={props.size}
      // stroke="black"
      strokeWidth="1"
      fill="white"
    />
  );
}

export default Spot;
