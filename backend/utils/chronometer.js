let chronometer = {
  startTimestamp: null,
  elapsedTime: 0,
  status: "stopped",
};

// Function to start or resume the chronometer
function startChronometer() {
  if (chronometer.status !== "running") {
    chronometer.startTimestamp = Date.now();
    chronometer.status = "running";
    console.log("Chronometer started");
  }
}

// Function to pause the chronometer
function pauseChronometer() {
  if (chronometer.status === "running") {
    chronometer.elapsedTime += Date.now() - chronometer.startTimestamp;
    chronometer.startTimestamp = null;
    chronometer.status = "paused";
  }
}

// Function to stop and reset the chronometer
function stopChronometer() {
  chronometer = { startTimestamp: null, elapsedTime: 0, status: "stopped" };
}

// Function to get the current elapsed time
function getChronometerTime() {
  if (chronometer.status === "running") {
    return Date.now() - chronometer.startTimestamp + chronometer.elapsedTime;
  }
  return chronometer.elapsedTime;
}

function getChronometerStatus() {
  return {
    status: chronometer.status,
    time: getChronometerTime(),
  };
}

module.exports = {
  startChronometer,
  pauseChronometer,
  stopChronometer,
  getChronometerTime,
  getChronometerStatus,
};
