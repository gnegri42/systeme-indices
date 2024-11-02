const express = require("express");
const {
  startChronometer,
  pauseChronometer,
  stopChronometer,
  getChronometerTime,
  getChronometerStatus,
} = require("../utils/chronometer");

const router = express.Router();

// Start the chronometer
router.post("/start", (req, res) => {
  console.log("CHRONOMETER STARTED !");
  startChronometer();
  res.sendStatus(200);
});

// Pause the chronometer
router.post("/pause", (req, res) => {
  console.log("CHRONOMETER PAUSED !");
  pauseChronometer();
  res.sendStatus(200);
});

// Stop the chronometer
router.post("/stop", (req, res) => {
  console.log("CHRONOMETER STOPPED !");
  stopChronometer();
  res.sendStatus(200);
});

// Get the current chronometer time
router.get("/get-time", (req, res) => {
  res.set("Cache-Control", "no-store");
  //   const time = getChronometerTime();
  const { status, time } = getChronometerStatus();
  res.json({ status, time });
});

module.exports = router;
