/**
 * @constant {WebSocket} originalWebSocketClass
 */
const originalWebSocketClass = global.WebSocket;

/**
 * overloadWebSocketConstructor
 * @returns void
 */
export const overloadWebSocketConstructor = () => {
  global.WebSocket = class WebSocketOverload extends WebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      super("ws://localhost:8123", protocols);
    }
  };
};

/**
 * restoreWebSocketClass
 * @returns void
 */
export const restoreWebSocketClass = () => {
  global.WebSocket = originalWebSocketClass;
};
