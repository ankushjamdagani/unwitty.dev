import { useControls } from "leva";

import GroundScene from "./GroundScene";
import GrassLandScene from "./GrassLandScene";
import HillyLandScene from "./HillyLandScene";
import MoonColorScene from "./MoonColorScene";

enum Scenes {
  scene_1 = "Rough Terrain",
  scene_2 = "Grassland",
  scene_3 = "Hilly Land",
  scene_4 = "Moon Color",
}

const ScenesComponent = {
  [Scenes.scene_1]: GroundScene,
  [Scenes.scene_2]: GrassLandScene,
  [Scenes.scene_3]: HillyLandScene,
  [Scenes.scene_4]: MoonColorScene,
};

const ScenesOptionsConfig = {
  default: Scenes.scene_4,
  options: [Scenes.scene_1, Scenes.scene_2, Scenes.scene_3, Scenes.scene_4],
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
