import { Suspense } from "react";
import * as THREE from "three";
import { Environment, OrbitControls, Ring, Stars } from "@react-three/drei";
import Moon from "../../entities/Moon";
import Lights from "./Lights";
import Player from "../../entities/Player";
import Pokeball from "../../entities/Pokeball";

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
      <color attach={"background"} args={["#130318"]} />
      <fog attach="fog" color="#130318" near={1} far={150} />
      <Lights />

      <Stars />

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <Ring args={[20, 24, 64, 8, 0, Math.PI * 2]} />
        <meshStandardMaterial color={"red"} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <Ring args={[17.5, 19.5, 64, 8, 0, Math.PI * 2]} />
        <meshStandardMaterial color={"red"} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <Ring args={[24.5, 25.5, 64, 8, 0, Math.PI * 2]} />
        <meshStandardMaterial color={"red"} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <Ring args={[26, 26.2, 64, 8, 0, Math.PI * 2]} />
        <meshStandardMaterial color={"red"} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <Ring args={[26.5, 27, 64, 8, 0, Math.PI * 2]} />
        <meshStandardMaterial color={"red"} metalness={10} />
      </mesh>
      {/* <OrbitControls /> */}
      {/* <Suspense fallback={null}>
        <Environment background preset="park" blur={0.08} />
      </Suspense> */}

      {/* <Moon config={GameConfig.entities.moon} /> */}
      <Pokeball config={GameConfig.entities.moon} />
      <Player config={GameConfig.entities.player} />
    </>
  );
}

export default MoonColorScene;
