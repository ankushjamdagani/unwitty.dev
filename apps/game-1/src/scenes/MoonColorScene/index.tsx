import * as THREE from "three";
import { OrbitControls, Stars } from "@react-three/drei";

import Lights from "./entities/Lights";
import Player from "./entities/Player";
import Pokeball from "./entities/Pokeball";
import PlanetRings from "./entities/PlanetRings";
import Player2 from "./entities/Player2";

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

function MoonColorScene() {
  return (
    <>
      {/* <OrbitControls /> */}

      <color attach={"background"} args={["#130318"]} />
      <fog attach="fog" color="#130318" near={1} far={150} />
      <Lights />
      <Stars />

      <PlanetRings />
      <Pokeball config={GameConfig.entities.moon} />
      {/* <Player config={GameConfig.entities.player} /> */}
      <Player2 />
    </>
  );
}

export default MoonColorScene;
