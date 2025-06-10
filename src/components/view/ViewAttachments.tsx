import React, { Fragment, FunctionComponent, useState } from "react";
import { Button, Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faDownload,
  faEye,
  faPlusSquare,
  faMinusSquare,
  faFileImage,
  faFilePdf,
  faFileWord,
  faFileExcel
} from "@fortawesome/free-solid-svg-icons";
import { IEmailAttachment } from "interfaces";
import { MimeTools } from "lib";

/**
 * @interface IViewAttachmentsProps
 */
interface IViewAttachmentsProps {
  attachments?: IEmailAttachment[];
}

/**
 * ViewAttachments
 * @param {IViewAttachmentsProps} properties
 * @returns {ReactNode}
 */
export const ViewAttachments: FunctionComponent<IViewAttachmentsProps> = ({ attachments }) => {
  const viewAttachment = (attachment: IEmailAttachment) => {
    const content: string = attachment.content.trim();

    const blob: Blob =
      attachment.encoding?.toLowerCase() === "base64"
        ? MimeTools.base64toBlob(content, attachment.mimeType)
        : MimeTools.binaryStringToBlob(content, attachment.mimeType);

    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");
  };

  const downloadAttachment = (attachment: IEmailAttachment) => {
    const content: string = attachment.content.trim();

    const blob: Blob =
      attachment.encoding?.toLowerCase() === "base64"
        ? MimeTools.base64toBlob(content, attachment.mimeType)
        : MimeTools.binaryStringToBlob(content, attachment.mimeType);

    const blobUrl = URL.createObjectURL(blob);

    const anchorElement: HTMLAnchorElement = document.createElement("a");

    document.body.appendChild(anchorElement);

    anchorElement.style.display = "none";
    anchorElement.href = blobUrl;
    anchorElement.download = attachment.filename;
    anchorElement.click();

    document.body.removeChild(anchorElement);
  };

  const [attachmentsCollapsed, setAttachmentsCollapsed] = useState<boolean>(false);

  const toggleAttachmentsCollapsed: () => void = () =>
    setAttachmentsCollapsed(!attachmentsCollapsed);

  return (
    <Fragment>
      <div
        onClick={toggleAttachmentsCollapsed}
        onKeyUp={() => {}}
        onKeyDown={() => {}}
        role="menuitem"
        tabIndex={0}
        className="pointer"
      >
        <FontAwesomeIcon icon={attachmentsCollapsed ? faMinusSquare : faPlusSquare} /> Attachments
      </div>
      <Collapse in={attachmentsCollapsed} timeout={100}>
        <div className="p-0 m-0">
          {attachments?.length ? (
            attachments.map((attachment: IEmailAttachment) => (
              <div
                key={attachment.key}
                className="attachment float-start border rounded d-inline small bg-light ps-2 pe-2 pt-1 pb-1 me-2 mt-3"
              >
                <div className="title text-truncate float-start">
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
                <div className="float-end">
                  <Button
                    className="p-0 ms-1"
                    variant="light"
                    size="sm"
                    onClick={() => downloadAttachment(attachment)}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </Button>
                  <Button
                    className="p-0 ms-1"
                    variant="light"
                    size="sm"
                    onClick={() => viewAttachment(attachment)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>
              <em>No attachments found</em>
            </p>
          )}
        </div>
      </Collapse>
    </Fragment>
  );
};
