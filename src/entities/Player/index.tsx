import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

function Player({ config }) {
  const { size, ...meshProps } = config;

  const playerRef = useRef();
  const spotLightRef = useRef();

  useFrame((state) => {
    const player = playerRef.current;

    if (!player) return;

    const elapsedTime = state.clock.elapsedTime;

    const sphericalPos = new THREE.Spherical();
    sphericalPos.setFromVector3(player.translation());
    sphericalPos.phi += sphericalPos.phi > 2 ? -2 : 0.01; // * Math.sin(elapsedTime);
    // sphericalPos.theta += 0.01; // * Math.cos(elapsedTime);

    const vectorPos = new THREE.Vector3().setFromSpherical(sphericalPos);

    player.setNextKinematicTranslation(vectorPos);
    spotLightRef.current.position.set(...vectorPos);
    // console.log(player);
  });

  return (
    <>
      <RigidBody
        type="kinematicPosition"
        colliders={"ball"}
        ref={playerRef}
        {...meshProps}
      >
        <mesh>
          <sphereGeometry args={[size]} />
          <meshStandardMaterial color={"red"} />
        </mesh>
      </RigidBody>
      <spotLight
        ref={spotLightRef}
        args={["blue", 100, 20, Math.PI * 0.25, 0.2, 1]}
        // position={[0, 40, 0]}
      />
    </>
  );
}

export default Player;
