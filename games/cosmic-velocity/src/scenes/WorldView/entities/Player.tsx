import React, { useRef, RefObject, createRef, Fragment } from "react";
import * as THREE from "three";
import {
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";

// const size = new THREE.Vector3(3, 1, 0.5);

const WHEEL_WIDTH = 0.2;
const WHEEL_SIZE = 0.5;

type Wheel = {
  axlePosition: THREE.Vector3Tuple;
  wheelPosition: THREE.Vector3Tuple;
  canDrive: boolean;
  canSteer: boolean;
};

const WHEELS: Wheel[] = [
  {
    axlePosition: [-0.5, WHEEL_SIZE / 2, WHEEL_WIDTH],
    canDrive: false,
    canSteer: true,
    wheelPosition: [-1, WHEEL_SIZE / 2, 0],
  },
  {
    axlePosition: [0.5, WHEEL_SIZE / 2, WHEEL_WIDTH],
    canDrive: true,
    canSteer: false,
    wheelPosition: [1, WHEEL_SIZE / 2, 0],
  },
];

function Player() {
  const chassisRef = useRef<RapierRigidBody>(null);
  const wheelsRef = useRef<RefObject<RapierRigidBody>[]>(
    WHEELS.map(() => createRef())
  );
  const axelsRef = useRef<RefObject<RapierRigidBody>[]>(
    WHEELS.map(() => createRef())
  );

  return (
    <group position={[0, 1, 0]}>
      <RigidBody
        type="fixed"
        ref={chassisRef}
        colliders="cuboid"
        position={[0, 0.25, 0]}
      >
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.2]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>

      {WHEELS.map((wheel, index) => (
        <Fragment key={index}>
          <RigidBody
            type="fixed"
            ref={wheelsRef.current[index]}
            colliders={false}
            position={wheel.wheelPosition}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <mesh>
              <cylinderGeometry
                args={[WHEEL_SIZE, WHEEL_SIZE, WHEEL_WIDTH, 32]}
              />
              <meshStandardMaterial color="black" />
            </mesh>
            <CylinderCollider args={[WHEEL_WIDTH / 2, WHEEL_SIZE]} />
          </RigidBody>

          <RigidBody
            type="fixed"
            ref={axelsRef.current[index]}
            position={wheel.axlePosition}
          >
            <mesh>
              <boxGeometry args={[1, 0.1, 0.1]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </RigidBody>
        </Fragment>
      ))}
    </group>
  );
}

export default Player;
