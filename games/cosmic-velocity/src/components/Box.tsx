import * as THREE from "three";
import { useRef } from "react";
import { useFrame, ThreeElements } from "@react-three/fiber";

export default function Box(props: ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_state, delta) => {
    meshRef.current.rotation.y += delta;
    meshRef.current.position.x = Math.cos(_state.clock.elapsedTime);
  });
  return (
    <mesh {...props} ref={meshRef}>
      <sphereGeometry args={[1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
