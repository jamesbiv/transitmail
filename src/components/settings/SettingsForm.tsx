import React from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import {
  ISettings,
  ISettingsErrors,
  ISettingsSecondaryEmail,
} from "interfaces";
import { SettingsSecondaryEmails, SettingsFormFolders } from "./";

interface ISettingsFormProps {
  settings: ISettings;
  errors?: ISettingsErrors;
  showSecondaryEmailsModal: boolean;
  toggleSecondaryEmailsModal: (showSecondaryEmailsModal: boolean) => void;
  addSecondaryEmail: (econdaryEmail: ISettingsSecondaryEmail) => void;
  updateSecondaryEmail: (
    secondaryEmail: ISettingsSecondaryEmail,
    secondaryEmailKey: number
  ) => void;
  deleteSecondaryEmail: (secondaryEmailKey: number) => void;
}

export const SettingsForm: React.FC<ISettingsFormProps> = ({
  settings,
  errors,
  showSecondaryEmailsModal,
  toggleSecondaryEmailsModal,
  addSecondaryEmail,
  updateSecondaryEmail,
  deleteSecondaryEmail,
}) => {
  return (
    <React.Fragment>
      <Form.Group controlId="formDisplayName">
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
          placeholder="Enter display name"
          isInvalid={!!errors?.name}
          defaultValue={settings.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            settings.name = event.target.value;
          }}
        />
        <Form.Text className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
        </Form.Text>
        <Form.Control.Feedback type="invalid">
          {errors?.name}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formEmailAddress">
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
          placeholder="Enter email address"
          isInvalid={!!errors?.email}
          defaultValue={settings.email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            settings.email = event.target.value;
          }}
        />
        <Form.Text className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
        </Form.Text>
        <Form.Control.Feedback type="invalid">
          {errors?.email}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formEmailSignature">
        <Form.Label>Email signature</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter email signature"
          isInvalid={!!errors?.signature}
          defaultValue={settings.signature}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            settings.signature = event.target.value;
          }}
        />
        <Form.Control.Feedback type="invalid">
          {errors?.signature}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formEmailAutoLogin">
        <Form.Check
          type="switch"
          id="autoLogin"
          label="Ask for password before sign-in"
          /*defaultChecked={settings.autoLogin}
                    onChange={() => {
                      settings.autoLogin = settings.autoLogin ? false : true;
                    }}*/
        />
        <Form.Text className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
        </Form.Text>
      </Form.Group>
      <SettingsSecondaryEmails
        showSecondaryEmailsModal={showSecondaryEmailsModal}
        toggleSecondaryEmailsModal={toggleSecondaryEmailsModal}
        addSecondaryEmail={addSecondaryEmail}
        updateSecondaryEmail={updateSecondaryEmail}
        deleteSecondaryEmail={deleteSecondaryEmail}
      />
      <Container fluid className="p-0">
        <Row>
          <Col md={12} lg={6}>
            <Card>
              <Card.Header>Incomming settings (IMAP)</Card.Header>
              <Card.Body>
                <Form.Group controlId="formIncommingHost">
                  <Form.Label>
                    Incomming mail host{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Incomming mail host"
                    isInvalid={!!errors?.imapHost}
                    defaultValue={settings.imapHost}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      settings.imapHost = event.target.value;
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.imapHost}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formIncommingPort">
                  <Form.Label>
                    Incomming mail port{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Incomming mail port"
                    isInvalid={!!errors?.imapPort}
                    defaultValue={settings.imapPort}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      settings.imapPort = Number(event.target.value);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.imapPort}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formIncommingUser">
                  <Form.Label>
                    Incomming mail username{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Incomming mail username"
                    isInvalid={!!errors?.imapUsername}
                    defaultValue={settings.imapUsername}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      settings.imapUsername = event.target.value;
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.imapUsername}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formIncommingPassword">
                  <Form.Label>
                    Incomming mail password{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Incomming mail password"
                    isInvalid={!!errors?.imapPassword}
                    defaultValue={settings.imapPassword}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      settings.imapPassword = event.target.value;
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.imapPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={12} lg={6} className="mt-3 mt-lg-0">
            <Card>
              <Card.Header>Outgoing settings (SMTP)</Card.Header>
              <Card.Body>
                <Form.Group controlId="formOutgoingHost">
                  <Form.Label>
                    Outgoing mail host{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Outgoing mail host"
                    isInvalid={!!errors?.smtpHost}
                    defaultValue={settings.smtpHost}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      settings.smtpHost = event.target.value;
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.smtpHost}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formOutgoingPort">
                  <Form.Label>
                    Outgoing mail port{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Outgoing mail port"
                    isInvalid={!!errors?.smtpPort}
                    defaultValue={settings.smtpPort}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      settings.smtpPort = Number(event.target.value);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.smtpPort}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formOutgoingUser">
                  <Form.Label>
                    Outgoing mail username{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Outgoing mail username"
                    isInvalid={!!errors?.smtpUsername}
                    defaultValue={settings.smtpUsername}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      settings.smtpUsername = event.target.value;
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.smtpUsername}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formOutgoingPassword">
                  <Form.Label>
                    Outgoing mail password{" "}
                    <FontAwesomeIcon
                      icon={faAsterisk}
                      size="xs"
                      className="text-danger mb-1"
                    />
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Outgoing mail password"
                    isInvalid={!!errors?.smtpPassword}
                    defaultValue={settings.smtpPassword}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      settings.smtpPassword = event.target.value;
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.smtpPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <SettingsFormFolders />
      </Container>
    </React.Fragment>
  );
};
