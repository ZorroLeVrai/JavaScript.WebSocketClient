import type { BoolCallback, MessageCallback } from "./typeDeclaration";
import Model from "./model";

const outputDiv = document.getElementById('output') as HTMLDivElement;
const messageInput = document.getElementById('messageInput') as HTMLInputElement;
const sendButton = document.getElementById('sendButton') as HTMLButtonElement;
const webSocketConnectionButton = document.getElementById('webSocketConnection') as HTMLButtonElement;

export default class MainView {
  private model: Model;
  private onMessageSent: MessageCallback;
  private onWebSocketConnection: BoolCallback;

  constructor(model: Model, onMessageSent: MessageCallback, onWebSocketConnection: BoolCallback) {
    this.model = model;
    this.onMessageSent = onMessageSent;
    this.onWebSocketConnection = onWebSocketConnection;

    sendButton.addEventListener('click', () => {
      this.handleSendMessage();
    });
    messageInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.handleSendMessage();
      }
    });
    webSocketConnectionButton.addEventListener('click', () => {
      this.handleWebSocketConnection();
    });
  }

  private handleSendMessage() {
    const message = messageInput.value;
    if (message.trim() === '') {
      return; // Ignore empty messages
    }
    this.onMessageSent(message);
    //this.appendMessage(`Client: ${message}`);
    messageInput.value = '';
  }

  private handleWebSocketConnection() {
    this.onWebSocketConnection(!this.model.isConnected);
    // if (this.model.isConnected) {
    //   webSocketConnectionButton.textContent = 'Disconnect';
    // } else {
    //   webSocketConnectionButton.textContent = 'Connect';
    // }
  }

  public displayMessage(message: string) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    outputDiv.appendChild(messageElement);
    outputDiv.scrollTop = outputDiv.scrollHeight; // Scroll to the bottom
  }

  public updateView() {
    if (this.model.isConnected) {
      this.displayMessage('Connected to server');
      webSocketConnectionButton.textContent = "Disconnect WebSocket";
      messageInput.disabled = false;
      sendButton.disabled = false;
    } else {
      this.displayMessage('Disconnected from server');
      webSocketConnectionButton.textContent = "Connect WebSocket";
      messageInput.disabled = true;
      sendButton.disabled = true;
    }
  }
}
