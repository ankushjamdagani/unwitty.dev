import React from "react";

function Plane() {
  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color={"white"} />
    </mesh>
  );
}

export default Plane;
