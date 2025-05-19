import { WebSocketServer, WebSocket } from "ws";

import { EImapResponseStatus, IImapSettings } from "interfaces";
import { ImapSocket } from "classes";
import { overloadWebSocketConstructor, restoreWebSocketClass, sleep } from "__tests__/fixtures";

jest.mock("contexts/DependenciesContext");

const settings: IImapSettings = {
  host: "localhost",
  port: 8234,
  username: "testUsername",
  password: "testPasword"
};

describe("Testing the ImapSocket class", () => {
  let webSocketServer: WebSocketServer;
  let webSocketOnMessageHandler: (
    webSocket: WebSocket,
    requestData: Buffer,
    isBinary: boolean
  ) => void;

  beforeAll(() => {
    overloadWebSocketConstructor();

    webSocketServer = new WebSocketServer({ port: 8234 });

    webSocketOnMessageHandler = (
      webSocket: WebSocket,
      requestData: Buffer,
      isBinary: boolean
    ): void => {
      const requestDataString: string = Buffer.from(requestData).toString();

      const [responseId, responseDataString] = requestDataString.split(/ (.*)/);

      switch (true) {
        case /Test ok request/i.test(requestDataString):
          webSocket.send(`${responseId} OK Test ok response`, {
            binary: isBinary
          });

          break;

        case /Test bad request/i.test(requestDataString):
          webSocket.send(`${responseId} BAD Test bad response`, {
            binary: isBinary
          });

          break;

        case /Test no request/i.test(requestDataString):
          webSocket.send(`${responseId} NO Test no response`, {
            binary: isBinary
          });

          break;

        case /Test non-binary request/i.test(requestDataString):
          webSocket.send(`${responseId} OK Test non-binary response`, {
            binary: !isBinary
          });

          break;

        case /Test session lock request/i.test(requestDataString):
          (async () => {
            await sleep(200);

            webSocket.send(`* 01 OK\r\nTest session lock response\r\n${responseId} OK`, {
              binary: isBinary
            });
          })();
          break;

        default:
          webSocket.send(`* 01 OK\r\n${responseDataString}\r\n${responseId} OK`, {
            binary: isBinary
          });
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
    webSocketServer.clients.forEach((webSocketClients) => webSocketClients.terminate());

    restoreWebSocketClass();
  });

  describe("test imapCheckOrConnect() method", () => {
    it("with successful connection", async () => {
      const imapSocket = new ImapSocket(settings);

      const imapConnectResponse: boolean = await imapSocket.imapCheckOrConnect();

      imapSocket.imapClose();

      expect(imapConnectResponse).toBeTruthy();
    });

    it("as already connected", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect(false);

      const imapConnectResponse: boolean = await imapSocket.imapCheckOrConnect();

      imapSocket.imapClose();

      expect(imapConnectResponse).toBeTruthy();
    });
  });

  describe("test imapConnect() method", () => {
    it("with successful connection", async () => {
      const imapSocket = new ImapSocket(settings);

      const imapConnectResponse: boolean = await imapSocket.imapConnect(false);

      imapSocket.imapClose();

      expect(imapConnectResponse).toBeTruthy();
    });

    it("with unsuccessful connection", async () => {
      const settings: IImapSettings = {
        host: "localhost",
        port: 1111,
        username: "testUsername",
        password: "testPasword"
      };

      const imapSocket = new ImapSocket(settings);

      const imapConnectResponse: boolean = await imapSocket.imapConnect(false);

      imapSocket.imapClose();

      expect(imapConnectResponse).toBeFalsy();
    });

    it("with unsuccessful connection with retry", async () => {
      const settings: IImapSettings = {
        host: "localhost",
        port: 1111,
        username: "testUsername",
        password: "testPasword"
      };

      const imapSocket = new ImapSocket(settings);

      imapSocket.session.retry = 10;

      const imapConnectResponse: boolean = await imapSocket.imapConnect(false);

      await sleep(20);

      imapSocket.imapClose();

      expect(imapConnectResponse).toBeFalsy();
    });

    it("with unsuccessful connection without retry", async () => {
      const settings: IImapSettings = {
        host: "localhost",
        port: 1111,
        username: "testUsername",
        password: "testPasword"
      };

      const imapSocket = new ImapSocket(settings);

      imapSocket.session.retry = 0;

      const imapConnectResponse: boolean = await imapSocket.imapConnect(false);

      await sleep(20);

      imapSocket.imapClose();

      expect(imapConnectResponse).toBeFalsy();
    });
  });

  describe("test imapClose() method", () => {
    it("with successful connection closure", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapCloseResponse: boolean = imapSocket.imapClose();

      expect(imapCloseResponse).toBeTruthy();
    });
  });

  describe("test imapRequest() method", () => {
    it("with a positive (multi-line) request", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("Test positive request");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          ["*", "01", "OK"],
          ["Test positive request\r\n"],
          [expect.stringMatching(/^[A-Za-z0-9]+$/), "OK", ""]
        ],
        status: EImapResponseStatus.OK
      });
    });

    it("with a ok request", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("Test ok request");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [[expect.stringMatching(/^[A-Za-z0-9]+$/), "OK", "Test ok response"]],
        status: EImapResponseStatus.OK
      });
    });

    it("with a no request", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("Test no request");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [[expect.stringMatching(/^[A-Za-z0-9]+$/), "NO", "Test no response"]],
        status: EImapResponseStatus.NO
      });
    });

    it("with a bad request", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("Test bad request");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [[expect.stringMatching(/^[A-Za-z0-9]+$/), "BAD", "Test bad response"]],
        status: EImapResponseStatus.BAD
      });
    });

    it("with a non-binary response under message handler", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect(false);

      const imapRequestResponse = await imapSocket.imapRequest("Test non-binary request");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [[expect.stringMatching(/^[A-Za-z0-9]+$/), "OK", "Test non-binary response"]],
        status: EImapResponseStatus.OK
      });
    });

    it("test session lock request mechanism under imapProcessRequest() and imapResponseHandler()", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      imapSocket.imapRequest("Test session lock request");
      const imapRequestResponse = await imapSocket.imapRequest("Test ok request");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [[expect.stringMatching(/^[A-Za-z0-9]+$/), "OK", "Test ok response"]],
        status: EImapResponseStatus.OK
      });
    });
  });

  describe("test imapAuthorise() method", () => {});

  describe("testing getReadyState() method", () => {
    it("with WebSocket.OPEN as a response", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const getReadyStateResponse: number | undefined = imapSocket.getReadyState();

      imapSocket.imapClose();

      expect(getReadyStateResponse).toBe(WebSocket.OPEN);
    });
  });

  describe("test getStreamAmount() method", () => {
    it("with a successful response", async () => {
      const imapSocket = new ImapSocket(settings);

      const getStreamAmountResponse: number = imapSocket.getStreamAmount();
      imapSocket.imapClose();

      expect(getStreamAmountResponse).toBe(0);
    });
  });

  describe("test getStreamCumlativeAmount() method", () => {
    it("with a successful response", async () => {
      const imapSocket = new ImapSocket(settings);

      const getStreamCumlativeAmountResponse: number = imapSocket.getStreamCumlativeAmount();

      expect(getStreamCumlativeAmountResponse).toBe(0);
    });
  });

  describe("testing getBufferedAmount() method", () => {
    it("with response of 0 bytes before connection is made", async () => {
      const imapSocket = new ImapSocket(settings);

      const getBufferedAmountResponse: number = imapSocket.getBufferedAmount();

      expect(getBufferedAmountResponse).toBe(0);
    });

    it("with response greater than 1024 bytes", async () => {
      const generateRandomChar: () => string = () =>
        String.fromCharCode(Math.floor(Math.random() * 128));

      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      imapSocket.imapRequest(generateRandomChar().repeat(1024));

      const getBufferedAmountResponse: number = imapSocket.getBufferedAmount();

      imapSocket.imapClose();

      expect(getBufferedAmountResponse).toBeGreaterThan(1024);
    });
  });

  describe("testing in development (debug) mode", () => {
    const originalEnvironmentVariables: NodeJS.ProcessEnv = process.env;
    const originalConsole: Console = global.console;

    beforeEach(() => {
      process.env = { NODE_ENV: "development", PUBLIC_URL: "https://localhost" };
      global.console = { error: jest.fn(), log: jest.fn() } as never;
    });

    afterEach(() => {
      process.env = originalEnvironmentVariables;
      global.console = originalConsole;
    });

    describe("test imapConnect() event handlers", () => {
      it("on open event", async () => {
        const imapSocket = new ImapSocket(settings);

        await imapSocket.imapConnect(false);

        imapSocket.imapClose();

        expect(global.console.log).toHaveBeenCalledWith(
          expect.stringMatching(/\[IMAP\] Client connected/i)
        );
      });

      it("on error event", async () => {
        const settings: IImapSettings = {
          host: "localhost",
          port: 1111,
          username: "testUsername",
          password: "testPasword"
        };

        const imapSocket = new ImapSocket(settings);

        await imapSocket.imapConnect(false);

        imapSocket.imapClose();

        expect(global.console.error).toHaveBeenCalledWith(
          expect.stringMatching(/\[IMAP\] Connection error/i),
          expect.stringMatching(/\S./i)
        );
      });

      it("on close event", async () => {
        const imapSocket = new ImapSocket(settings);

        await imapSocket.imapConnect(false);

        imapSocket.imapClose();

        await sleep(100);

        expect(global.console.log).toHaveBeenCalledWith(
          expect.stringMatching(/\[IMAP\] Connection closed/i),
          expect.stringMatching(/\S./i)
        );
      });
    });

    describe("test imapProcessRequest() and imapResponseHandler() methods", () => {
      it("during a successful request and response", async () => {
        const imapSocket = new ImapSocket(settings);

        await imapSocket.imapConnect(false);
        await imapSocket.imapRequest("Test request");

        imapSocket.imapClose();

        expect(global.console.log).toHaveBeenCalledWith(
          expect.stringMatching(/\[IMAP\] Request:/i)
        );
        expect(global.console.log).toHaveBeenCalledWith(
          expect.stringMatching(/\[IMAP\] Response:/i)
        );
      });
    });
  });

  describe("Test specific IMAP commands", () => {
    beforeEach(() => {
      webSocketOnMessageHandler = (
        webSocket: WebSocket,
        requestData: Buffer,
        isBinary: boolean
      ): void => {
        const requestDataString: string = Buffer.from(requestData).toString();

        const [responseId, _] = requestDataString.split(/ (.*)/);

        switch (true) {
          case /LOGIN/i.test(requestDataString):
            webSocket.send(
              "* OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID " +
                "ENABLE IDLE LITERAL+ STARTTLS AUTH=PLAIN AUTH=LOGIN] " +
                "Dovecot (Debian) ready.\r\n",
              { binary: isBinary }
            );

            webSocket.send(
              `${responseId} OK [CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ` +
                `ID ENABLE IDLE SORT SORT=DISPLAY THREAD=REFERENCES ` +
                `THREAD=REFS THREAD=ORDEREDSUBJECT MULTIAPPEND URL-PARTIAL ` +
                `CATENATE UNSELECT CHILDREN NAMESPACE UIDPLUS LIST-EXTENDED ` +
                `I18NLEVEL=1 CONDSTORE QRESYNC ESEARCH ESORT SEARCHRES WITHIN ` +
                `CONTEXT=SEARCH LIST-STATUS BINARY MOVE SNIPPET=FUZZY ` +
                `PREVIEW=FUZZY PREVIEW STATUS=SIZE SAVEDATE LITERAL+ ` +
                `NOTIFY SPECIAL-USE] Logged in\r\n`,
              { binary: isBinary }
            );
            break;

          case /SELECT/i.test(requestDataString):
            webSocket.send(
              "* FLAGS (\\Answered \\Flagged \\Deleted \\Seen \\Draft)\r\n" +
                "* OK [PERMANENTFLAGS (\\Answered \\Flagged \\Deleted \\Seen \\Draft \\*)] Flags permitted.\r\n" +
                "* 30 EXISTS\r\n" +
                "* 0 RECENT\r\n" +
                "* OK [UIDVALIDITY 1740160111] UIDs valid\r\n" +
                "* OK [UIDNEXT 243] Predicted next UID\r\n" +
                `${responseId} OK [READ-WRITE] Select completed (0.000 + 0.000 + 0.000 secs).\r\n`,
              { binary: isBinary }
            );
            break;

          case /LIST/i.test(requestDataString):
            webSocket.send(
              '* LIST (\\NoInferiors) "/" "Recycle Bin"\r\n' +
                '* LIST (\\NoInferiors) "/" Spam\r\n' +
                '* LIST (\\NoInferiors) "/" "Sent Items"\r\n' +
                '* LIST (\\NoInferiors \\Drafts) "/" Drafts\r\n' +
                '* LIST (\\NoInferiors \\UnMarked) "/" Archives\r\n' +
                '* LIST (\\HasChildren) "/" INBOX\r\n' +
                `${responseId} OK List completed (0.000 + 0.000 + 0.000 secs).\r\n`,
              { binary: isBinary }
            );
            break;

          case /CREATE/i.test(requestDataString):
            webSocket.send(`${responseId} OK Create completed (0.000 + 0.000 secs).\r\n`, {
              binary: isBinary
            });
            break;

          case /DELETE/i.test(requestDataString):
            webSocket.send(`${responseId} OK Delete completed (0.000 + 0.000 secs).\r\n`, {
              binary: isBinary
            });
            break;

          case /RENAME/i.test(requestDataString):
            webSocket.send(`${responseId} OK Rename completed (0.000 + 0.000 secs).\r\n`, {
              binary: isBinary
            });
            break;

          case /UID COPY/i.test(requestDataString):
            webSocket.send(
              `${responseId} OK [COPYUID 1740160118 241 1] Copy completed (0.000 + 0.000 + 0.000 secs).\r\n`,
              { binary: isBinary }
            );
            break;

          case /UID MOVE/i.test(requestDataString):
            webSocket.send(
              "* OK [COPYUID 1740160116 242 2] Moved UIDs.\r\n* 30 EXPUNGE\r\n" +
                `${responseId} OK Move completed (0.000 + 0.000 + 0.000 secs).\r\n`,
              { binary: isBinary }
            );
            break;

          case /UID STORE/i.test(requestDataString):
            webSocket.send(
              "* 28 FETCH (UID 240 FLAGS (\\Deleted \\Seen))\r\n" +
                `${responseId} OK Store completed (0.000 + 0.000 secs).\r\n`,
              { binary: isBinary }
            );
            break;

          case /UID EXPUNGE/i.test(requestDataString):
            webSocket.send(`${responseId} OK Expunge completed (0.000 + 0.000 + 0.000 secs).\r\n`, {
              binary: isBinary
            });
            break;

          case /UID FETCH RFC822/i.test(requestDataString):
            webSocket.send(
              `* 30 FETCH (UID 242 RFC822 {781}\r\n` +
                "Return-Path: <test@emailAddress.com>\r\n" +
                "X-Original-To: test@emailAddress.com\r\n" +
                "Delivered-To: test@emailAddress.com\r\n" +
                "Received: from 127.0.0.1 (unknown [127.0.0.1])\r\n" +
                "\tby 21a165c9994b (Postfix) with ESMTPA id B88804940034\r\n" +
                "\tfor <test@emailAddress.com>; Mon, 19 May 2025 15:49:44 +0000 (UTC)\r\n" +
                "Subject: (no subject)\r\n" +
                "To: test@emailAddress.com\r\n" +
                "Cc: \r\n" +
                "From: Test Display Name <test@emailAddress.com>\r\n" +
                "MIME-Version: 1.0\r\n" +
                "X-Mailer: Transit alpha0.0.1\r\n" +
                'Content-Type: multipart/alternative; boundary="transit--client--igvwe2o8w"\r\n' +
                "Message-Id: <20250519154944.B88804940034@21a165c9994b>\r\n" +
                "Date: Mon, 19 May 2025 15:49:44 +0000 (UTC)\r\n\r\n" +
                "--transit--client--igvwe2o8w\r\n" +
                'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
                "Test email\r\n\r\n" +
                "--transit--client--igvwe2o8w\r\n" +
                'Content-Type: text/html; charset="utf-8"\r\n\r\n' +
                "<p>Test email</p>\r\n\r\n" +
                "--transit--client--igvwe2o8w--\r\n\r\n)\r\n" +
                `${responseId} OK Fetch completed (0.000 + 0.000 secs).\r\n`,
              { binary: isBinary }
            );
            break;

          case /UID FETCH FLAGS/i.test(requestDataString):
            webSocket.send(
              `* 1 FETCH (UID 1 FLAGS (\\Seen) BODY[HEADER.FIELDS (DATE FROM SUBJECT)] {101}\r\n` +
                "Subject: Test Subject 01\r\n" +
                "From: Test Display Name <test@emailAddress.com>\r\n" +
                "Date: Mon, 01 Jan 2025 00:00:00 +0000 (UTC)\r\n\r\n " +
                'BODYSTRUCTURE (("text" "plain" ("charset" "utf-8") NIL NIL "7bit" 4 2 NIL NIL NIL NIL)' +
                '("text" "html" ("charset" "utf-8") NIL NIL "7bit" 13 1 NIL NIL NIL NIL) "alternative" ' +
                '("boundary" "transit--client--g1xgwltj") NIL NIL NIL))\r\n' +
                `* 2 FETCH (UID 2 FLAGS (\\Seen) BODY[HEADER.FIELDS (DATE FROM SUBJECT)] {102}\r\n` +
                "Subject: Test Subject 02\r\n" +
                "From: Test Display Name <test@emailAddress.com>\r\n" +
                "Date: Mon, 02 Jan 2025 00:00:00 +0000 (UTC)\r\n\r\n " +
                'BODYSTRUCTURE (("text" "plain" ("charset" "utf-8") NIL NIL "7bit" 4 2 NIL NIL NIL NIL)' +
                '("text" "html" ("charset" "utf-8") NIL NIL "7bit" 13 1 NIL NIL NIL NIL) "alternative" ' +
                '("boundary" "transit--client--6ohw29r5") NIL NIL NIL))\r\n' +
                `* 3 FETCH (UID 3 FLAGS (\\Seen) BODY[HEADER.FIELDS (DATE FROM SUBJECT)] {103}\r\n` +
                "Subject: Test Subject 03\r\n" +
                "From: Test Display Name <test@emailAddress.com>\r\n" +
                "Date: Mon, 03 Jan 2025 00:00:00 +0000 (UTC)\r\n\r\n " +
                'BODYSTRUCTURE (("text" "plain" ("charset" "utf-8") NIL NIL "7bit" 4 2 NIL NIL NIL NIL)' +
                '("text" "html" ("charset" "utf-8") NIL NIL "7bit" 13 1 NIL NIL NIL NIL) "alternative" ' +
                '("boundary" "transit--client--pklctuok") NIL NIL NIL))\r\n' +
                `${responseId} OK Fetch completed (0.000 + 0.000 secs).\r\n`,
              { binary: isBinary }
            );

            break;
        }
      };
    });

    it("LOGIN command", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("LOGIN");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          [
            "*",
            "OK",
            "[CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE LITERAL+ STARTTLS " +
              "AUTH=PLAIN AUTH=LOGIN] Dovecot (Debian) ready."
          ],
          [
            expect.stringMatching(/^[A-Za-z0-9]+$/),
            "OK",
            "[CAPABILITY IMAP4rev1 SASL-IR LOGIN-REFERRALS ID ENABLE IDLE SORT SORT=DISPLAY " +
              "THREAD=REFERENCES THREAD=REFS THREAD=ORDEREDSUBJECT MULTIAPPEND URL-PARTIAL " +
              "CATENATE UNSELECT CHILDREN NAMESPACE UIDPLUS LIST-EXTENDED I18NLEVEL=1 " +
              "CONDSTORE QRESYNC ESEARCH ESORT SEARCHRES WITHIN CONTEXT=SEARCH LIST-STATUS " +
              "BINARY MOVE SNIPPET=FUZZY PREVIEW=FUZZY PREVIEW STATUS=SIZE SAVEDATE LITERAL+ " +
              "NOTIFY SPECIAL-USE] Logged in"
          ]
        ],
        status: EImapResponseStatus.OK
      });
    });

    it("SELECT command", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("SELECT");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          ["*", "FLAGS", "(\\Answered \\Flagged \\Deleted \\Seen \\Draft)"],
          [
            "*",
            "OK",
            "[PERMANENTFLAGS (\\Answered \\Flagged \\Deleted \\Seen \\Draft \\*)] Flags permitted."
          ],
          ["*", "30", "EXISTS"],
          ["*", "0", "RECENT"],
          ["*", "OK", "[UIDVALIDITY 1740160111] UIDs valid"],
          ["*", "OK", "[UIDNEXT 243] Predicted next UID"],
          [
            expect.stringMatching(/^[A-Za-z0-9]+$/),
            "OK",
            "[READ-WRITE] Select completed (0.000 + 0.000 + 0.000 secs)."
          ]
        ],
        status: EImapResponseStatus.OK
      });
    });

    it("LIST command", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("LIST");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          ["*", "LIST", '(\\NoInferiors) "/" "Recycle Bin"'],
          ["*", "LIST", '(\\NoInferiors) "/" Spam'],
          ["*", "LIST", '(\\NoInferiors) "/" "Sent Items"'],
          ["*", "LIST", '(\\NoInferiors \\Drafts) "/" Drafts'],
          ["*", "LIST", '(\\NoInferiors \\UnMarked) "/" Archives'],
          ["*", "LIST", '(\\HasChildren) "/" INBOX'],
          [
            expect.stringMatching(/^[A-Za-z0-9]+$/),
            "OK",
            "List completed (0.000 + 0.000 + 0.000 secs)."
          ]
        ],
        status: EImapResponseStatus.OK
      });
    });

    it("CREATE command", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("CREATE");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          [expect.stringMatching(/^[A-Za-z0-9]+$/), "OK", "Create completed (0.000 + 0.000 secs)."]
        ],
        status: EImapResponseStatus.OK
      });
    });

    it("DELETE command", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("DELETE");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          [expect.stringMatching(/^[A-Za-z0-9]+$/), "OK", "Delete completed (0.000 + 0.000 secs)."]
        ],
        status: EImapResponseStatus.OK
      });
    });

    it("RENAME command", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("RENAME");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          [expect.stringMatching(/^[A-Za-z0-9]+$/), "OK", "Rename completed (0.000 + 0.000 secs)."]
        ],
        status: EImapResponseStatus.OK
      });
    });

    it("UID COPY command", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("UID COPY");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          [
            expect.stringMatching(/^[A-Za-z0-9]+$/),
            "OK",
            "[COPYUID 1740160118 241 1] Copy completed (0.000 + 0.000 + 0.000 secs)."
          ]
        ],
        status: EImapResponseStatus.OK
      });
    });

    it("UID MOVE command", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("UID MOVE");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          ["*", "OK", "[COPYUID 1740160116 242 2] Moved UIDs."],
          ["*", "30", "EXPUNGE"],
          [
            expect.stringMatching(/^[A-Za-z0-9]+$/),
            "OK",
            "Move completed (0.000 + 0.000 + 0.000 secs)."
          ]
        ],
        status: EImapResponseStatus.OK
      });
    });

    it("UID STORE command", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("UID STORE");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          ["*", "28", "FETCH (UID 240 FLAGS (\\Deleted \\Seen))"],
          [expect.stringMatching(/^[A-Za-z0-9]+$/), "OK", "Store completed (0.000 + 0.000 secs)."]
        ],
        status: EImapResponseStatus.OK
      });
    });

    it("UID EXPUNGE command", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("UID EXPUNGE");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          [
            expect.stringMatching(/^[A-Za-z0-9]+$/),
            "OK",
            "Expunge completed (0.000 + 0.000 + 0.000 secs)."
          ]
        ],
        status: EImapResponseStatus.OK
      });
    });

    it("UID FETCH RFC822 command", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("UID FETCH RFC822");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          ["*", "30", "FETCH (UID 242 RFC822 {781}"],
          [
            "Return-Path: <test@emailAddress.com>\r\n" +
              "X-Original-To: test@emailAddress.com\r\n" +
              "Delivered-To: test@emailAddress.com\r\n" +
              "Received: from 127.0.0.1 (unknown [127.0.0.1])\r\n" +
              "\tby 21a165c9994b (Postfix) with ESMTPA id B88804940034\r\n" +
              "\tfor <test@emailAddress.com>; Mon, 19 May 2025 15:49:44 +0000 (UTC)\r\n" +
              "Subject: (no subject)\r\n" +
              "To: test@emailAddress.com\r\n" +
              "Cc: \r\n" +
              "From: Test Display Name <test@emailAddress.com>\r\n" +
              "MIME-Version: 1.0\r\n" +
              "X-Mailer: Transit alpha0.0.1\r\n" +
              'Content-Type: multipart/alternative; boundary="transit--client--igvwe2o8w"\r\n' +
              "Message-Id: <20250519154944.B88804940034@21a165c9994b>\r\n" +
              "Date: Mon, 19 May 2025 15:49:44 +0000 (UTC)\r\n\r\n" +
              "--transit--client--igvwe2o8w\r\n" +
              'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
              "Test email\r\n\r\n" +
              "--transit--client--igvwe2o8w\r\n" +
              'Content-Type: text/html; charset="utf-8"\r\n\r\n' +
              "<p>Test email</p>\r\n\r\n" +
              "--transit--client--igvwe2o8w--\r\n\r\n"
          ],
          [expect.stringMatching(/^[A-Za-z0-9]+$/), "OK", "Fetch completed (0.000 + 0.000 secs)."]
        ],
        status: EImapResponseStatus.OK
      });
    });

    it("UID FETCH FLAGS command", async () => {
      const imapSocket = new ImapSocket(settings);

      await imapSocket.imapConnect();

      const imapRequestResponse = await imapSocket.imapRequest("UID FETCH FLAGS");

      imapSocket.imapClose();

      expect(imapRequestResponse).toEqual({
        data: [
          ["*", "1", "FETCH (UID 1 FLAGS (\\Seen) BODY[HEADER.FIELDS (DATE FROM SUBJECT)] {101}"],
          [
            "Subject: Test Subject 01\r\nFrom: Test Display Name <test@emailAddress.com>\r\n" +
              "Date: Mon, 01 Jan 2025 00:00:00 +0000 (UTC)\r\n\r\n " +
              'BODYSTRUCTURE (("text" "plain" ("charset" "utf-8") NIL NIL "7bit" 4 2 NIL NIL NIL NIL)' +
              '("text" "html" ("charset" "utf-8") NIL NIL "7bit" 13 1 NIL NIL NIL NIL) "alternative" ' +
              '("boundary" "transit--client--g1xgwltj") NIL NIL NIL))\r\n'
          ],

          ["*", "2", "FETCH (UID 2 FLAGS (\\Seen) BODY[HEADER.FIELDS (DATE FROM SUBJECT)] {102}"],
          [
            "Subject: Test Subject 02\r\nFrom: Test Display Name <test@emailAddress.com>\r\n" +
              "Date: Mon, 02 Jan 2025 00:00:00 +0000 (UTC)\r\n\r\n " +
              'BODYSTRUCTURE (("text" "plain" ("charset" "utf-8") NIL NIL "7bit" 4 2 NIL NIL NIL NIL)' +
              '("text" "html" ("charset" "utf-8") NIL NIL "7bit" 13 1 NIL NIL NIL NIL) "alternative" ' +
              '("boundary" "transit--client--6ohw29r5") NIL NIL NIL))\r\n'
          ],
          ["*", "3", "FETCH (UID 3 FLAGS (\\Seen) BODY[HEADER.FIELDS (DATE FROM SUBJECT)] {103}"],
          [
            "Subject: Test Subject 03\r\nFrom: Test Display Name <test@emailAddress.com>\r\n" +
              "Date: Mon, 03 Jan 2025 00:00:00 +0000 (UTC)\r\n\r\n " +
              'BODYSTRUCTURE (("text" "plain" ("charset" "utf-8") NIL NIL "7bit" 4 2 NIL NIL NIL NIL)' +
              '("text" "html" ("charset" "utf-8") NIL NIL "7bit" 13 1 NIL NIL NIL NIL) "alternative" ' +
              '("boundary" "transit--client--pklctuok") NIL NIL NIL))\r\n'
          ],
          [expect.stringMatching(/^[A-Za-z0-9]+$/), "OK", "Fetch completed (0.000 + 0.000 secs)."]
        ],
        status: EImapResponseStatus.OK
      });
    });
  });
});
