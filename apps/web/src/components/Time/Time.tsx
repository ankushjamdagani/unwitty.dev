"use client";

import { useEffect, useState } from "react";

enum TIME_OF_DAY {
  AM = "AM",
  PM = "PM",
}

function padTime(num: number) {
  return num.toString().padStart(2, "0");
}

function getFormattedTime(date: EpochTimeStamp) {
  const currentDate = new Date(date);

  const hours = padTime(currentDate.getHours() % 12);
  const minutes = padTime(currentDate.getMinutes());
  const seconds = padTime(currentDate.getSeconds());
  const timeOfDay =
    currentDate.getHours() < 12 ? TIME_OF_DAY.AM : TIME_OF_DAY.PM;

  return `${hours}:${minutes}:${seconds} ${timeOfDay}`;
}

export function Time() {
  const [formattedTime, setFormattedTime] = useState(() =>
    getFormattedTime(Date.now())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedTime(getFormattedTime(Date.now()));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return <>{formattedTime}</>;
}
