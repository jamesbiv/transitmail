/* eslint-disable no-useless-escape */
import { EmailParser } from "classes";

const mockEmailRaw: any = `Return-Path: sender@transitmail.org\r\n\
Date: Thu, 01 Apr 2021 00:00:00 -0300\r\n\
To: receiver@transitmail.org\r\n\
Cc: \r\n\
Subject: (no subject)\r\n\
Message-ID: <60663F2A-000016D7@mailserver01.transitmail.org>\r\n\
From: "Test Sender" <sender@transitmail.org>\r\n\
Received: from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1])\r\n\
	by mailserver01.transitmail.org; Thu, 01 Apr 2021 00:00:00 -0300\r\n\
Bcc: \r\n\
MIME-Version: 1.0\r\n\
X-Mailer: Transit alpha0.0.1\r\n\
Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n\r\n\
--transit--client--6ohw29r5\r\n\
Content-Type: text/plain; charset="utf-8"\r\n\r\n\
Test Body\r\n\r\n\
--transit--client--6ohw29r5\r\n\
Content-Type: text/html; charset="utf-8"\r\n\r\n\
<p>Test Body</p>\r\n\r\n\
--transit--client--6ohw29r5-\r\n\r\n`;

const mockProcessEmailResponse: any = {
  emailRaw:
    "Return-Path: sender@transitmail.org\r\n" +
    "Date: Thu, 01 Apr 2021 00:00:00 -0300\r\n" +
    "To: receiver@transitmail.org\r\n" +
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
    cc: "",
    subject: "(no subject)",
    "message-id": "<60663F2A-000016D7@mailserver01.transitmail.org>",
    from: '"Test Sender" <sender@transitmail.org>',
    received:
      "from mail.transitmail.org (mailserver01.transitmail.org [127.0.0.1]) by mailserver01.transitmail.org; Thu, 01 Apr 2021 00:00:00 -0300",
    bcc: "",
    "mime-version": "1.0",
    "x-mailer": "Transit alpha0.0.1",
    "content-type":
      'multipart/alternative; boundary="transit--client--6ohw29r5"',
  },
  date: "Thu, 01 Apr 2021 00:00:00 -0300",
  to: "receiver@transitmail.org",
  cc: "",
  subject: "(no subject)",
  from: '"Test Sender" <sender@transitmail.org>',
  mimeType: "multipart/alternative",
  charset: undefined,
  boundaryIds: ["transit--client--6ohw29r5"],
  boundaries: [
    {
      contents: [
        {
          contentRaw:
            'Content-Type: text/plain; charset="utf-8"\r\n\r\nTest Body\r\n\r\n',
          headers: {
            "content-type": 'text/plain; charset="utf-8"',
            content: "Test Body\r\n\r\n\r\n",
          },
          content: "Test Body\r\n\r\n\r\n",
          mimeType: "text/plain",
          charset: "utf-8",
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
            content:
              "<p>Test Body</p>\r\n\r\n--transit--client--6ohw29r5-\r\n\r\n\r\n",
          },
          content:
            "<p>Test Body</p>\r\n\r\n--transit--client--6ohw29r5-\r\n\r\n\r\n",
          mimeType: "text/html",
          charset: "utf-8",
        },
      ],
    },
  ],
  bodyText: "Test Body\r\n\r\n\r\n",
  bodyTextHeaders: {
    "content-type": 'text/plain; charset="utf-8"',
    content: "Test Body\r\n\r\n\r\n",
  },
  bodyHtml: "<p>Test Body</p>\n\n--transit--client--6ohw29r5-\n\n\n",
  bodyHtmlHeaders: {
    "content-type": 'text/html; charset="utf-8"',
    content: "<p>Test Body</p>\r\n\r\n--transit--client--6ohw29r5-\r\n\r\n\r\n",
  },
};

const emailParser = new EmailParser();

describe("Testing the EmailParser class", () => {
  test("Test processEmail", () => {
    const processEmailResponse: any = emailParser.processEmail(mockEmailRaw);
    
    expect(processEmailResponse).toEqual(mockProcessEmailResponse);
  });
});
