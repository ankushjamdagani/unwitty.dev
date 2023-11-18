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
import SceneHandler from "./scenes";
import Lights from "./Lights";

export default function App() {
  const [perfSucks, degrade] = useState(false);

  const { position: cameraPosition, fov: cameraFov } = useControls("camera", {
    fov: 30,
    position: { value: [0, 4, 10] },
  });

  return (
    <Canvas
      dpr={[1, perfSucks ? 1.5 : 2]}
      shadows
      gl={{
        antialias: false,
        toneMapping: THREE.NoToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={cameraFov}
      />

      <Lights />

      {/* -------- ACTIVE SCENE ------------ */}
      <SceneHandler />

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
