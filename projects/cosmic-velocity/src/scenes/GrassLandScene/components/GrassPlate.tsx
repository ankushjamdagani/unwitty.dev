import { useGLTF, useTexture } from "@react-three/drei";
import Textures from "../../../resources/textures";
import { GLTF } from "three/examples/jsm/Addons.js";

function GrassInstance(props: { model: GLTF; texture: any }) {
  const { model, texture } = props;
  return (
    <mesh
      geometry={model.nodes.grass_medium_01.geometry}
      position={[Math.random(), 0, Math.random()]}
      rotation={[0, Math.PI * (Math.random() * 2), 0]}
    >
      <meshStandardMaterial {...texture} />
    </mesh>
  );
}

function GrassPlate() {
  const grassModel = useGLTF("./textures/grass/grass_medium_01_4k.gltf");
  const grassTexture = useTexture(Textures.grass);
  // grassTexture.flipY = false;
  // grassTexture.flipX = false;

  return (
    <>
      {Array.from(new Array(50)).map((_, index) => {
        return (
          <GrassInstance
            key={index}
            texture={grassTexture}
            model={grassModel}
          />
        );
      })}
    </>
  );
}

export default GrassPlate;
