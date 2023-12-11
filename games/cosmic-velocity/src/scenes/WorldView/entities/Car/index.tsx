import { useRef, RefObject, createRef, Fragment } from "react";
import {
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";

import {
  AXEL_WIDTH,
  CHASSIS_WIDTH,
  WHEEL_SIZE,
  WHEEL_WIDTH,
} from "./constants";

import { getWheels } from "./config";
import JointSteerAxelToChassis from "./components/JointSteerAxelToChassis";
import JointWheelAxel from "./components/JointWheelAxel";
import JointDriveAxelToChassis from "./components/JointDriveAxelToChassis";

const WHEELS = getWheels();

function Car() {
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
            <JointDriveAxelToChassis
              body={chassisRef}
              axel={axelsRef.current[index]}
              bodyAnchor={[wheel.axlePosition[0], 0, wheel.axlePosition[2]]}
            />
          )}

          {!!wheel.canSteer && (
            <JointSteerAxelToChassis
              body={chassisRef}
              axel={axelsRef.current[index]}
              bodyAnchor={[wheel.axlePosition[0], 0, wheel.axlePosition[2]]}
            />
          )}

          <JointWheelAxel
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

export default Car;
