import { useEffect } from "react";
import { useRevoluteJoint } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";

import type { Controls } from "../../../../../controllers/InputController/constants";

import {
  AXLE_TO_CHASSIS_JOINT_DAMPING,
  AXLE_TO_CHASSIS_JOINT_STIFFNESS,
} from "../constants";

const JointSteerAxelToChassis = ({ body, axel, bodyAnchor }) => {
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

export default JointSteerAxelToChassis;
