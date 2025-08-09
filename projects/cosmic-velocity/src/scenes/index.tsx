import React from "react";
import { useControls } from "leva";

import GrassLandScene from "./GrassLandScene";
import GroundScene from "./GroundScene";
import HillyLandScene from "./HillyLandScene";
import MoonColorScene from "./MoonColorScene";
import PlanetRaceTrack from "./PlanetRaceTrack";
import WorldView from "./WorldView";

enum Scenes {
  scene_1 = "Rough Terrain",
  scene_2 = "Grassland",
  scene_3 = "Hilly Land",
  scene_4 = "Moon Color",
  scene_5 = "Planet Racing",
  scene_6 = "World View",
}

type GameConfig = {
  [key: string]: unknown;
};

type TSceneHandler = {
  config: GameConfig;
};

const ScenesComponent: { [key in Scenes]: React.FC<{ config: GameConfig }> } = {
  [Scenes.scene_1]: GroundScene,
  [Scenes.scene_2]: GrassLandScene,
  [Scenes.scene_3]: HillyLandScene,
  [Scenes.scene_4]: MoonColorScene,
  [Scenes.scene_5]: PlanetRaceTrack,
  [Scenes.scene_6]: WorldView,
};

const ScenesOptionsConfig = {
  default: Scenes.scene_6,
  options: Object.values(Scenes),
};

function SceneHandler({ config }: TSceneHandler) {
  const { selected: selectedScene } = useControls("scene", {
    selected: {
      value: ScenesOptionsConfig.default,
      options: ScenesOptionsConfig.options,
    },
  });

  const SceneComponent = ScenesComponent[selectedScene];

  return <SceneComponent config={config} />;
}

export default SceneHandler;
