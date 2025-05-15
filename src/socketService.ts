import type { CloseEventCallback, EventCallback, MessageCallback, SimpleCallback } from './typeDeclaration';

export default class SocketService {
  private socket: WebSocket | null = null;
  private webSocketUrl: string;
  private onOpenCallback: SimpleCallback;
  private onMessageCallback: MessageCallback;
  private onCloseCallback: CloseEventCallback;
  private onErrorCallback: EventCallback;


  constructor(webSocketUrl: string,
    onOpenCallback: SimpleCallback,
    onMessageCallback: MessageCallback,
    onCloseCallback: CloseEventCallback,
    onErrorCallback: EventCallback

  ) {
    this.webSocketUrl = webSocketUrl;
    this.onOpenCallback = onOpenCallback;
    this.onMessageCallback = onMessageCallback;
    this.onCloseCallback = onCloseCallback;
    this.onErrorCallback = onErrorCallback;
  }

  connect() {
    this.socket = new WebSocket(this.webSocketUrl);

    this.socket.onopen = () => {
      this.onOpenCallback();
    }

    this.socket.onmessage = (event: MessageEvent<any>) => {
      this.onMessageCallback(event.data)
    }

    this.socket.onclose = (closeEvent: CloseEvent) => {
      this.onCloseCallback(closeEvent);
    }

    this.socket.onerror = (error: Event) => {
      this.onErrorCallback(error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessage(message: string): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return false; // Socket is not open
    }

    this.socket.send(message);
    return true; // Message sent successfully
  }
}