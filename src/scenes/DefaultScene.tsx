import { Environment } from "@react-three/drei";
import Box from "../components/Box";

function DefaultScene() {
  return (
    <>
      <color args={["#241a1a"]} attach="background" />
      <Environment preset="city" />
      <Box />
    </>
  );
}

export default DefaultScene;
