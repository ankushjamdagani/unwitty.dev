import * as THREE from "three";
import { useRef } from "react";
import { useFrame, ThreeElements } from "@react-three/fiber";

export default function Box(props: ThreeElements["mesh"]) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame((_state, delta) => (meshRef.current.rotation.x += delta));
  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
}
