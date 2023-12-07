import { useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";
import Textures from "../resources/textures";

export default function Terrain() {
  const terrainRef = useRef();

  const texture = useTexture(Textures["brown_mud"]);
  texture.map.wrapS = THREE.RepeatWrapping;
  texture.map.wrapT = THREE.RepeatWrapping;

  const { repeatTexture, color, displacementScale, displacementBias } =
    useControls("Terrain", {
      repeatTexture: { value: [20, 20] },
      color: "#b8ff1b",
      displacementBias: -5,
      displacementScale: 6,
    });

  return (
    <RigidBody type="fixed">
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
          displacementBias={displacementBias}
          map-repeat={repeatTexture}
          color={color}
        />
      </mesh>
    </RigidBody>
  );
}
