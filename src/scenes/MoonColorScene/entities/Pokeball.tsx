import { useGLTF } from "@react-three/drei";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { Suspense, useMemo } from "react";

const MODEL_SIZE = 1;

function Pokeball({ config }) {
  const model = useGLTF("./models/pokeball2.glb");
  const { size, ...meshConfig } = config;
  const scale = size / MODEL_SIZE;

  const loadingCube = useMemo(() => <mesh geometry={<sphereGeometry />} />, []);

  return (
    <>
      <RigidBody type="fixed" colliders={false} {...meshConfig} visible={true}>
        <Suspense fallback={loadingCube}>
          <primitive
            object={model.scene}
            scale={scale}
            position={[0, -14, 0]}
          />
        </Suspense>
        <BallCollider args={[size + 0.1]} mass={Infinity} />
      </RigidBody>
    </>
  );
}

export default Pokeball;
