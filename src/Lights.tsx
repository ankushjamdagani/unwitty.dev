import { useRef } from "react";
import * as THREE from "three";
import { useHelper } from "@react-three/drei";
import { useControls } from "leva";

function Lights() {
  const pointLightRef = useRef();
  useHelper(pointLightRef, THREE.PointLightHelper, 0.2, "red");

  const { pointLight, ambientLight } = useControls("light", {
    ambientLight: 0.5,
    pointLight: { value: [0, 1, 1] },
  });

  return (
    <>
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={ambientLight} />
      <pointLight ref={pointLightRef} position={pointLight} />
    </>
  );
}

export default Lights;
