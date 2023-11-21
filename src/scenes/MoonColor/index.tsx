import * as THREE from "three";
import { Environment } from "@react-three/drei";
import Moon from "../../entities/Moon";
import Lights from "./Lights";
import Player from "../../entities/Player";
import { Suspense } from "react";

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
      velocity: new THREE.Vector2(Math.PI / 10, Math.PI / 10),
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
      <Lights />
      <Suspense fallback={null}>
        <Environment background preset="park" blur={0.08} />
      </Suspense>

      <Moon config={GameConfig.entities.moon} />
      <Player config={GameConfig.entities.player} />
    </>
  );
}

export default MoonColor;
