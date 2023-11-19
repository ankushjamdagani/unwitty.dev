import { useControls } from "leva";
import GroundScene from "./GroundScene";
import GrassLandScene from "./GrassLandScene";
import HillyLandScene from "./HillyLandScene";
import { Grid } from "@react-three/drei";

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

function SceneHandler() {
  const { selected: selectedScene } = useControls("scene", {
    selected: {
      value: ScenesOptionsConfig.default,
      options: ScenesOptionsConfig.options,
    },
  });

  const SceneComponent = ScenesComponent[selectedScene];

  return (
    <>
      <SceneComponent />
      <GroundBase />
    </>
  );
}

export default SceneHandler;
