import * as THREE from "three";
import { Environment, OrbitControls } from "@react-three/drei";
import Moon from "../../entities/Moon";
import Lights from "./Lights";
import Player from "../../entities/Player";

const MOON_SIZE = 10;
const PLAYER_OFFSET_DISTANCE = 2;

const GameConfig = {
  entities: {
    moon: {
      size: MOON_SIZE,
      position: new THREE.Vector3(0, 0, 0),
    },
    player: {
      size: Math.floor(MOON_SIZE / 8),
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

function MoonColor() {
  return (
    <>
      <OrbitControls />
      <Lights />
      <Environment background preset="park" blur={0.08} />

      <Moon config={GameConfig.entities.moon} />
      <Player config={GameConfig.entities.player} />
    </>
  );
}

export default MoonColor;
