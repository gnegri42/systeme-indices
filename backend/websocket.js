const WebSocket = require("ws");
const { broadcastStateUpdate } = require("./utils/broadcast");
const { espData } = require("./utils/espData");

let clients = [];

/**
 * Mise en place de websocket pour l'application
 * @param {*} server
 */
function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    clients.push({ ws, ip: clientIp });
    console.log(`New client connected: ${clientIp}`);

    ws.on("message", (message) => {
      handleMessage(ws, message, clientIp);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      clients = clients.filter((client) => client.ws !== ws);
    });
  });
}

/**
 * Fonction de gestion des messages reçus ou envoyés via websocket.
 * Permet également de mettre à jour les états des ESPs en fonction des informations reçues
 * @param {*} ws
 * @param {*} message
 * @param {*} clientIp
 * @returns
 */
function handleMessage(ws, message, clientIp) {
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
}

/**
 * Fonction de gestion des états des ESP
 * @param {*} parsedMessage
 * @param {*} clientIp
 */
function handleEspState(parsedMessage, clientIp) {
  const { etat: newState } = parsedMessage;
  const esp = espData.find((esp) => esp.ip === clientIp);
  if (esp) {
    esp.etat_endpoint = newState;
    broadcastStateUpdate(clients, clientIp, newState);
  } else {
    console.error(`No ESP found for IP: ${clientIp}`);
  }
}

module.exports = { setupWebSocket };
