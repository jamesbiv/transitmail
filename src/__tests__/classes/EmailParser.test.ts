import { EmailParser } from "classes";
import { IEmail } from "interfaces";

jest.mock("contexts/DependenciesContext");

const emailParser = new EmailParser();

describe("Testing the EmailParser class", () => {
  it("Test getEmail", () => {
    const getEmailResponse: IEmail = emailParser.getEmail();

    expect(getEmailResponse).toEqual({
      contentRaw: "",
      emailRaw: "",
      headersRaw: ""
    });
  });

  describe("Test processEmail", () => {
    it("process an email which contains content boundaries", () => {
      const emailRaw: string =
        "Return-Path: sender@transitmail.org\r\n" +
        "Date: Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
        "To: receiver@transitmail.org\r\n" +
        "Reply-to: receiver@transitmail.org\r\n" +
        "Cc: \r\n" +
        "Subject: (no subject)\r\n" +
        "Message-ID: <60663F2A-000016D7@mailserver01.transitmail.org>\r\n" +
        'From: "Test Sender" <sender@transitmail.org>\r\n' +
        "Received: from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1])\r\n" +
        "	by mailserver01.transitmail.org; Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
        "Bcc: \r\n" +
        "MIME-Version: 1.0\r\n" +
        "X-Mailer: Transit alpha0.0.1\r\n" +
        'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n\r\n' +
        "--transit--client--6ohw29r5\r\n" +
        'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
        "Test Body\r\n\r\n" +
        "--transit--client--6ohw29r5\r\n" +
        'Content-Type: text/html; charset="utf-8"\r\n\r\n' +
        "<p>Test Body</p>\r\n\r\n" +
        "--transit--client--6ohw29r5-\r\n\r\n";

      const email: IEmail = {
        emailRaw:
          "Return-Path: sender@transitmail.org\r\n" +
          "Date: Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
          "To: receiver@transitmail.org\r\n" +
          "Reply-to: receiver@transitmail.org\r\n" +
          "Cc: \r\n" +
          "Subject: (no subject)\r\n" +
          "Message-ID: <60663F2A-000016D7@mailserver01.transitmail.org>\r\n" +
          'From: "Test Sender" <sender@transitmail.org>\r\n' +
          "Received: from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1])\r\n" +
          "\tby mailserver01.transitmail.org; Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
          "Bcc: \r\n" +
          "MIME-Version: 1.0\r\n" +
          "X-Mailer: Transit alpha0.0.1\r\n" +
          'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n' +
          "\r\n" +
          "--transit--client--6ohw29r5\r\n" +
          'Content-Type: text/plain; charset="utf-8"\r\n' +
          "\r\n" +
          "Test Body\r\n" +
          "\r\n" +
          "--transit--client--6ohw29r5\r\n" +
          'Content-Type: text/html; charset="utf-8"\r\n' +
          "\r\n" +
          "<p>Test Body</p>\r\n" +
          "\r\n" +
          "--transit--client--6ohw29r5-\r\n" +
          "\r\n",
        headersRaw:
          "Return-Path: sender@transitmail.org\r\n" +
          "Date: Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
          "To: receiver@transitmail.org\r\n" +
          "Reply-to: receiver@transitmail.org\r\n" +
          "Cc: \r\n" +
          "Subject: (no subject)\r\n" +
          "Message-ID: <60663F2A-000016D7@mailserver01.transitmail.org>\r\n" +
          'From: "Test Sender" <sender@transitmail.org>\r\n' +
          "Received: from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1])\r\n" +
          "\tby mailserver01.transitmail.org; Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
          "Bcc: \r\n" +
          "MIME-Version: 1.0\r\n" +
          "X-Mailer: Transit alpha0.0.1\r\n" +
          'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"',
        contentRaw:
          "--transit--client--6ohw29r5\r\n" +
          'Content-Type: text/plain; charset="utf-8"\r\n' +
          "\r\n" +
          "Test Body\r\n" +
          "\r\n" +
          "--transit--client--6ohw29r5\r\n" +
          'Content-Type: text/html; charset="utf-8"\r\n' +
          "\r\n" +
          "<p>Test Body</p>\r\n" +
          "\r\n" +
          "--transit--client--6ohw29r5-\r\n" +
          "\r",
        headers: {
          "return-path": "sender@transitmail.org",
          date: "Thu, 01 Apr 2021 00:00:00 -0300",
          to: "receiver@transitmail.org",
          "reply-to": "receiver@transitmail.org",
          cc: "",
          subject: "(no subject)",
          "message-id": "<60663F2A-000016D7@mailserver01.transitmail.org>",
          from: '"Test Sender" <sender@transitmail.org>',
          received:
            "from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1])" +
            " by mailserver01.transitmail.org; Thu, 01 Apr 2021 00:00:00 -0300",
          bcc: "",
          "mime-version": "1.0",
          "x-mailer": "Transit alpha0.0.1",
          "content-type": 'multipart/alternative; boundary="transit--client--6ohw29r5"'
        },
        date: "Thu, 01 Apr 2021 00:00:00 -0300",
        to: "receiver@transitmail.org",
        cc: "",
        subject: "(no subject)",
        from: '"Test Sender" <sender@transitmail.org>',
        mimeType: "multipart/alternative",
        replyTo: "receiver@transitmail.org",
        charset: undefined,
        boundaryIds: ["transit--client--6ohw29r5"],
        boundaries: [
          {
            contents: [
              {
                contentRaw: 'Content-Type: text/plain; charset="utf-8"\r\n\r\nTest Body\r\n\r\n',
                headers: {
                  "content-type": 'text/plain; charset="utf-8"',
                  content: "Test Body\r\n\r\n\r\n"
                },
                content: "Test Body\r\n\r\n\r\n",
                mimeType: "text/plain",
                charset: "utf-8"
              },
              {
                contentRaw:
                  'Content-Type: text/html; charset="utf-8"\r\n' +
                  "\r\n" +
                  "<p>Test Body</p>\r\n" +
                  "\r\n" +
                  "--transit--client--6ohw29r5-\r\n" +
                  "\r\n",
                headers: {
                  "content-type": 'text/html; charset="utf-8"',
                  content: "<p>Test Body</p>\r\n\r\n--transit--client--6ohw29r5-\r\n\r\n\r\n"
                },
                content: "<p>Test Body</p>\r\n\r\n--transit--client--6ohw29r5-\r\n\r\n\r\n",
                mimeType: "text/html",
                charset: "utf-8"
              }
            ]
          }
        ],
        bodyText: "Test Body\r\n\r\n\r\n",
        bodyTextHeaders: {
          "content-type": 'text/plain; charset="utf-8"',
          content: "Test Body\r\n\r\n\r\n"
        },
        bodyHtml: "<p>Test Body</p>\n\n--transit--client--6ohw29r5-\n\n\n",
        bodyHtmlHeaders: {
          "content-type": 'text/html; charset="utf-8"',
          content: "<p>Test Body</p>\r\n\r\n--transit--client--6ohw29r5-\r\n\r\n\r\n"
        }
      };

      const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

      expect(processEmailResponse).toEqual(email);
    });

    it("process an email which doesn't contain content boundaries", () => {
      const emailRaw: string =
        "Return-Path: sender@transitmail.org\r\n" +
        "Date: Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
        "To: receiver@transitmail.org\r\n" +
        "Reply-to: receiver@transitmail.org\r\n" +
        "Cc: \r\n" +
        "Subject: (no subject)\r\n" +
        "Message-ID: <60663F2A-000016D7@mailserver01.transitmail.org>\r\n" +
        'From: "Test Sender" <sender@transitmail.org>\r\n' +
        "Received: from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1])\r\n" +
        "	by mailserver01.transitmail.org; Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
        "Bcc: \r\n" +
        "MIME-Version: 1.0\r\n" +
        "X-Mailer: Transit alpha0.0.1\r\n" +
        'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
        "Test Body\r\n\r\n";

      const email: IEmail = {
        emailRaw:
          "Return-Path: sender@transitmail.org\r\n" +
          "Date: Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
          "To: receiver@transitmail.org\r\n" +
          "Reply-to: receiver@transitmail.org\r\n" +
          "Cc: \r\n" +
          "Subject: (no subject)\r\n" +
          "Message-ID: <60663F2A-000016D7@mailserver01.transitmail.org>\r\n" +
          'From: "Test Sender" <sender@transitmail.org>\r\n' +
          "Received: from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1])\r\n" +
          "\tby mailserver01.transitmail.org; Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
          "Bcc: \r\n" +
          "MIME-Version: 1.0\r\n" +
          "X-Mailer: Transit alpha0.0.1\r\n" +
          'Content-Type: text/plain; charset="utf-8"\r\n' +
          "\r\n" +
          "Test Body\r\n" +
          "\r\n",
        headersRaw:
          "Return-Path: sender@transitmail.org\r\n" +
          "Date: Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
          "To: receiver@transitmail.org\r\n" +
          "Reply-to: receiver@transitmail.org\r\n" +
          "Cc: \r\n" +
          "Subject: (no subject)\r\n" +
          "Message-ID: <60663F2A-000016D7@mailserver01.transitmail.org>\r\n" +
          'From: "Test Sender" <sender@transitmail.org>\r\n' +
          "Received: from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1])\r\n" +
          "\tby mailserver01.transitmail.org; Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
          "Bcc: \r\n" +
          "MIME-Version: 1.0\r\n" +
          "X-Mailer: Transit alpha0.0.1\r\n" +
          'Content-Type: text/plain; charset="utf-8"',
        contentRaw: "Test Body\r\n\r",
        headers: {
          "return-path": "sender@transitmail.org",
          date: "Thu, 01 Apr 2021 00:00:00 -0300",
          to: "receiver@transitmail.org",
          "reply-to": "receiver@transitmail.org",
          cc: "",
          subject: "(no subject)",
          "message-id": "<60663F2A-000016D7@mailserver01.transitmail.org>",
          from: '"Test Sender" <sender@transitmail.org>',
          received:
            "from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1])" +
            " by mailserver01.transitmail.org; Thu, 01 Apr 2021 00:00:00 -0300",
          bcc: "",
          "mime-version": "1.0",
          "x-mailer": "Transit alpha0.0.1",
          "content-type": 'text/plain; charset="utf-8"'
        },
        date: "Thu, 01 Apr 2021 00:00:00 -0300",
        to: "receiver@transitmail.org",
        replyTo: "receiver@transitmail.org",
        cc: "",
        subject: "(no subject)",
        from: '"Test Sender" <sender@transitmail.org>',
        mimeType: "text/plain",
        charset: "utf-8",
        boundaries: [],
        bodyText: "Test Body\r\n\r"
      };

      const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);
      expect(processEmailResponse).toEqual(email);
    });

    it("process an email with base64 encoded attchment", () => {
      const emailRaw: string =
        "Return-Path: <sender@transitmail.org>\r\n" +
        "X-Original-To: james@localhost\r\n" +
        "Delivered-To: james@localhost\r\n" +
        "Received: from localhost (unknown [127.0.0.1])\r\n" +
        "	by 21a165c9994b (Postfix) with ESMTPA id 02E0549442D9\r\n" +
        "	for <james@localhost>; Tue,  1 Apr 2025 20:11:49 +0000 (UTC)\r\n" +
        "Subject: (no subject)\r\n" +
        "To: james@localhost\r\n" +
        "Cc:\r\n" +
        'From: "James Biviano" <james@localhost>\r\n' +
        "MIME-Version: 1.0\r\n" +
        "X-Mailer: Transit alpha0.0.1\r\n" +
        'Content-Type: multipart/alternative; boundary="transit--client--9cbr3k0r"\r\n' +
        "Message-Id: <20250401201149.02E0549442D9@21a165c9994b>\r\n" +
        "Date: Tue,  1 Apr 2025 20:11:49 +0000 (UTC)\r\n\r\n" +
        "--transit--client--9cbr3k0r\r\n" +
        'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
        "--transit--client--9cbr3k0r\r\n" +
        'Content-Type: text/html; charset="utf-8"r\n\r\n' +
        "<p><br></p>\r\n\r\n" +
        "--transit--client--9cbr3k0r\r\n" +
        'Content-Type: text/plain; name="testFile.txt"\r\n' +
        'Content-Disposition: attachment; filename="testFile.txt"\r\n' +
        "Content-Transfer-Encoding: base64\r\n\r\n" +
        "MQo=\r\n\r\n" +
        "--transit--client--9cbr3k0r--\r\n\r\n";

      const email: IEmail = {
        emailRaw:
          "Return-Path: <sender@transitmail.org>\r\n" +
          "X-Original-To: james@localhost\r\n" +
          "Delivered-To: james@localhost\r\n" +
          "Received: from localhost (unknown [127.0.0.1])\r\n" +
          "\tby 21a165c9994b (Postfix) with ESMTPA id 02E0549442D9\r\n" +
          "\tfor <james@localhost>; Tue,  1 Apr 2025 20:11:49 +0000 (UTC)\r\n" +
          "Subject: (no subject)\r\n" +
          "To: james@localhost\r\n" +
          "Cc:\r\n" +
          'From: "James Biviano" <james@localhost>\r\n' +
          "MIME-Version: 1.0\r\n" +
          "X-Mailer: Transit alpha0.0.1\r\n" +
          'Content-Type: multipart/alternative; boundary="transit--client--9cbr3k0r"\r\n' +
          "Message-Id: <20250401201149.02E0549442D9@21a165c9994b>\r\n" +
          "Date: Tue,  1 Apr 2025 20:11:49 +0000 (UTC)\r\n" +
          "\r\n" +
          "--transit--client--9cbr3k0r\r\n" +
          'Content-Type: text/plain; charset="utf-8"\r\n' +
          "\r\n" +
          "--transit--client--9cbr3k0r\r\n" +
          'Content-Type: text/html; charset="utf-8"r\n' +
          "\r\n" +
          "<p><br></p>\r\n" +
          "\r\n" +
          "--transit--client--9cbr3k0r\r\n" +
          'Content-Type: text/plain; name="testFile.txt"\r\n' +
          'Content-Disposition: attachment; filename="testFile.txt"\r\n' +
          "Content-Transfer-Encoding: base64\r\n" +
          "\r\n" +
          "MQo=\r\n" +
          "\r\n" +
          "--transit--client--9cbr3k0r--\r\n" +
          "\r\n",
        headersRaw:
          "Return-Path: <sender@transitmail.org>\r\n" +
          "X-Original-To: james@localhost\r\n" +
          "Delivered-To: james@localhost\r\n" +
          "Received: from localhost (unknown [127.0.0.1])\r\n" +
          "\tby 21a165c9994b (Postfix) with ESMTPA id 02E0549442D9\r\n" +
          "\tfor <james@localhost>; Tue,  1 Apr 2025 20:11:49 +0000 (UTC)\r\n" +
          "Subject: (no subject)\r\n" +
          "To: james@localhost\r\n" +
          "Cc:\r\n" +
          'From: "James Biviano" <james@localhost>\r\n' +
          "MIME-Version: 1.0\r\n" +
          "X-Mailer: Transit alpha0.0.1\r\n" +
          'Content-Type: multipart/alternative; boundary="transit--client--9cbr3k0r"\r\n' +
          "Message-Id: <20250401201149.02E0549442D9@21a165c9994b>\r\n" +
          "Date: Tue,  1 Apr 2025 20:11:49 +0000 (UTC)",
        contentRaw:
          "--transit--client--9cbr3k0r\r\n" +
          'Content-Type: text/plain; charset="utf-8"\r\n' +
          "\r\n" +
          "--transit--client--9cbr3k0r\r\n" +
          'Content-Type: text/html; charset="utf-8"r\n' +
          "\r\n" +
          "<p><br></p>\r\n" +
          "\r\n" +
          "--transit--client--9cbr3k0r\r\n" +
          'Content-Type: text/plain; name="testFile.txt"\r\n' +
          'Content-Disposition: attachment; filename="testFile.txt"\r\n' +
          "Content-Transfer-Encoding: base64\r\n" +
          "\r\n" +
          "MQo=\r\n" +
          "\r\n" +
          "--transit--client--9cbr3k0r--\r\n" +
          "\r",
        headers: {
          "return-path": "<sender@transitmail.org>",
          "x-original-to": "james@localhost",
          "delivered-to": "james@localhost",
          received:
            "from localhost (unknown [127.0.0.1]) by 21a165c9994b (Postfix) with ESMTPA id 02E0549442D9for <james@localhost>; Tue,  1 Apr 2025 20:11:49 +0000 (UTC)",
          subject: "(no subject)",
          to: "james@localhost",
          cc: "",
          from: '"James Biviano" <james@localhost>',
          "mime-version": "1.0",
          "x-mailer": "Transit alpha0.0.1",
          "content-type": 'multipart/alternative; boundary="transit--client--9cbr3k0r"',
          "message-id": "<20250401201149.02E0549442D9@21a165c9994b>",
          date: "Tue,  1 Apr 2025 20:11:49 +0000 (UTC)"
        },
        subject: "(no subject)",
        to: "james@localhost",
        cc: "",
        from: '"James Biviano" <james@localhost>',
        mimeType: "multipart/alternative",
        charset: undefined,
        boundaryIds: ["transit--client--9cbr3k0r"],
        date: "Tue,  1 Apr 2025 20:11:49 +0000 (UTC)",
        boundaries: [
          {
            contents: [
              {
                contentRaw: 'Content-Type: text/plain; charset="utf-8"\r\n\r\n',
                headers: {
                  "content-type": 'text/plain; charset="utf-8"',
                  content: "\r\n"
                },
                content: "\r\n",
                mimeType: "text/plain",
                charset: "utf-8"
              },
              {
                contentRaw: 'Content-Type: text/html; charset="utf-8"r\r\n<p><br></p>\r\n\r\n',
                headers: {
                  "content-type": 'text/html; charset="utf-8"r',
                  content: "\r\n\r\n"
                },
                content: "\r\n\r\n",
                mimeType: "text/html",
                charset: "utf-8r"
              },
              {
                contentRaw:
                  'Content-Type: text/plain; name="testFile.txt"\r\n' +
                  'Content-Disposition: attachment; filename="testFile.txt"\r\n' +
                  "Content-Transfer-Encoding: base64\r\n" +
                  "\r\n" +
                  "MQo=\r\n" +
                  "\r\n",
                headers: {
                  "content-type": 'text/plain; name="testFile.txt"',
                  "content-disposition": 'attachment; filename="testFile.txt"',
                  "content-transfer-encoding": "base64",
                  content: "MQo=\r\n\r\n\r\n"
                },
                content: "MQo=\r\n\r\n\r\n",
                mimeType: "text/plain",
                isAttachment: true,
                filename: "testFile.txt",
                encoding: "base64"
              }
            ]
          }
        ],
        bodyText: "\r\n1\n",
        bodyTextHeaders: {
          "content-type": 'text/plain; name="testFile.txt"',
          "content-disposition": 'attachment; filename="testFile.txt"',
          "content-transfer-encoding": "base64",
          content: "MQo=\r\n\r\n\r\n"
        },
        bodyHtml: "\n\n",
        bodyHtmlHeaders: {
          "content-type": 'text/html; charset="utf-8"r',
          content: "\r\n\r\n"
        },
        attachments: [
          {
            contentRaw:
              'Content-Type: text/plain; name="testFile.txt"\r\n' +
              'Content-Disposition: attachment; filename="testFile.txt"\r\n' +
              "Content-Transfer-Encoding: base64\r\n" +
              "\r\n" +
              "MQo=\r\n" +
              "\r\n",
            headers: {
              "content-type": 'text/plain; name="testFile.txt"',
              "content-disposition": 'attachment; filename="testFile.txt"',
              "content-transfer-encoding": "base64",
              content: "MQo=\r\n\r\n\r\n"
            },
            content: "MQo=\r\n\r\n\r\n",
            mimeType: "text/plain",
            isAttachment: true,
            filename: "testFile.txt",
            encoding: "base64"
          }
        ]
      };

      const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

      expect(processEmailResponse).toEqual(email);
    });
  });
});
