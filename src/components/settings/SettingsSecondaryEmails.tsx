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
  showSecondaryEmailsModal: boolean;
  toggleSecondaryEmailsModal: (showSecondaryEmailsModal: boolean) => void;
  addSecondaryEmail: (econdaryEmail: ISettingsSecondaryEmail) => void;
  updateSecondaryEmail: (
    secondaryEmail: ISettingsSecondaryEmail,
    secondaryEmailKey: number
  ) => void;
  deleteSecondaryEmail: (secondaryEmailKey: number) => void;
}

export const SettingsSecondaryEmails: React.FC<ISettingsSecondaryEmailsProps> = ({
  showSecondaryEmailsModal,
  toggleSecondaryEmailsModal,
  addSecondaryEmail,
  updateSecondaryEmail,
  deleteSecondaryEmail,
}) => {
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
                onClick={() => toggleSecondaryEmailsModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} /> Add Seconday Email
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Button
              variant="danger"
              className="float-right"
              size="sm"
              aria-label=""
              onClick={() => {}}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
            <Button
              variant="primary"
              className="float-right mr-2"
              size="sm"
              aria-label=""
              onClick={() => {}}
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            test@test.com
          </ListGroup.Item>
        </ListGroup>
      </Card>
      <SettingsSecondaryEmailsModal
        secondayEmailId={1}
        showModal={showSecondaryEmailsModal}
        onHide={() => toggleSecondaryEmailsModal(false)}
        addSecondaryEmail={addSecondaryEmail}
        updateSecondaryEmail={updateSecondaryEmail}
      />
    </React.Fragment>
  );
};

interface ISettingsSecondaryEmailsModalProps {
  secondayEmailId?: number;
  showModal: boolean;
  onHide: () => void;
  addSecondaryEmail: (econdaryEmail: ISettingsSecondaryEmail) => void;
  updateSecondaryEmail: (
    secondaryEmail: ISettingsSecondaryEmail,
    secondaryEmailKey: number
  ) => void;
}

export const SettingsSecondaryEmailsModal: React.FC<ISettingsSecondaryEmailsModalProps> = ({
  secondayEmailId,
  showModal,
  onHide,
  addSecondaryEmail,
  updateSecondaryEmail,
}) => {
  const [submit, changeSubmit] = useState(false);
  useEffect(() => {}, []);

  return (
    <Modal
      show={showModal}
      centered={true}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton onClick={() => onHide()}>
        <Modal.Title id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={faEnvelope} />{" "}
          {secondayEmailId ? "Edit secondary email" : "Add new secondary email"}
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
            onChange={() => {}}
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
            onChange={() => {}}
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
            onChange={() => {}}
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
