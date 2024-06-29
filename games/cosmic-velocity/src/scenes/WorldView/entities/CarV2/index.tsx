import { useRef, RefObject, createRef, Fragment } from "react";
import {
  CylinderCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";

import {
  AXEL_SIZE,
  AXEL_WIDTH,
  CHASSIS_HEIGHT,
  WHEEL_SIZE,
  WHEEL_WIDTH,
} from "./constants";

import { getVehicleConfig } from "./config";
import JointSteerAxelToChassis from "./components/JointSteerAxelToChassis";
import JointWheelAxel from "./components/JointWheelAxel";
import JointDriveAxelToChassis from "./components/JointDriveAxelToChassis";

const VehicleConfig = getVehicleConfig();

const CHASSIS = VehicleConfig.chassis;
const WHEELS = VehicleConfig.wheels;

function CarV2() {
  const chassisRef = useRef<RapierRigidBody>(null);
  const wheelsRef = useRef<RefObject<RapierRigidBody>[]>(
    WHEELS.map(() => createRef())
  );
  const axelsRef = useRef<RefObject<RapierRigidBody>[]>(
    WHEELS.map(() => createRef())
  );

  return (
    <group position={[0, 0, 5]}>
      <RigidBody
        ref={chassisRef}
        colliders="cuboid"
        position={CHASSIS.position}
        mass={0.2}
      >
        <mesh>
          <boxGeometry args={CHASSIS.size} />
          <meshStandardMaterial color={CHASSIS.color} />
        </mesh>
      </RigidBody>

      {WHEELS.map((wheel, i) => (
        <Fragment key={wheel.id}>
          {/* ----------- WHEEL ----------- */}
          <RigidBody
            ref={wheelsRef.current[i]}
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

          {/* ----------- AXLE ------------ */}
          <RigidBody ref={axelsRef.current[i]} position={wheel.axlePosition}>
            <mesh>
              <boxGeometry args={[AXEL_SIZE, AXEL_SIZE, AXEL_WIDTH]} />
              <meshBasicMaterial color={"silver"} />
            </mesh>
          </RigidBody>

          {/* ----------- JOINTS ---------- */}
          {!!wheel.canDrive && (
            <JointDriveAxelToChassis
              body={chassisRef}
              axel={axelsRef.current[i]}
              bodyAnchor={[
                wheel.axlePosition[0],
                -(CHASSIS_HEIGHT / 2 + WHEEL_SIZE),
                wheel.axlePosition[2],
              ]}
            />
          )}

          {!!wheel.canSteer && (
            <JointSteerAxelToChassis
              body={chassisRef}
              axel={axelsRef.current[i]}
              bodyAnchor={[
                wheel.axlePosition[0],
                -(CHASSIS_HEIGHT / 2 + WHEEL_SIZE),
                wheel.axlePosition[2],
              ]}
            />
          )}

          <JointWheelAxel
            wheel={wheelsRef.current[i]}
            axel={axelsRef.current[i]}
            axelAnchor={[0, 0, wheel.side == "left" ? -AXEL_WIDTH : AXEL_WIDTH]}
            canDrive={wheel.canDrive}
          />
        </Fragment>
      ))}
    </group>
  );
}

export default CarV2;
