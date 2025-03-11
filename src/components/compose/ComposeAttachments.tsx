import React, { ChangeEvent, Dispatch, Fragment, FunctionComponent, ReactElement } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileExcel,
  faTimes,
  faEye
} from "@fortawesome/free-solid-svg-icons";
import { IComposeAttachment } from "interfaces";
import { MimeTools } from "lib";

/**
 * @interface IComposeAttachmentProps
 */
interface IComposeAttachmentProps {
  attachments: IComposeAttachment[];
  setAttachments: Dispatch<IComposeAttachment[]>;
}

/**
 * ComposeAttachments
 * @param {IComposeAttachmentProps} properties
 * @returns FunctionComponent
 */
export const ComposeAttachments: FunctionComponent<IComposeAttachmentProps> = ({
  attachments,
  setAttachments
}) => {
  const loadAttachments: (event: ChangeEvent<HTMLInputElement>) => void = (event) => {
    const fileList: FileList | undefined = event.target.files ?? undefined;
    const files: File[] = Array.from(fileList ?? []);

    files.forEach((file: File) => {
      const reader: FileReader = new FileReader();

      reader.onload = () => {
        const newAttachment: IComposeAttachment = {
          id: attachments.length,
          filename: file.name,
          size: file.size,
          mimeType: file.type,
          data: reader.result ?? undefined
        };

        setAttachments([...attachments, newAttachment]);
      };

      reader.readAsBinaryString(file);
    });
  };

  const viewAttachment: (id: number) => void = (id) => {
    const attachment = attachments.find((attachment: IComposeAttachment) => attachment.id === id);

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

  const AttachmentInput: () => ReactElement = () => (
    <input
      id="attachmentInput"
      type="file"
      name="files[]"
      hidden
      multiple
      onChange={(event: ChangeEvent<HTMLInputElement> & Event) => loadAttachments(event)}
    />
  );

  return (
    <Fragment>
      <AttachmentInput />
      {attachments.length > 0 && (
        <div className="mt-2 mb-2 ps-2 pt-2 overflow-hidden">
          <h6>Attachments</h6>

          {attachments.map((attachment: IComposeAttachment) => (
            <div
              key={attachment.id}
              className="attachments float-start border rounded d-inline small bg-light ps-2 pe-2 pt-1 pb-1 me-2 mt-2"
            >
              <div className="text-truncate title float-start">
                <FontAwesomeIcon
                  className="me-1"
                  icon={(() => {
                    switch (attachment.mimeType) {
                      case "image/jpeg":
                        return faFileImage;

                      case "application/pdf":
                        return faFilePdf;

                      case "application/msword":
                        return faFileWord;

                      case "application/vnd.me-excel":
                        return faFileExcel;

                      default:
                        return faFile;
                    }
                  })()}
                />
                {attachment.filename}
              </div>
              <div className="buttons float-end">
                <Button
                  className=" p-0 ms-1"
                  variant="light"
                  size="sm"
                  onClick={() => viewAttachment(attachment.id)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </Button>
                <Button
                  className=" p-0 ms-1"
                  variant="light"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  );
};
