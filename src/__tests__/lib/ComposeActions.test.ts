import { waitFor } from "@testing-library/react";
import { sleep } from "__tests__/fixtures";
import { ImapHelper, ImapSocket, SmtpSocket } from "classes";
import { IEmailData } from "classes/EmailComposer";
import {
  EComposePresetType,
  EImapResponseStatus,
  ESmtpResponseStatus,
  IComposePresets,
  IEmail,
  ISmtpResponse
} from "interfaces";
import { downloadEmail, sendEmail } from "lib";

const mockDirectAccessToDependencies = {
  imapHelper: new ImapHelper(),
  imapSocket: new ImapSocket(),
  smtpSocket: new SmtpSocket()
};

jest.mock("contexts/DependenciesContext", () => {
  return {
    directAccessToDependencies: () => mockDirectAccessToDependencies
  };
});

describe("Test ComposeActions", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Test downloadEmail() function", () => {
    it("a successful response", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        switch (true) {
          case /UID FETCH (.*) \(RFC822.SIZE FLAGS\)/i.test(request):
            return {
              data: [
                ["*", "1", "FETCH (UID 1 RFC822.SIZE 1 FLAGS (\\Seen))"],
                ["clbk0jks", "OK", "UID FETCH completed"]
              ],
              status: EImapResponseStatus.OK
            };

          case /UID FETCH (.*) RFC822/i.test(request):
            return {
              data: [
                ["*", "1971", "FETCH (UID 5968 RFC822 {885}"],
                ["Test email header\r\n\r\nTest email body\r\n\r\n" + "\r\n)\r\n"],
                ["q3ilhxgq", "OK", "UID FETCH completed"]
              ],
              status: EImapResponseStatus.OK
            };
        }
      });

      const composePresets: IComposePresets = { uid: 1, type: EComposePresetType.Reply };

      const downloadEmailResponse: IEmail | undefined = await downloadEmail(composePresets);

      expect(downloadEmailResponse).toEqual({
        emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
        headersRaw: "Test email header",
        contentRaw: "Test email body\r\n\r\n",
        headers: undefined,
        boundaries: [],
        bodyText: "Test email body\r\n\r\n"
      });
    });

    it("a successful response with progressBar", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        switch (true) {
          case /UID FETCH (.*) \(RFC822.SIZE FLAGS\)/i.test(request):
            return {
              data: [
                ["*", "1", "FETCH (UID 1 RFC822.SIZE 1 FLAGS (\\Seen))"],
                ["clbk0jks", "OK", "UID FETCH completed"]
              ],
              status: EImapResponseStatus.OK
            };

          case /UID FETCH (.*) RFC822/i.test(request):
            return {
              data: [
                ["*", "1971", "FETCH (UID 5968 RFC822 {885}"],
                ["Test email header\r\n\r\nTest email body\r\n\r\n" + "\r\n)\r\n"],
                ["q3ilhxgq", "OK", "UID FETCH completed"]
              ],
              status: EImapResponseStatus.OK
            };
        }
      });

      const getStreamAmountSpy: jest.SpyInstance = jest.spyOn(
        ImapSocket.prototype,
        "getStreamAmount"
      );

      getStreamAmountSpy.mockImplementation(() => 100);

      const setProgressBarNow = () => 100;

      const finalCallbackFn = jest.fn().mockImplementation(() => true);

      const composePresets: IComposePresets = { uid: 1, type: EComposePresetType.Reply };

      const downloadEmailResponse: IEmail | undefined = await downloadEmail(
        composePresets,
        setProgressBarNow,
        finalCallbackFn
      );

      await sleep(200);

      await waitFor(() => expect(finalCallbackFn).toHaveBeenCalled());

      expect(downloadEmailResponse).toEqual({
        emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
        headersRaw: "Test email header",
        contentRaw: "Test email body\r\n\r\n",
        headers: undefined,
        boundaries: [],
        bodyText: "Test email body\r\n\r\n"
      });
    });

    it("an unsuccessful response because UID FETCH FLAGS failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementationOnce((request: string) => {
        return { data: [["*"]], status: EImapResponseStatus.BAD };
      });

      const composePresets: IComposePresets = { uid: 1, type: EComposePresetType.Reply };

      const downloadEmailResponse: IEmail | undefined = await downloadEmail(composePresets);

      expect(downloadEmailResponse).toEqual(undefined);
    });

    it("an unsuccessful response because formatFetchEmailFlagsResponse() failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementationOnce((request: string) => {
        return { data: [["*"]], status: EImapResponseStatus.OK };
      });

      const composePresets: IComposePresets = { uid: 1, type: EComposePresetType.Reply };

      const downloadEmailResponse: IEmail | undefined = await downloadEmail(composePresets);

      expect(downloadEmailResponse).toEqual(undefined);
    });

    it("an unsuccessful response because UID FETCH failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        switch (true) {
          case /UID FETCH (.*) \(RFC822.SIZE FLAGS\)/i.test(request):
            return {
              data: [
                ["*", "1", "FETCH (UID 1 RFC822.SIZE 1 FLAGS (\\Seen))"],
                ["clbk0jks", "OK", "UID FETCH completed"]
              ],
              status: EImapResponseStatus.OK
            };

          case /UID FETCH (.*) RFC822/i.test(request):
            return {
              data: [["*"]],
              status: EImapResponseStatus.BAD
            };
        }
      });

      const composePresets: IComposePresets = { uid: 1, type: EComposePresetType.Reply };

      const downloadEmailResponse: IEmail | undefined = await downloadEmail(composePresets);

      expect(downloadEmailResponse).toEqual(undefined);
    });
  });

  describe("Test sendEmail() / sendEmailAction() function", () => {
    it("a successful response", async () => {
      const smtpRequestSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpRequest");

      smtpRequestSpy.mockImplementation((request: string) => {
        switch (true) {
          case /MAIL from: (.*)/i.test(request):
            return {
              data: [["250 2.1.5 Ok"]],
              status: ESmtpResponseStatus.Success
            };

          case /RCPT to: (.*)/i.test(request):
            return {
              data: [["354 End data with <CR><LF>.<CR><LF>"]],
              status: ESmtpResponseStatus.Success
            };

          case /DATA/i.test(request):
            return {
              data: [["250 2.1.5 Ok."]],
              status: ESmtpResponseStatus.Success
            };

          case /(.*)\r\n\r\n./i.test(request):
            return {
              data: [["250 2.0.0 Ok: queued as 431DA494434E"]],
              status: ESmtpResponseStatus.Success
            };

          case /QUIT/i.test(request):
            return {
              data: [["221 2.0.0 Bye"]],
              status: ESmtpResponseStatus.Success
            };
        }
      });

      const smtpConnectSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpConnect");
      smtpConnectSpy.mockImplementation(() => true);

      const smtpCloseSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpClose");
      smtpCloseSpy.mockImplementation(() => true);

      const emailData: IEmailData = {
        from: { displayName: "Test Display Name", email: "sender@transitmail.org" },
        subject: "Test Email",
        recipients: [{ id: 1, type: "To", value: "receiver@transitmail.org" }],
        body: "<p>Test Body</p>"
      };

      const sendEmailResponse: ISmtpResponse = await sendEmail(emailData);

      expect(sendEmailResponse).toEqual({
        data: [["221 2.0.0 Bye"]],
        status: ESmtpResponseStatus.Success
      });
    });

    it("an unsuccessful response because MAIL from: failed", async () => {
      const smtpRequestSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpRequest");

      smtpRequestSpy.mockImplementationOnce((request: string) => {
        return {
          data: [["555 MAIL FROM/RCPT TO parameters not recognized or not implemented"]],
          status: ESmtpResponseStatus.Failure
        };
      });

      const smtpConnectSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpConnect");
      smtpConnectSpy.mockImplementation(() => true);

      const smtpCloseSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpClose");
      smtpCloseSpy.mockImplementation(() => true);

      const emailData: IEmailData = {
        from: { displayName: "Test Display Name", email: "sender@transitmail.org" },
        subject: "Test Email",
        recipients: [{ id: 1, type: "To", value: "receiver@transitmail.org" }],
        body: "<p>Test Body</p>"
      };

      const sendEmailResponse: ISmtpResponse = await sendEmail(emailData);

      expect(sendEmailResponse).toEqual({
        data: [["555 MAIL FROM/RCPT TO parameters not recognized or not implemented"]],
        status: ESmtpResponseStatus.Failure
      });
    });
  });

  it("an unsuccessful response because RCPT to: failed", async () => {
    const smtpRequestSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpRequest");

    smtpRequestSpy.mockImplementation((request: string) => {
      switch (true) {
        case /MAIL from: (.*)/i.test(request):
          return {
            data: [["250 2.1.5 Ok"]],
            status: ESmtpResponseStatus.Success
          };

        case /RCPT to: (.*)/i.test(request):
          return {
            data: [["554 Transaction failed"]],
            status: ESmtpResponseStatus.Failure
          };
      }
    });

    const smtpConnectSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpConnect");
    smtpConnectSpy.mockImplementation(() => true);

    const smtpCloseSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpClose");
    smtpCloseSpy.mockImplementation(() => true);

    const emailData: IEmailData = {
      from: { displayName: "Test Display Name", email: "sender@transitmail.org" },
      subject: "Test Email",
      recipients: [{ id: 1, type: "To", value: "receiver@transitmail.org" }],
      body: "<p>Test Body</p>"
    };

    const sendEmailResponse: ISmtpResponse = await sendEmail(emailData);

    expect(sendEmailResponse).toEqual({
      data: [["554 Transaction failed"]],
      status: ESmtpResponseStatus.Failure
    });
  });

  it("an unsuccessful response because MAIL from: failed", async () => {
    const smtpRequestSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpRequest");

    smtpRequestSpy.mockImplementation((request: string) => {
      switch (true) {
        case /MAIL from: (.*)/i.test(request):
          return {
            data: [["250 2.1.5 Ok"]],
            status: ESmtpResponseStatus.Success
          };

        case /RCPT to: (.*)/i.test(request):
          return {
            data: [["354 End data with <CR><LF>.<CR><LF>"]],
            status: ESmtpResponseStatus.Success
          };

        case /DATA/i.test(request):
          return {
            data: [["554 Transaction failed"]],
            status: ESmtpResponseStatus.Failure
          };
      }
    });

    const smtpConnectSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpConnect");
    smtpConnectSpy.mockImplementation(() => true);

    const smtpCloseSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpClose");
    smtpCloseSpy.mockImplementation(() => true);

    const emailData: IEmailData = {
      from: { displayName: "Test Display Name", email: "sender@transitmail.org" },
      subject: "Test Email",
      recipients: [{ id: 1, type: "To", value: "receiver@transitmail.org" }],
      body: "<p>Test Body</p>"
    };

    const sendEmailResponse: ISmtpResponse = await sendEmail(emailData);

    expect(sendEmailResponse).toEqual({
      data: [["554 Transaction failed"]],
      status: ESmtpResponseStatus.Failure
    });
  });

  it("an unsuccessful response because MAIL from: failed", async () => {
    const smtpRequestSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpRequest");

    smtpRequestSpy.mockImplementation((request: string) => {
      switch (true) {
        case /MAIL from: (.*)/i.test(request):
          return {
            data: [["250 2.1.5 Ok"]],
            status: ESmtpResponseStatus.Success
          };

        case /RCPT to: (.*)/i.test(request):
          return {
            data: [["354 End data with <CR><LF>.<CR><LF>"]],
            status: ESmtpResponseStatus.Success
          };

        case /DATA/i.test(request):
          return {
            data: [["250 2.1.5 Ok."]],
            status: ESmtpResponseStatus.Success
          };

        case /(.*)\r\n\r\n./i.test(request):
          return {
            data: [["554 Transaction failed"]],
            status: ESmtpResponseStatus.Failure
          };
      }
    });

    const smtpConnectSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpConnect");
    smtpConnectSpy.mockImplementation(() => true);

    const smtpCloseSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpClose");
    smtpCloseSpy.mockImplementation(() => true);

    const emailData: IEmailData = {
      from: { displayName: "Test Display Name", email: "sender@transitmail.org" },
      subject: "Test Email",
      recipients: [{ id: 1, type: "To", value: "receiver@transitmail.org" }],
      body: "<p>Test Body</p>"
    };

    const sendEmailResponse: ISmtpResponse = await sendEmail(emailData);

    expect(sendEmailResponse).toEqual({
      data: [["554 Transaction failed"]],
      status: ESmtpResponseStatus.Failure
    });
  });

  it("an unsuccessful response because MAIL from: failed", async () => {
    const smtpRequestSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpRequest");

    smtpRequestSpy.mockImplementation((request: string) => {
      switch (true) {
        case /MAIL from: (.*)/i.test(request):
          return {
            data: [["250 2.1.5 Ok"]],
            status: ESmtpResponseStatus.Success
          };

        case /RCPT to: (.*)/i.test(request):
          return {
            data: [["354 End data with <CR><LF>.<CR><LF>"]],
            status: ESmtpResponseStatus.Success
          };

        case /DATA/i.test(request):
          return {
            data: [["250 2.1.5 Ok."]],
            status: ESmtpResponseStatus.Success
          };

        case /(.*)\r\n\r\n./i.test(request):
          return {
            data: [["250 2.0.0 Ok: queued as 431DA494434E"]],
            status: ESmtpResponseStatus.Success
          };

        case /QUIT/i.test(request):
          return {
            data: [["554 Transaction failed"]],
            status: ESmtpResponseStatus.Failure
          };
      }
    });

    const smtpConnectSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpConnect");
    smtpConnectSpy.mockImplementation(() => true);

    const smtpCloseSpy: jest.SpyInstance = jest.spyOn(SmtpSocket.prototype, "smtpClose");
    smtpCloseSpy.mockImplementation(() => true);

    const emailData: IEmailData = {
      from: { displayName: "Test Display Name", email: "sender@transitmail.org" },
      subject: "Test Email",
      recipients: [{ id: 1, type: "To", value: "receiver@transitmail.org" }],
      body: "<p>Test Body</p>"
    };

    const sendEmailResponse: ISmtpResponse = await sendEmail(emailData);

    expect(sendEmailResponse).toEqual({
      data: [["554 Transaction failed"]],
      status: ESmtpResponseStatus.Failure
    });
  });
});
