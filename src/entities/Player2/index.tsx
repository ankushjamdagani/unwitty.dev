import { useControls } from "leva";
import { useRef } from "react";

function Player2() {
  const playerRef = useRef();
  const spotLightRef = useRef();

  const { color, intensity, distance, angle, penumbra, decay } = useControls(
    "Player Headlight",
    {
      color: "#bad892",
      intensity: 100,
      distance: 20,
      angle: Math.PI * 0.25,
      penumbra: 0.2,
      decay: 1,
    }
  );

  return (
    <>
      <mesh ref={playerRef} position={[0, 2, 22]}>
        <boxGeometry args={[4, 2, 2]} />
        <meshBasicMaterial color={"red"} />
      </mesh>
      <spotLight
        ref={spotLightRef}
        args={[color, intensity, distance, angle, penumbra, decay]}
        position={[0, 2, 22]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <pointLight
        args={[color, 10, 5, 2]}
        position={[2, 1, 22]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </>
  );
}

export default Player2;
