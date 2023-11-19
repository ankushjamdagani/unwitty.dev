import {
  Grid,
  OrbitControls,
  PerformanceMonitor,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Leva, useControls } from "leva";
import * as THREE from "three";
import { useState } from "react";
import SceneHandler from "./scenes";
import Lights from "./Lights";
import { Physics, RigidBody } from "@react-three/rapier";
import Player from "./entities/Player";
import InputController from "./InputController";

// // can be complex object for specific debugging modes
// enum DebugMode {
//   ALL,
//   PHYSICS,
//   SCENE,
//   OBJECTS,
// }

function GroundBase() {
  const gridConfig = {
    cellSize: 0.1,
    cellThickness: 0.5,
    cellColor: "#6f6f6f",
    sectionSize: 1,
    sectionThickness: 1,
    sectionColor: "#f7d76d",
    // fadeDistance: 10,
    // fadeStrength: 2,
    followCamera: false,
    infiniteGrid: true,
  };
  return <Grid args={[10, 10]} {...gridConfig} />;
}

export default function App() {
  const [perfSucks, degrade] = useState(false);
  const [debugMode, setDebugMode] = useState(true);

  const { position: cameraPosition, fov: cameraFov } = useControls("camera", {
    fov: 30,
    position: { value: [0, 4, 10] },
  });

  return (
    <>
      <Leva collapsed hidden={!debugMode} />
      <Canvas
        dpr={[1, perfSucks ? 1.5 : 2]}
        shadows
        gl={{
          antialias: false,
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={cameraPosition}
          fov={cameraFov}
        />

        <Lights />

        <Physics>
          <InputController>
            {/* -------- ACTIVE SCENE ------------ */}
            <SceneHandler />

            {/* --------- GAME OBJECT ------------ */}
            <Player />

            {/* --------- REFERENCE OBJECT ------- */}
            <RigidBody position={[-1, 4, 0]}>
              <mesh>
                <boxGeometry args={[1, 1]} />
                <meshStandardMaterial color={"blue"} />
              </mesh>
            </RigidBody>
          </InputController>
        </Physics>

        {/* -------- DEBUG CONTROLS ---------- */}

        {debugMode && (
          <>
            <Perf position="top-left" />
            {/* <OrbitControls /> */}
            <GroundBase />
          </>
        )}

        {/* -------- PERFORMANCE CONTROLS ---- */}
        <PerformanceMonitor
          flipflops={3}
          onIncline={() => {
            console.log("performance - onIncline");
            degrade(false);
          }}
          onDecline={() => {
            console.log("performance - onDecline");
            degrade(true);
          }}
        />
      </Canvas>
    </>
  );
}
