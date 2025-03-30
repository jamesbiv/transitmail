import { ESmtpResponseStatus, ISmtpSettings } from "interfaces";
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

    const webSocketOnMessage = (requestData: Buffer, isBinary: boolean): void => {
      webSocketServer.clients.forEach((client: WebSocket) => {
        if (client === this || client.readyState !== WebSocket.OPEN) {
          return;
        }

        const requestDataString: string = Buffer.from(requestData).toString();

        switch (true) {
          case /Test positive request/i.test(requestDataString):
            client.send("220 Test positive response", { binary: isBinary });
            break;

          case /Test negative request/i.test(requestDataString):
            client.send("500 Test negative response", { binary: isBinary });
            break;

          default:
            client.send(`220 ${requestDataString}`, { binary: isBinary });
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

  it("testing smtpRequest() method with a positive request", async () => {
    const smtpSocket = new SmtpSocket(settings);

    smtpSocket.smtpConnect();

    const smtpRequestResponse = await smtpSocket.smtpRequest("Test positive request");

    smtpSocket.smtpClose();

    expect(smtpRequestResponse).toEqual({
      data: [["220 Test positive response"]],
      status: ESmtpResponseStatus.Success
    });
  });

  it("testing smtpRequest() method with a negavtive request", async () => {
    const smtpSocket = new SmtpSocket(settings);

    smtpSocket.smtpConnect();

    const smtpRequestResponse = await smtpSocket.smtpRequest("Test negative request");

    smtpSocket.smtpClose();

    expect(smtpRequestResponse).toEqual({
      data: [["500 Test negative response"]],
      status: ESmtpResponseStatus.Failure
    });
  });

  it("testing smtpAuthorise() method", () => {});
  it("testing getReadyState() method", () => {});
  it("testing getBufferedAmount() method", () => {});
});
