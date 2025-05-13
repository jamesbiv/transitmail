import { IComposeAttachment, IEmailAttachment } from "interfaces";
import { MimeTools } from "lib";

/**
 * @name convertAttachments
 * @param {IEmailAttachment[]} attachments
 * @returns IComposeAttachment[]
 */
export const convertAttachments = async (
  attachments: IEmailAttachment[] | undefined
): Promise<IComposeAttachment[] | undefined> => {
  if (!attachments) {
    return undefined;
  }

  let attachmentCount: number = 0;

  return await attachments.reduce(
    async (convertedAttachments: Promise<IComposeAttachment[]>, attachment: IEmailAttachment) => {
      const attachmentContent: Blob = MimeTools.base64toBlob(
        attachment.content,
        attachment.mimeType
      );

      const fileReaderResponse: FileReader = await new Promise((resolve) => {
        const fileReader = new FileReader();

        fileReader.onload = () => resolve(fileReader);
        fileReader.readAsArrayBuffer(attachmentContent);
      });

      const readerResultArrayBuffer: Uint8Array<ArrayBuffer> = new Uint8Array(
        fileReaderResponse.result as ArrayBuffer
      );

      let readerResult: string = "";

      for (let increment = 0; increment < readerResultArrayBuffer.byteLength; increment++) {
        readerResult += String.fromCharCode(readerResultArrayBuffer[increment]);
      }

      (await convertedAttachments).push({
        id: attachmentCount++,
        filename: attachment.filename,
        size: 0,
        mimeType: attachment.mimeType,
        data: readerResult
      });

      return Promise.resolve(convertedAttachments);
    },
    Promise.resolve([])
  );
};
