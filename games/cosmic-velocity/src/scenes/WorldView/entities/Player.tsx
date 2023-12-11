import React, {
  useRef,
  RefObject,
  createRef,
  Fragment,
  useEffect,
} from "react";
import * as THREE from "three";
import {
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
  useFixedJoint,
  useRevoluteJoint,
} from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";

import { Controls } from "../../../controllers/InputController/constants";

const CHASSIS_WIDTH = 1;
const AXEL_WIDTH = 0.2;
const WHEEL_WIDTH = 0.2;
const WHEEL_SIZE = 0.5;

const AXLE_TO_CHASSIS_JOINT_STIFFNESS = 150000;
const AXLE_TO_CHASSIS_JOINT_DAMPING = 20;

const DRIVE_WHEEL_FORCE = 600;
const DRIVE_WHEEL_DAMPING = 5;

type Wheel = {
  axlePosition: THREE.Vector3Tuple;
  wheelPosition: THREE.Vector3Tuple;
  side: "left" | "right";
  canDrive: boolean;
  canSteer: boolean;
};

const WHEELS: Wheel[] = [
  {
    axlePosition: [
      -0.8,
      WHEEL_SIZE / 2, // - 0.2,
      -(CHASSIS_WIDTH / 2 + AXEL_WIDTH / 2),
    ],
    side: "left",
    canDrive: false,
    canSteer: true,
    wheelPosition: [
      -0.8,
      WHEEL_SIZE / 2 + 0.1,
      -(CHASSIS_WIDTH / 2 + AXEL_WIDTH / 2 + AXEL_WIDTH),
    ],
  },
  {
    axlePosition: [
      -0.8,
      WHEEL_SIZE / 2, // - 0.2,
      CHASSIS_WIDTH / 2 + AXEL_WIDTH / 2,
    ],
    side: "right",
    canDrive: false,
    canSteer: true,
    wheelPosition: [
      -0.8,
      WHEEL_SIZE / 2,
      CHASSIS_WIDTH / 2 + AXEL_WIDTH / 2 + AXEL_WIDTH,
    ],
  },
  {
    axlePosition: [
      0.8,
      WHEEL_SIZE / 2, // - 0.2,
      -(CHASSIS_WIDTH / 2 + AXEL_WIDTH / 2),
    ],
    side: "left",
    canDrive: true,
    canSteer: false,
    wheelPosition: [
      0.8,
      WHEEL_SIZE / 2,
      -(CHASSIS_WIDTH / 2 + AXEL_WIDTH / 2 + AXEL_WIDTH),
    ],
  },
  {
    axlePosition: [
      0.8,
      WHEEL_SIZE / 2, // - 0.2,
      CHASSIS_WIDTH / 2 + AXEL_WIDTH / 2,
    ],
    side: "right",
    canDrive: true,
    canSteer: false,
    wheelPosition: [
      0.8,
      WHEEL_SIZE / 2,
      CHASSIS_WIDTH / 2 + AXEL_WIDTH / 2 + AXEL_WIDTH,
    ],
  },
];

const WheelAxelJoint = ({ axel, wheel, bodyAnchor, canDrive }) => {
  const joint = useRevoluteJoint(axel, wheel, [
    bodyAnchor,
    [0, 0, 0],
    [0, 0, 1],
  ]);

  const forwardPressed = useKeyboardControls<Controls>(
    (state) => state.forward
  );
  const backwardPressed = useKeyboardControls<Controls>((state) => state.back);

  useEffect(() => {
    if (!canDrive) return;

    let forward = 0;
    if (forwardPressed) forward += 1;
    if (backwardPressed) forward -= 1;

    forward *= DRIVE_WHEEL_FORCE;

    if (forward !== 0) {
      wheel.current?.wakeUp();
    }

    joint.current?.configureMotorVelocity(forward, DRIVE_WHEEL_DAMPING);
  }, [forwardPressed, backwardPressed]);

  return null;
};

const SteerAxelToChassisJoint = ({ body, axel, bodyAnchor }) => {
  const joint = useRevoluteJoint(body, axel, [
    bodyAnchor,
    [0, 0, 0],
    [0, 1, 0],
  ]);

  const leftPressed = useKeyboardControls<Controls>((state) => state.left);
  const rightPressed = useKeyboardControls<Controls>((state) => state.right);

  useEffect(() => {
    const targetPos = leftPressed ? 0.2 : rightPressed ? -0.2 : 0;

    joint.current?.configureMotorPosition(
      targetPos,
      AXLE_TO_CHASSIS_JOINT_STIFFNESS,
      AXLE_TO_CHASSIS_JOINT_DAMPING
    );
  }, [leftPressed, rightPressed]);

  return null;
};

const DriveAxelToChassisJoint = ({ body, axel, bodyAnchor }) => {
  useFixedJoint(body, axel, [
    bodyAnchor,
    [0, 0, 0, 1],
    [0, 0, 0],
    [0, 0, 0, 1],
  ]);

  return null;
};

function Player() {
  const chassisRef = useRef<RapierRigidBody>(null);
  const wheelsRef = useRef<RefObject<RapierRigidBody>[]>(
    WHEELS.map(() => createRef())
  );
  const axelsRef = useRef<RefObject<RapierRigidBody>[]>(
    WHEELS.map(() => createRef())
  );

  return (
    <group>
      <RigidBody
        ref={chassisRef}
        colliders="cuboid"
        position={[0, WHEEL_SIZE / 2, 0]}
        mass={1}
      >
        <mesh>
          <boxGeometry args={[2, 0.5, CHASSIS_WIDTH]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>

      {WHEELS.map((wheel, index) => (
        <Fragment key={index}>
          {/* Wheel */}
          <RigidBody
            ref={wheelsRef.current[index]}
            colliders={false}
            position={wheel.wheelPosition}
          >
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry
                args={[WHEEL_SIZE, WHEEL_SIZE, WHEEL_WIDTH, 32]}
              />
              <meshStandardMaterial color="#666" />
            </mesh>
            <CylinderCollider
              mass={0.5}
              friction={1.5}
              args={[WHEEL_WIDTH / 2, WHEEL_SIZE]}
              rotation={[-Math.PI / 2, 0, 0]}
            />
          </RigidBody>

          {/* Axel */}
          <RigidBody
            ref={axelsRef.current[index]}
            position={wheel.axlePosition}
            colliders="cuboid"
          >
            <mesh>
              <boxGeometry args={[0.5, 0.5, AXEL_WIDTH / 2]} />
              <meshStandardMaterial color="#999" />
            </mesh>
          </RigidBody>

          {/* Joints */}
          {!!wheel.canDrive && (
            <DriveAxelToChassisJoint
              body={chassisRef}
              axel={axelsRef.current[index]}
              bodyAnchor={[wheel.axlePosition[0], 0, wheel.axlePosition[2]]}
            />
          )}

          {!!wheel.canSteer && (
            <SteerAxelToChassisJoint
              body={chassisRef}
              axel={axelsRef.current[index]}
              bodyAnchor={[wheel.axlePosition[0], 0, wheel.axlePosition[2]]}
            />
          )}

          <WheelAxelJoint
            wheel={wheelsRef.current[index]}
            axel={axelsRef.current[index]}
            bodyAnchor={[0, 0, wheel.side == "left" ? -0.2 : 0.2]}
            canDrive={wheel.canDrive}
          />
        </Fragment>
      ))}
    </group>
  );
}

export default Player;
