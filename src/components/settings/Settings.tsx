import React, { FormEvent, FunctionComponent, useContext, useState } from "react";
import { SettingsForm, SettingsValidationMessage, settingsValidationConditions } from ".";
import { Row, Col, Card, Form, Button, CardHeader, CardBody, CardFooter } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCog, faSync } from "@fortawesome/free-solid-svg-icons";
import {
  EImapResponseStatus,
  ESmtpResponseStatus,
  IFoldersEntry,
  IImapResponse,
  ISettings,
  ISettingsErrors,
  ISettingsFolders,
  ISettingsValidationMessage
} from "interfaces";
import { DependenciesContext } from "contexts";
import {
  processValidationConditions,
  processValidationErrorMessages
} from "./SettingsValidationConditions";

/**
 * Settings
 * @returns {ReactNode}
 */
export const Settings: FunctionComponent = () => {
  const { imapHelper, imapSocket, smtpSocket, secureStorage, stateManager } =
    useContext(DependenciesContext);

  const settingsDefault: Partial<ISettings> = {
    folderSettings: {
      archiveFolder: process.env.REACT_APP_DEFAULT_ARCHIVE_FOLDER ?? "",
      draftsFolder: process.env.REACT_APP_DEFAULT_DRAFTS_FOLDER ?? "",
      sentItemsFolder: process.env.REACT_APP_DEFAULT_SENT_ITEMS_FOLDER ?? "",
      spamFolder: process.env.REACT_APP_DEFAULT_SPAM_FOLDER ?? "",
      trashFolder: process.env.REACT_APP_DEFAULT_TRASH_FOLDER ?? ""
    }
  };

  const [validationMessage, setValidationMessage] = useState<
    ISettingsValidationMessage | undefined
  >(undefined);

  const [settings, setSettings] = useState<ISettings>({
    ...settingsDefault,
    ...(secureStorage.getSettings() as ISettings)
  });

  const [verifySettingsSpinner, setVerifySettingsSpinner] = useState<boolean>(false);

  const saveSettings = async (): Promise<void> => {
    const validationErrors: ISettingsErrors = processValidationConditions(
      settingsValidationConditions,
      settings
    );

    if (Object.keys(validationErrors).length) {
      const errorMessages: string = processValidationErrorMessages(validationErrors);

      setValidationMessage({
        message: `Please check the following errors: ${errorMessages}`,
        type: "error"
      });

      return;
    }

    setValidationMessage({ message: "Settings saved successfully", type: "info" });

    secureStorage.setSettings(settings as Required<ISettings>);

    await createFolders(settings.folderSettings);
  };

  const verifySettings = async (): Promise<void> => {
    setVerifySettingsSpinner(true);

    imapSocket.settings = {
      host: settings.imapHost,
      port: settings.imapPort,
      username: settings.imapUsername,
      password: settings.imapPassword
    };

    smtpSocket.settings = {
      host: settings.smtpHost,
      port: settings.smtpPort,
      username: settings.smtpUsername,
      password: settings.smtpPassword
    };

    imapSocket.imapClose();
    smtpSocket.smtpClose();

    await Promise.all([imapSocket.imapConnect(false), smtpSocket.smtpConnect(false)]);

    let imapVerfied: boolean = false;
    let smtpVerfied: boolean = false;

    const [imapAuthoriseResponse, smtpAuthoriseResponse] = await Promise.all([
      imapSocket.imapAuthorise(),
      smtpSocket.smtpAuthorise()
    ]);

    if (imapAuthoriseResponse.status === EImapResponseStatus.OK) {
      imapVerfied = true;
    }

    if (smtpAuthoriseResponse.status === ESmtpResponseStatus.Success) {
      smtpVerfied = true;
    }

    imapSocket.imapClose();
    smtpSocket.smtpClose();

    if (!imapVerfied || !smtpVerfied) {
      stateManager.showMessageModal({
        title: "Unable to verify your settings",
        content:
          "Unable to verifiy your email settings, please check your credientals and try again"
      });

      setVerifySettingsSpinner(false);

      return;
    }

    stateManager.showMessageModal({
      title: "Settings verfieid",
      content: "Your email settings have been verfied"
    });

    setVerifySettingsSpinner(false);
  };

  const createFolders = async (folderSettings: ISettingsFolders): Promise<void> => {
    imapSocket.settings = {
      host: settings.imapHost,
      port: settings.imapPort,
      username: settings.imapUsername,
      password: settings.imapPassword
    };

    await imapSocket.imapCheckOrConnect();

    const listResponse: IImapResponse = await imapSocket.imapRequest(`LIST "" "*"`);

    const currentFolders: IFoldersEntry[] = imapHelper.formatListFoldersResponse(listResponse.data);

    Object.keys(folderSettings).forEach(async (settingsFolder: string) => {
      const folderPath: string = folderSettings[settingsFolder];

      const folderFound: boolean = currentFolders.some(
        (currentFolder: IFoldersEntry) => currentFolder.name === folderPath
      );

      if (!folderFound) {
        const createFolderResponse: IImapResponse = await imapSocket.imapRequest(
          `CREATE "${folderPath}"`
        );

        if (createFolderResponse.status !== EImapResponseStatus.OK) {
          return;
        }
      }
    });
  };

  return (
    <Card className="mt-0 mt-sm-3 mb-3">
      <CardHeader>
        <Row className="pt-2 pt-sm-0 pb-2 pb-sm-0">
          <Col xs={6}>
            <h4 className="p-0 m-0 text-nowrap">
              <FontAwesomeIcon icon={faCog} /> Settings
            </h4>
          </Col>
        </Row>
      </CardHeader>
      <Form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          const containerElement: HTMLElement = document.getElementById("container-main")!;

          containerElement.scroll(0, 0);

          saveSettings();
        }}
        noValidate={true}
      >
        <CardBody>
          <SettingsValidationMessage validationMessage={validationMessage} />
          <SettingsForm
            settingsValidationConditions={settingsValidationConditions}
            settings={settings}
            setSettings={setSettings}
          />
        </CardBody>
        <CardFooter>
          <Row>
            <Col>
              <div className="d-grid gap-2">
                <Button variant="primary" type="submit">
                  <FontAwesomeIcon icon={faSave} /> Save
                </Button>
              </div>
            </Col>
            <Col>
              <div className="d-grid gap-2">
                <Button
                  className="me-2"
                  type="button"
                  variant="secondary"
                  onClick={() => verifySettings()}
                >
                  <FontAwesomeIcon icon={faSync} spin={verifySettingsSpinner} /> Verify{" "}
                  <span className="d-none d-sm-inline-block">settings</span>
                </Button>
              </div>
            </Col>
          </Row>
        </CardFooter>
      </Form>
    </Card>
  );
};
