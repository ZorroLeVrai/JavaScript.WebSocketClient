import type { SimpleCallback } from "./typeDeclaration";

export default class Model {
  private _isConnected: boolean;
  private _onUpdateCallback: SimpleCallback;

  constructor(onUpdateCallback: SimpleCallback) {
    this._isConnected = false;
    this._onUpdateCallback = onUpdateCallback;
  }

  setConnectionStatus(status: boolean) {
    this._isConnected = status;
    this._onUpdateCallback();
  }

  get isConnected(): boolean {
    return this._isConnected;
  }
}