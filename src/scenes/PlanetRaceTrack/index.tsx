import * as THREE from "three";
import { OrbitControls, Stars } from "@react-three/drei";

import Lights from "./entities/Lights";
import Planet from "./entities/Planet";
import PlanetRings from "./entities/PlanetRings";
import Player from "./entities/Player";
import { RigidBody } from "@react-three/rapier";

const MOON_SIZE = 14;
const PLAYER_OFFSET_DISTANCE = 2;

const GameConfig = {
  entities: {
    moon: {
      size: MOON_SIZE,
      position: new THREE.Vector3(0, 0, 0),
    },
    player: {
      size: Math.floor(MOON_SIZE / 8),
      velocity: new THREE.Vector2(Math.PI / 5, Math.PI / 5),
      position: new THREE.Vector3().setFromSpherical(
        new THREE.Spherical(
          MOON_SIZE + PLAYER_OFFSET_DISTANCE,
          Math.PI / 4,
          Math.PI / 4
        )
      ),
    },
  },
};

function PlanetRaceTrack() {
  return (
    <>
      <OrbitControls />

      <color attach={"background"} args={["#130318"]} />
      <Lights />
      <Stars />

      <PlanetRings />
      {/* <Planet config={GameConfig.entities.moon} /> */}
      {/* <Player /> */}

      <RigidBody>
        <mesh position={[20, 2, 0]}>
          <boxGeometry />
        </mesh>
      </RigidBody>
    </>
  );
}

export default PlanetRaceTrack;
