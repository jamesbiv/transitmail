import React, { useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import {
  ISettings,
  ISettingsSecondaryEmail,
  ISettingsValidationCondition,
} from "interfaces";
import { SettingsSecondaryEmails, SettingsFormFolders } from ".";

interface ISettingsFormProps {
  settings: ISettings;
  validationConditions: ISettingsValidationCondition[];
  displayFormFolders: boolean;
  setDisplayFormFolders: React.Dispatch<boolean>;
}

export const SettingsForm: React.FC<ISettingsFormProps> = ({
  settings,
  validationConditions,
  displayFormFolders,
  setDisplayFormFolders,
}) => {
  const [errorMessage, setErrorMessage] = useState<
    Partial<ISettings> | undefined
  >(undefined);

  const setSettingValue = (
    settingName: keyof ISettings,
    settingValue: string | number | boolean
  ) => {
    const settingsCondition = validationConditions.find(
      (validationCondition: ISettingsValidationCondition) =>
        validationCondition.field === settingName
    );

    if (!settingsCondition) {
      return;
    }

    const updatedErrorMessage:
      | Partial<ISettings>
      | undefined = settingsCondition.constraint(settingValue)
      ? { ...errorMessage, [settingName]: undefined }
      : {
          ...errorMessage,
          [settingName]: settingsCondition.message,
        };

    setErrorMessage(updatedErrorMessage);

    settings[settingName] = settingValue;
  };

  const updateSecondaryEmails: (
    secondaryEmails?: ISettingsSecondaryEmail[]
  ) => void = (secondaryEmails?: ISettingsSecondaryEmail[]): void => {
    settings.secondaryEmails = secondaryEmails;
  };

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
          isInvalid={!!errorMessage?.name}
          defaultValue={settings.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSettingValue("name", event.target.value)
          }
        />
        <Form.Text className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
        </Form.Text>
        <Form.Control.Feedback type="invalid">
          {errorMessage?.name}
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
          isInvalid={!!errorMessage?.email}
          defaultValue={settings.email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSettingValue("email", event.target.value)
          }
        />
        <Form.Text className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
        </Form.Text>
        <Form.Control.Feedback type="invalid">
          {errorMessage?.email}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formEmailSignature">
        <Form.Label>Email signature</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter email signature"
          isInvalid={!!errorMessage?.signature}
          defaultValue={settings.signature}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSettingValue("signature", event.target.value);
          }}
        />
        <Form.Control.Feedback type="invalid">
          {errorMessage?.signature}
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
        secondaryEmails={settings.secondaryEmails}
        updateSecondaryEmails={updateSecondaryEmails}
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
                    isInvalid={!!errorMessage?.imapHost}
                    defaultValue={settings.imapHost}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("imapHost", event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.imapHost}
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
                    isInvalid={!!errorMessage?.imapPort}
                    defaultValue={settings.imapPort}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("imapPort", Number(event.target.value))
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.imapPort}
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
                    isInvalid={!!errorMessage?.imapUsername}
                    defaultValue={settings.imapUsername}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("imapUsername", event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.imapUsername}
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
                    isInvalid={!!errorMessage?.imapPassword}
                    defaultValue={settings.imapPassword}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("imapPassword", event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.imapPassword}
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
                    isInvalid={!!errorMessage?.smtpHost}
                    defaultValue={settings.smtpHost}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("smtpHost", event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.smtpHost}
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
                    isInvalid={!!errorMessage?.smtpPort}
                    defaultValue={settings.smtpPort}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("smtpPort", Number(event.target.value))
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.smtpPort}
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
                    isInvalid={!!errorMessage?.smtpUsername}
                    defaultValue={settings.smtpUsername}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("smtpUsername", event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.smtpUsername}
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
                    isInvalid={!!errorMessage?.smtpPassword}
                    defaultValue={settings.smtpPassword}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("smtpPassword", event.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errorMessage?.smtpPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <SettingsFormFolders
          folderSettings={settings.folderSettings}
          displayFormFolders={displayFormFolders}
          setDisplayFormFolders={setDisplayFormFolders}
        />
      </Container>
    </React.Fragment>
  );
};
