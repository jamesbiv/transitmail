import { ImapSocket } from "classes";

jest.mock("contexts/DependenciesContext");

const imapSocket = new ImapSocket({
  host: "test-host"
});

describe("Testing the ImapSocket class", () => {
  describe("Test imapConnect", () => {
    it("Test a successful connection", () => {
      imapSocket.imapConnect();
    });
  });

  describe("Test imapRequest", () => {
    it("Test a successful request", () => {});
  });

  describe("Test imapProcessRequest", () => {
    it("Test a successful request", () => {});
  });

  describe("Test imapResponseHandler", () => {
    it("Test a successful response", () => {});
  });

  describe("Test imapAuthorise", () => {
    it("Test a successful authorisation", () => {});
  });
});
