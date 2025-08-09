import { RigidBody } from "@react-three/rapier";

const wallSize = 4;

function Ground({ map }) {
  const { size, scale } = map;

  return (
    <RigidBody type="fixed" friction={2}>
      <mesh position={[0, wallSize / 2, -size.z / 2]}>
        <boxGeometry args={[size.x, wallSize, 0.1]} />
        <meshBasicMaterial color={"orange"} />
      </mesh>
      <mesh position={[0, wallSize / 2, size.z / 2]}>
        <boxGeometry args={[size.x, wallSize, 0.1]} />
        <meshBasicMaterial color={"orange"} />
      </mesh>
      <mesh position={[size.x / 2, wallSize / 2, 0]}>
        <boxGeometry args={[0.1, wallSize, size.z]} />
        <meshBasicMaterial color={"orange"} />
      </mesh>
      <mesh position={[-size.x / 2, wallSize / 2, 0]}>
        <boxGeometry args={[0.1, wallSize, size.z]} />
        <meshBasicMaterial color={"orange"} />
      </mesh>
      <mesh position={[0, -size.y / 2, 0]}>
        <boxGeometry args={[...size]} />
        <meshBasicMaterial color={"white"} />
      </mesh>
    </RigidBody>
  );
}

export default Ground;
