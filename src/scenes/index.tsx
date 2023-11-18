import { useControls } from "leva";
import GroundScene from "./GroundScene";
import GroundScene2 from "./GroundScene2";

enum Scenes {
  scene_1 = "Ground 1",
  scene_2 = "Ground 2",
}

const ScenesComponent = {
  [Scenes.scene_1]: GroundScene,
  [Scenes.scene_2]: GroundScene2,
};

const ScenesOptionsConfig = {
  default: Scenes.scene_2,
  options: [Scenes.scene_1, Scenes.scene_2],
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
