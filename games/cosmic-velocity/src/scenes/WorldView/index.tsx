import * as THREE from "three";
import { Stars } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

import Ground from "./entities/Ground";
import Car from "./entities/Car";
import CarV2 from "./entities/CarV2";

const mapScale = 100;
const mapSize = new THREE.Vector3(mapScale, mapScale / mapScale, mapScale);

const gameConfig = {
  world: {
    gravity: new THREE.Vector3(0, -9.81, 0),
  },
  map: {
    size: mapSize,
    scale: mapScale,
  },
  camera: {
    fov: 50,
    position: new THREE.Vector3(0, mapScale, 2 * mapScale),
  },
};

function WorldView({ config: globalConfig }) {
  const config = gameConfig;

  return (
    <>
      {/* Environment */}
      <color attach={"background"} args={["#130318"]} />
      <Stars />

      <Ground map={config.map} />
      {/* <Car /> */}
      <CarV2 />

      {/* Testing */}
      <RigidBody colliders="cuboid" position={[-4, 1, -10]}>
        <mesh>
          <meshBasicMaterial color="crimson" />
          <capsuleGeometry args={[0.5, 1, 4, 8]} />
        </mesh>
        {/* <CapsuleCollider /> */}
      </RigidBody>
    </>
  );
}

export default WorldView;
