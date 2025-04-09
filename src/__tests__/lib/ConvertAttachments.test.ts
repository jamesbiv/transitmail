import { IEmailAttachment } from "interfaces";
import { convertAttachments } from "lib";
import { TextDecoder } from "util";

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
        key: "uuid-v4-randomKey",
        filename: "testAttachment.txt",
        encoding: "base64"
      }
    ];

    const convertAttachmentsResponse = await convertAttachments(attachments);

    const textDecoder = new TextDecoder();

    const extractDataResponse = convertAttachmentsResponse?.[0]?.data as ArrayBuffer | undefined;

    const decodedDataResponse = extractDataResponse
      ? textDecoder.decode(extractDataResponse)
      : undefined;

    expect(decodedDataResponse).toEqual("Test Attachment\n");
    expect(convertAttachmentsResponse).toMatchObject([
      {
        id: 0,
        size: 0,
        filename: "testAttachment.txt",
        mimeType: "text/plain"
      }
    ]);
  });

  it("without a valid attachment", async () => {
    const convertAttachmentsResponse = await convertAttachments(undefined);

    expect(convertAttachmentsResponse).toEqual(undefined);
  });
});
