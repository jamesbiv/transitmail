import { EmailComposer } from "classes";

jest.mock("contexts/DependenciesContext");

const mockEmailData: any = {
  editorState: {
    getCurrentContent: () => jest.fn()
  },
  from: "sender@transitmail.org",
  subject: "Test Email",
  recipients: [
    {
      id: 1,
      type: "To",
      value: "receiver@transitmail.org"
    },
    {
      id: 2,
      type: "Cc",
      value: "receivercc@transitmail.org"
    },
    {
      id: 3,
      type: "Cc",
      value: "receivercc1@transitmail.org"
    },
    {
      id: 4,
      type: "Bcc",
      value: "receiverbcc@transitmail.org"
    },
    {
      id: 5,
      type: "Bcc",
      value: "receiverbcc1@transitmail.org"
    }
  ],
  attachments: [
    {
      data: "",
      filename: "filename.jpg",
      id: 0,
      mimeType: "image/jpeg",
      size: 1
    }
  ]
};

const mockComposedEmail: any = {
  boundaryid: "wjbcgv9",
  //subject: "Test Email",
  from: "sender@transitmail.org",
  to: "receiver@transitmail.org",
  contentText: "Test Body\r\n",
  contentHTML: "<p>Test Body</p>",
  attachmentsEncoded: "",
  payload: `Subject: Test Email\r\n\
To: receiver@transitmail.org\r\n\
Cc: \r\n\
Bcc: \r\n\
From: sender@transitmail.org\r\n\
MIME-Version: 1.0\r\n\
X-Mailer: Transit alpha0.0.1\r\n\
Content-Type: multipart/alternative; boundary="transit--client--wjbcgv9"\r\n\r\n\
--transit--client--wjbcgv9\r\n\
Content-Type: text/plain; charset="utf-8"\r\n\r\n\
Test Body\r\n\r\n\
--transit--client--wjbcgv9\r\n\
Content-Type: text/html; charset="utf-8"\r\n\r\n\
<p>Test Body</p>\r\n\r\n\
--transit--client--wjbcgv9--`
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
      data: {}
    },
    {
      key: "4pfol",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {}
    }
  ]
};

jest.mock("draft-js", () => ({
  convertToRaw: () => {
    return mockContentBlocks;
  }
}));

jest.mock("draft-js-export-html", () => ({
  stateToHTML: () => {
    return "<p>Test Body</p>";
  }
}));

const emailParser = new EmailComposer();

describe("Testing the EmailCompose class", () => {
  test("As a standard email", () => {
    const emailParserResponse: any = emailParser.composeEmail(mockEmailData);

    expect(emailParserResponse).toMatchObject<{ contentHTML: string }>({
      contentHTML: "<p>Test Body</p>"
    });
  });
});
