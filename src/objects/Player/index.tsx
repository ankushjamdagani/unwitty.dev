import { useEffect, useLayoutEffect, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { BallCollider, CuboidCollider, RigidBody } from "@react-three/rapier";
import { Controls } from "../../InputController";

const defaultProps = {
  kinematic: {
    mass: 1,
    velocity: { x: 0, y: -1, z: 0 },
    acceleration: { x: 0.2, y: 0, z: 0.2 },
  },
};

function Player() {
  const playerRef = useRef();
  const leftPressed = useKeyboardControls<Controls>((state) => state.left);
  const rightPressed = useKeyboardControls<Controls>((state) => state.right);
  const jumpPressed = useKeyboardControls<Controls>((state) => state.jump);
  const forwardPressed = useKeyboardControls<Controls>(
    (state) => state.forward
  );
  const backPressed = useKeyboardControls<Controls>((state) => state.back);

  useLayoutEffect(() => {
    if (!playerRef.current) return;

    const player = playerRef.current;

    console.log("player", player);

    const mass = player.mass();
    const currentLinvel = player.linvel();
    if (leftPressed) {
      currentLinvel.x = -1.0;
      // player.setAngvel({ x: 1.0, ...currentLinvel }, true);
      // player.setLinvel(1.0, 0, 0);
      // player.addForce({ x: -0.2 * mass, y: 0, z: 0 }, true);
      // player.applyImpulse({ x: 0, y: -0.2 * mass, z: 0 });
    } else if (rightPressed) {
      currentLinvel.x = 1.0;
    }

    if (forwardPressed) {
      currentLinvel.z = -1.0;
    } else if (backPressed) {
      currentLinvel.z = 1.0;
    }

    player.setLinvel({ ...currentLinvel }, true);

    if (jumpPressed) {
      player.applyImpulse({ x: 0, y: 0.2 * mass, z: 0 }, true);
    }
    // player.applyTorqueImpulse({
    //   x: Math.random() - 1,
    //   y: Math.random() - 1,
    //   z: Math.random() - 1,
    // });
  }, [leftPressed, rightPressed, jumpPressed, forwardPressed, backPressed]);

  return (
    <RigidBody
      ref={playerRef}
      // type="kinematicVelocity"
      colliders={false}
      position={[0, 4, 0]}
      friction={0}
      // restitution={0.2}
      // gravityScale={0.2}
      canSleep={false}
      // friction={0}
    >
      <mesh>
        {/* <boxGeometry args={[1, 1, 1]} /> */}
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color={"yellow"} />
      </mesh>
      <BallCollider args={[0.5, 0.5, 0.5]} />
    </RigidBody>
  );
}

export default Player;
