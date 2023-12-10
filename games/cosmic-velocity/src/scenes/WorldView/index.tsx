import * as THREE from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import Ground from "./entities/Ground";
import Player from "./entities/Player";

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
      <OrbitControls />

      {/* Environment */}
      <color attach={"background"} args={["#130318"]} />
      <Stars />

      <Ground map={config.map} />
      <Player />
    </>
  );
}

export default WorldView;
