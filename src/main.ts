import Controller from "./controller";

const WEB_SOCKET_PORT = 8181;
const websocketUrl = `ws://localhost:${WEB_SOCKET_PORT}`;

const controller = new Controller(websocketUrl);
// Connect to the WebSocket when the page loads
controller.connectWebSocket();
