import { EmailComposer } from "classes";

const mockEmailData: any = {
  editorState: {
    getCurrentContent: () => jest.fn(),
  },
  from: "sender@testserver.com",
  subject: "Test Email",
  recipients: [
    {
      id: 1,
      type: "To",
      value: "receiver@testserver.com",
    },
  ],
  attachments: [],
};

const mockComposedEmail: any = {
  boundaryid: "wjbcgv9",
  subject: "Test Email",
  from: "sender@testserver.com",
  to: "receiver@testserver.com",
  contentText: "Test Body\r\n",
  contentHTML: "<p>Test Body</p>",
  attachmentsEncoded: "",
  payload:
    'Subject: Test Email\r\nTo: receiver@testserver.com\r\nCc: \r\nBcc: \r\nFrom: sender@testserver.com\r\nMIME-Version: 1.0\r\nX-Mailer: Transit alpha0.0.1\r\nContent-Type: multipart/alternative; boundary="transit--client--wjbcgv9"\r\n\r\n--transit--client--wjbcgv9\r\nContent-Type: text/plain; charset="utf-8"\r\n\r\nTest Body\r\n\r\n\r\n--transit--client--wjbcgv9\r\nContent-Type: text/html; charset="utf-8"\r\n\r\n<p>Test Body</p>\r\n\r\n--transit--client--wjbcgv9--',
};

const mockContentBlocks: any = {
  blocks: [
    {
      key: "4u96s",
      text: "Test Body",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "4pfol",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
};
  
jest.mock("draft-js", () => ({
  convertToRaw: () => {
    return mockContentBlocks;
  },
}));

jest.mock("draft-js-export-html", () => ({
  stateToHTML: () => {
    return "<p>Test Body</p>";
  },
}));

const emailParser = new EmailComposer();

describe("Testing the EmailCompose class", () => {
  test("As a standard email", () => {
    const emailParserResponse: any = emailParser.composeEmail(mockEmailData);

    expect(emailParserResponse).toEqual(mockComposedEmail);
  });
});
