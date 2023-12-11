export type Wheel = {
  axlePosition: THREE.Vector3Tuple;
  wheelPosition: THREE.Vector3Tuple;
  side: "left" | "right";
  canDrive: boolean;
  canSteer: boolean;
};
