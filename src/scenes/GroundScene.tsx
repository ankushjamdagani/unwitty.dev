import Terrain from "../components/Terrain";
import { Sky } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";

function GroundScene() {
  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  const { position: ballPosition } = useControls("ball", {
    position: { value: [0, 10, 0] },
  });

  return (
    <>
      <Sky sunPosition={sunPosition} />
      <Physics debug>
        <Terrain />
        <RigidBody>
          <mesh position={ballPosition} castShadow>
            <sphereGeometry />
            <meshStandardMaterial color={"yellow"} />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  );
}

export default GroundScene;
