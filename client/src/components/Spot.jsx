import { useEffect } from "react";

function Spot(props) {
  return (
    <circle
      style={{
        display: props.nullSpot ? 'none' : 'block'
      }}
      onClick={() => console.log(props.boardPosition)}
      cx={props.position.x}
      cy={props.position.y}
      r={props.size}
      stroke="black"
      strokeWidth="1"
      fill="transparent"
    />
  );
}

export default Spot;
