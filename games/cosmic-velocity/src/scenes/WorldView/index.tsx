import * as THREE from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import Plane from "./entities/Plane";
import Player from "./entities/Player";

const mapScale = 100;
const mapSize = new THREE.Vector3(mapScale, mapScale / 50, mapScale);

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
  return (
    <>
      <OrbitControls />

      <color attach={"background"} args={["#130318"]} />

      <Plane />
      <Player />

      {/* <Stars /> */}
    </>
  );
}

export default WorldView;
