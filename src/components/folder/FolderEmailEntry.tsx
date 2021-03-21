import React from "react";
import { Button, ButtonGroup, Row, Col, Form, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelopeOpen,
  faReply,
  faShare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { IFolderEmail } from "interfaces";

interface IFolderEmailEntryProps {
  email: IFolderEmail;
  updateActiveKeyUid: (activeKey: string, activeUid: number) => void;
  replyToEmail: (uid: number) => void;
  forwardEmail: (uid: number) => void;
  deleteEmail: (uid: number) => void;
}

export const FolderEmailEntry: React.FC<IFolderEmailEntryProps> = ({
  updateActiveKeyUid,
  email,
  replyToEmail,
  forwardEmail,
  deleteEmail,
}) => {
  return (
    <Row
      className={`border-bottom pt-1 pb-1 mt-0 mt-sm-2 pointer ${
        !email.flags.includes("Seen") && "font-weight-bold"
      }`}
      onClick={() => {
        updateActiveKeyUid("view", email.uid);
      }}
    >
      <Col className="d-none d-sm-block folder-checkbox">
        <Form.Check
          type="checkbox"
          id=""
          label=""
          onClick={(event: React.SyntheticEvent) => {
            event.stopPropagation();
          }}
        />
      </Col>
      <Col>
        <Container fluid className="pl-0 pr-0">
          <Row>
            <Col xs={4} sm={2} md={2} lg={2} className="text-truncate">
              {new Date(email.date).toDateString()}
              <br />
              {new Date(email.date).toTimeString().split(" ")[0]}
            </Col>
            <Col xs={5} sm={2} md={2} lg={2} className="text-truncate">
              {/*email.from.match(/"(.*)"/)[1]*/}
              {email.from}
            </Col>
            <Col
              className="d-none d-sm-block text-truncate folder-subject"
              xs={0}
              sm={5}
              md={4}
              lg={5}
            >
              {email.subject || "(no subject)"}
            </Col>
            <Col className="text-right text-nowrap" xs={3} sm={3} md={4} lg={3}>
              <ButtonGroup
                className="ml-auto btn-group-vertical-xs"
                size="sm"
                aria-label=""
              >
                <Button
                  variant="primary"
                  onClick={(event: React.SyntheticEvent) => {
                    event.stopPropagation();
                    updateActiveKeyUid("view", email.uid);
                  }}
                >
                  <FontAwesomeIcon icon={faEnvelopeOpen} />
                </Button>
                <Button
                  variant="success"
                  onClick={(event: React.SyntheticEvent) => {
                    event.stopPropagation();
                    replyToEmail(email.uid);
                  }}
                >
                  <FontAwesomeIcon icon={faReply} />
                </Button>
                <Button
                  variant="success"
                  onClick={(event: React.SyntheticEvent) => {
                    event.stopPropagation();
                    forwardEmail(email.uid);
                  }}
                >
                  <FontAwesomeIcon icon={faShare} />
                </Button>
                <Button
                  variant="danger"
                  onClick={(event: React.SyntheticEvent) => {
                    event.stopPropagation();
                    deleteEmail(email.uid);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </ButtonGroup>
            </Col>
            <Col
              className="d-xs-block d-sm-none text-truncate subject-xs"
              xs={10}
              sm={0}
              md={0}
              lg={0}
            >
              <b>Subject</b>
              <br />
              {email.subject}
            </Col>
          </Row>
        </Container>
      </Col>
    </Row>
  );
};
