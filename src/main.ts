const outputDiv = document.getElementById('output') as HTMLDivElement;
const messageInput = document.getElementById('messageInput') as HTMLInputElement;
const sendButton = document.getElementById('sendButton') as HTMLButtonElement;

const WEB_SOCKET_PORT = 8181;

// Replace with the actual URL of your WebSocket server
const websocketUrl = `ws://localhost:${WEB_SOCKET_PORT}`;
let websocket: WebSocket | null = null;

function connectWebSocket() {
  websocket = new WebSocket(websocketUrl);

  websocket.onopen = () => {
    console.log('WebSocket connection established.');
    appendMessage('System: WebSocket connection established.');
  };

  websocket.onmessage = (event: MessageEvent<any>) => {
    console.log('Received message:', event.data);
    appendMessage(`Server: ${event.data}`);
  };

  websocket.onclose = (event: CloseEvent) => {
    if (event.wasClean) {
      console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      appendMessage(`System: Connection closed (code=${event.code}, reason=${event.reason}).`);
    } else {
      console.log('Connection abruptly closed');
      appendMessage('System: Connection abruptly closed.');
      // Optionally attempt to reconnect after a delay
      //setTimeout(connectWebSocket, 3000);
    }
  };

  websocket.onerror = (error: Event) => {
    console.error('WebSocket error:', error);
    appendMessage("System: Error occurred");
  };
}

function sendMessage() {
  if (!websocket || websocket.readyState !== WebSocket.OPEN) {
    appendMessage('System: WebSocket is not connected.');
    return;
  }

  const message = messageInput.value;
  if (message.trim() === '') {
    return; // Ignore empty messages
  }

  websocket.send(message);
  appendMessage(`Client: ${message}`);
  messageInput.value = '';
}

function appendMessage(message: string) {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  outputDiv.appendChild(messageElement);
  outputDiv.scrollTop = outputDiv.scrollHeight; // Scroll to the bottom
}

// Connect to the WebSocket when the page loads
connectWebSocket();

// Event listener for the send button
sendButton.addEventListener('click', sendMessage);

// Optional: Handle pressing Enter in the input field
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});
