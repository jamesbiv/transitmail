import { EmailComposer } from "classes";
import { IEmailData } from "classes/EmailComposer";
import { IComposedEmail } from "interfaces";

jest.mock("contexts/DependenciesContext");

describe("Testing EmailCompose class", () => {
  it("test as a standard email", () => {
    const emailData: IEmailData = {
      from: { displayName: "Test Display Name", email: "sender@transitmail.org" },
      subject: "Test Email",
      recipients: [{ id: 1, type: "To", value: "receiver@transitmail.org" }],
      body: "<p>Test Body</p>"
    };

    const emailParser = new EmailComposer();

    const emailParserResponse: IComposedEmail = emailParser.composeEmail(emailData);

    expect(emailParserResponse).toMatchObject({
      subject: "Test Email",
      from: "Test Display Name <sender@transitmail.org>",
      to: "receiver@transitmail.org",
      contentText: "",
      contentHTML: "<p>Test Body</p>"
    });
  });

  it("test as an email without a subject", () => {
    const emailData: IEmailData = {
      from: { displayName: "Test Display Name", email: "sender@transitmail.org" },
      recipients: [{ id: 1, type: "To", value: "receiver@transitmail.org" }],
      body: "<p>Test Body</p>"
    };

    const emailParser = new EmailComposer();

    const emailParserResponse: IComposedEmail = emailParser.composeEmail(emailData);

    expect(emailParserResponse).toMatchObject({
      subject: undefined,
      from: "Test Display Name <sender@transitmail.org>",
      to: "receiver@transitmail.org",
      contentText: "",
      contentHTML: "<p>Test Body</p>"
    });
  });

  it("test an email with cc and bcc", () => {
    const emailData: IEmailData = {
      from: { displayName: "Test Display Name", email: "sender@transitmail.org" },
      subject: "Test Email",
      recipients: [
        { id: 1, type: "To", value: "receiver@transitmail.org" },
        { id: 2, type: "Cc", value: "receiverCc@transitmail.org" },
        { id: 3, type: "Cc", value: "receiverCc1@transitmail.org" },
        { id: 4, type: "Bcc", value: "receiverBcc@transitmail.org" },
        { id: 5, type: "Bcc", value: "receiverBcc1@transitmail.org" },
        { id: 5, type: "Bcc", value: undefined }
      ],
      body: "<p>Test Body</p>"
    };

    const emailParser = new EmailComposer();

    const emailParserResponse: IComposedEmail = emailParser.composeEmail(emailData);

    expect(emailParserResponse).toMatchObject({
      subject: "Test Email",
      from: "Test Display Name <sender@transitmail.org>",
      to: "receiver@transitmail.org",
      cc: "receiverCc@transitmail.org, receiverCc1@transitmail.org",
      bcc: "receiverBcc@transitmail.org, receiverBcc1@transitmail.org",
      contentText: "",
      contentHTML: "<p>Test Body</p>"
    });
  });

  it("test an email with attachments", () => {
    const emailData: IEmailData = {
      from: { displayName: "Test Display Name", email: "sender@transitmail.org" },
      subject: "Test Email",
      recipients: [{ id: 1, type: "To", value: "receiver@transitmail.org" }],
      body: "<p>Test Body</p>",
      attachments: [{ data: "", filename: "filename.jpg", id: 0, mimeType: "image/jpeg", size: 1 }]
    };

    const emailParser = new EmailComposer();

    const emailParserResponse: IComposedEmail = emailParser.composeEmail(emailData);

    expect(emailParserResponse).toMatchObject({
      subject: "Test Email",
      from: "Test Display Name <sender@transitmail.org>",
      to: "receiver@transitmail.org",
      contentText: "",
      contentHTML: "<p>Test Body</p>"
    });
  });
});
