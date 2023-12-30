"use client";

import { useEffect, useState } from "react";

function getTimeInTimeZone(timezone: string = "IST") {
  const timezoneOffset = new Date().toLocaleTimeString("en", {
    timeZoneName: "short",
    timeZone: timezone,
  });

  return timezoneOffset;
}

export function Time() {
  const [currentTime, setCurrentTime] = useState(() => getTimeInTimeZone());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getTimeInTimeZone());
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return <>{currentTime}</>;
}
