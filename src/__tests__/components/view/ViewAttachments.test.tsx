import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { ViewAttachments } from "components/view";
import { IEmailAttachment } from "interfaces";

describe("ViewAttachments Component", () => {
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
        filename: "testAttachment.txt",
        encoding: "base64"
      }
    ];
    const { getByText } = render(<ViewAttachments attachments={attachments} />);

    expect(getByText(/testAttachment.txt/i)).toBeInTheDocument();
  });
});
