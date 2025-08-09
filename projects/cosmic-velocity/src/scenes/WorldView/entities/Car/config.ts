import type { Wheel } from "./types";

import { AXEL_WIDTH, CHASSIS_WIDTH, WHEEL_SIZE } from "./constants";

const getWheels = (): Wheel[] => [
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

export { getWheels };
