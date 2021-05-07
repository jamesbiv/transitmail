import { ImapHelper } from "classes";

const imapHelper = new ImapHelper();

describe("Testing the ImapHelper class", () => {
  describe("Test formatFetchEmailFlagsResponse", () => {
    const mockFetchData: any = [
      ["*", "1", "FETCH (UID 1 RFC822.SIZE 100000 FLAGS (\\Seen))"],
      ["clbk0jks", "OK", "UID FETCH completed"],
    ];

    const mockFormatFetchEmailFlagsResponse: any = {
      deleted: false,
      flags: "\\Seen",
      seen: true,
      size: 100000,
    };

    test("Test populated string", () => {
      const formatFetchEmailFlagsResponse: any = imapHelper.formatFetchEmailFlagsResponse(
        mockFetchData
      );

      expect(formatFetchEmailFlagsResponse).toEqual(
        mockFormatFetchEmailFlagsResponse
      );
    });
  });

  describe("Test formatFetchEmailResponse", () => {
    const mockFetchData: any = [
      ["*", "1971", "FETCH (UID 5968 RFC822 {885}"],
      [
        "Return-Path: sender@transitmail.org\r\n" +
          "Date: Sun, 04 Apr 2021 21:13:16 -0300\r\n" +
          "To: receiever@transitmail.org\r\n" +
          "CC: \r\n" +
          "Subject: (no subject)\r\n" +
          "Message-ID: <606A561C-00001750@mailserver01.transitmail.org\r\n" +
          'From: "james" <sender@transitmail.org>\r\n' +
          "Received: from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1])\r\n" +
          "\tby mailserver01.transitmail.org; Sun, 04 Apr 2021 21:13:16 -0300\r\n" +
          "Bcc: \r\n" +
          "MIME-Version: 1.0\r\n" +
          "X-Mailer: Transit alpha0.0.1\r\n" +
          'Content-Type: multipart/alternative; boundary="transit--client--zieazjy"\r\n' +
          "\r\n" +
          "\r\n" +
          "--transit--client--zieazjy\r\n" +
          'Content-Type: text/plain; charset="utf-8"\r\n' +
          "\r\n" +
          "Test Body\r\n" +
          "\r\n" +
          "\r\n" +
          "--transit--client--zieazjy\r\n" +
          'Content-Type: text/html; charset="utf-8"\r\n' +
          "\r\n" +
          "<p>Test Body</p>\r\n" +
          "\r\n" +
          "--transit--client--zieazjy--\r\n" +
          "\r\n" +
          "\r\n)\r\n",
      ],
      ["q3ilhxgq", "OK", "UID FETCH completed"],
    ];

    const mockFormatFetchEmailResponse: any = {
      emailRaw:
        "Return-Path: sender@transitmail.org\r\n" +
        "Date: Sun, 04 Apr 2021 21:13:16 -0300\r\n" +
        "To: receiever@transitmail.org\r\n" +
        "CC: \r\n" +
        "Subject: (no subject)\r\n" +
        "Message-ID: <606A561C-00001750@mailserver01.transitmail.org\r\n" +
        'From: "james" <sender@transitmail.org>\r\n' +
        "Received: from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1])\r\n" +
        "\tby mailserver01.transitmail.org; Sun, 04 Apr 2021 21:13:16 -0300\r\n" +
        "Bcc: \r\n" +
        "MIME-Version: 1.0\r\n" +
        "X-Mailer: Transit alpha0.0.1\r\n" +
        'Content-Type: multipart/alternative; boundary="transit--client--zieazjy"\r\n' +
        "\r\n" +
        "\r\n" +
        "--transit--client--zieazjy\r\n" +
        'Content-Type: text/plain; charset="utf-8"\r\n' +
        "\r\n" +
        "Test Body\r\n" +
        "\r\n" +
        "\r\n" +
        "--transit--client--zieazjy\r\n" +
        'Content-Type: text/html; charset="utf-8"\r\n' +
        "\r\n" +
        "<p>Test Body</p>\r\n" +
        "\r\n" +
        "--transit--client--zieazjy--\r\n" +
        "\r\n",
      headersRaw:
        "Return-Path: sender@transitmail.org\r\n" +
        "Date: Sun, 04 Apr 2021 21:13:16 -0300\r\n" +
        "To: receiever@transitmail.org\r\n" +
        "CC: \r\n" +
        "Subject: (no subject)\r\n" +
        "Message-ID: <606A561C-00001750@mailserver01.transitmail.org\r\n" +
        'From: "james" <sender@transitmail.org>\r\n' +
        "Received: from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1])\r\n" +
        "\tby mailserver01.transitmail.org; Sun, 04 Apr 2021 21:13:16 -0300\r\n" +
        "Bcc: \r\n" +
        "MIME-Version: 1.0\r\n" +
        "X-Mailer: Transit alpha0.0.1\r\n" +
        'Content-Type: multipart/alternative; boundary="transit--client--zieazjy"',
      contentRaw:
        "\r\n" +
        "--transit--client--zieazjy\r\n" +
        'Content-Type: text/plain; charset="utf-8"\r\n' +
        "\r\n" +
        "Test Body\r\n" +
        "\r\n" +
        "\r\n" +
        "--transit--client--zieazjy\r\n" +
        'Content-Type: text/html; charset="utf-8"\r\n' +
        "\r\n" +
        "<p>Test Body</p>\r\n" +
        "\r\n" +
        "--transit--client--zieazjy--\r\n" +
        "\r",
      headers: {
        "return-path": "sender@transitmail.org",
        date: "Sun, 04 Apr 2021 21:13:16 -0300",
        to: "receiever@transitmail.org",
        cc: "",
        subject: "(no subject)",
        "message-id": "<606A561C-00001750@mailserver01.transitmail.org",
        from: '"james" <sender@transitmail.org>',
        received:
          "from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1]) by mailserver01.transitmail.org; Sun, 04 Apr 2021 21:13:16 -0300",
        bcc: "",
        "mime-version": "1.0",
        "x-mailer": "Transit alpha0.0.1",
        "content-type":
          'multipart/alternative; boundary="transit--client--zieazjy"',
      },
      date: "Sun, 04 Apr 2021 21:13:16 -0300",
      to: "receiever@transitmail.org",
      cc: "",
      subject: "(no subject)",
      from: '"james" <sender@transitmail.org>',
      mimeType: "multipart/alternative",
      charset: undefined,
      boundaryIds: ["transit--client--zieazjy"],
      boundaries: [
        {
          contents: [
            {
              contentRaw:
                'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
                "Test Body\r\n\r\n\r\n",
              headers: {
                "content-type": 'text/plain; charset="utf-8"',
                content: "Test Body\r\n\r\n\r\n\r\n",
              },
              content: "Test Body\r\n\r\n\r\n\r\n",
              mimeType: "text/plain",
              charset: "utf-8",
            },
            {
              contentRaw:
                'Content-Type: text/html; charset="utf-8"\r\n\r\n' +
                "<p>Test Body</p>\r\n\r\n",
              headers: {
                "content-type": 'text/html; charset="utf-8"',
                content: "<p>Test Body</p>\r\n\r\n\r\n",
              },
              content: "<p>Test Body</p>\r\n\r\n\r\n",
              mimeType: "text/html",
              charset: "utf-8",
            },
          ],
        },
      ],
      bodyText: "Test Body\r\n\r\n\r\n\r\n",
      bodyTextHeaders: {
        "content-type": 'text/plain; charset="utf-8"',
        content: "Test Body\r\n\r\n\r\n\r\n",
      },
      bodyHtml: "<p>Test Body</p>\n\n\n",
      bodyHtmlHeaders: {
        "content-type": 'text/html; charset="utf-8"',
        content: "<p>Test Body</p>\r\n\r\n\r\n",
      },
    };

    test("Test populated string", () => {
      const formatFetchEmailResponse: any = imapHelper.formatFetchEmailResponse(
        mockFetchData
      );

      expect(formatFetchEmailResponse).toEqual(mockFormatFetchEmailResponse);
    });
  });

  describe("Test formatFetchFolderEmailsResponse", () => {
    const mockFolderData: any = [
      [
        "*",
        "1",
        "FETCH (UID 1 FLAGS (\\Seen) BODY[HEADER.FIELDS (DATE FROM SUBJECT)] {1}",
      ],
      [
        "Date: Fri, 24 Jul 2020 00:00:00 -0300\r\n" +
          "Subject: Test Subject\r\n" +
          'From: "Test Sender" <sender@transitmail.org>\r\n' +
          "\r\n" +
          ' BODYSTRUCTURE ("text" "plain" ("CHARSET" "utf-8") NIL NIL "7BIT" 337 11 NIL NIL NIL))\r\n',
      ],
      ["3d290h4", "OK", "UID FETCH completed"],
    ];

    const mockFormatFetchFolderEmailsResponse: any = [
      {
        id: 1,
        date: "Fri, 24 Jul 2020 00:00:00 -0300",
        epoch: 1595559600000,
        from: '"Test Sender" <sender@transitmail.org>',
        subject: "Test Subject",
        uid: 1,
        ref: "1",
        flags: "\\Seen",
        hasAttachment: false,
        selected: false,
      },
    ];

    test("Test populated string", () => {
      const formatFetchFolderEmailsResponse: any = imapHelper.formatFetchFolderEmailsResponse(
        mockFolderData
      );

      expect(formatFetchFolderEmailsResponse).toEqual(
        mockFormatFetchFolderEmailsResponse
      );
    });
  });

  describe("Test formatListFoldersResponse", () => {
    const mockFolderData: any = [
      ["*", "LIST", '(\\NoSelect \\HasChildren) "/" ""'],
      ["*", "LIST", '() "/" "INBOX"'],
      ["*", "LIST", '() "/" "INBOX/subfolder"'],
      ["g7xyu52", "OK", "LIST completed"],
    ];

    const mockFormatListFoldersResponse: any = [
      {
        folders: [
          {
            id: 2,
            name: "subfolder",
            ref: "subfolder",
          },
        ],
        id: 1,
        name: "INBOX",
        ref: "INBOX",
      },
    ];

    test("Test populated string", () => {
      const formatListFoldersResponse: any = imapHelper.formatListFoldersResponse(
        mockFolderData
      );

      expect(formatListFoldersResponse).toEqual(mockFormatListFoldersResponse);
    });
  });
});
