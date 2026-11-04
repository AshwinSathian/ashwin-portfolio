"use client";

import { useEffect, useState } from "react";

const format = () =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date())
    .toLowerCase();

/**
 * The time in Kochi right now. The server HTML says the time zone, so the
 * line reads fine without JavaScript; the client fills in the minute.
 */
export default function KochiTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(format());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span>
      {time ? <>It’s {time} in Kochi right now.</> : <>Kochi runs on IST, UTC+5:30.</>}
    </span>
  );
}
