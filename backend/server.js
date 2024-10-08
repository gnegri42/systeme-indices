const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080, host: "0.0.0.0" });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log("Received message:", JSON.parse(message));

    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter((client) => client !== ws);
  });
});

console.log("WebSocket server is running on ws://0.0.0.0:8080");
