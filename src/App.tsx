import { Canvas } from "@react-three/fiber";
import Box from "./components/Box";
import DefaultScene from "./scenes/DefaultScene";

export default function App() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {/* <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} /> */}
      <DefaultScene />
    </Canvas>
  );
}
