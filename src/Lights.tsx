import { useRef } from "react";
import * as THREE from "three";
import { useHelper } from "@react-three/drei";
import { useControls } from "leva";

function Lights() {
  const pointLightRef = useRef();
  const directionalLightRef = useRef();

  useHelper(pointLightRef, THREE.PointLightHelper, 0.2, "red");
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, "red");

  const { pointLight, ambientLight } = useControls("light", {
    ambientLight: 0.2,
    pointLight: { value: [0, 1, 1] },
  });

  return (
    <>
      <directionalLight
        ref={directionalLightRef}
        position={[-20, 2, 10]}
        intensity={2.5}
        color={"blue"}
      />
      <ambientLight intensity={ambientLight} />
      <pointLight ref={pointLightRef} position={pointLight} intensity={2} />
    </>
  );
}

export default Lights;
