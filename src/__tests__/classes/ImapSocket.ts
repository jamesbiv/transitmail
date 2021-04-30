import { ImapSocket } from "classes";

const mockEmailRaw: any = {};

const imapSocket = new ImapSocket({
  host: "test-host",
});

describe("Testing the ImapSocket class", () => {
  describe("Test imapConnect", () => {
    test("Test a successful connection", () => {
      imapSocket.imapConnect();
    });
  });

  describe("Test imapRequest", () => {
    test("Test a successful request", () => {});
  });

  describe("Test imapProcessRequest", () => {
    test("Test a successful request", () => {});
  });

  describe("Test imapResponseHandler", () => {
    test("Test a successful response", () => {});
  });

  describe("Test imapAuthorise", () => {
    test("Test a successful authorisation", () => {});
  });
});
