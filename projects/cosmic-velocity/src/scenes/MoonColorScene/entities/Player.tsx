import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";

function Player({ config }) {
  const { size, velocity, ...meshProps } = config;

  const playerRef = useRef();
  const spotLightRef = useRef();

  const [, get] = useKeyboardControls();

  useFrame((state, delta) => {
    const player = playerRef.current;

    if (!player) return;

    const { forward, back, left, right } = get();

    // current position
    const playerPos = player.translation();
    const sphericalPos = new THREE.Spherical();
    sphericalPos.setFromVector3(playerPos).makeSafe();

    // update spherical coords based on user input
    if (forward) sphericalPos.phi -= velocity.y * delta;
    if (back) sphericalPos.phi += velocity.y * delta;
    if (left) sphericalPos.theta -= velocity.x * delta;
    if (right) sphericalPos.theta += velocity.x * delta;

    // prevent glitch on poles
    const minPhi = 0.01;
    const maxPhi = Math.PI - 0.01;
    sphericalPos.phi = Math.max(minPhi, Math.min(maxPhi, sphericalPos.phi));

    // update player with vector coords
    const vectorPos = new THREE.Vector3().setFromSpherical(sphericalPos);
    player.setNextKinematicTranslation(vectorPos);

    // update torch
    spotLightRef.current.position.set(vectorPos.x, vectorPos.y, vectorPos.z);

    // update camera
    sphericalPos.radius = state.camera.fov;
    const cameraPos = new THREE.Vector3().setFromSpherical(sphericalPos);
    state.camera.position.set(...cameraPos);
    state.camera.lookAt(new THREE.Vector3(0, 0, 0));
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
