import { EmailParser } from "classes";
import { IEmail } from "interfaces";

jest.mock("contexts/DependenciesContext");

describe("Testing the EmailParser class", () => {
  it("Test getEmail", () => {
    const emailParser = new EmailParser();

    const getEmailResponse: IEmail = emailParser.getEmail();

    expect(getEmailResponse).toEqual({ contentRaw: "", emailRaw: "", headersRaw: "" });
  });

  describe("Test processEmail", () => {
    describe("testing splitHeaders() method", () => {
      it("with an empty header", () => {
        const emailRaw: string = "\r\n" + " \r\n" + "\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: "\r\n \r\n\r\n",
          headersRaw: "\r\n ",
          contentRaw: "",
          headers: {},
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a single header", () => {
        const emailRaw: string = "Test-Header: test header\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: "Test-Header: test header\r\n\r\n",
          headersRaw: "Test-Header: test header",
          contentRaw: "",
          headers: { "test-header": "test header" },
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a single header on multi line", () => {
        const emailRaw: string = "Test-Header: test header\r\n" + " multi line header\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: "Test-Header: test header\r\n multi line header\r\n\r\n",
          headersRaw: "Test-Header: test header\r\n multi line header",
          contentRaw: "",
          headers: { "test-header": "test header multi line header" },
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a single header on multi line with header length exceeded", () => {
        const emailRaw: string =
          "Test-Header: test header test header test header test header test " +
          "header test header test hea\r\n" +
          " der test header test header test header test header test header\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw:
            "Test-Header: test header test header test header test header " +
            "test header test header test hea\r\n" +
            " der test header test header test header test header test header\r\n" +
            "\r\n",
          headersRaw:
            "Test-Header: test header test header test header test header " +
            "test header test header test hea\r\n" +
            " der test header test header test header test header test header",
          contentRaw: "",
          headers: {
            "test-header":
              "test header test header test header test header test header " +
              "test header test header test header test header test header " +
              "test header test header"
          },
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a duplicate header", () => {
        const emailRaw: string =
          "Test-Header: original header\r\n" + "Test-Header: duplicate header\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: "Test-Header: original header\r\nTest-Header: duplicate header\r\n\r\n",
          headersRaw: "Test-Header: original header\r\nTest-Header: duplicate header",
          contentRaw: "",
          headers: { "test-header": "original header duplicate header" },
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a duplicate header on multi line", () => {
        const emailRaw: string =
          "Test-Header: original header\r\n" +
          "Test-Header: duplicate header\r\n" +
          " multi line header\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw:
            "Test-Header: original header\r\n" +
            "Test-Header: duplicate header\r\n" +
            " multi line header\r\n" +
            "\r\n",
          headersRaw:
            "Test-Header: original header\r\n" +
            "Test-Header: duplicate header\r\n" +
            " multi line header",
          contentRaw: "",
          headers: {
            "test-header": "original header duplicate header multi line header"
          },
          boundaries: [],
          bodyText: ""
        });
      });
    });

    describe("testing extractDetailsFromHeaders() method", () => {
      it("with a Date header", () => {
        const emailRaw: string = "Date: Thu, 01 Apr 2021 00:00:00 -0300\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: "Date: Thu, 01 Apr 2021 00:00:00 -0300\r\n\r\n",
          headersRaw: "Date: Thu, 01 Apr 2021 00:00:00 -0300",
          contentRaw: "",
          headers: { date: "Thu, 01 Apr 2021 00:00:00 -0300" },
          date: "Thu, 01 Apr 2021 00:00:00 -0300",
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a To header", () => {
        const emailRaw: string = "To: Test Display Name <test@emailAddress.com>\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: "To: Test Display Name <test@emailAddress.com>\r\n\r\n",
          headersRaw: "To: Test Display Name <test@emailAddress.com>",
          contentRaw: "",
          headers: { to: "Test Display Name <test@emailAddress.com>" },
          to: "Test Display Name <test@emailAddress.com>",
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a CC header", () => {
        const emailRaw: string =
          "Cc: Test Display Name <test@emailAddress.com>, test@emailAddress.com\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: "Cc: Test Display Name <test@emailAddress.com>, test@emailAddress.com\r\n\r\n",
          headersRaw: "Cc: Test Display Name <test@emailAddress.com>, test@emailAddress.com",
          contentRaw: "",
          headers: {
            cc: "Test Display Name <test@emailAddress.com>, test@emailAddress.com"
          },
          cc: "Test Display Name <test@emailAddress.com>, test@emailAddress.com",
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a BCC header", () => {
        const emailRaw: string =
          "Bcc: Test Display Name <test@emailAddress.com>, test@emailAddress.com\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: "Bcc: Test Display Name <test@emailAddress.com>, test@emailAddress.com\r\n\r\n",
          headersRaw: "Bcc: Test Display Name <test@emailAddress.com>, test@emailAddress.com",
          contentRaw: "",
          headers: {
            bcc: "Test Display Name <test@emailAddress.com>, test@emailAddress.com"
          },
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a From header", () => {
        const emailRaw: string = "From: Test Display Name <test@emailAddress.com>\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: "From: Test Display Name <test@emailAddress.com>\r\n\r\n",
          headersRaw: "From: Test Display Name <test@emailAddress.com>",
          contentRaw: "",
          headers: { from: "Test Display Name <test@emailAddress.com>" },
          from: "Test Display Name <test@emailAddress.com>",
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a Reply-to header", () => {
        const emailRaw: string = "Reply-to: Test Display Name <test@emailAddress.com>\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: "Reply-to: Test Display Name <test@emailAddress.com>\r\n\r\n",
          headersRaw: "Reply-to: Test Display Name <test@emailAddress.com>",
          contentRaw: "",
          headers: { "reply-to": "Test Display Name <test@emailAddress.com>" },
          replyTo: "Test Display Name <test@emailAddress.com>",
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a Subject header", () => {
        const emailRaw: string = "Subject: Test Subject\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: "Subject: Test Subject\r\n\r\n",
          headersRaw: "Subject: Test Subject",
          contentRaw: "",
          headers: { subject: "Test Subject" },
          subject: "Test Subject",
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a Content-transfer-encoding header", () => {
        const emailRaw: string = "Content-Transfer-Encoding: quoted-printable\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: "Content-Transfer-Encoding: quoted-printable\r\n\r\n",
          headersRaw: "Content-Transfer-Encoding: quoted-printable",
          contentRaw: "",
          headers: { "content-transfer-encoding": "quoted-printable" },
          encoding: "quoted-printable",
          boundaries: [],
          bodyText: ""
        });
      });

      it("with a Content-type header", () => {
        const emailRaw: string = 'Content-Type: text/html; charset="utf-8"\r\n\r\n';

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw: 'Content-Type: text/html; charset="utf-8"\r\n\r\n',
          headersRaw: 'Content-Type: text/html; charset="utf-8"',
          contentRaw: "",
          headers: { "content-type": 'text/html; charset="utf-8"' },
          mimeType: "text/html",
          charset: "utf-8",
          boundaries: [],
          bodyHtml: ""
        });
      });

      it("with a Content-type header with boundaryId", () => {
        const emailRaw: string =
          'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n\r\n';

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw:
            'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n' +
            "\r\n",
          headersRaw: 'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"',
          contentRaw: "",
          headers: {
            "content-type": 'multipart/alternative; boundary="transit--client--6ohw29r5"'
          },
          mimeType: "multipart/alternative",
          charset: undefined,
          boundaryIds: ["transit--client--6ohw29r5"],
          boundaries: [],
          bodyText: ""
        });
      });
    });

    describe("testing extractContentFromBody() method", () => {
      it("with Content-Type as text/html", () => {
        const emailRaw: string =
          'Content-Type: text/html; charset="utf-8"\r\n\r\n' + "<p>Test email content</p>\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw:
            'Content-Type: text/html; charset="utf-8"\r\n\r\n<p>Test email content</p>\r\n\r\n',
          headersRaw: 'Content-Type: text/html; charset="utf-8"',
          contentRaw: "<p>Test email content</p>\r\n\r\n",
          headers: { "content-type": 'text/html; charset="utf-8"' },
          mimeType: "text/html",
          charset: "utf-8",
          boundaries: [],
          bodyHtml: "<p>Test email content</p>\n\n"
        });
      });

      it("with Content-Type as text/html encoded as quoted-printable", () => {
        const emailRaw: string =
          'Content-Type: text/html; charset="utf-8"\r\n' +
          "Content-Transfer-Encoding: quoted-printable\r\n\r\n" +
          "<p>Test email content</p>\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw:
            'Content-Type: text/html; charset="utf-8"\r\n' +
            "Content-Transfer-Encoding: quoted-printable\r\n" +
            "\r\n" +
            "<p>Test email content</p>\r\n" +
            "\r\n",
          headersRaw:
            'Content-Type: text/html; charset="utf-8"\r\n' +
            "Content-Transfer-Encoding: quoted-printable",
          contentRaw: "<p>Test email content</p>\r\n\r\n",
          headers: {
            "content-type": 'text/html; charset="utf-8"',
            "content-transfer-encoding": "quoted-printable"
          },
          mimeType: "text/html",
          charset: "utf-8",
          encoding: "quoted-printable",
          boundaries: [],
          bodyHtml: "<p>Test email content</p>\n\n"
        });
      });

      it("with Content-Type as text/html encoded as base64", () => {
        const emailRaw: string =
          'Content-Type: text/html; charset="utf-8"\r\n' +
          "Content-Transfer-Encoding: base64\r\n\r\n" +
          "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw:
            'Content-Type: text/html; charset="utf-8"\r\n' +
            "Content-Transfer-Encoding: base64\r\n" +
            "\r\n" +
            "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n" +
            "\r\n",
          headersRaw:
            'Content-Type: text/html; charset="utf-8"\r\n' + "Content-Transfer-Encoding: base64",
          contentRaw: "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n\r\n",
          headers: {
            "content-type": 'text/html; charset="utf-8"',
            "content-transfer-encoding": "base64"
          },
          mimeType: "text/html",
          charset: "utf-8",
          encoding: "base64",
          boundaries: [],
          bodyHtml: "<p>Test email content</p>"
        });
      });

      it("with Content-Type as text/plain", () => {
        const emailRaw: string =
          'Content-Type: text/plain; charset="utf-8"\r\n\r\n' + "<p>Test email content</p>\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw:
            'Content-Type: text/plain; charset="utf-8"\r\n\r\n<p>Test email content</p>\r\n\r\n',
          headersRaw: 'Content-Type: text/plain; charset="utf-8"',
          contentRaw: "<p>Test email content</p>\r\n\r\n",
          headers: { "content-type": 'text/plain; charset="utf-8"' },
          mimeType: "text/plain",
          charset: "utf-8",
          boundaries: [],
          bodyText: "<p>Test email content</p>\r\n\r\n"
        });
      });

      it("with Content-Type as text/plain encoded as quoted-printable", () => {
        const emailRaw: string =
          'Content-Type: text/plain; charset="utf-8"\r\n' +
          "Content-Transfer-Encoding: quoted-printable\r\n\r\n" +
          "<p>Test email content</p>\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw:
            'Content-Type: text/plain; charset="utf-8"\r\n' +
            "Content-Transfer-Encoding: quoted-printable\r\n" +
            "\r\n" +
            "<p>Test email content</p>\r\n" +
            "\r\n",
          headersRaw:
            'Content-Type: text/plain; charset="utf-8"\r\n' +
            "Content-Transfer-Encoding: quoted-printable",
          contentRaw: "<p>Test email content</p>\r\n\r\n",
          headers: {
            "content-type": 'text/plain; charset="utf-8"',
            "content-transfer-encoding": "quoted-printable"
          },
          mimeType: "text/plain",
          charset: "utf-8",
          encoding: "quoted-printable",
          boundaries: [],
          bodyText: "<p>Test email content</p>\r\n\r\n"
        });
      });

      it("with Content-Type as text/plain encoded as base64", () => {
        const emailRaw: string =
          'Content-Type: text/plain; charset="utf-8"\r\n' +
          "Content-Transfer-Encoding: base64\r\n\r\n" +
          "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw:
            'Content-Type: text/plain; charset="utf-8"\r\n' +
            "Content-Transfer-Encoding: base64\r\n" +
            "\r\n" +
            "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n" +
            "\r\n",
          headersRaw:
            'Content-Type: text/plain; charset="utf-8"\r\n' + "Content-Transfer-Encoding: base64",
          contentRaw: "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n\r\n",
          headers: {
            "content-type": 'text/plain; charset="utf-8"',
            "content-transfer-encoding": "base64"
          },
          mimeType: "text/plain",
          charset: "utf-8",
          encoding: "base64",
          boundaries: [],
          bodyText: "<p>Test email content</p>"
        });
      });
    });

    describe("testing extractContentFromBoundaries() method", () => {
      it("with boundary as an attachment", () => {
        const emailRaw: string =
          'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n\r\n' +
          "--transit--client--6ohw29r5\r\n" +
          'Content-Type: text/plain; name="testFile.txt"\r\n' +
          'Content-Disposition: attachment; filename="testFile.txt"\r\n' +
          "Content-Transfer-Encoding: base64\r\n\r\n" +
          "MQo=\r\n\r\n" +
          "--transit--client--6ohw29r5--\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse.boundaryIds).toEqual(["transit--client--6ohw29r5"]);
        expect(processEmailResponse.boundaries).toEqual([
          {
            contents: [
              {
                contentRaw:
                  'Content-Type: text/plain; name="testFile.txt"\r\n' +
                  'Content-Disposition: attachment; filename="testFile.txt"\r\n' +
                  "Content-Transfer-Encoding: base64\r\n\r\n" +
                  "MQo=\r\n\r\n",
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
        ]);
        expect(processEmailResponse.attachments).toEqual([
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
        ]);
      });

      it("with boundary includes a sub boundary", () => {
        const emailRaw: string =
          'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n\r\n' +
          "--transit--client--6ohw29r5\r\n" +
          'Content-Type: multipart/alternative; boundary="transit--client--pklctuok"\r\n\r\n' +
          "--transit--client--pklctuok\r\n" +
          'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
          "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n" +
          "--transit--client--pklctuok--\r\n" +
          "--transit--client--6ohw29r5--\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        /**
         * @note may need to ensure boundaryId is a part of the object
         * and boundaryIds array may need the subBoundaryId
         */
        expect(processEmailResponse.boundaryIds).toEqual(["transit--client--6ohw29r5"]);
        expect(processEmailResponse.boundaries).toEqual([
          {
            contents: [
              {
                contentRaw:
                  'Content-Type: multipart/alternative; boundary="transit--client--pklctuok"\r\n\r\n' +
                  "--transit--client--pklctuok\r\n" +
                  'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
                  "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n" +
                  "--transit--client--pklctuok--\r\n",
                headers: {
                  "content-type": 'multipart/alternative; boundary="transit--client--pklctuok"',
                  content:
                    "--transit--client--pklctuok\r\n" +
                    'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
                    "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n" +
                    "--transit--client--pklctuok--\r\n\r\n"
                },
                content:
                  "--transit--client--pklctuok\r\n" +
                  'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
                  "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n" +
                  "--transit--client--pklctuok--\r\n\r\n",
                mimeType: "multipart/alternative",
                subBoundaryId: "transit--client--pklctuok"
              }
            ]
          },
          {
            contents: [
              {
                contentRaw:
                  'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
                  "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n",
                headers: {
                  "content-type": 'text/plain; charset="utf-8"',
                  content: "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n\r\n"
                },
                content: "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n\r\n",
                mimeType: "text/plain",
                charset: "utf-8"
              }
            ]
          }
        ]);
      });

      it("with Content-Type as text/html and text/plain", () => {
        const emailRaw: string =
          'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n\r\n' +
          "--transit--client--6ohw29r5\r\n" +
          'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
          "Test email content\r\n\r\n" +
          "--transit--client--6ohw29r5\r\n" +
          'Content-Type: text/html; charset="utf-8"\r\n\r\n' +
          "<p>Test email content</p>\r\n\r\n" +
          "--transit--client--6ohw29r5--\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse.boundaryIds).toEqual(["transit--client--6ohw29r5"]);
        expect(processEmailResponse.boundaries).toEqual([
          {
            contents: [
              {
                contentRaw:
                  'Content-Type: text/plain; charset="utf-8"\r\n\r\nTest email content\r\n\r\n',
                headers: {
                  "content-type": 'text/plain; charset="utf-8"',
                  content: "Test email content\r\n\r\n\r\n"
                },
                content: "Test email content\r\n\r\n\r\n",
                mimeType: "text/plain",
                charset: "utf-8"
              },
              {
                contentRaw:
                  'Content-Type: text/html; charset="utf-8"\r\n\r\n' +
                  "<p>Test email content</p>\r\n\r\n",
                headers: {
                  "content-type": 'text/html; charset="utf-8"',
                  content: "<p>Test email content</p>\r\n\r\n\r\n"
                },
                content: "<p>Test email content</p>\r\n\r\n\r\n",
                mimeType: "text/html",
                charset: "utf-8"
              }
            ]
          }
        ]);
      });

      it("with Content-Type as text/html and text/plain encoded as quoted-printable", () => {
        const emailRaw: string =
          'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n\r\n' +
          "--transit--client--6ohw29r5\r\n" +
          "Content-Transfer-Encoding: quoted-printable\r\n" +
          'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
          "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n" +
          "--transit--client--6ohw29r5\r\n" +
          "Content-Transfer-Encoding: quoted-printable\r\n" +
          'Content-Type: text/html; charset="utf-8"\r\n\r\n' +
          "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n\r\n" +
          "--transit--client--6ohw29r5--\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse.boundaryIds).toEqual(["transit--client--6ohw29r5"]);
        expect(processEmailResponse.boundaries).toEqual([
          {
            contents: [
              {
                contentRaw:
                  "Content-Transfer-Encoding: quoted-printable\r\n" +
                  'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
                  "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n",
                headers: {
                  "content-transfer-encoding": "quoted-printable",
                  "content-type": 'text/plain; charset="utf-8"',
                  content: "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n\r\n"
                },
                content: "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n\r\n",
                mimeType: "text/plain",
                encoding: "quoted-printable",
                charset: "utf-8"
              },
              {
                contentRaw:
                  "Content-Transfer-Encoding: quoted-printable\r\n" +
                  'Content-Type: text/html; charset="utf-8"\r\n\r\n' +
                  "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n\r\n",
                headers: {
                  "content-transfer-encoding": "quoted-printable",
                  "content-type": 'text/html; charset="utf-8"',
                  content: "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n\r\n\r\n"
                },
                content: "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n\r\n\r\n",
                mimeType: "text/html",
                encoding: "quoted-printable",
                charset: "utf-8"
              }
            ]
          }
        ]);
      });

      it("with Content-Type as text/html and text/plain encoded as base64", () => {
        const emailRaw: string =
          'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n\r\n' +
          "--transit--client--6ohw29r5\r\n" +
          "Content-Transfer-Encoding: base64\r\n" +
          'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
          "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n" +
          "--transit--client--6ohw29r5\r\n" +
          "Content-Transfer-Encoding: base64\r\n" +
          'Content-Type: text/html; charset="utf-8"\r\n\r\n' +
          "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n\r\n" +
          "--transit--client--6ohw29r5--\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse.boundaryIds).toEqual(["transit--client--6ohw29r5"]);
        expect(processEmailResponse.boundaries).toEqual([
          {
            contents: [
              {
                contentRaw:
                  "Content-Transfer-Encoding: base64\r\n" +
                  'Content-Type: text/plain; charset="utf-8"\r\n\r\n' +
                  "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n",
                headers: {
                  "content-transfer-encoding": "base64",
                  "content-type": 'text/plain; charset="utf-8"',
                  content: "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n\r\n"
                },
                content: "VGVzdCBlbWFpbCBjb250ZW50\r\n\r\n\r\n",
                mimeType: "text/plain",
                encoding: "base64",
                charset: "utf-8"
              },
              {
                contentRaw:
                  "Content-Transfer-Encoding: base64\r\n" +
                  'Content-Type: text/html; charset="utf-8"\r\n\r\n' +
                  "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n\r\n",
                headers: {
                  "content-transfer-encoding": "base64",
                  "content-type": 'text/html; charset="utf-8"',
                  content: "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n\r\n\r\n"
                },
                content: "PHA+VGVzdCBlbWFpbCBjb250ZW50PC9wPg==\r\n\r\n\r\n",
                mimeType: "text/html",
                encoding: "base64",
                charset: "utf-8"
              }
            ]
          }
        ]);
      });
    });

    describe("testing sanitiseRawBoundry() method", () => {
      it("a content boundary Content-type without a charset", () => {
        const emailRaw: string =
          'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n\r\n' +
          "--transit--client--6ohw29r5\r\n" +
          "Content-Type: text/html;\r\n\r\n" +
          "<p>Test email content</p>\r\n\r\n" +
          "--transit--client--6ohw29r5--\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse.boundaryIds).toEqual(["transit--client--6ohw29r5"]);
        expect(processEmailResponse.boundaries).toEqual([
          {
            contents: [
              {
                contentRaw: "Content-Type: text/html;\r\n\r\n<p>Test email content</p>\r\n\r\n",
                headers: {
                  "content-type": "text/html;",
                  content: "<p>Test email content</p>\r\n\r\n\r\n"
                },
                content: "<p>Test email content</p>\r\n\r\n\r\n",
                mimeType: "text/html"
              }
            ]
          }
        ]);
      });

      it("a content boundary  Content-type without a mime type and charset", () => {
        const emailRaw: string =
          'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n\r\n' +
          "--transit--client--6ohw29r5\r\n" +
          "Content-Type: \r\n\r\n" +
          "<p>Test email content</p>\r\n\r\n" +
          "--transit--client--6ohw29r5--\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse.boundaryIds).toEqual(["transit--client--6ohw29r5"]);
        expect(processEmailResponse.boundaries).toEqual([
          {
            contents: [
              {
                contentRaw: "Content-Type: \r\n\r\n<p>Test email content</p>\r\n\r\n",
                headers: {
                  "content-type": "",
                  content: "<p>Test email content</p>\r\n\r\n\r\n"
                },
                content: "<p>Test email content</p>\r\n\r\n\r\n",
                mimeType: ""
              }
            ]
          }
        ]);
      });

      it("an attachment based content boundary Content-disposition without a filename", () => {
        const emailRaw: string =
          'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n\r\n' +
          "--transit--client--6ohw29r5\r\n" +
          "Content-Disposition: attachment;\r\n" +
          "Content-Transfer-Encoding: base64\r\n\r\n" +
          "MQo=\r\n\r\n" +
          "--transit--client--6ohw29r5--\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse.boundaryIds).toEqual(["transit--client--6ohw29r5"]);
        expect(processEmailResponse.boundaries).toEqual([
          {
            contents: [
              {
                contentRaw:
                  "Content-Disposition: attachment;\r\n" +
                  "Content-Transfer-Encoding: base64\r\n\r\n" +
                  "MQo=\r\n\r\n",
                headers: {
                  "content-disposition": "attachment;",
                  "content-transfer-encoding": "base64",
                  content: "MQo=\r\n\r\n\r\n"
                },
                content: "MQo=\r\n\r\n\r\n",
                mimeType: "",
                isAttachment: true,
                encoding: "base64"
              }
            ]
          }
        ]);
        expect(processEmailResponse.attachments).toEqual([
          {
            contentRaw:
              "Content-Disposition: attachment;\r\n" +
              "Content-Transfer-Encoding: base64\r\n\r\n" +
              "MQo=\r\n\r\n",
            headers: {
              "content-disposition": "attachment;",
              "content-transfer-encoding": "base64",
              content: "MQo=\r\n\r\n\r\n"
            },
            content: "MQo=\r\n\r\n\r\n",
            mimeType: "",
            isAttachment: true,
            encoding: "base64"
          }
        ]);
      });

      it("an attachment based content boundary Content-disposition without a mime type and filename", () => {
        const emailRaw: string =
          'Content-Type: multipart/alternative; boundary="transit--client--6ohw29r5"\r\n\r\n' +
          "--transit--client--6ohw29r5\r\n" +
          "Content-Disposition: \r\n" +
          "Content-Transfer-Encoding: base64\r\n\r\n" +
          "MQo=\r\n\r\n" +
          "--transit--client--6ohw29r5--\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse.boundaryIds).toEqual(["transit--client--6ohw29r5"]);
        expect(processEmailResponse.boundaries).toEqual([
          {
            contents: [
              {
                contentRaw:
                  "Content-Disposition: \r\n" +
                  "Content-Transfer-Encoding: base64\r\n\r\n" +
                  "MQo=\r\n\r\n",
                headers: {
                  "content-disposition": "",
                  "content-transfer-encoding": "base64",
                  content: "MQo=\r\n\r\n\r\n"
                },
                content: "MQo=\r\n\r\n\r\n",
                mimeType: "",
                encoding: "base64"
              }
            ]
          }
        ]);
      });
    });

    describe("testing stripScripts() method", () => {
      it("a successful response", () => {
        const emailRaw: string =
          'Content-Type: text/html; charset="utf-8"\r\n\r\n' + "<script>alert(1)</script>\r\n\r\n";

        const emailParser = new EmailParser();

        const processEmailResponse: IEmail = emailParser.processEmail(emailRaw);

        expect(processEmailResponse).toEqual({
          emailRaw:
            'Content-Type: text/html; charset="utf-8"\r\n\r\n<script>alert(1)</script>\r\n\r\n',
          headersRaw: 'Content-Type: text/html; charset="utf-8"',
          contentRaw: "<script>alert(1)</script>\r\n\r\n",
          headers: { "content-type": 'text/html; charset="utf-8"' },
          mimeType: "text/html",
          charset: "utf-8",
          boundaries: [],
          bodyHtml: "\n\n"
        });
      });
    });
  });
});
