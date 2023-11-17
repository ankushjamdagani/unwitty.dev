import {
  CubeCamera,
  OrbitControls,
  PerformanceMonitor,
  PerspectiveCamera,
  Sky,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useControls } from "leva";

import Terrain from "./components/Terrain";
import { useState } from "react";

export default function App() {
  const [perfSucks, degrade] = useState(false);

  const { position: cameraPosition } = useControls("camera", {
    position: { value: [0, 4, 10] },
  });

  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  return (
    <Canvas
      dpr={[1, perfSucks ? 1.5 : 2]}
      shadows
      // camera={{ position: cameraPosition }}
    >
      <Perf position="top-left" />
      <OrbitControls />
      <PerspectiveCamera makeDefault position={cameraPosition} />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

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

      <Sky sunPosition={sunPosition} />
      <Terrain />
    </Canvas>
  );
}
