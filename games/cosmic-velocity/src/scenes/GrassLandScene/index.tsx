import { useControls } from "leva";
import { useTexture } from "@react-three/drei";

import Textures from "../../resources/textures";
import GrassPlate from "./components/GrassPlate";

function GrassLandScene() {
  const {
    color: planeColor,
    metalness,
    roughness,
  } = useControls("Plane", {
    color: "#fff",
    metalness: 0.5,
    roughness: 0.5,
  });

  const texture = useTexture(Textures.grass_land);

  return (
    <>
      <GrassPlate />

      <mesh position={[0, -0.2, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          color={planeColor}
          {...texture}
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>
    </>
  );
}

export default GrassLandScene;
