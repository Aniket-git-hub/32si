function Spot(props) {
  // props: relations (object), position (object), size (number), value (number)
  // value: 0 = empty, 1 = arrow, 2 = bead
  return (
    <div
      className="spot"
      style={{
        left: props.position.x,
        top: props.position.y,
        width: props.size,
        height: props.size,
      }}
      onClick={() => {
        console.log(props)
      }}
    >
      {props.value === 1 && (
        // render an arrow based on the relations object
        <div className="arrow">red</div>
      )}
      {props.value === 2 && (
        // render a bead based on the color
        <div className="bead">blue</div>
      )}
    </div>
  );
}

export default Spot;
