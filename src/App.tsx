import {
  BakeShadows,
  Environment,
  Lightformer,
  OrbitControls,
  Sky,
  Stage,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useControls } from "leva";

import Terrain from "./components/Terrain";

export default function App() {
  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  return (
    <Canvas shadows>
      <Perf position="top-left" />
      <OrbitControls />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <Sky sunPosition={sunPosition} />
      <Terrain />
    </Canvas>
  );
}
