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

import Box from "./components/Box";

export default function App() {
  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  return (
    <Canvas
    // camera={{ position: [0, 2, 2] }}
    >
      <Perf position="top-left" />
      <OrbitControls />

      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Environment preset="dawn">
        <Lightformer
          scale={10}
          position={[0, 0, -10]}
          color={"red"}
          intensity={10}
          form={"ring"}
        />
      </Environment>

      <Sky sunPosition={sunPosition} />

      <Box />
    </Canvas>
  );
}
