import React, { FormEvent, useContext, useState } from "react";
import { SettingsForm, SettingsValidation, validationConditions } from ".";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
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
  ISmtpResponse,
} from "interfaces";
import { DependenciesContext } from "contexts";

interface ISettingsValidation {
  message: string;
  type: string;
}

export const Settings: React.FC = () => {
  const { imapHelper, imapSocket, smtpSocket, localStorage, stateManager } =
    useContext(DependenciesContext);

  const settingsDefault: Partial<ISettings> = {
    folderSettings: {
      archiveFolder: process.env.REACT_APP_DEFAULT_ARCHIVE_FOLDER ?? "",
      draftsFolder: process.env.REACT_APP_DEFAULT_DRAFTS_FOLDER ?? "",
      sentItemsFolder: process.env.REACT_APP_DEFAULT_SENT_ITEMS_FOLDER ?? "",
      spamFolder: process.env.REACT_APP_DEFAULT_SPAM_FOLDER ?? "",
      trashFolder: process.env.REACT_APP_DEFAULT_TRASH_FOLDER ?? "",
    },
  };

  const settings: ISettings = {
    ...settingsDefault,
    ...localStorage.getSettings(),
  };

  const [displayFormFolders, setDisplayFormFolders] = useState<boolean>(false);

  const [validation, setValidation] =
    useState<ISettingsValidation | undefined>(undefined);

  const saveSettings = async (): Promise<void> => {
    const validationErrors: ISettingsErrors = processValidationConditions();

    if (Object.keys(validationErrors).length) {
      const errorMessages: string =
        processValidationErrorMessages(validationErrors);

      if (settings.folderSettings) {
        setDisplayFormFolders(true);
      }

      setValidation({
        message: `Please check the following errors: ${errorMessages}`,
        type: "error",
      });

      return;
    }

    setValidation({ message: "Settings saved successfully", type: "info" });

    localStorage.setSettings(settings as Required<ISettings>);

    await createFolders(settings.folderSettings);

    return;
  };

  const processValidationConditions = (): ISettingsErrors => {
    return validationConditions.reduce(
      (
        validationResults: ISettingsErrors,
        { field, subField, constraint, message }
      ) => {
        if (!subField) {
          const settingsValue = settings[field] as string;

          if (!constraint(settingsValue)) {
            validationResults[field] = message;
          }
        } else {
          const settingsValue = settings[field] as {
            [subField: string]: string;
          };

          if (!constraint(settingsValue[subField])) {
            validationResults[field] = {
              [field]: message,
              ...(validationResults[field] as object),
            };
          }
        }

        return validationResults;
      },
      {}
    );
  };

  const processValidationErrorMessages = (
    validationErrors: ISettingsErrors
  ): string => {
    return `<ul>${Object.keys(validationErrors).reduce(
      (errorResponse: string, valueKey: string): string => {
        if (typeof validationErrors[valueKey] === "string") {
          errorResponse += `<li>${validationErrors[valueKey]}</li>`;
        }

        if (typeof validationErrors[valueKey] === "object") {
          const objectValidationErrors = validationErrors[valueKey] as {
            [key: string]: string;
          };

          errorResponse += Object.keys(objectValidationErrors).reduce(
            (errorObjectResponse: string, objectKey: string): string => {
              errorObjectResponse += `<li>${objectValidationErrors[objectKey]}</li>`;

              return errorObjectResponse;
            },
            ""
          );
        }

        return errorResponse;
      },
      ""
    )}</ul>`;
  };

  const verifySettings = async (): Promise<void> => {
    imapSocket.imapClose();
    imapSocket.imapConnect(false);

    smtpSocket.smtpClose();
    smtpSocket.smtpConnect(false);

    let imapVerfied: boolean = false;
    let smtpVerfied: boolean = true;

    const imapAuthroiseResponse: IImapResponse =
      await imapSocket.imapAuthorise();

    if (imapAuthroiseResponse.status === EImapResponseStatus.OK) {
      imapVerfied = true;
    }

    imapSocket.imapClose();

    const smtpAuthroiseResponse: ISmtpResponse =
      await smtpSocket.smtpAuthorise();

    if (smtpAuthroiseResponse.status === ESmtpResponseStatus.Success) {
      smtpVerfied = true;
    }

    smtpSocket.smtpClose();

    if (imapVerfied && smtpVerfied) {
      stateManager.showMessageModal({
        title: "Settings verfieid",
        content: "Your email settings have been verfied",
        action: () => {},
      });
    } else {
      stateManager.showMessageModal({
        title: "Unable to verify your settings",
        content:
          "Unable to verifiy your email settings, please check your credientals and try again",
        action: () => {},
      });
    }
  };

  const createFolders = async (
    folderSettings: ISettingsFolders
  ): Promise<void> => {
    if (imapSocket.getReadyState() !== 1) {
      imapSocket.imapConnect();
    }

    const listResponse = await imapSocket.imapRequest(`LIST "" "*"`);

    const currentFolders: IFoldersEntry[] =
      imapHelper.formatListFoldersResponse(listResponse.data);

    Object.keys(folderSettings).forEach(async (settingsFolder: string) => {
      const folderPath: string = folderSettings[settingsFolder];

      const folderFound: boolean = currentFolders.some(
        (currentFolder: IFoldersEntry) => currentFolder.name === folderPath
      );

      if (!folderFound) {
        const createFolderResponse: IImapResponse =
          await imapSocket.imapRequest(`CREATE "${folderPath}"`);

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

          const containerElement = document.getElementById(
            "container-main"
          ) as HTMLElement;

          containerElement.scroll(0, 0);

          saveSettings();
        }}
        noValidate={true}
      >
        <Card.Body>
          <SettingsValidation validation={validation} />
          <SettingsForm
            settings={settings}
            validationConditions={validationConditions}
            displayFormFolders={displayFormFolders}
            setDisplayFormFolders={setDisplayFormFolders}
          />
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col>
              <Button variant="primary" type="submit">
                <FontAwesomeIcon icon={faSave} /> Save
              </Button>
            </Col>
            <Col>
              <Button
                className="me-2"
                type="button"
                variant="secondary"
                onClick={() => verifySettings()}
              >
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
