import React from "react";
import { Dropdown, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSlidersH,
  faReply,
  faReplyAll,
  faShare,
  faTrash,
  faTrashRestore,
} from "@fortawesome/free-solid-svg-icons";
import { IEmail } from "interfaces";

interface IViewHeaderProps {
  replyToEmail: (all?: boolean) => void;
  forwardEmail: () => void;
  deleteEmail: () => void;
  restoreEmail: () => void;
  email: IEmail;
  deleted: boolean;
}

export const ViewHeader: React.FC<IViewHeaderProps> = ({
  replyToEmail,
  forwardEmail,
  deleteEmail,
  restoreEmail,
  email,
  deleted,
}) => {
  return (
    <>
      <div className="ml-2 float-right text-right">
        <div className="mb-2 d-none d-sm-block">
          <Button
            variant="primary"
            type="button"
            onClick={() => replyToEmail()}
          >
            <FontAwesomeIcon icon={faReply} /> Reply
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="button"
            onClick={() => replyToEmail(true)}
            className="ml-1"
          >
            <FontAwesomeIcon icon={faReplyAll} />
          </Button>
          <Button
            variant="success"
            size="sm"
            type="button"
            onClick={() => forwardEmail()}
            className="ml-1"
          >
            <FontAwesomeIcon icon={faShare} />{" "}
            <span className="d-none d-sm-inline-block">Forward</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            type="button"
            onClick={() => deleteEmail()}
            className="ml-1"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
        <Dropdown>
          <Dropdown.Toggle size="sm" variant="outline-dark" id="dropdown-basic">
            <FontAwesomeIcon icon={faSlidersH} />{" "}
            <span className="d-none">More Options</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Move</Dropdown.Item>
            <Dropdown.Item>Tag</Dropdown.Item>
            <Dropdown.Item>View Source</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <p className="m-0">Date: {email.date}</p>
      <p className="m-0">From: {email.from}</p>
      <p className={`m-0 ${!email.replyTo?.length ? "d-none" : ""}`}>
        <small>Reply to: {email.replyTo}</small>
      </p>
      <p className="m-0">To: {email.to}</p>
      <p className={`m-0 ${!email.cc?.length ? "d-none" : ""}`}>
        <small>Cc: {email.cc}</small>
      </p>
      <div className="mt-2 d-block d-sm-none">
        <Button variant="primary" type="button" onClick={() => replyToEmail()}>
          <FontAwesomeIcon icon={faReply} /> Reply
        </Button>
        <Button
          variant="primary"
          size="sm"
          type="button"
          onClick={() => replyToEmail(true)}
          className="ml-1"
        >
          <FontAwesomeIcon icon={faReplyAll} />
        </Button>
        <Button
          variant="success"
          size="sm"
          type="button"
          onClick={() => forwardEmail()}
          className="ml-1"
        >
          <FontAwesomeIcon icon={faShare} />{" "}
          <span className="d-none d-sm-inline-block">Forward</span>
        </Button>
        <Button
          variant="danger"
          size="sm"
          type="button"
          onClick={() => deleteEmail()}
          className={`ml-1 ${deleted ? "d-inline-block" : "d-none"}`}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
        <Button
          variant="dark"
          size="sm"
          type="button"
          onClick={() => restoreEmail()}
          className={`ml-1 ${deleted ? "d-none" : "d-inline-block"}`}
        >
          <FontAwesomeIcon icon={faTrashRestore} />
        </Button>
      </div>
    </>
  );
};
