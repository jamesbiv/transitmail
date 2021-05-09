import { IComposeAttachment, IEmailAttachment } from "interfaces";
import { MimeTools } from "lib";

/**
 * @name convertAttachments
 * @param {IEmailAttachment[]} attachments
 * @returns IComposeAttachment[]
 */
const convertAttachments = async (
  attachments: IEmailAttachment[] | undefined
): Promise<IComposeAttachment[] | undefined> => {
  if (!attachments) {
    return undefined;
  }

  let count: number = 0;

  return await attachments.reduce(
    async (
      convertedAttachments: Promise<IComposeAttachment[]>,
      attachment: IEmailAttachment
    ) => {
      const attachmentContent: Blob = MimeTools.base64toBlob(
        attachment.content,
        attachment.mimeType
      );

      const fileReaderResponse: FileReader = await new Promise((resolve) => {
        const fileReader = new FileReader();

        fileReader.onload = () => resolve(fileReader);
        fileReader.readAsBinaryString(attachmentContent);
      });

      (await convertedAttachments).push({
        id: count++,
        filename: attachment.filename,
        size: 0,
        mimeType: attachment.mimeType,
        data: fileReaderResponse.result,
      });

      return Promise.resolve(convertedAttachments);
    },
    Promise.resolve([])
  );
};

export default convertAttachments;
