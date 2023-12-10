import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";

const size = new THREE.Vector3(1, 2, 4.2);

function Player() {
  const model = useGLTF("/models/lightcycle.glb");

  const loadingCube = useMemo(
    () => <mesh geometry={<boxGeometry args={[size.x, size.y, size.z]} />} />,
    [size]
  );

  return (
    <>
      <RigidBody
        type="kinematicPosition"
        colliders={false}
        position={[0, size.y / 2, 0]}
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
