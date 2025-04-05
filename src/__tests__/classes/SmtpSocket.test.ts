import { WebSocketServer, WebSocket } from "ws";

import { ESmtpResponseStatus, ISmtpSettings } from "interfaces";
import { SmtpSocket } from "classes";
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

describe("Testing the SmtpSocket class", () => {
  let webSocketServer: WebSocketServer;
  let webSocketOnMessageHandler: (
    webSocket: WebSocket,
    requestData: Buffer,
    isBinary: boolean
  ) => void;

  beforeAll(() => {
    overloadWebSocketConstructor();

    webSocketServer = new WebSocketServer({ port: 8123 });

    webSocketOnMessageHandler = (
      webSocket: WebSocket,
      requestData: Buffer,
      isBinary: boolean
    ): void => {
      const requestDataString: string = Buffer.from(requestData).toString();

      switch (true) {
        case /Test positive request/i.test(requestDataString):
          webSocket.send("220 Test positive response", { binary: isBinary });
          break;

        case /Test negative request/i.test(requestDataString):
          webSocket.send("500 Test negative response", { binary: isBinary });
          break;

        case /Test non-binary request/i.test(requestDataString):
          webSocket.send("220 Test non-binary response", { binary: !isBinary });
          break;

        case /Test session lock request/i.test(requestDataString):
          (async () => {
            await sleep(200);

            webSocket.send("220 Test session lock response", { binary: isBinary });
          })();
          break;

        default:
          webSocket.send(`220 ${requestDataString}`, { binary: isBinary });
      }
    };

    webSocketServer.on("connection", (webSocket: WebSocket) => {
      // eslint-disable-next-line no-console
      webSocket.on("error", (error: Error): void => console.error(error));

      webSocket.on("message", (requestData: Buffer, isBinary: boolean): void =>
        webSocketOnMessageHandler(webSocket, requestData, isBinary)
      );
    });
  });

  afterAll(() => {
    webSocketServer.close();

    restoreWebSocketClass();
  });

  describe("test smtpConnect() method", () => {
    it("with successful connection", async () => {
      const smtpSocket = new SmtpSocket(settings);

      const smtpConnectResponse: boolean = await smtpSocket.smtpConnect(false);

      smtpSocket.smtpClose();

      expect(smtpConnectResponse).toBeTruthy();
    });

    it("with unsuccessful connection", async () => {
      const settings: ISmtpSettings = {
        host: "localhost",
        port: 1111,
        username: "testUsername",
        password: "testPasword"
      };

      const smtpSocket = new SmtpSocket(settings);

      const smtpConnectResponse: boolean = await smtpSocket.smtpConnect(false);

      smtpSocket.smtpClose();

      expect(smtpConnectResponse).toBeFalsy();
    });

    it("with unsuccessful connection with  retry", async () => {
      const settings: ISmtpSettings = {
        host: "localhost",
        port: 1111,
        username: "testUsername",
        password: "testPasword"
      };

      const smtpSocket = new SmtpSocket(settings);

      smtpSocket.session.retry = 10;

      const smtpConnectResponse: boolean = await smtpSocket.smtpConnect(false);

      await sleep(20);

      smtpSocket.smtpClose();

      expect(smtpConnectResponse).toBeFalsy();
    });
  });

  describe("test smtpClose() method", () => {
    it("with successful connection closure", async () => {
      const smtpSocket = new SmtpSocket(settings);

      await smtpSocket.smtpConnect();

      const smtpCloseResponse: boolean = smtpSocket.smtpClose();

      expect(smtpCloseResponse).toBeTruthy();
    });
  });

  describe("test smtpRequest() method", () => {
    it("with a positive request", async () => {
      const smtpSocket = new SmtpSocket(settings);

      await smtpSocket.smtpConnect();

      const smtpRequestResponse = await smtpSocket.smtpRequest("Test positive request");

      smtpSocket.smtpClose();

      expect(smtpRequestResponse).toEqual({
        data: [["220 Test positive response"]],
        status: ESmtpResponseStatus.Success
      });
    });

    it("with a negavtive request", async () => {
      const smtpSocket = new SmtpSocket(settings);

      await smtpSocket.smtpConnect();

      const smtpRequestResponse = await smtpSocket.smtpRequest("Test negative request");

      smtpSocket.smtpClose();

      expect(smtpRequestResponse).toEqual({
        data: [["500 Test negative response"]],
        status: ESmtpResponseStatus.Failure
      });
    });

    it("with a non-binary response under message handler", async () => {
      const smtpSocket = new SmtpSocket(settings);

      await smtpSocket.smtpConnect(false);

      const smtpRequestResponse = await smtpSocket.smtpRequest("Test non-binary request");

      smtpSocket.smtpClose();

      expect(smtpRequestResponse).toEqual({
        data: [["220 Test non-binary response"]],
        status: ESmtpResponseStatus.Success
      });
    });

    it("test session lock request mechanism under smtpProcessRequest() and smtpResponseHandler()", async () => {
      const smtpSocket = new SmtpSocket(settings);

      await smtpSocket.smtpConnect();

      smtpSocket.smtpRequest("Test session lock request");
      const smtpRequestResponse = await smtpSocket.smtpRequest("Test positive request");

      smtpSocket.smtpClose();

      expect(smtpRequestResponse).toEqual({
        data: [["220 Test positive response"]],
        status: ESmtpResponseStatus.Success
      });
    });
  });

  describe("testing smtpAuthorise() method", () => {
    let originalWebSocketOnMessageHandler: (
      webSocket: WebSocket,
      requestData: Buffer,
      isBinary: boolean
    ) => void;

    beforeAll(() => {
      originalWebSocketOnMessageHandler = webSocketOnMessageHandler;
    });

    afterAll(() => {
      webSocketOnMessageHandler = originalWebSocketOnMessageHandler;
    });

    it("with EHLO failing", async () => {
      webSocketOnMessageHandler = (
        webSocket: WebSocket,
        requestData: Buffer,
        isBinary: boolean
      ) => {
        const requestDataString: string = Buffer.from(requestData).toString();

        if (/EHLO/i.test(requestDataString)) {
          webSocket.send("500 Test negative response", { binary: isBinary });
          return;
        }

        webSocket.send(`220 ${requestDataString}`, { binary: isBinary });
      };

      const smtpSocket = new SmtpSocket(settings);

      await smtpSocket.smtpConnect();

      const smtpAuthoriseResponse = await smtpSocket.smtpAuthorise();

      smtpSocket.smtpClose();

      expect(smtpAuthoriseResponse.status).toBe(ESmtpResponseStatus.Failure);
    });

    it("with AUTH LOGIN failing", async () => {
      webSocketOnMessageHandler = (
        webSocket: WebSocket,
        requestData: Buffer,
        isBinary: boolean
      ) => {
        const requestDataString: string = Buffer.from(requestData).toString();

        if (/AUTH LOGIN/i.test(requestDataString)) {
          webSocket.send("500 Test negative response", { binary: isBinary });
          return;
        }

        webSocket.send(`220 ${requestDataString}`, { binary: isBinary });
      };

      const smtpSocket = new SmtpSocket(settings);

      await smtpSocket.smtpConnect();

      const smtpAuthoriseResponse = await smtpSocket.smtpAuthorise();

      smtpSocket.smtpClose();

      expect(smtpAuthoriseResponse.status).toBe(ESmtpResponseStatus.Failure);
    });

    it("with username failing", async () => {
      webSocketOnMessageHandler = (
        webSocket: WebSocket,
        requestData: Buffer,
        isBinary: boolean
      ) => {
        const requestDataString: string = Buffer.from(requestData).toString();

        if (requestDataString.includes(btoa("testUsername"))) {
          webSocket.send("500 Test negative response", { binary: isBinary });
          return;
        }

        webSocket.send(`220 ${requestDataString}`, { binary: isBinary });
      };

      const smtpSocket = new SmtpSocket(settings);

      await smtpSocket.smtpConnect();

      const smtpAuthoriseResponse = await smtpSocket.smtpAuthorise();

      smtpSocket.smtpClose();

      expect(smtpAuthoriseResponse.status).toBe(ESmtpResponseStatus.Failure);
    });

    it("with password failing", async () => {
      webSocketOnMessageHandler = (
        webSocket: WebSocket,
        requestData: Buffer,
        isBinary: boolean
      ) => {
        const requestDataString: string = Buffer.from(requestData).toString();

        if (requestDataString.includes(btoa("testPasword"))) {
          webSocket.send("500 Test negative response", { binary: isBinary });
          return;
        }

        webSocket.send(`220 ${requestDataString}`, { binary: isBinary });
      };

      const smtpSocket = new SmtpSocket(settings);

      await smtpSocket.smtpConnect();

      const smtpAuthoriseResponse = await smtpSocket.smtpAuthorise();

      smtpSocket.smtpClose();

      expect(smtpAuthoriseResponse.status).toBe(ESmtpResponseStatus.Failure);
    });

    it("with successful response", async () => {
      webSocketOnMessageHandler = (
        webSocket: WebSocket,
        requestData: Buffer,
        isBinary: boolean
      ) => {
        const requestDataString: string = Buffer.from(requestData).toString();

        webSocket.send(`220 ${requestDataString}`, { binary: isBinary });
      };

      const smtpSocket = new SmtpSocket(settings);

      await smtpSocket.smtpConnect();

      const smtpAuthoriseResponse = await smtpSocket.smtpAuthorise();

      smtpSocket.smtpClose();

      expect(smtpAuthoriseResponse.status).toBe(ESmtpResponseStatus.Success);
    });
  });

  describe("testing getReadyState() method", () => {
    it("with WebSocket.OPEN as a response", async () => {
      const smtpSocket = new SmtpSocket(settings);

      await smtpSocket.smtpConnect();

      const getReadyStateResponse: number | undefined = smtpSocket.getReadyState();

      smtpSocket.smtpClose();

      expect(getReadyStateResponse).toBe(WebSocket.OPEN);
    });
  });

  describe("testing getBufferedAmount() method", () => {
    it("with response of 0 bytes before connection is made", async () => {
      const smtpSocket = new SmtpSocket(settings);

      const getBufferedAmountResponse: number = smtpSocket.getBufferedAmount();

      expect(getBufferedAmountResponse).toBe(0);
    });

    it("with response greater than 1024 bytes", async () => {
      const generateRandomChar: () => string = () =>
        String.fromCharCode(Math.floor(Math.random() * 128));

      const smtpSocket = new SmtpSocket(settings);

      await smtpSocket.smtpConnect();

      smtpSocket.smtpRequest(generateRandomChar().repeat(1024));

      const getBufferedAmountResponse: number = smtpSocket.getBufferedAmount();

      smtpSocket.smtpClose();

      expect(getBufferedAmountResponse).toBeGreaterThan(1024);
    });
  });

  describe("testing in development (debug) mode", () => {
    const originalEnvironmentVariables: NodeJS.ProcessEnv = process.env;
    const originalConsole: Console = global.console;

    beforeAll(() => {
      process.env = { NODE_ENV: "development", PUBLIC_URL: "https://localhost" };
      global.console = { error: jest.fn(), log: jest.fn() } as never;
    });

    afterAll(() => {
      process.env = originalEnvironmentVariables;
      global.console = originalConsole;
    });

    describe("test smtpConnect() event handlers", () => {
      it("on open event", async () => {
        const smtpSocket = new SmtpSocket(settings);

        await smtpSocket.smtpConnect(false);

        smtpSocket.smtpClose();

        expect(global.console.log).toHaveBeenCalledWith(
          expect.stringMatching(/\[SMTP\] Client connected/i)
        );
      });

      it("on error event", async () => {
        const settings: ISmtpSettings = {
          host: "localhost",
          port: 1111,
          username: "testUsername",
          password: "testPasword"
        };

        const smtpSocket = new SmtpSocket(settings);

        await smtpSocket.smtpConnect(false);

        smtpSocket.smtpClose();

        expect(global.console.error).toHaveBeenCalledWith(
          expect.stringMatching(/\[SMTP\] Connection error/i),
          expect.stringMatching(/\S./i)
        );
      });

      it("on close event", async () => {
        const smtpSocket = new SmtpSocket(settings);

        await smtpSocket.smtpConnect(false);

        smtpSocket.smtpClose();

        expect(global.console.log).toHaveBeenCalledWith(
          expect.stringMatching(/\[SMTP\] Connection closed/i),
          expect.stringMatching(/\S./i)
        );
      });
    });

    describe("test smtpProcessRequest() and smtpResponseHandler() methods", () => {
      it("during a successful request and response", async () => {
        const smtpSocket = new SmtpSocket(settings);

        await smtpSocket.smtpConnect(false);
        await smtpSocket.smtpRequest("Test request");

        smtpSocket.smtpClose();

        expect(global.console.log).toHaveBeenCalledWith(
          expect.stringMatching(/\[SMTP\] Request:/i)
        );
        expect(global.console.log).toHaveBeenCalledWith(
          expect.stringMatching(/\[SMTP\] Response:/i)
        );
      });
    });
  });
});
