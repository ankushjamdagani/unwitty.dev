import { useMemo } from "react";
import * as THREE from "three";
import { OrbitControls, Stars } from "@react-three/drei";

import Lights from "./entities/Lights";
import Planet from "./entities/Planet";
import PlanetRings from "./entities/PlanetRings";
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

function PlanetRaceTrack({ config: _globalConfig }) {
  const globalConfig = gameConfig;

  const config = useMemo(() => {
    const mapScale = globalConfig.map.scale;
    const planetSize = mapScale / 2;

    return {
      ...globalConfig,
      entities: {
        planet: {
          size: planetSize,
          psition: new THREE.Vector3(0, 0, 0),
        },
        player: {
          size: Math.floor(planetSize / 10),
          velocity: new THREE.Vector2(1, 1),
          position: new THREE.Vector3().setFromSpherical(
            new THREE.Spherical(
              planetSize + planetSize / 10,
              Math.PI / 4,
              Math.PI / 4
            )
          ),
        },
      },
    };
  }, [globalConfig]);

  return (
    <>
      <OrbitControls />

      <color attach={"background"} args={["#130318"]} />
      <Lights />
      <Stars />

      <PlanetRings config={config} />
      <Planet config={config} />
      <Player />
    </>
  );
}

export default PlanetRaceTrack;
