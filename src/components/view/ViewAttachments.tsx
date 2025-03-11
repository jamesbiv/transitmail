import React, { Fragment, FunctionComponent, useState } from "react";
import { Button, Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faDownload,
  faEye,
  faPlusSquare,
  faMinusSquare
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
 * @returns FunctionComponent
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
      <div onClick={toggleAttachmentsCollapsed} className="pointer">
        <FontAwesomeIcon icon={attachmentsCollapsed ? faPlusSquare : faMinusSquare} /> Attachments
      </div>
      <Collapse in={attachmentsCollapsed} timeout={100}>
        <div className="p-0 m-0 mt-3">
          {attachments ? (
            attachments.map((attachment: IEmailAttachment, attachmentKey: number) => (
              <div
                key={attachmentKey}
                className="attachments float-start border rounded d-inline small bg-light ps-2 pe-2 pt-1 pb-1 me-2 mb-2 text-truncate"
              >
                <Button
                  variant="light"
                  size="sm"
                  style={{ zIndex: 20000 }}
                  className="float-end p-0 ms-2"
                  onClick={() => downloadAttachment(attachment)}
                >
                  <FontAwesomeIcon icon={faDownload} />
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  style={{ zIndex: 20000 }}
                  className="float-end p-0 ms-2"
                  onClick={() => viewAttachment(attachment)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </Button>
                <FontAwesomeIcon
                  className="me-1"
                  icon={(() => {
                    switch (attachment.mimeType) {
                      default:
                        return faFile;
                    }
                  })()}
                />{" "}
                {attachment.filename}
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
