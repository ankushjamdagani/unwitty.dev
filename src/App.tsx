import {
  OrbitControls,
  PerformanceMonitor,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useControls } from "leva";
import * as THREE from "three";

import { useState } from "react";
import GroundScene from "./scenes/GroundScene";

export default function App() {
  const [perfSucks, degrade] = useState(false);

  const { position: cameraPosition, fov: cameraFov } = useControls("camera", {
    fov: 50,
    position: { value: [0, 4, 10] },
  });

  return (
    <Canvas
      dpr={[1, perfSucks ? 1.5 : 2]}
      shadows
      gl={{
        antialias: false,
        toneMapping: THREE.NoToneMapping, // same as setting `flat` to true on Canvas
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={cameraFov}
      />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* -------- ACTIVE SCENE ------------ */}
      <GroundScene />

      {/* -------- DEBUG CONTROLS ---------- */}
      <Perf position="top-left" />
      <OrbitControls />
      <PerformanceMonitor
        flipflops={3}
        onIncline={() => {
          console.log("performance - onIncline");
          degrade(false);
        }}
        onDecline={() => {
          console.log("performance - onDecline");
          degrade(true);
        }}
      />
    </Canvas>
  );
}
