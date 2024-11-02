const WebSocket = require("ws");

function broadcastStateUpdate(clients, clientIp, newState) {
  clients.forEach(({ ws }) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({ type: "stateUpdate", ip: clientIp, etat: newState })
      );
    }
  });
  console.log(`ESP state updated for IP ${clientIp}: ${newState}`);
}

module.exports = { broadcastStateUpdate };
