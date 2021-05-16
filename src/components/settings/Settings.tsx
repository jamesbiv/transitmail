import React, { FormEvent, useContext, useState } from "react";
import { SettingsForm, SettingsValidation } from ".";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faCog, faSync } from "@fortawesome/free-solid-svg-icons";
import {
  EImapResponseStatus,
  IFoldersEntry,
  IImapResponse,
  ISettings,
  ISettingsErrors,
  ISettingsFolders,
} from "interfaces";
import { DependenciesContext } from "contexts";

export const Settings: React.FC = () => {
  const { imapHelper, imapSocket, localStorage } = useContext(
    DependenciesContext
  );

  const [validation, setValidation] = useState<
    { message: string; type: string } | undefined
  >(undefined);

  const [errors, setErrors] = useState<ISettingsErrors | undefined>(undefined);

  const settingsDefault: Partial<ISettings> = {
    secondaryEmails: [],
    folderSettings: {
      archiveFolder: process.env.REACT_APP_DEFAULT_ARCHIVE_FOLDER ?? "",
      draftsFolder: process.env.REACT_APP_DEFAULT_DRAFTS_FOLDER ?? "",
      sentItemsFolder: process.env.REACT_APP_DEFAULT_SENT_ITEMS_FOLDER ?? "",
      spamFolder: process.env.REACT_APP_DEFAULT_SPAM_FOLDER ?? "",
      trashFolder: process.env.REACT_APP_DEFAULT_TRASH_FOLDER ?? "",
    },
  };

  const settings = Object.assign(settingsDefault, localStorage.getSettings());

  const saveSettings = (): void => {
    const emailRegex: RegExp = /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const validationErrors: ISettingsErrors = {};

    if (settings.name === "") {
      validationErrors.name = "Please specify a valid display name";
    }
    if (!emailRegex.test(settings.email) || settings.email === "") {
      validationErrors.email = "Please specify a valid email address";
    }
    if (settings.signature?.length > 1000) {
      validationErrors.signature =
        "Signature must have a maximum of 1000 characters";
    }
    if (settings.imapHost === "") {
      validationErrors.imapHost = "Please specify an incomming mail host";
    }
    if (isNaN(settings.imapPort)) {
      validationErrors.imapPort = "Please specify an incomming mail port";
    }
    if (settings.imapUsername === "") {
      validationErrors.imapUsername =
        "Please specify an incomming mail username";
    }
    if (settings.imapPassword === "") {
      validationErrors.imapPassword =
        "Please specify an incomming mail password";
    }
    if (settings.smtpHost === "") {
      validationErrors.smtpHost = "Please specify an outgoing mail host";
    }
    if (isNaN(settings.smtpPort)) {
      validationErrors.smtpPort = "Please specify an outgoing mail port";
    }
    if (settings.smtpUsername === "") {
      validationErrors.smtpUsername =
        "Please specify an outgoing mail username";
    }
    if (settings.smtpPassword === "") {
      validationErrors.smtpPassword =
        "Please specify an outgoing mail password";
    }

    if (Object.keys(validationErrors).length) {
      const errorMessages = `<ul> ${Object.keys(validationErrors).reduce(
        (errorResponse: string, key: string): string => {
          errorResponse += "<li>" + validationErrors[key] + "</li>";

          return errorResponse;
        },
        ""
      )}</ul>`;

      setValidation({
        message: `Please check the following errors: ${errorMessages}`,
        type: "error",
      });

      setErrors(validationErrors);

      return;
    }

    createFolders(settings.folderSettings);

    setValidation({ message: "Settings saved successfully", type: "info" });

    localStorage.setSettings(settings);
  };

  const createFolders = async (
    folderSettings: ISettingsFolders
  ): Promise<void> => {
    if (imapSocket.getReadyState() !== 1) {
      imapSocket.imapConnect();
    }

    const listResponse = await imapSocket.imapRequest(`LIST "" "*"`);

    const currentFolders: IFoldersEntry[] = imapHelper.formatListFoldersResponse(
      listResponse.data
    );

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
      <Card.Header>
        <h4 className="p-0 m-0 text-nowrap">
          <FontAwesomeIcon icon={faCog} /> Settings
        </h4>
      </Card.Header>
      <Form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          (document.getElementById("container-main") as HTMLElement).scroll(
            0,
            0
          );

          saveSettings();
        }}
        noValidate={true}
      >
        <Card.Body>
          <SettingsValidation validation={validation} />
          <SettingsForm settings={settings} errors={errors} />
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col>
              <Button variant="primary" type="submit" block>
                <FontAwesomeIcon icon={faSave} /> Save
              </Button>
            </Col>
            <Col>
              <Button className="mr-2" type="button" variant="secondary" block>
                <FontAwesomeIcon icon={faSync} /> Verify{" "}
                <span className="d-none d-sm-inline-block">settings</span>
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Form>
    </Card>
  );
};
