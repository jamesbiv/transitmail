import React, { FormEvent } from "react";
import { ImapHelper, ImapSocket, LocalStorage } from "classes";
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

interface ISettingsProps {
  dependencies: {
    imapSocket: ImapSocket;
    imapHelper: ImapHelper;
    localStorage: LocalStorage;
  };
}

interface ISettingsState {
  message?: string;
  messageType?: string;
  errors?: ISettingsErrors;
}

export class Settings extends React.PureComponent<
  ISettingsProps,
  ISettingsState
> {
  /**
   * @var {ImapSocket} imapSocket
   */
  protected imapSocket: ImapSocket;

  /**
   * @var {ImapHelper} imapHelper
   */
  protected imapHelper: ImapHelper;

  /**
   * @var {LocalStorage} localStorage
   */
  protected localStorage: LocalStorage;

  /**
   * @var {ISettings} settings
   */
  protected settings: ISettings;

  /**
   * @constructor
   * @param {ISettingsProps} props
   */
  constructor(props: ISettingsProps) {
    super(props);

    this.imapSocket = props.dependencies.imapSocket;
    this.localStorage = props.dependencies.localStorage;
    this.imapHelper = props.dependencies.imapHelper;

    const settingsDefault: Partial<ISettings> = {
      folderSettings: {
        archiveFolder: process.env.REACT_APP_DEFAULT_ARCHIVE_FOLDER ?? "",
        draftsFolder: process.env.REACT_APP_DEFAULT_DRAFTS_FOLDER ?? "",
        sentItemsFolder: process.env.REACT_APP_DEFAULT_SENT_ITEMS_FOLDER ?? "",
        spamFolder: process.env.REACT_APP_DEFAULT_SPAM_FOLDER ?? "",
        trashFolder: process.env.REACT_APP_DEFAULT_TRASH_FOLDER ?? "",
      },
    };

    this.settings = Object.assign(
      settingsDefault,
      this.localStorage.getSettings()
    );
  }

  public saveSettings() {
    const emailRegex: RegExp = /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const errors: ISettingsErrors = {};

    if (this.settings.name === "") {
      errors.name = "Please specify a valid display name";
    }
    if (!emailRegex.test(this.settings.email) || this.settings.email === "") {
      errors.email = "Please specify a valid email address";
    }
    if (this.settings.signature?.length > 1000) {
      errors.signature = "Signature must have a maximum of 1000 characters";
    }
    if (this.settings.imapHost === "") {
      errors.imapHost = "Please specify an incomming mail host";
    }
    if (isNaN(this.settings.imapPort)) {
      errors.imapPort = "Please specify an incomming mail port";
    }
    if (this.settings.imapUsername === "") {
      errors.imapUsername = "Please specify an incomming mail username";
    }
    if (this.settings.imapPassword === "") {
      errors.imapPassword = "Please specify an incomming mail password";
    }
    if (this.settings.smtpHost === "") {
      errors.smtpHost = "Please specify an outgoing mail host";
    }
    if (isNaN(this.settings.smtpPort)) {
      errors.smtpPort = "Please specify an outgoing mail port";
    }
    if (this.settings.smtpUsername === "") {
      errors.smtpUsername = "Please specify an outgoing mail username";
    }
    if (this.settings.smtpPassword === "") {
      errors.smtpPassword = "Please specify an outgoing mail password";
    }

    if (Object.keys(errors).length) {
      const errorMessages = `<ul> ${Object.keys(errors).reduce(
        (errorResponse: string, key: string): string => {
          errorResponse += "<li>" + errors[key] + "</li>";

          return errorResponse;
        },
        ""
      )}</ul>`;

      this.setState({
        errors: errors,
        message: "Please check the following errors: " + errorMessages,
        messageType: "error",
      });

      return;
    }

    this.createFolders(this.settings.folderSettings);

    this.setState({
      errors: undefined,
      message: "Settings saved successfully",
      messageType: "info",
    });

    this.localStorage.setSettings(this.settings);
  }

  public createFolders = async (
    folderSettings: ISettingsFolders
  ): Promise<void> => {
    if (this.imapSocket.getReadyState() !== 1) {
      this.imapSocket.imapConnect();
    }

    const listResponse = await this.imapSocket.imapRequest(`LIST "" "*"`);

    const currentFolders: IFoldersEntry[] = this.imapHelper.formatListFoldersResponse(
      listResponse.data
    );

    Object.keys(folderSettings).forEach(async (settingsFolder: string) => {
      const folderPath: string = folderSettings[settingsFolder];

      const folderFound: boolean = currentFolders.some(
        (currentFolder: IFoldersEntry) => currentFolder.name === folderPath
      );

      if (!folderFound) {
        const createFolderResponse: IImapResponse = await this.imapSocket.imapRequest(
          `CREATE "${folderPath}"`
        );

        if (createFolderResponse.status !== EImapResponseStatus.OK) {
          return;
        }
      }
    });
  };

  render() {
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

            this.saveSettings();
          }}
          noValidate={true}
        >
          <Card.Body>
            <SettingsValidation
              message={this.state?.message}
              messageType={this.state?.messageType}
            />
            <SettingsForm
              settings={this.settings}
              errors={this.state?.errors}
            />
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col>
                <Button variant="primary" type="submit" block>
                  <FontAwesomeIcon icon={faSave} /> Save
                </Button>
              </Col>
              <Col>
                <Button
                  className="mr-2"
                  type="button"
                  variant="secondary"
                  block
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
  }
}
