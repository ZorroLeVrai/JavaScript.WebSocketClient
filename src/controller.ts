import MainView from "./mainView";
import SocketService from "./socketService";
import Model from "./model";

export default class Controller {
  private socketService: SocketService;
  private model: Model;
  private mainView: MainView;

  constructor(webSocketUrl: string) {

    this.socketService = new SocketService(
      webSocketUrl,
      this.handleOpenSocket,
      this.handleMessageSocket,
      this.handleCloseSocket,
      this.handleErrorSocket);

    this.model = new Model(this.handleModelUpdate);
    this.mainView = new MainView(this.model, this.handleMessageSent, this.handleWebSocketConnection);
  }

  connectWebSocket = () => {
    this.socketService.connect();
  }

  handleOpenSocket = () => {
    this.model.setConnectionStatus(true);
  }

  handleMessageSocket = (message: string) => {
    this.mainView.displayMessage(`Server: ${message}`);
  }

  handleWebSocketConnection = (status: boolean) => {
    if (status) {
      this.socketService.connect();
    } else {
      this.socketService.disconnect();
    }
  }

  handleCloseSocket = (event: CloseEvent) => {
    this.model.setConnectionStatus(false);
    if (event.wasClean) {
      this.mainView.displayMessage(`Connection closed (code=${event.code}, reason=${event.reason})`);
    } else {
      this.mainView.displayMessage('Connection abruptly closed');
    }
  }

  handleErrorSocket = (error: Event) => {
    console.error('WebSocket error:', error);
    this.mainView.displayMessage('WebSocket error occurred');
  }

  handleMessageSent = (message: string) => {
    if (this.socketService.sendMessage(message)) {
      this.mainView.displayMessage(`Client: ${message}`);
    }
  }

  handleModelUpdate = () => {
    this.mainView.updateView();
  }
}