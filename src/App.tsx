import { Canvas } from "@react-three/fiber";
import DefaultScene from "./scenes/DefaultScene";
// import * as THREE from "three";

export default function App() {
  return (
    <Canvas
      shadows
      orthographic
      camera={{ zoom: 100, position: [10, 10, 10] }}
      gl={
        {
          // antialias: true,
          // toneMapping: THREE.ACESFilmicToneMapping,
          // outputColorSpace: THREE.SRGBColorSpace,
        }
      }
    >
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
      <DefaultScene />
    </Canvas>
  );
}
