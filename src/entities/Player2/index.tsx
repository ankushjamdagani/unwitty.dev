import { useRef } from "react";

function Player2() {
  const playerRef = useRef();

  return (
    <mesh ref={playerRef} position={[0, 2, 22]}>
      <boxGeometry args={[4, 2, 2]} />
      <meshBasicMaterial color={"red"} />
    </mesh>
  );
}

export default Player2;
