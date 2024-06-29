import { useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

import Textures from "../resources/textures";
import { useControls } from "leva";

function Pathway() {
  const texture = useTexture(Textures["stone_floor"]);
  texture.map.wrapS = THREE.RepeatWrapping;
  texture.map.wrapT = THREE.RepeatWrapping;

  const { repeatTexture } = useControls("Pathway", {
    repeatTexture: { value: [1.4, 4.2] },
  });

  return (
    <RigidBody position={[0, 5, 0]}>
      <mesh scale={[4, 0.2, 20]}>
        <boxGeometry />
        <meshStandardMaterial {...texture} map-repeat={repeatTexture} />
      </mesh>
    </RigidBody>
  );
}

export default Pathway;
