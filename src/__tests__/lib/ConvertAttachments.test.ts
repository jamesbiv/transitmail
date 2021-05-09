import { convertAttachments } from "lib";

describe("Testing convertAttachments", () => {
  test("With a valid attachment", async () => {
    const mockConvertAttachmentsContent: any = [
      {
        contentRaw:
          'Content-Type: text/plain; name="testattachment.txt"\r\n' +
          'Content-Disposition: attachment; filename="testattachment.txt"\r\n' +
          "Content-Transfer-Encoding: base64\r\n\r\n" +
          "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n",
        headers: {
          "content-type": 'text/plain; name="testattachment.txt"',
          "content-disposition": 'attachment; filename="testattachment.txt"',
          "content-transfer-encoding": "base64",
          content: "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n\r\n",
        },
        content: "VGVzdCBBdHRhY2htZW50Cg==\r\n\r\n\r\n",
        mimeType: "text/plain",
        isAttachment: true,
        filename: "testattachment.txt",
        encoding: "base64",
      },
    ];

    const mockConvertAttachmentsResponse: any = [
      {
        data: "Test Attachment\n",
        filename: "testattachment.txt",
        id: 0,
        mimeType: "text/plain",
        size: 0,
      },
    ];

    const convertAttachmentsResponse = await convertAttachments(
      mockConvertAttachmentsContent
    );

    expect(convertAttachmentsResponse).toEqual(mockConvertAttachmentsResponse);
  });

  test("Without an attachment", async () => {
    const convertAttachmentsResponse = await convertAttachments(undefined);

    expect(convertAttachmentsResponse).toEqual(undefined);
  });
});
