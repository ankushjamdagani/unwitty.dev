import { useGLTF } from "@react-three/drei";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { Suspense, useMemo } from "react";

const MODEL_SIZE = 1;

function Planet({ config }) {
  const model = useGLTF("./models/pokeball2.glb");
  const { size, ...meshConfig } = config;
  const scale = size / MODEL_SIZE;

  const loadingCube = useMemo(() => <mesh geometry={<sphereGeometry />} />, []);

  return (
    <>
      <RigidBody
        type="fixed"
        colliders="ball"
        args={[size + 0.1]}
        {...meshConfig}
      >
        <Suspense fallback={loadingCube}>
          <primitive
            object={model.scene}
            scale={scale}
            position={[0, -14, 0]}
          />
        </Suspense>
      </RigidBody>
    </>
  );
}

export default Planet;
