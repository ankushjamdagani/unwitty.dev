import { useEffect, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Controls } from "../../InputController";

function Player() {
  const playerRef = useRef();
  const jumpPressed = useKeyboardControls<Controls>((state) => state.jump);

  useEffect(() => {
    if (!playerRef.current) return;

    if (jumpPressed) {
      const mass = playerRef.current.mass();
      playerRef.current.applyImpulse({ x: 0, y: mass, z: 0 });
      playerRef.current.applyTorqueImpulse({
        x: Math.random() - 1,
        y: Math.random() - 1,
        z: Math.random() - 1,
      });
    }
  }, [jumpPressed]);

  return (
    <RigidBody
      ref={playerRef}
      colliders={false}
      position={[0, 4, 0]}
      restitution={0.2}
      gravityScale={0.2}
      // friction={0}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"yellow"} />
      </mesh>
      <CuboidCollider args={[1, 1, 1]} />
    </RigidBody>
  );
}

export default Player;
