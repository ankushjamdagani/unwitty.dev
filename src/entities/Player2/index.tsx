import { useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "leva";

const velocity = new THREE.Vector2(1, 1);

function Player2() {
  const playerRef = useRef();
  const spotLightRef = useRef();

  const [, get] = useKeyboardControls();

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

  useFrame((state, delta) => {
    const player = playerRef.current;

    if (!player) return;

    const { forward, back, left, right } = get();

    // console.log(player.position);

    const time = state.clock.elapsedTime;

    if (left) velocity.x = -1;
    if (right) velocity.x = 1;

    const x = velocity.x * Math.sin(time) * 20;
    const z = velocity.y * Math.cos(time) * 20;

    console.log(x, z, velocity);

    player.position.set(x, 2, z);

    const vectorPos = player.position;

    // update torch
    spotLightRef.current.position.set(vectorPos.x, vectorPos.y, vectorPos.z);
  });

  return (
    <>
      <mesh ref={playerRef} position={[5, 2, 22]}>
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
