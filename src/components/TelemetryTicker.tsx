"use client";

import { useEffect, useMemo, useState } from "react";

const BASE_EVENTS = [
  "NODE LINK / AUTHENTICATION FRAME ACCEPTED",
  "GRIDPULSE / TELEMETRY SCHEMA AVAILABLE",
  "RLS / POLICY BOUNDARY VERIFIED",
  "DATABASE / TRANSACTION CHANNEL READY",
  "GEO VECTOR / DECIMAL COORDINATE VALIDATOR ARMED",
  "HARDWARE BODY / SIGNAL HANDSHAKE STANDBY",
];

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function clockStamp(date: Date) {
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

export default function TelemetryTicker() {
  const initial = useMemo(
    () =>
      BASE_EVENTS.map((message, index) => ({
        id: `${index}-${message}`,
        time: clockStamp(new Date(Date.now() - index * 4000)),
        message,
      })),
    [],
  );

  const [events, setEvents] = useState(initial);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = new Date();
      const nextIndex = Math.floor(now.getUTCSeconds() / 10) % BASE_EVENTS.length;
      const next = {
        id: `${now.getTime()}`,
        time: clockStamp(now),
        message: BASE_EVENTS[nextIndex],
      };

      setEvents((current) => [next, ...current].slice(0, 7));
    }, 7000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="feed" aria-live="polite">
      {events.map((event) => (
        <div className="feed-row" key={event.id}>
          <span className="feed-time">{event.time}Z</span>
          <span className="feed-marker">&gt;&gt;</span>
          <span className="feed-message">{event.message}</span>
          <span className="feed-status">OK</span>
        </div>
      ))}
    </div>
  );
}
