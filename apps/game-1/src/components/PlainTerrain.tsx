import { RigidBody } from "@react-three/rapier";
import { useControls } from "leva";

export default function PlainTerrain() {
  const { color } = useControls("Plain Terrain", {
    color: "#0084f0",
  });

  return (
    <RigidBody type="fixed">
      <mesh receiveShadow position={[0, -0.51, 0]}>
        <boxGeometry args={[64, 1, 64, 256, 2, 256]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}
