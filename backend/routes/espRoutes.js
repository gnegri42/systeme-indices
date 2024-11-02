const express = require("express");
const { broadcastStateUpdate } = require("../utils/broadcast");
const { espData } = require("../utils/espData");

const router = express.Router();

router.get("/:etat", (req, res) => {
  const clientIp = req.ip;
  let newState = req.params.etat;

  if (!isNaN(newState)) {
    newState = parseFloat(newState);
  } else if (newState === "true" || newState === "false") {
    newState = newState === "true";
  }

  const esp = espData.find((esp) => esp.ip === clientIp);
  if (esp) {
    esp.etat_endpoint = newState;
    broadcastStateUpdate(clientIp, newState);
    res.status(200).send("Etat received and updated");
  } else {
    espData.push({ ip: clientIp, etat_endpoint: newState });
    broadcastStateUpdate(clientIp, newState);
    res.status(200).send("New ESP state registered and updated");
  }

  console.log(`ESP at ${clientIp} sent new etat: ${newState}`);
});

module.exports = router;
