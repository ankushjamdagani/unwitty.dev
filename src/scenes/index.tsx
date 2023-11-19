import { useControls } from "leva";
import GroundScene from "./GroundScene";
import GrassLandScene from "./GrassLandScene";
import HillyLandScene from "./HillyLandScene";

enum Scenes {
  scene_1 = "Ground 1",
  scene_2 = "Ground 2",
  scene_3 = "Ground 3",
}

const ScenesComponent = {
  [Scenes.scene_1]: GroundScene,
  [Scenes.scene_2]: GrassLandScene,
  [Scenes.scene_3]: HillyLandScene,
};

const ScenesOptionsConfig = {
  default: Scenes.scene_3,
  options: [Scenes.scene_1, Scenes.scene_2, Scenes.scene_3],
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
