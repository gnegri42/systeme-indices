import React, { useState, useEffect, useRef } from "react";
import "./ChronometerComponent.css";
import { mainUrl } from "../../config/config";

const ChronometerComponent = () => {
  const [time, setTime] = useState(0);
  const [status, setStatus] = useState("stopped");
  const HTTP_URL = `http://${mainUrl}:8080`;
  let intervalRef = useRef(null);

  useEffect(() => {
    const fetchInitialStatus = async () => {
      const response = await fetch(`${HTTP_URL}/chronometer/get-time`);
      const data = await response.json();
      console.log("TIME : ", data.time);
      setStatus(data.status);
      setTime(data.time);

      console.log("STATUS : ", status);
      if (status === "running") {
        const startTime = Date.now() - data.time;
        intervalRef.current = setInterval(() => {
          setTime(Date.now() - startTime);
        }, 1000);
      }
    };

    fetchInitialStatus();

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, [status]);

  const startChronometer = async () => {
    await fetch(`${HTTP_URL}/chronometer/start`, { method: "POST" });
    setStatus("running");
  };

  const pauseChronometer = async () => {
    await fetch(`${HTTP_URL}/chronometer/pause`, { method: "POST" });
    setStatus("paused");
  };

  const stopChronometer = async () => {
    await fetch(`${HTTP_URL}/chronometer/stop`, { method: "POST" });
    setStatus("stopped");
    setTime(0);
  };

  // Format time from milliseconds to HH:MM:SS
  const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="chronometer-container">
      <h1>{formatTime(time)}</h1>
      <button onClick={startChronometer} disabled={status === "running"}>
        Start
      </button>
      <button onClick={pauseChronometer} disabled={status !== "running"}>
        Pause
      </button>
      <button onClick={stopChronometer}>Stop</button>
    </div>
  );
};

export default ChronometerComponent;
