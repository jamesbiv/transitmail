import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ViewAttachments } from "components/view";
import { IEmailAttachment } from "interfaces";

describe("ViewAttachments Component", () => {
  const originalCreateObjectURL = window.URL.createObjectURL;

  beforeEach(() => {
    window.URL.createObjectURL = jest.fn();
  });

  afterEach(() => {
    window.URL.createObjectURL = originalCreateObjectURL;
  });

  describe("Test collapsable", () => {
    it("if attachments are found", () => {
      const attachments: IEmailAttachment[] = [
        {
          contentRaw:
            'Content-Type: text/plain; name="testAttachment.txt"\r\n' +
            'Content-Disposition: attachment; filename="testAttachment.txt"\r\n' +
            "Content-Transfer-Encoding: base64\r\n\r\n" +
            "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n",
          headers: {
            "content-type": 'text/plain; name="testAttachment.txt"',
            "content-disposition": 'attachment; filename="testAttachment.txt"',
            "content-transfer-encoding": "base64",
            content: "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n\r\n"
          },
          content: "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n\r\n",
          mimeType: "text/plain",
          isAttachment: true,
          key: "uuid-v4-randomKey",
          filename: "testAttachment.txt",
          encoding: "base64"
        }
      ];
      const { getByText } = render(<ViewAttachments attachments={attachments} />);

      expect(getByText(/testAttachment.txt/i)).toBeInTheDocument();
    });

    it("if attachments not found", async () => {
      const attachments: undefined = undefined;

      const { getByText } = render(<ViewAttachments attachments={attachments} />);

      expect(getByText(/No attachments found/i)).toBeInTheDocument();
    });

    it("if attachments are found as image/jpeg", () => {
      const attachments: IEmailAttachment[] = [
        {
          content: "\r\n\r\n\r\n",
          mimeType: "image/jpeg",
          isAttachment: true,
          key: "uuid-v4-randomKey",
          filename: "testAttachment.jpg",
          encoding: "base64"
        }
      ];

      const { container } = render(<ViewAttachments attachments={attachments} />);

      const fileImageIcon = container.querySelector('[data-icon="file-image"]')!;
      expect(fileImageIcon).toBeInTheDocument();
    });

    it("if attachments are found as application/pdf", () => {
      const attachments: IEmailAttachment[] = [
        {
          content: "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n\r\n",
          mimeType: "application/pdf",
          isAttachment: true,
          key: "uuid-v4-randomKey",
          filename: "testAttachment.pdf",
          encoding: "base64"
        }
      ];
      const { container } = render(<ViewAttachments attachments={attachments} />);

      const fileImageIcon = container.querySelector('[data-icon="file-pdf"]')!;
      expect(fileImageIcon).toBeInTheDocument();
    });

    it("if attachments are found as application/msword", () => {
      const attachments: IEmailAttachment[] = [
        {
          content: "\r\n\r\n\r\n",
          mimeType: "application/msword",
          isAttachment: true,
          key: "uuid-v4-randomKey",
          filename: "testAttachment.doc",
          encoding: "base64"
        }
      ];
      const { container } = render(<ViewAttachments attachments={attachments} />);

      const fileImageIcon = container.querySelector('[data-icon="file-word"]')!;
      expect(fileImageIcon).toBeInTheDocument();
    });

    it("if attachments are found as application/vnd.me-excel", () => {
      const attachments: IEmailAttachment[] = [
        {
          content: "\r\n\r\n\r\n",
          mimeType: "application/vnd.me-excel",
          isAttachment: true,
          key: "uuid-v4-randomKey",
          filename: "testAttachment.jpg",
          encoding: "base64"
        }
      ];
      const { container } = render(<ViewAttachments attachments={attachments} />);

      const fileImageIcon = container.querySelector('[data-icon="file-excel"]')!;
      expect(fileImageIcon).toBeInTheDocument();
    });
  });

  describe("Test viewAttachment()", () => {
    it("a successful result a with base64 encoded attachment", () => {
      const attachments: IEmailAttachment[] = [
        {
          contentRaw:
            'Content-Type: text/plain; name="testAttachment.txt"\r\n' +
            'Content-Disposition: attachment; filename="testAttachment.txt"\r\n' +
            "Content-Transfer-Encoding: base64\r\n\r\n" +
            "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n",
          headers: {
            "content-type": 'text/plain; name="testAttachment.txt"',
            "content-disposition": 'attachment; filename="testAttachment.txt"',
            "content-transfer-encoding": "base64",
            content: "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n\r\n"
          },
          content: "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n\r\n",
          mimeType: "text/plain",
          isAttachment: true,
          key: "uuid-v4-randomKey",
          filename: "testAttachment.txt",
          encoding: "base64"
        }
      ];
      const { container, getByText } = render(<ViewAttachments attachments={attachments} />);

      const eyeIcon: Element = container.querySelector('[data-icon="eye"]')!;
      fireEvent.click(eyeIcon);

      expect(getByText(/testAttachment.txt/i)).toBeInTheDocument();
    });

    it("a successful result a with binary encoded attachment", () => {
      const attachments: IEmailAttachment[] = [
        {
          contentRaw:
            'Content-Type: text/plain; name="testAttachment.txt"\r\n' +
            'Content-Disposition: attachment; filename="testAttachment.txt"\r\n' +
            "Content-Transfer-Encoding: binary\r\n\r\n" +
            "Test attachment contents\r\n\r\n",
          headers: {
            "content-type": 'text/plain; name="testAttachment.txt"',
            "content-disposition": 'attachment; filename="testAttachment.txt"',
            "content-transfer-encoding": "binary",
            content: "Test attachment contents\r\n\r\n\r\n"
          },
          content: "Test attachment contents\r\n\r\n\r\n",
          mimeType: "text/plain",
          isAttachment: true,
          key: "uuid-v4-randomKey",
          filename: "testAttachment.txt",
          encoding: "binary"
        }
      ];
      const { container, getByText } = render(<ViewAttachments attachments={attachments} />);

      const eyeIcon: Element = container.querySelector('[data-icon="eye"]')!;
      fireEvent.click(eyeIcon);

      expect(getByText(/testAttachment.txt/i)).toBeInTheDocument();
    });
  });

  describe("Test downloadAttachment(", () => {
    it("a successful result a with base64 encoded attachment", () => {
      const attachments: IEmailAttachment[] = [
        {
          contentRaw:
            'Content-Type: text/plain; name="testAttachment.txt"\r\n' +
            'Content-Disposition: attachment; filename="testAttachment.txt"\r\n' +
            "Content-Transfer-Encoding: base64\r\n\r\n" +
            "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n",
          headers: {
            "content-type": 'text/plain; name="testAttachment.txt"',
            "content-disposition": 'attachment; filename="testAttachment.txt"',
            "content-transfer-encoding": "base64",
            content: "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n\r\n"
          },
          content: "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n\r\n",
          mimeType: "text/plain",
          isAttachment: true,
          key: "uuid-v4-randomKey",
          filename: "testAttachment.txt",
          encoding: "base64"
        }
      ];
      const { container, getByText } = render(<ViewAttachments attachments={attachments} />);

      const downloadIcon: Element = container.querySelector('[data-icon="download"]')!;
      fireEvent.click(downloadIcon);

      expect(getByText(/testAttachment.txt/i)).toBeInTheDocument();
    });

    it("a successful result a with base64 encoded attachment", () => {
      const attachments: IEmailAttachment[] = [
        {
          contentRaw:
            'Content-Type: text/plain; name="testAttachment.txt"\r\n' +
            'Content-Disposition: attachment; filename="testAttachment.txt"\r\n' +
            "Content-Transfer-Encoding: base64\r\n\r\n" +
            "Test attachment contents\r\n\r\n",
          headers: {
            "content-type": 'text/plain; name="testAttachment.txt"',
            "content-disposition": 'attachment; filename="testAttachment.txt"',
            "content-transfer-encoding": "base64",
            content: "Test attachment contents\r\n\r\n\r\n"
          },
          content: "Test attachment contents\r\n\r\n\r\n",
          mimeType: "text/plain",
          isAttachment: true,
          key: "uuid-v4-randomKey",
          filename: "testAttachment.txt",
          encoding: "binary"
        }
      ];
      const { container, getByText } = render(<ViewAttachments attachments={attachments} />);

      const downloadIcon: Element = container.querySelector('[data-icon="download"]')!;
      fireEvent.click(downloadIcon);

      expect(getByText(/testAttachment.txt/i)).toBeInTheDocument();
    });
  });

  describe("Test toggleAttachmentsCollapsed(", () => {
    it("a successful result", () => {
      const attachments: IEmailAttachment[] = [
        {
          contentRaw:
            'Content-Type: text/plain; name="testAttachment.txt"\r\n' +
            'Content-Disposition: attachment; filename="testAttachment.txt"\r\n' +
            "Content-Transfer-Encoding: base64\r\n\r\n" +
            "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n",
          headers: {
            "content-type": 'text/plain; name="testAttachment.txt"',
            "content-disposition": 'attachment; filename="testAttachment.txt"',
            "content-transfer-encoding": "base64",
            content: "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n\r\n"
          },
          content: "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n\r\n",
          mimeType: "text/plain",
          isAttachment: true,
          key: "uuid-v4-randomKey",
          filename: "testAttachment.txt",
          encoding: "base64"
        }
      ];
      const { container, getByText } = render(<ViewAttachments attachments={attachments} />);

      const collpsableHeader: Element = container.querySelector('[class="pointer"]')!;
      fireEvent.click(collpsableHeader);
      fireEvent.keyUp(collpsableHeader);
      fireEvent.keyDown(collpsableHeader);

      expect(getByText(/testAttachment.txt/i)).toBeInTheDocument();
    });
  });
});
