import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileExcel,
  faTimes,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { IComposeAttachment } from "interfaces";
import { MimeTools } from "lib";

interface IComposeAttachmentProps {
  attachments: IComposeAttachment[];
  setAttachments: React.Dispatch<IComposeAttachment[]>;
}

export const ComposeAttachments: React.FC<IComposeAttachmentProps> = ({
  attachments,
  setAttachments,
}) => {
  const loadAttachments: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void = (event) => {
    const fileList: FileList | undefined = event.target.files ?? undefined;
    const files: File[] = Array.from(fileList ?? []);

    let count: number = 0;

    files.forEach((file: File) => {
      const reader: FileReader = new FileReader();

      reader.onload = () => {
        attachments.push({
          id: count++,
          filename: file.name,
          size: file.size,
          mimeType: file.type,
          data: reader.result,
        });

        if (files?.length === count) {
          setAttachments([...attachments]);
        }
      };

      reader.readAsBinaryString(file);
    });
  };

  const viewAttachment: (id: number) => void = (id) => {
    const attachment = attachments.find(
      (attachment: IComposeAttachment) => attachment.id === id
    );

    if (attachment) {
      const blob: Blob = MimeTools.binaryStringToBlob(
        attachment.data! as string,
        attachment.mimeType
      );

      const blobUrl: string = URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");
    }
  };

  const removeAttachment: (attachmentId: number) => void = (attachmentId) => {
    const updatedAttachments: IComposeAttachment[] = attachments.filter(
      (attachment: IComposeAttachment) => attachment.id !== attachmentId
    );

    setAttachments(updatedAttachments);
  };

  const AttachmentInput: () => JSX.Element = () => (
    <input
      id="attachmentInput"
      type="file"
      name="files[]"
      hidden
      multiple
      onChange={(event: React.ChangeEvent<HTMLInputElement> & Event) =>
        loadAttachments(event)
      }
    />
  );

  return (
    <React.Fragment>
      <AttachmentInput />
      {attachments.length > 0 && (
        <div className="mt-2 mb-2 pl-2 pt-2 border-top overflow-hidden">
          <h6>Attachments</h6>

          {attachments.map((attachment: IComposeAttachment) => (
            <div
              key={attachment.id}
              className="attachments float-left border rounded d-inline small bg-light pl-2 pr-2 pt-1 pb-1 mr-2 mb-2 text-truncate"
            >
              <Button
                className="float-right p-0 ml-2"
                variant="light"
                size="sm"
                onClick={() => removeAttachment(attachment.id)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </Button>
              <Button
                className="float-right p-0 ml-2"
                variant="light"
                size="sm"
                onClick={() => viewAttachment(attachment.id)}
              >
                <FontAwesomeIcon icon={faEye} />
              </Button>
              <FontAwesomeIcon
                className="mr-1"
                icon={(() => {
                  switch (attachment.mimeType) {
                    case "image/jpeg":
                      return faFileImage;

                    case "application/pdf":
                      return faFilePdf;

                    case "application/msword":
                      return faFileWord;

                    case "application/vnd.ms-excel":
                      return faFileExcel;

                    default:
                      return faFile;
                  }
                })()}
              />{" "}
              {attachment.filename}
            </div>
          ))}
        </div>
      )}
    </React.Fragment>
  );
};
