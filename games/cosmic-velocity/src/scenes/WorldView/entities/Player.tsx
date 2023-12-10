import React from "react";

function Player() {
  return (
    <mesh position={[0, 0.501, 0]}>
      <boxGeometry args={[2, 1, 3]} />
      <meshStandardMaterial color={"white"} />
    </mesh>
  );
}

export default Player;
