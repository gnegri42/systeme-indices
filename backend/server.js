const http = require("http");
const app = require("./app"); // Import Express app
const { setupWebSocket } = require("./websocket"); // Import WebSocket setup

const port = 8080;
const server = http.createServer(app);

// Setup WebSocket server
setupWebSocket(server);

server.listen(port, () => {
  console.log(`HTTP & WebSocket server running on http://0.0.0.0:${port}`);
});
