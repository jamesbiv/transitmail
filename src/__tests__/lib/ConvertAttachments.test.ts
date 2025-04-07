import { IEmailAttachment } from "interfaces";
import { convertAttachments } from "lib";

describe("Testing convertAttachments", () => {
  it("with a valid attachment", async () => {
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

    const convertAttachmentsResponse = await convertAttachments(attachments);

    expect(convertAttachmentsResponse).toEqual([
      {
        data: "Test Attachment\n",
        filename: "testAttachment.txt",
        id: 0,
        mimeType: "text/plain",
        size: 0
      }
    ]);
  });

  it("without a valid attachment", async () => {
    const convertAttachmentsResponse = await convertAttachments(undefined);

    expect(convertAttachmentsResponse).toEqual(undefined);
  });
});
