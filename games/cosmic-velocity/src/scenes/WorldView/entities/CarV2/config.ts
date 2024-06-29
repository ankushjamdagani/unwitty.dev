import type { Wheel } from "./types";

import {
  AXEL_WIDTH,
  CHASSIS_BACK,
  CHASSIS_FRONT,
  CHASSIS_HEIGHT,
  CHASSIS_LENGTH,
  CHASSIS_WIDTH,
  WHEEL_SIZE,
  WHEEL_WIDTH,
} from "./constants";
import { ColorRepresentation, Vector3Tuple } from "three";

const gapWheelChassis = 0;
const gapAxelWheel = 0;
const gapChassisAxel = 0;

const xDistanceFront = CHASSIS_LENGTH / 2 - CHASSIS_FRONT;
const xDistanceBack = CHASSIS_LENGTH / 2 - CHASSIS_BACK;

const yWheelCenter = WHEEL_SIZE / 2;
const yAxleCenter = yWheelCenter;

const zWheelDistance = CHASSIS_WIDTH / 2 + gapWheelChassis;
const zWheelDistanceCenter = zWheelDistance + WHEEL_WIDTH / 2;
const zAxelDistanceCenter = zWheelDistance - AXEL_WIDTH / 2 - gapAxelWheel;

console.log("zWheelDistance", zWheelDistance);
console.log("zWheelDistanceCenter", zWheelDistanceCenter);
console.log("zAxelDistanceCenter", zAxelDistanceCenter);

type VehicleConfig = {
  chassis: {
    position: Vector3Tuple;
    size: Vector3Tuple;
    color: ColorRepresentation;
  };
  wheels: Wheel[];
};

const getVehicleConfig = (): VehicleConfig => ({
  chassis: {
    position: [0, WHEEL_SIZE + gapChassisAxel, 0],
    size: [CHASSIS_LENGTH, CHASSIS_HEIGHT, CHASSIS_WIDTH],
    color: "red",
  },
  wheels: [
    {
      id: "front_left",
      axlePosition: [-xDistanceFront, yAxleCenter, -zAxelDistanceCenter],
      side: "left",
      canDrive: false,
      canSteer: true,
      wheelPosition: [-xDistanceFront, yWheelCenter, -zWheelDistanceCenter],
    },
    {
      id: "front_right",
      axlePosition: [-xDistanceFront, yAxleCenter, zAxelDistanceCenter],
      side: "right",
      canDrive: false,
      canSteer: true,
      wheelPosition: [-xDistanceFront, yWheelCenter, zWheelDistanceCenter],
    },
    {
      id: "back_left",
      axlePosition: [xDistanceBack, yAxleCenter, -zAxelDistanceCenter],
      side: "left",
      canDrive: true,
      canSteer: false,
      wheelPosition: [xDistanceBack, yWheelCenter, -zWheelDistanceCenter],
    },
    {
      id: "back_right",
      axlePosition: [xDistanceBack, yAxleCenter, zAxelDistanceCenter],
      side: "right",
      canDrive: true,
      canSteer: false,
      wheelPosition: [xDistanceBack, yWheelCenter, zWheelDistanceCenter],
    },
  ],
});

export { getVehicleConfig };
