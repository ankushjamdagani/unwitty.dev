import { useFixedJoint } from "@react-three/rapier";

const JointDriveAxelToChassis = ({ body, axel, bodyAnchor }) => {
  useFixedJoint(body, axel, [
    bodyAnchor,
    [0, 0, 0, 1],
    [0, 0, 0],
    [0, 0, 0, 1],
  ]);

  return null;
};

export default JointDriveAxelToChassis;
