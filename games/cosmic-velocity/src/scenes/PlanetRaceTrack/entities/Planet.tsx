import { useGLTF } from "@react-three/drei";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { Suspense, useMemo } from "react";

const MODEL_SIZE = 1;

function Planet({ config }) {
  const model = useGLTF("./models/pokeball2.glb");
  const { size, ...meshConfig } = config.entities.planet;
  const scale = size / MODEL_SIZE;

  const loadingCube = useMemo(() => <mesh geometry={<sphereGeometry />} />, []);

  return (
    <>
      <RigidBody
        type="fixed"
        colliders={false}
        args={[size + 0.1]}
        {...meshConfig}
      >
        <Suspense fallback={loadingCube}>
          <primitive
            object={model.scene}
            scale={scale}
            position={[0, -scale, 0]}
          />
          <BallCollider args={[size + 1]} />
        </Suspense>
      </RigidBody>
    </>
  );
}

export default Planet;
