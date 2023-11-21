import { useGLTF } from "@react-three/drei";
import { BallCollider, RigidBody } from "@react-three/rapier";

function Moon() {
  const { nodes, materials } = useGLTF("./models/moon_nasa.glb");

  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube008.geometry}
          material={materials["Default OBJ.005"]}
          scale={0.02}
        />
        <BallCollider args={[10.1]} mass={Infinity} />
      </RigidBody>
    </>
  );
}

export default Moon;
