export type Wheel = {
  id: string;
  axlePosition: THREE.Vector3Tuple;
  wheelPosition: THREE.Vector3Tuple;
  side: "left" | "right";
  canDrive: boolean;
  canSteer: boolean;
};
