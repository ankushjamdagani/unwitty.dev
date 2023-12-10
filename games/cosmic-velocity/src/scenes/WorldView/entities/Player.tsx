import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";

const size = new THREE.Vector3(2, 1, 3);

function Player() {
  return (
    <RigidBody>
      <mesh position={[0, 1 + size.y / 2 + 0.1, 0]}>
        <boxGeometry args={[size.x, size.y, size.z]} />
        <meshStandardMaterial color={"white"} />
      </mesh>
    </RigidBody>
  );
}

export default Player;
