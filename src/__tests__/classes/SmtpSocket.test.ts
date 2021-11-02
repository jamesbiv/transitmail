import { SmtpSocket } from "classes";

jest.mock("contexts/DependenciesContext");

const mockItem: any = {};

const smtpSocket = new SmtpSocket({
  host: "test-host",
});

describe("Testing the SmtpSocket class", () => {
  describe("Test ", () => {
    test("Test a successful connection", () => {
      smtpSocket.smtpConnect();
    });
  });
});
