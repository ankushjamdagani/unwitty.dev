import { Environment, OrbitControls } from "@react-three/drei";
import Moon from "../../entities/Moon";
import Lights from "./Lights";

function MoonColor() {
  return (
    <>
      <OrbitControls />
      <Lights />
      <Moon />
      <Environment background preset="park" blur={0.08} />
    </>
  );
}

export default MoonColor;
