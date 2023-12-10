import * as THREE from "three";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const size = new THREE.Vector3(1, 2, 4.2);

const SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

function Player() {
  const model = useGLTF("/models/lightcycle.glb");
  const playerRef = useRef();
  const [, getKeyboardControls] = useKeyboardControls();

  useFrame((state) => {
    if (!playerRef.current) return;

    const { forward, back, left, right, jump } = getKeyboardControls();

    const player = playerRef.current as RapierRigidBody;
    const position = player.translation();
    const velocity = player.linvel();

    // ------ Player Update --------
    frontVector.set(0, 0, back - forward || 0);
    sideVector.set(left - right || 0, 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED);

    player.setLinvel(direction, true);

    if (jump) {
      player.applyImpulse({ x: 0, y: 0.5, z: 0 }, true);
    }
  });

  const loadingCube = useMemo(
    () => <mesh geometry={<boxGeometry args={[size.x, size.y, size.z]} />} />,
    [size]
  );

  return (
    <>
      <RigidBody
        ref={playerRef}
        type="kinematicVelocity"
        colliders={false}
        position={[0, size.y / 2, 0]}
        friction={0}
        canSleep={false}
      >
        <Suspense fallback={loadingCube}>
          <primitive
            object={model.scene}
            scale={0.08}
            rotation-y={-Math.PI / 2}
            position={[0, -0.2, -0.4]}
          />
        </Suspense>
        <CuboidCollider args={[size.x / 2, size.y / 2, size.z / 2]} />
      </RigidBody>
    </>
  );
}

export default Player;
