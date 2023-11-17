import { Plane, useTexture } from "@react-three/drei";
import { useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";

const textures = {
  brown_mud: {
    map: "./textures/brown_mud/brown_mud_leaves_01_diff_1k.jpg",
    displacementMap: "./textures/cloud.jpeg",
    // displacementMap: "./textures/brown_mud/brown_mud_leaves_01_disp_1k.jpg",
    // normalMap: "./textures/brown_mud/brown_mud_leaves_01_nor_gl_1k.jpg",
    // aoMap: "./textures/brown_mud/brown_mud_leaves_01_arm_1k.jpg",
    // roughnessMap: "./textures/brown_mud/brown_mud_leaves_01_arm_1k.jpg",
    // metalnessMap: "./textures/brown_mud/brown_mud_leaves_01_arm_1k.jpg",
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
  texture.map.wrapS = THREE.RepeatWrapping;
  texture.map.wrapT = THREE.RepeatWrapping;

  const { repeatTexture, color, displacementScale } = useControls("Terrain", {
    repeatTexture: { value: [20, 20] },
    color: "white",
    displacementScale: 4,
  });

  return (
    <mesh
      ref={terrainRef}
      receiveShadow
      position={[0, 0, 0]}
      rotation-x={-Math.PI / 2}
    >
      <planeGeometry args={[64, 64, 256, 256]} />
      <meshStandardMaterial
        {...texture}
        displacementScale={displacementScale}
        map-repeat={repeatTexture}
        color={color}
      />
    </mesh>
  );
}
