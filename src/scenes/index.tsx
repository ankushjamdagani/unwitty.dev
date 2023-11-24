import { useControls } from "leva";

import GroundScene from "./GroundScene";
import GrassLandScene from "./GrassLandScene";
import HillyLandScene from "./HillyLandScene";
import MoonColorScene from "./MoonColorScene";
import PlanetRaceTrack from "./PlanetRaceTrack";

enum Scenes {
  scene_1 = "Rough Terrain",
  scene_2 = "Grassland",
  scene_3 = "Hilly Land",
  scene_4 = "Moon Color",
  scene_5 = "Planet Racing",
}

const ScenesComponent = {
  [Scenes.scene_1]: GroundScene,
  [Scenes.scene_2]: GrassLandScene,
  [Scenes.scene_3]: HillyLandScene,
  [Scenes.scene_4]: MoonColorScene,
  [Scenes.scene_5]: PlanetRaceTrack,
};

const ScenesOptionsConfig = {
  default: Scenes.scene_5,
  options: Object.values(Scenes),
};

function SceneHandler() {
  const { selected: selectedScene } = useControls("scene", {
    selected: {
      value: ScenesOptionsConfig.default,
      options: ScenesOptionsConfig.options,
    },
  });

  const SceneComponent = ScenesComponent[selectedScene];

  return <SceneComponent />;
}

export default SceneHandler;
