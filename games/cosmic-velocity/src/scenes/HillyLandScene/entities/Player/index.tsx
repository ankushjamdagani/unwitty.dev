import { useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";

import * as THREE from "three";

const defaultProps = {
  kinematic: {
    mass: 1,
    velocity: { x: 0, y: -1, z: 0 },
    acceleration: { x: 0.2, y: 0, z: 0.2 },
  },
};

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const rotation = new THREE.Vector3();

function Player() {
  const playerRef = useRef();
  const [, getKeyboardControls] = useKeyboardControls();

  useFrame((state) => {
    if (!playerRef.current) return;

    const { forward, back, left, right, jump } = getKeyboardControls();

    const player = playerRef.current as RapierRigidBody;
    const position = player.translation();
    const velocity = player.linvel();

    // ----- Camera Update --------
    // - works if no orbit controls

    // - move camera
    state.camera.position.set(position.x, position.y + 4, position.z + 10);

    // - rotate camera
    const rotateDeg = new THREE.Vector3(-Math.PI / 8, 0, 0);
    const rotateEuler = new THREE.Euler();
    rotateEuler.setFromVector3(rotateDeg);
    state.camera.rotation.set(rotateEuler.x, rotateEuler.y, rotateEuler.z);
    // state.camera.lookAt(position);

    // ------ Player Update --------
    frontVector.set(0, 0, back - forward || 0);
    sideVector.set(left - right || 0, 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation);

    player.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true);

    if (jump) {
      player.applyImpulse({ x: 0, y: 0.5, z: 0 }, true);
    }
  });

  // useLayoutEffect(() => {
  //   if (!playerRef.current) return;

  //   const player = playerRef.current;

  //   const mass = player.mass();
  //   const currentLinvel = player.linvel();
  //   if (leftPressed) {
  //     currentLinvel.x = -1.0;
  //     // player.setAngvel({ x: 1.0, ...currentLinvel }, true);
  //     // player.setLinvel(1.0, 0, 0);
  //     // player.addForce({ x: -0.2 * mass, y: 0, z: 0 }, true);
  //     // player.applyImpulse({ x: 0, y: -0.2 * mass, z: 0 });
  //   } else if (rightPressed) {
  //     currentLinvel.x = 1.0;
  //   }

  //   if (forwardPressed) {
  //     currentLinvel.z = -1.0;
  //   } else if (backPressed) {
  //     currentLinvel.z = 1.0;
  //   }

  //   player.setLinvel({ ...currentLinvel }, true);

  //   if (jumpPressed) {
  //     player.applyImpulse({ x: 0, y: 5 * mass, z: 0 }, true);
  //   }
  //   // player.applyTorqueImpulse({
  //   //   x: Math.random() - 1,
  //   //   y: Math.random() - 1,
  //   //   z: Math.random() - 1,
  //   // });
  // }, [leftPressed, rightPressed, jumpPressed, forwardPressed, backPressed]);

  return (
    <RigidBody
      ref={playerRef}
      // type="kinematicVelocity"
      // colliders={false}
      position={[0, 4, 0]}
      friction={0}
      restitution={1.5}
      // gravityScale={0.2}
      canSleep={false}
      // friction={0}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        {/* <sphereGeometry args={[0.5]} /> */}
        <meshStandardMaterial color={"yellow"} />
      </mesh>
      <CuboidCollider args={[0.5, 0.5, 0.5]} />
    </RigidBody>
  );
}

export default Player;
