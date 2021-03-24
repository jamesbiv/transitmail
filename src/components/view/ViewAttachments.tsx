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

interface IViewAttachmentsProps {
  attachments: IEmailAttachment[];
  base64toBlob: (
    content: string,
    contentType: string,
    sliceSize?: number
  ) => Blob;
}

export const ViewAttachments: React.FC<IViewAttachmentsProps> = ({
  attachments,
  base64toBlob,
}) => {
  const viewAttachment = (attachment: IEmailAttachment) => {
    const content = attachment.content.trim();
    //content = content.substring(0, content.length-1);

    const blob = base64toBlob(content, attachment.mimeType);
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");
  };

  const downloadAttachment = (attachment: IEmailAttachment) => {
    const content = attachment.content.trim();
    //content = content.substring(0, content.length-1);

    const blob = base64toBlob(content, attachment.mimeType);
    const blobUrl = URL.createObjectURL(blob);

    const a: HTMLAnchorElement = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = blobUrl;
    a.download = attachment.filename;
    a.click();
    document.body.removeChild(a);
  };

  const [attachmentEventKey, setAttachmentEventKey] = useState<null | string>(
    null
  );

  return (
    <Accordion
      onSelect={(id) => {
        setAttachmentEventKey(id);
      }}
    >
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
            attachments.map((attachment: IEmailAttachment) => (
              <div
                key={attachment.filename}
                className="attachments float-left border rounded d-inline font-small bg-light pl-2 pr-2 pt-1 pb-1 mr-2 mb-2 text-truncate"
              >
                <small>
                  <Button
                    variant="light"
                    size="sm"
                    className="float-right p-0 ml-2"
                    onClick={() => {
                      downloadAttachment(attachment);
                    }}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    className="float-right p-0 ml-2"
                    onClick={() => {
                      viewAttachment(attachment);
                    }}
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
                </small>
              </div>
            ))
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
