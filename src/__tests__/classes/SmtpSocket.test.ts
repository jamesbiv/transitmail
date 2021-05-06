import { SmtpSocket } from "classes";

const mockItem: any = {};

const smtpSocket = new SmtpSocket();

describe("Testing the SmtpSocket class", () => {
  describe("Test ", () => {
    test("Test a successful connection", () => {
      smtpSocket.smtpConnect();
    });
  });
});
