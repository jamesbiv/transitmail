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
  });

  describe("Test viewAttachment(", () => {
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

      const eyeIcon: Element = container.querySelector('[data-icon="eye"]')!;
      fireEvent.click(eyeIcon);

      expect(getByText(/testAttachment.txt/i)).toBeInTheDocument();
    });
  });

  describe("Test downloadAttachment(", () => {
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

      expect(getByText(/testAttachment.txt/i)).toBeInTheDocument();
    });
  });
});
