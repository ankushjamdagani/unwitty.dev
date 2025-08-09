import { useGLTF } from "@react-three/drei";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { Suspense, useMemo } from "react";

const MODEL_SIZE = 500;

function Moon({ config }) {
  const model = useGLTF("./models/moon_nasa.glb");
  const { nodes, materials } = model;

  const geometry = nodes.Cube008.geometry;
  const material = materials["Default OBJ.005"];

  const { size, ...meshConfig } = config;
  const scale = size / MODEL_SIZE;

  const loadingCube = useMemo(() => <mesh geometry={<sphereGeometry />} />, []);

  return (
    <>
      <RigidBody type="fixed" colliders={false} {...meshConfig}>
        <Suspense fallback={loadingCube}>
          <mesh
            castShadow
            receiveShadow
            geometry={geometry}
            material={material}
            scale={scale}
          />
        </Suspense>
        <BallCollider args={[size + 0.1]} mass={Infinity} />
      </RigidBody>
    </>
  );
}

export default Moon;
