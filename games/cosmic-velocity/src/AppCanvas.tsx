import { useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  Grid,
  OrbitControls,
  PerformanceMonitor,
  PerspectiveCamera,
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { useControls } from "leva";

import SceneHandler from "./scenes";
import Lights from "./Lights";
import InputController from "./controllers/InputController";

import useDebugState, { DebugLevels } from "./state/Debug";
import { PriorityPhysicsUpdate } from "./constants/UpdatePriorities";

function GroundBase() {
  const scale = 4;
  const gridConfig = {
    cellSize: scale / 10,
    cellThickness: 0.5,
    cellColor: "#6f6f6f",
    sectionSize: scale,
    sectionThickness: 1,
    sectionColor: "#f7d76d",
    // fadeDistance: 10,
    // fadeStrength: 2,
    followCamera: false,
    infiniteGrid: true,
  };
  return <Grid args={[10, 10]} {...gridConfig} position={[0, 0.02, 0]} />;
}

function GroundBasePolar() {
  const radius = 32;
  const sectors = 16;
  const rings = 8;
  const divisions = 64;
  return <polarGridHelper args={[radius, sectors, rings, divisions]} />;
}

const gameConfig = {
  camera: {
    fov: 50,
    position: new THREE.Vector3(0, 10, 21),
  },
};

export default function AppCanvas() {
  const { debugLevel } = useDebugState();
  const debugMode = debugLevel === DebugLevels.FULL;

  const [perfSucks, degrade] = useState(false);

  const {
    position: cameraPosition,
    fov: cameraFov,
    mode: cameraMode,
  } = useControls("camera", {
    mode: {
      value: "orbit",
      options: ["follow", "orbit"],
    },
    fov: 50,
    position: {
      value: [
        gameConfig.camera.position.x,
        gameConfig.camera.position.y,
        gameConfig.camera.position.z,
      ],
    },
  });

  return (
    <div id="CanvasApp">
      <Canvas
        dpr={[1, perfSucks ? 1.5 : 2]}
        shadows
        gl={{
          antialias: false,
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        {cameraMode === "orbit" ? <OrbitControls /> : null}

        <PerspectiveCamera
          makeDefault
          position={cameraPosition}
          fov={cameraFov}
        />

        <Lights debugMode={debugMode} />

        <Physics
          debug={debugMode}
          // gravity={[0, -2.6, 0]}
          maxStabilizationIterations={50}
          maxVelocityFrictionIterations={50}
          maxVelocityIterations={100}
          updatePriority={PriorityPhysicsUpdate}
        >
          <InputController>
            {/* -------- ACTIVE SCENE ------------ */}
            <SceneHandler config={gameConfig} />
          </InputController>
        </Physics>

        {/* -------- DEBUG CONTROLS ---------- */}

        {debugMode && (
          <>
            <Perf position="top-left" />
            {/* <GroundBasePolar /> */}
            <GroundBase />
            <axesHelper args={[5]} />
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
    </div>
  );
}
