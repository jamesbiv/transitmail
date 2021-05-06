import React, { useState } from "react";
import { Button, Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faDownload,
  faEye,
  faPlusSquare,
  faMinusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { IEmailAttachment } from "interfaces";
import { MimeTools } from "lib";

interface IViewAttachmentsProps {
  attachments?: IEmailAttachment[];
}

export const ViewAttachments: React.FC<IViewAttachmentsProps> = ({
  attachments,
}) => {
  const viewAttachment = (attachment: IEmailAttachment) => {
    const content: string = attachment.content.trim();

    const blob: Blob =
      attachment.encoding.toLowerCase() === "base64"
        ? MimeTools.base64toBlob(content, attachment.mimeType)
        : MimeTools.binaryStringToBlob(content, attachment.mimeType);

    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");
  };

  const downloadAttachment = (attachment: IEmailAttachment) => {
    const content: string = attachment.content.trim();

    const blob: Blob =
      attachment.encoding.toLowerCase() === "base64"
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

  const [attachmentEventKey, setAttachmentEventKey] = useState<null | string>(
    null
  );

  return (
    <Accordion onSelect={(eventKey) => setAttachmentEventKey(eventKey)}>
      <Accordion.Toggle
        className="text-dark font-weight-bold text-decoration-none p-0 m-0"
        as={Button}
        variant="link"
        eventKey="0"
      >
        <FontAwesomeIcon
          icon={attachmentEventKey === "0" ? faMinusSquare : faPlusSquare}
        />{" "}
        Attachments
      </Accordion.Toggle>
      <Accordion.Collapse eventKey="0" className="p-0 m-0 mt-2">
        <>
          {attachments ? (
            attachments.map(
              (attachment: IEmailAttachment, attachmentKey: number) => (
                <div
                  key={attachmentKey}
                  className="attachments float-left border rounded d-inline small bg-light pl-2 pr-2 pt-1 pb-1 mr-2 mb-2 text-truncate"
                >
                  <Button
                    variant="light"
                    size="sm"
                    style={{ zIndex: 20000 }}
                    className="float-right p-0 ml-2"
                    onClick={() => downloadAttachment(attachment)}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    style={{ zIndex: 20000 }}
                    className="float-right p-0 ml-2"
                    onClick={() => viewAttachment(attachment)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                  <FontAwesomeIcon
                    className="mr-1"
                    icon={(() => {
                      switch (attachment.mimeType) {
                        default:
                          return faFile;
                      }
                    })()}
                  />{" "}
                  {attachment.filename}
                </div>
              )
            )
          ) : (
            <p>
              <em>No attachments found</em>
            </p>
          )}
        </>
      </Accordion.Collapse>
    </Accordion>
  );
};
