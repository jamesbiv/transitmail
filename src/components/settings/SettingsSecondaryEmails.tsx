import {
  faAsterisk,
  faEdit,
  faEnvelope,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ISettingsSecondaryEmail } from "interfaces";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Modal,
  Row,
} from "react-bootstrap";

interface ISettingsSecondaryEmailsProps {
  secondaryEmails: ISettingsSecondaryEmail[] | undefined;
}

export const SettingsSecondaryEmails: React.FC<ISettingsSecondaryEmailsProps> = ({
  secondaryEmails,
}) => {
  const [showModal, toggleModal] = useState<boolean>(false);

  let secondaryEmail: ISettingsSecondaryEmail | undefined;
  let secondaryEmailKey: number | undefined;

  const updateSecondaryEmail: (
    emailData: ISettingsSecondaryEmail,
    emailKey?: number
  ) => void = (emailData, emailKey) => {
    if (!secondaryEmails) {
      secondaryEmails = [];
    }

    if (!emailKey || !secondaryEmails?.[emailKey]) {
      secondaryEmails.push(emailData);
    } else {
      secondaryEmails[emailKey] = emailData;
    }
  };

  const createNewSecondaryEmail: () => void = () => {
    secondaryEmail = undefined;
    secondaryEmailKey = undefined;

    toggleModal(true);
  };

  const editSecondaryEmail: (emailKey: number) => void = (emailKey) => {
    if (!secondaryEmails?.[emailKey]) {
      return;
    }

    secondaryEmail = secondaryEmails[emailKey];
    secondaryEmailKey = emailKey;

    toggleModal(true);
  };

  const deleteSecondaryEmail: (emailKey: number) => void = (emailKey) => {
    if (secondaryEmails?.[emailKey]) {
      secondaryEmails.slice(emailKey, 1);
    }
  };

  return (
    <React.Fragment>
      <Card className="mt-3 mb-3">
        <Card.Header>
          <Row>
            <Col xs={12} sm={6}>
              <FontAwesomeIcon className="mr-2" icon={faEnvelope} />
              Secondary email accounts
            </Col>
            <Col
              className="text-right text-sm-right text-nowrap mt-3 mt-sm-0"
              xs={12}
              sm={6}
            >
              <Button
                size="sm"
                variant="outline-dark"
                type="button"
                onClick={() => createNewSecondaryEmail()}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Seconday Email
              </Button>
            </Col>
          </Row>
        </Card.Header>
        {!secondaryEmails?.length && (
          <Card.Body className="text-center text-secondary">
            No secondary email accounts found
          </Card.Body>
        )}
        <ListGroup variant="flush">
          {secondaryEmails?.map(
            (
              secondaryEmail: ISettingsSecondaryEmail,
              secondaryEmailKey: number
            ) => (
              <ListGroup.Item key={secondaryEmailKey}>
                <Button
                  variant="danger"
                  className="float-right"
                  size="sm"
                  aria-label=""
                  onClick={() => deleteSecondaryEmail(secondaryEmailKey)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Button
                  variant="primary"
                  className="float-right mr-2"
                  size="sm"
                  aria-label=""
                  onClick={() => editSecondaryEmail(secondaryEmailKey)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                {secondaryEmail.email}
              </ListGroup.Item>
            )
          )}
        </ListGroup>
      </Card>
      <SettingsSecondaryEmailsModal
        secondaryEmail={secondaryEmail}
        secondaryEmailKey={secondaryEmailKey}
        showModal={showModal}
        onHide={() => toggleModal(false)}
        updateSecondaryEmail={updateSecondaryEmail}
      />
    </React.Fragment>
  );
};

interface ISettingsSecondaryEmailsModalProps {
  secondaryEmail?: ISettingsSecondaryEmail;
  secondaryEmailKey?: number;
  showModal: boolean;
  onHide: () => void;
  updateSecondaryEmail: (
    emailData: ISettingsSecondaryEmail,
    emailKey?: number
  ) => void;
}

export const SettingsSecondaryEmailsModal: React.FC<ISettingsSecondaryEmailsModalProps> = ({
  secondaryEmail,
  secondaryEmailKey,
  showModal,
  onHide,
  updateSecondaryEmail,
}) => {
  const [submit, changeSubmit] = useState(false);

  const updatedSecondaryEmail: ISettingsSecondaryEmail = secondaryEmail
    ? secondaryEmail
    : {
        name: "",
        email: "",
        signature: "",
      };

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    updateSecondaryEmail(updatedSecondaryEmail, secondaryEmailKey);

    onHide();
  };

  return (
    <Modal
      show={showModal}
      centered={true}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton onClick={() => onHide()}>
        <Modal.Title id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={faEnvelope} />{" "}
          {secondaryEmailKey
            ? "Edit secondary email"
            : "Add new secondary email"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formSecondaryEmailDisplayName">
          <Form.Label>
            Display name{" "}
            <FontAwesomeIcon
              icon={faAsterisk}
              size="xs"
              className="text-danger mb-1"
            />
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a secondary display name"
            defaultValue={updatedSecondaryEmail.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              (updatedSecondaryEmail.name = event.target.value)
            }
          />
          <Form.Text className="text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
          </Form.Text>
          <Form.Control.Feedback type="invalid"> </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formSecondaryEmailEmailAddress">
          <Form.Label>
            Email address{" "}
            <FontAwesomeIcon
              icon={faAsterisk}
              size="xs"
              className="text-danger mb-1"
            />
          </Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter a secondary email address"
            defaultValue={updatedSecondaryEmail.email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              (updatedSecondaryEmail.email = event.target.value)
            }
          />
          <Form.Text className="text-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
          </Form.Text>
          <Form.Control.Feedback type="invalid">{""}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formSecondaryEmailEmailSignature">
          <Form.Label>Email signature</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter a secondary email signature"
            defaultValue={updatedSecondaryEmail.signature}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              (updatedSecondaryEmail.signature = event.target.value)
            }
          />
          <Form.Control.Feedback type="invalid">{""}</Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => changeSubmit(true)}>Ok</Button>
        <Button onClick={() => onHide()}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
