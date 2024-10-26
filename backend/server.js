const WebSocket = require("ws");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const port = 8080;

const wss = new WebSocket.Server({ server });

let clients = [];
// NEW CODE: Initialize memory-based ESP storage
let espData = [
  { ip: "127.0.0.1", etat_endpoint: "" },
  // Add more ESP objects if needed
];

function broadcastStateUpdate(clientIp, newState) {
  clients.forEach(({ ws }) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({ type: "stateUpdate", ip: clientIp, etat: newState })
      );
    }
  });

  console.log(`ESP state updated for IP ${clientIp}: ${newState}`);
}

function handleEspState(parsedMessage, clientIp) {
  const { etat: newState } = parsedMessage;

  const esp = espData.find((esp) => esp.ip === clientIp);
  if (esp) {
    esp.etat_endpoint = newState;
    broadcastStateUpdate(clientIp, newState);
  } else {
    console.error(`No ESP found for IP: ${clientIp}`);
  }
}

app.get("/setEtat/:etat", (req, res) => {
  const clientIp = req.ip; // Récupérer l'IP de l'ESP
  let newState = req.params.etat;

  if (!isNaN(newState)) {
    newState = parseFloat(newState); // Si c'est un nombre, le convertir
  } else if (newState === "true" || newState === "false") {
    newState = newState === "true"; // Si c'est un booléen, le convertir
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

wss.on("connection", (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  clients.push({ ws, ip: clientIp });
  console.log(`New client connected: ${clientIp}`);

  ws.on("message", (message) => {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
      console.log("Received message:", parsedMessage);
    } catch (e) {
      console.error("Invalid message format", message);
      return;
    }

    if (parsedMessage.type === "setEtat") {
      handleEspState(parsedMessage, clientIp);
    }

    if (parsedMessage.type === "stateUpdate") {
      console.log("ETAT MIS A JOUR AVEC LE NOUVEL ETAT : ");
      console.log(parsedMessage.etat);
    }

    clients.forEach((client) => {
      if (client.ws !== ws && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter((client) => client.ws !== ws);
  });
});

server.listen(port, () => {
  console.log(`HTTP & WebSocket server running on http://0.0.0.0:${port}`);
});
