import { useRef } from "react";
import * as THREE from "three";
import { useHelper } from "@react-three/drei";
import { useControls } from "leva";

function Lights({ debugMode }: { debugMode: boolean }) {
  const pointLightRef = useRef();
  const directionalLightRef = useRef();

  useHelper(debugMode && pointLightRef, THREE.PointLightHelper, 0.2, "red");
  useHelper(
    debugMode && directionalLightRef,
    THREE.DirectionalLightHelper,
    1,
    "red"
  );

  const { pointLight, ambientLight } = useControls("light", {
    ambientLight: 1,
    pointLight: { value: [1, 1, 1] },
  });

  return (
    <>
      <directionalLight
        ref={directionalLightRef}
        position={[-50, 10, 50]}
        intensity={1}
        color={"white"}
      />
      <ambientLight intensity={ambientLight} />
      {/* <pointLight ref={pointLightRef} position={pointLight} intensity={2} /> */}
    </>
  );
}

export default Lights;
