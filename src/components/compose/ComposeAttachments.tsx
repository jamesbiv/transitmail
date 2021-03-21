import React, { ChangeEvent } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileExcel,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { IComposeAttachment } from "interfaces";

interface IComposeAttachmentProps {
  updateAttachments: (attachments: IComposeAttachment[]) => void;
  attachments: IComposeAttachment[];
}

export const ComposeAttachments: React.FC<IComposeAttachmentProps> = ({
  updateAttachments,
  attachments,
}) => {
  const loadAttachments = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList | null = event.target.files;
    const files: File[] = Array.from(fileList ?? []);
    
    files.forEach((file: File) => {
      const reader = new FileReader();
      let count = 0;

      reader.onload = () => {
        count++;
        attachments.push({
          id: attachments.length + count,
          filename: file.name,
          size: file.size,
          mimeType: file.type,
          data: reader.result,
        });

        if (files?.length === count) {
          updateAttachments(attachments);
        }
      };

      reader.readAsBinaryString(file);
    });
  };

  const removeAttachment = (id: number) => {
    attachments = attachments.filter((attachment: IComposeAttachment) => {
      return attachment.id !== id;
    });

    updateAttachments(attachments);
  };

  const AttachmentInput = () => (
    <input
      id="attachmentInput"
      type="file"
      name="files[]"
      hidden
      multiple
      onChange={(event: ChangeEvent<HTMLInputElement> & Event) => {
        loadAttachments(event);
      }}
    />
  );

  return (
    <>
      <AttachmentInput />
      {attachments.length > 0 && (
        <div className="mt-2 mb-2 pl-2 pt-2 border-top overflow-hidden">
          <h6>Attachments</h6>

          {attachments.map((attachment: IComposeAttachment) => (
            <div
              key={attachment.id}
              className="attachments float-left border rounded d-inline font-small bg-light pl-2 pr-2 pt-1 pb-1 mr-2 mb-2 text-truncate"
            >
              <small>
                <Button
                  className="float-right p-0 ml-2"
                  variant="light"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                >
                  <FontAwesomeIcon icon={faTimes} />
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
              </small>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
