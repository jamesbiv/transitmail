import React, { ChangeEvent, Dispatch, Fragment, FunctionComponent, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  FormControl,
  FormGroup,
  FormCheck,
  FormLabel,
  FormText,
  CardBody,
  CardHeader
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { ISettings, ISettingsSecondaryEmail, ISettingsValidationCondition } from "interfaces";
import { SettingsSecondaryEmails, SettingsFormFolders } from ".";

/**
 * @interface ISettingsFormProps
 */
interface ISettingsFormProps {
  settings: ISettings;
  validationConditions: ISettingsValidationCondition[];
  displayFormFolders: boolean;
  setSettings: Dispatch<ISettings>;
  setDisplayFormFolders: Dispatch<boolean>;
}

/**
 * SettingsForm
 * @param {ISettingsFormProps} properties
 * @returns FunctionComponent
 */
export const SettingsForm: FunctionComponent<ISettingsFormProps> = ({
  settings,
  validationConditions,
  displayFormFolders,
  setSettings,
  setDisplayFormFolders
}) => {
  const [errorMessage, setErrorMessage] = useState<Partial<ISettings> | undefined>(undefined);

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

    const updatedErrorMessage: Partial<ISettings> | undefined = settingsCondition.constraint(
      settingValue
    )
      ? { ...errorMessage, [settingName]: undefined }
      : {
          ...errorMessage,
          [settingName]: settingsCondition.message
        };

    setErrorMessage(updatedErrorMessage);

    const updatedSettings: ISettings = {
      ...settings,
      [settingName]: settingValue
    };

    setSettings(updatedSettings);
  };

  const updateSecondaryEmails: (secondaryEmails?: ISettingsSecondaryEmail[]) => void = (
    secondaryEmails?: ISettingsSecondaryEmail[]
  ): void => {
    settings.secondaryEmails = secondaryEmails;
  };

  return (
    <Fragment>
      <FormGroup controlId="formDisplayName">
        <FormLabel>
          Display name <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
        </FormLabel>
        <FormControl
          type="text"
          placeholder="Enter display name"
          isInvalid={!!errorMessage?.name}
          defaultValue={settings.name}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setSettingValue("name", event.target.value)
          }
        />
        <FormText className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
        </FormText>
        <FormControl.Feedback type="invalid">{errorMessage?.name}</FormControl.Feedback>
      </FormGroup>
      <FormGroup controlId="formEmailAddress">
        <FormLabel>
          Email address <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
        </FormLabel>
        <FormControl
          type="email"
          placeholder="Enter email address"
          isInvalid={!!errorMessage?.email}
          defaultValue={settings.email}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setSettingValue("email", event.target.value)
          }
        />
        <FormText className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
        </FormText>
        <FormControl.Feedback type="invalid">{errorMessage?.email}</FormControl.Feedback>
      </FormGroup>
      <FormGroup controlId="formEmailSignature">
        <FormLabel>Email signature</FormLabel>
        <FormControl
          as="textarea"
          rows={3}
          placeholder="Enter email signature"
          isInvalid={!!errorMessage?.signature}
          defaultValue={settings.signature}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setSettingValue("signature", event.target.value);
          }}
        />
        <FormControl.Feedback type="invalid">{errorMessage?.signature}</FormControl.Feedback>
      </FormGroup>
      <FormGroup controlId="formEmailAutoLogin">
        <FormCheck
          type="switch"
          id="autoLogin"
          label="Ask for password before sign-in"
          /*defaultChecked={settings.autoLogin}
          onChange={() => {
          settings.autoLogin = settings.autoLogin ? false : true;
          }}*/
        />
        <FormText className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit ...
        </FormText>
      </FormGroup>
      <SettingsSecondaryEmails
        secondaryEmails={settings.secondaryEmails}
        updateSecondaryEmails={updateSecondaryEmails}
      />
      <Container fluid className="p-0">
        <Row>
          <Col md={12} lg={6}>
            <Card>
              <CardHeader>Incomming settings (IMAP)</CardHeader>
              <CardBody>
                <FormGroup controlId="formIncommingHost">
                  <FormLabel>
                    Incomming mail host{" "}
                    <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                  </FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Incomming mail host"
                    isInvalid={!!errorMessage?.imapHost}
                    defaultValue={settings.imapHost}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("imapHost", event.target.value)
                    }
                  />
                  <FormControl.Feedback type="invalid">
                    {errorMessage?.imapHost}
                  </FormControl.Feedback>
                </FormGroup>
                <FormGroup controlId="formIncommingPort">
                  <FormLabel>
                    Incomming mail port{" "}
                    <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                  </FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Incomming mail port"
                    isInvalid={!!errorMessage?.imapPort}
                    defaultValue={settings.imapPort}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("imapPort", Number(event.target.value))
                    }
                  />
                  <FormControl.Feedback type="invalid">
                    {errorMessage?.imapPort}
                  </FormControl.Feedback>
                </FormGroup>
                <FormGroup controlId="formIncommingUser">
                  <FormLabel>
                    Incomming mail username{" "}
                    <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                  </FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Incomming mail username"
                    isInvalid={!!errorMessage?.imapUsername}
                    defaultValue={settings.imapUsername}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("imapUsername", event.target.value)
                    }
                  />
                  <FormControl.Feedback type="invalid">
                    {errorMessage?.imapUsername}
                  </FormControl.Feedback>
                </FormGroup>
                <FormGroup controlId="formIncommingPassword">
                  <FormLabel>
                    Incomming mail password{" "}
                    <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                  </FormLabel>
                  <FormControl
                    type="password"
                    placeholder="Incomming mail password"
                    isInvalid={!!errorMessage?.imapPassword}
                    defaultValue={settings.imapPassword}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("imapPassword", event.target.value)
                    }
                  />
                  <FormControl.Feedback type="invalid">
                    {errorMessage?.imapPassword}
                  </FormControl.Feedback>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col md={12} lg={6} className="mt-3 mt-lg-0">
            <Card>
              <CardHeader>Outgoing settings (SMTP)</CardHeader>
              <CardBody>
                <FormGroup controlId="formOutgoingHost">
                  <FormLabel>
                    Outgoing mail host{" "}
                    <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                  </FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Outgoing mail host"
                    isInvalid={!!errorMessage?.smtpHost}
                    defaultValue={settings.smtpHost}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("smtpHost", event.target.value)
                    }
                  />
                  <FormControl.Feedback type="invalid">
                    {errorMessage?.smtpHost}
                  </FormControl.Feedback>
                </FormGroup>
                <FormGroup controlId="formOutgoingPort">
                  <FormLabel>
                    Outgoing mail port{" "}
                    <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                  </FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Outgoing mail port"
                    isInvalid={!!errorMessage?.smtpPort}
                    defaultValue={settings.smtpPort}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("smtpPort", Number(event.target.value))
                    }
                  />
                  <FormControl.Feedback type="invalid">
                    {errorMessage?.smtpPort}
                  </FormControl.Feedback>
                </FormGroup>
                <FormGroup controlId="formOutgoingUser">
                  <FormLabel>
                    Outgoing mail username{" "}
                    <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                  </FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Outgoing mail username"
                    isInvalid={!!errorMessage?.smtpUsername}
                    defaultValue={settings.smtpUsername}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("smtpUsername", event.target.value)
                    }
                  />
                  <FormControl.Feedback type="invalid">
                    {errorMessage?.smtpUsername}
                  </FormControl.Feedback>
                </FormGroup>
                <FormGroup controlId="formOutgoingPassword">
                  <FormLabel>
                    Outgoing mail password{" "}
                    <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
                  </FormLabel>
                  <FormControl
                    type="password"
                    placeholder="Outgoing mail password"
                    isInvalid={!!errorMessage?.smtpPassword}
                    defaultValue={settings.smtpPassword}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      setSettingValue("smtpPassword", event.target.value)
                    }
                  />
                  <FormControl.Feedback type="invalid">
                    {errorMessage?.smtpPassword}
                  </FormControl.Feedback>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <SettingsFormFolders
          folderSettings={settings.folderSettings}
          displayFormFolders={displayFormFolders}
          setDisplayFormFolders={setDisplayFormFolders}
        />
      </Container>
    </Fragment>
  );
};
