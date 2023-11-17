import { Plane, useTexture } from "@react-three/drei";
import { useRef } from "react";

const textures = {
  brown_mud: {
    map: "./textures/brown_mud/brown_mud_leaves_01_diff_1k.jpg",
    displacementMap: "./textures/brown_mud/brown_mud_leaves_01_disp_1k.jpg",
    normalMap: "./textures/brown_mud/brown_mud_leaves_01_nor_gl_1k.jpg",
    aoMap: "./textures/brown_mud/brown_mud_leaves_01_arm_1k.jpg",
    roughnessMap: "./textures/brown_mud/brown_mud_leaves_01_arm_1k.jpg",
    metalnessMap: "./textures/brown_mud/brown_mud_leaves_01_arm_1k.jpg",
  },
  grass: {
    map: "./textures/grass/grass_medium_01_diff_4k.jpg",
    alphaMap: "./textures/grass/grass_medium_01_alpha_4k.jpg",
    normalMap: "./textures/grass/grass_medium_01_nor_gl_4k.jpg",
    aoMap: "./textures/grass/grass_medium_01_arm_4k.jpg",
    roughnessMap: "./textures/grass/grass_medium_01_arm_4k.jpg",
    metalnessMap: "./textures/grass/grass_medium_01_arm_4k.jpg",
  },
};

export default function Terrain() {
  const terrainRef = useRef();
  const texture = useTexture(textures["brown_mud"]);

  return (
    <Plane
      ref={terrainRef}
      rotation={[-Math.PI / 2, 0, 0]}
      args={[64, 64, 1024, 1024]}
      position={[0, -3, 0]}
    >
      <meshStandardMaterial
        // wireframe={true}
        displacementScale={0.1}
        {...texture}
      />
    </Plane>
  );
}
