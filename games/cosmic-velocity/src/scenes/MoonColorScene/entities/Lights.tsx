import { useRef } from "react";
import * as THREE from "three";
import { useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

function Lights() {
  const spotLightRef = useRef();

  useHelper(spotLightRef, THREE.SpotLightHelper, "red");

  useFrame((state) => {
    const spotLight = spotLightRef.current;

    if (!spotLight) return;

    const time = state.clock.elapsedTime;

    const radius = 20;
    const x = radius * Math.sin(time);
    const z = radius * Math.cos(time);
    const y = radius * Math.cos(time);

    spotLight.position.set(x, y, z);
  });

  return (
    <>
      <spotLight
        ref={spotLightRef}
        args={["red", 100, 20, Math.PI * 0.1, 0.2, 1]}
        // position={[0, 40, 0]}
      />
    </>
  );
}

export default Lights;
