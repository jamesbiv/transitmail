import React from "react";
import { Button, ButtonGroup, Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelopeOpen,
  faPaperclip,
  faReply,
  faShare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  IFolderEmail,
  IFolderEmailActions,
  IFolderLongPress,
} from "interfaces";

interface IFolderEmailEntryProps {
  email: IFolderEmail;
  toggleSelection: (uid: number) => void;
  folderEmailActions: IFolderEmailActions;
  folderLongPress: IFolderLongPress;
}

export const FolderEmailEntry: React.FC<IFolderEmailEntryProps> = ({
  email,
  toggleSelection,
  folderEmailActions,
  folderLongPress,
}) => {
  return (
    <Row
      className={`border-bottom g-0 p-2 pt-sm-2 pointer ${
        email.selected && "bg-light"
      }
      ${
        !email.flags.includes("Seen") || email.flags.includes("Recent")
          ? "font-weight-bold"
          : ""
      }`}
    >
      <Col
        xs={0}
        sm={0}
        md={1}
        lg={1}
        className="d-none d-sm-block me-3 folder-checkbox"
      >
        <Form.Check
          type="checkbox"
          id=""
          label=""
          checked={email.selected}
          onChange={() => toggleSelection(email.uid)}
        />
      </Col>
      <Col
        xs={4}
        sm={2}
        md={2}
        lg={2}
        className="text-truncate ps-3 ps-sm-0"
        onTouchStart={() => folderLongPress.handleLongPress(email.uid)}
        onTouchEnd={() => folderLongPress.handleLongRelease()}
        onClick={() => {
          if (!folderLongPress.isReturned) {
            folderEmailActions.viewEmail(email.uid);
          } else {
            folderLongPress.isReturned = false;
          }
        }}
      >
        {new Date(email.date).toDateString()}
        <br />
        {new Date(email.date).toTimeString().split(" ")[0]}
      </Col>
      <Col
        xs={5}
        sm={2}
        md={2}
        lg={2}
        className="text-truncate ps-3 ps-sm-0"
        onTouchStart={() => folderLongPress.handleLongPress(email.uid)}
        onTouchEnd={() => folderLongPress.handleLongRelease()}
        onClick={() => {
          if (!folderLongPress.isReturned) {
            folderEmailActions.viewEmail(email.uid);
          } else {
            folderLongPress.isReturned = false;
          }
        }}
      >
        {email.from.match(/"(.*)"/)?.[1] ?? undefined}
        <br />
        <small>
          <em>{email.from.match(/<(.*)>/)?.[1] ?? undefined}</em>
        </small>
      </Col>
      <Col className="text-truncate">
        <ButtonGroup
          className="float-end ps-0 ps-sm-3 btn-group-vertical-xs"
          size="sm"
          aria-label=""
        >
          <Button
            variant="primary"
            onClick={() => folderEmailActions.viewEmail(email.uid)}
          >
            <FontAwesomeIcon icon={faEnvelopeOpen} />
          </Button>
          <Button
            variant="success"
            onClick={() => folderEmailActions.replyToEmail(email.uid)}
          >
            <FontAwesomeIcon icon={faReply} />
          </Button>
          <Button
            variant="success"
            onClick={() => folderEmailActions.forwardEmail(email.uid)}
          >
            <FontAwesomeIcon icon={faShare} />
          </Button>
          <Button
            variant="danger"
            onClick={() => folderEmailActions.deleteEmail(email.uid)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </ButtonGroup>
        <p className="d-none d-sm-inline">
          {email.hasAttachment && (
            <FontAwesomeIcon className="me-2" icon={faPaperclip} />
          )}
          {email.subject || "(no subject)"}
        </p>
      </Col>
      <Col
        className="d-xs-block d-sm-none text-truncate ps-3 subject-xs"
        xs={10}
        sm={0}
        md={0}
        lg={0}
        onTouchStart={() => folderLongPress.handleLongPress(email.uid)}
        onTouchEnd={() => folderLongPress.handleLongRelease()}
        onClick={() => {
          if (!folderLongPress.isReturned) {
            folderEmailActions.viewEmail(email.uid);
          } else {
            folderLongPress.isReturned = false;
          }
        }}
      >
        <b>Subject</b>
        <br />
        {email.hasAttachment && (
          <FontAwesomeIcon className="me-2" icon={faPaperclip} />
        )}
        {email.subject || "(no subject)"}
      </Col>
    </Row>
  );
};
