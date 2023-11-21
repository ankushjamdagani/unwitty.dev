import { useGLTF } from "@react-three/drei";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { Suspense, useMemo } from "react";

function Moon() {
  const { nodes, materials } = useGLTF("./models/moon_nasa.glb");

  const loadingCube = useMemo(() => <mesh geometry={<sphereGeometry />} />, []);

  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <Suspense fallback={loadingCube}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube008.geometry}
            material={materials["Default OBJ.005"]}
            scale={0.02}
          />
        </Suspense>
        <BallCollider args={[10.1]} mass={Infinity} />
      </RigidBody>
    </>
  );
}

export default Moon;
