import Terrain from "../components/Terrain";
import { Sky } from "@react-three/drei";
import { useControls } from "leva";

function GroundScene() {
  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  const { position: ballPosition } = useControls("ball", {
    position: { value: [0, 4, 0] },
  });

  return (
    <>
      <Sky sunPosition={sunPosition} />
      <Terrain />
      <mesh position={ballPosition} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color={"yellow"} />
      </mesh>
    </>
  );
}

export default GroundScene;
