import { useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useRevoluteJoint } from "@react-three/rapier";
import type { Controls } from "../../../../../controllers/InputController/constants";

import { DRIVE_WHEEL_DAMPING, DRIVE_WHEEL_FORCE } from "../constants";

const JointWheelAxel = ({ axel, wheel, axelAnchor, canDrive }) => {
  const joint = useRevoluteJoint(axel, wheel, [
    axelAnchor,
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

export default JointWheelAxel;
