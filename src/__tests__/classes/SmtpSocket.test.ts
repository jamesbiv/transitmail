import { ISmtpSettings } from "interfaces";
import { SmtpSocket } from "classes";
import { WebSocketServer, WebSocket } from "ws";
import { overloadWebSocketConstructor, restoreWebSocketClass } from "__tests__/fixtures";

jest.mock("contexts/DependenciesContext");

const sleep = async (milliSeconds: number) =>
  new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, milliSeconds));

const settings: ISmtpSettings = {
  host: "localhost",
  port: 8123,
  username: "testUsername",
  password: "testPasword"
};

process.env = {
  NODE_ENV: "development",
  PUBLIC_URL: "https://localhost"
};

describe("Testing the SmtpSocket class", () => {
  let webSocketServer: WebSocketServer;

  beforeAll(() => {
    overloadWebSocketConstructor();

    webSocketServer = new WebSocketServer({ port: 8123 });

    // eslint-disable-next-line no-console
    const webSocketOnError = (error: Error): void => console.error(error);

    const webSocketOnMessage = (data: string, isBinary: boolean): void => {
      webSocketServer.clients.forEach((client: WebSocket) => {
        if (client !== this && client.readyState === WebSocket.OPEN) {
          client.send("220 " + data, { binary: isBinary });
        }
      });
    };

    webSocketServer.on("connection", (webSocket: WebSocket) => {
      webSocket.on("error", webSocketOnError);
      webSocket.on("message", webSocketOnMessage);
    });
  });

  afterAll(() => {
    webSocketServer.close();

    restoreWebSocketClass();
  });

  it("testing smtpConnect() method", () => {
    const smtpSocket = new SmtpSocket(settings);

    const smtpConnectResponse: boolean = smtpSocket.smtpConnect();

    expect(smtpConnectResponse).toBeTruthy();
  });

  it("testing smtpClose() method", () => {
    const smtpSocket = new SmtpSocket(settings);

    smtpSocket.smtpConnect();

    const smtpCloseResponse: boolean = smtpSocket.smtpClose();

    expect(smtpCloseResponse).toBeTruthy();
  });

  it("testing smtpRequest() method", async () => {
    const smtpSocket = new SmtpSocket(settings);

    smtpSocket.smtpConnect();

    const smtpRequestResponse = await smtpSocket.smtpRequest("Test request");

    smtpSocket.smtpClose();

    expect(smtpRequestResponse).toBeTruthy();
  });

  it("testing smtpAuthorise() method", () => {});
  it("testing getReadyState() method", () => {});
  it("testing getBufferedAmount() method", () => {});
});
