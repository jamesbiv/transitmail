import React from "react";
import {
  ImapHelper,
  ImapSocket,
  EmailParser,
  LocalStorage,
  StateManager,
  InfiniteScroll,
} from "classes";
import {
  EImapResponseStatus,
  IEmail,
  IFolderEmail,
  IImapResponse,
} from "interfaces";
import {
  Card,
  Button,
  Spinner,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faInbox,
  faSync,
} from "@fortawesome/free-solid-svg-icons";
import {
  FolderEmailEntry,
  FolderEmailActions,
  EFolderEmailActionType,
  FolderTableHeader,
  FolderTableOptions,
} from ".";

interface IFolderProps {
  dependencies: {
    imapHelper: ImapHelper;
    imapSocket: ImapSocket;
    localStorage: LocalStorage;
    emailParser: EmailParser;
    stateManager: StateManager;
  };
}

interface IFolderState {
  emails?: IFolderEmail[];
  displayTableHeader: boolean;
  displayTableOptions: boolean;
  folderSpinner: boolean;
  message?: string;
  messageType?: string;
  actionUids?: number[];
  actionType: EFolderEmailActionType;
  showActionModal: boolean;
}

export class Folder extends React.PureComponent<IFolderProps, IFolderState> {
  /**
   * @var {EmailParser} emailParser
   */
  protected emailParser: EmailParser;

  /**
   * @var {ImapHelper} imapHelper
   */
  protected imapHelper: ImapHelper;

  /**
   * @var {ImapSocket} imapSocket
   */
  protected imapSocket: ImapSocket;

  /**
   * @var {LocalStorage} localStorage
   */
  protected localStorage: LocalStorage;

  /**
   * @var {StateManager} stateManager
   */
  protected stateManager: StateManager;

  /**
   * @var {InfiniteScroll} infiniteScroll
   */
  protected infiniteScroll: InfiniteScroll;

  /**
   * @var {boolean} toggleSelectionAll
   */
  protected toggleSelectionAll: boolean;

  /**
   * @var {IFolderEmail} emails
   */
  protected emails?: IFolderEmail[];

  constructor(props: IFolderProps) {
    super(props);

    this.imapHelper = props.dependencies.imapHelper;
    this.imapSocket = props.dependencies.imapSocket;
    this.localStorage = props.dependencies.localStorage;
    this.emailParser = props.dependencies.emailParser;
    this.stateManager = props.dependencies.stateManager;

    this.toggleSelectionAll = false;

    this.infiniteScroll = new InfiniteScroll(
      "container-main",
      (minIndex: number, maxIndex: number) => {
        this.setState({
          emails: this.emails?.slice(minIndex, maxIndex),
          displayTableHeader: minIndex === 0,
        });
      }
    );

    this.state = {
      displayTableHeader: true,
      displayTableOptions: false,
      showActionModal: false,
      actionType: EFolderEmailActionType.COPY,
      folderSpinner: false,
    };
  }

  public async componentDidMount() {
    this.infiniteScroll.startHandler();

    if (this.imapSocket.getReadyState() !== 1) {
      this.imapSocket.imapConnect();
    }

    this.setState({
      folderSpinner: true,
    });

    this.emails =
      this.stateManager.getCurrentFolder()?.emails ||
      (await this.getLatestEmails());

    this.stateManager.updateCurrentFolder(this.emails);

    this.clearSelection();

    this.infiniteScroll.setTotalEntries(this.emails?.length ?? 0);

    this.setState({
      emails: this.emails?.slice(0, 15),
      folderSpinner: false,
    });
  }

  public componentWillUnmount() {
    this.infiniteScroll.stopHandler();
  }

  public checkEmail = async (): Promise<void> => {
    this.setState({
      folderSpinner: true,
    });

    const latestEmails: IFolderEmail[] | undefined = await this.getLatestEmails(
      this.emails && this.emails[0]?.uid
    );

    if (latestEmails && latestEmails[0]?.uid === this.emails?.[0]?.uid) {
      latestEmails.shift();
    }

    const currentEmails: IFolderEmail[] =
      this.stateManager.getCurrentFolder()?.emails ?? [];

    this.emails = latestEmails
      ? [...latestEmails, ...currentEmails]
      : currentEmails;

    this.stateManager.updateCurrentFolder(this.emails);

    this.infiniteScroll.setTotalEntries(this.emails.length);

    this.setState({
      folderSpinner: false,
      emails: this.emails?.slice(0, 15),
    });
  };

  private async getLatestEmails(
    lastUid?: number
  ): Promise<IFolderEmail[] | undefined> {
    const folderId: string | undefined = this.stateManager.getFolderId();

    const selectResponse: IImapResponse = await this.imapSocket.imapRequest(
      `SELECT "${folderId}"`
    );

    if (selectResponse.status !== EImapResponseStatus.OK) {
      return undefined;
    }

    const fetchUid: number = (lastUid ?? 0) + 1;

    const fetchResponse: IImapResponse = await this.imapSocket.imapRequest(
      `UID FETCH ${fetchUid}:* (FLAGS BODY[HEADER.FIELDS (DATE FROM SUBJECT)])`
    );

    if (fetchResponse.status !== EImapResponseStatus.OK) {
      return undefined;
    }

    const emails: IFolderEmail[] = this.imapHelper.formatFetchFolderEmailsResponse(
      fetchResponse.data
    );

    emails.sort((a, b) => [1, -1][Number(a.epoch > b.epoch)]);

    return emails;
  }

  public viewEmail = (uid: number): void => {
    this.stateManager.setActiveUid(uid);

    this.stateManager.updateActiveKey("view");
  };

  public deleteEmail = (uid: number): void => {
    (async () => {
      await this.imapSocket.imapRequest(`UID STORE ${uid} +FLAGS (\\Deleted)`);
    })();

    this.setState({
      message: "This email has been marked for deletion.",
      messageType: "danger",
    });
  };

  public replyToEmail = async (uid: number): Promise<void> => {
    const fetchEmailResponse: IImapResponse = await this.imapSocket.imapRequest(
      `UID FETCH ${uid} RFC822`
    );

    if (fetchEmailResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const email: IEmail = this.imapHelper.formatFetchEmailResponse(
      fetchEmailResponse.data
    );

    this.stateManager.setComposePresets({
      subject: email.subject,
      from: email.from,
      email: email.bodyHtml ?? email.bodyText ?? "",
    });

    this.stateManager.updateActiveKey("compose");
  };

  public forwardEmail = async (uid: number): Promise<void> => {
    const fetchEmailResponse: IImapResponse = await this.imapSocket.imapRequest(
      `UID FETCH ${uid} RFC822`
    );

    if (fetchEmailResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const email: IEmail = this.imapHelper.formatFetchEmailResponse(
      fetchEmailResponse.data
    );

    this.stateManager.setComposePresets({
      subject: email.subject,
      email: email.bodyHtml ?? email.bodyText ?? "",
    });

    this.stateManager.updateActiveKey("compose");
  };

  public updateEmails = (emails: IFolderEmail[]): void => {
    this.emails = emails;

    this.setState({ emails: this.emails?.slice(0, 15) });
  };

  public updateVisibleEmails = (): void => {
    if (this.emails) {
      const visibleEmailUid: number | undefined = this.state.emails?.[0].uid;

      if (visibleEmailUid) {
        const firstEmailKey: number | undefined = this.emails.reduce(
          (
            validKey: number | undefined,
            email: IFolderEmail,
            emailKey: number
          ) => {
            if (visibleEmailUid === email.uid) {
              validKey = emailKey;
            }

            return validKey;
          },
          undefined
        );

        if (firstEmailKey !== undefined) {
          this.setState({ emails: this.emails.slice(firstEmailKey, 15) });
        }
      }
    }
  };

  public toggleTableOptionsDisplay = () => {
    if (this.emails) {
      let displayTableOptions: boolean = false;

      this.emails.find((email: IFolderEmail) => {
        if (email.selected === true) {
          displayTableOptions = true;
        }
      });

      this.setState({ displayTableOptions });
    }
  };

  public toggleSelection = (uid: number): void => {
    if (this.emails) {
      if (uid === -1) {
        this.toggleSelectionAll = this.toggleSelectionAll ? false : true;
      }

      this.emails.forEach((email: IFolderEmail, emailKey: number) => {
        if (uid === -1) {
          this.emails![emailKey].selected = this.toggleSelectionAll;
        } else if (email.uid === uid) {
          this.emails![emailKey].selected = this.emails![emailKey].selected
            ? false
            : true;
        }
      });

      this.updateVisibleEmails();

      this.toggleTableOptionsDisplay();
    }
  };

  public clearSelection = (): void => {
    if (this.emails) {
      this.emails.forEach((email: IFolderEmail, emailKey: number) => {
        this.emails![emailKey].selected = false;
      });
    }
  };

  public toggleActionModal = (actionType: EFolderEmailActionType): void => {
    const actionUids: number[] | undefined = this.emails?.reduce(
      (selectedUids: number[], email: IFolderEmail) => {
        if (email.selected) {
          selectedUids.push(email.uid);
        }

        return selectedUids;
      },
      []
    );

    this.setState({ actionUids, actionType, showActionModal: true });
  };

  render() {
    return (
      <React.Fragment>
        <Card
          className={`${
            this.state.displayTableHeader ? "mt-0 mt-sm-3" : ""
          } mb-3`}
        >
          {this.state.displayTableHeader && (
            <Card.Header>
              <Row className="pt-3 pt-sm-0">
                <Col xs={12} sm={6} md={7} lg={9}>
                  <h4 className="p-0 m-0 text-nowrap text-truncate">
                    <FontAwesomeIcon icon={faInbox} />{" "}
                    {(this.stateManager.getFolderId() ?? "").split("/").pop()}
                    <Button
                      className="ml-2 float-right float-sm-none"
                      onClick={this.checkEmail}
                      size="sm"
                      variant="primary"
                      type="button"
                    >
                      <FontAwesomeIcon
                        icon={faSync}
                        spin={this.state.folderSpinner}
                      />
                    </Button>
                  </h4>
                </Col>
                <Col xs={12} sm={6} md={5} lg={3} className="mt-3 mt-sm-0">
                  <Form.Control type="text" placeholder="Search &hellip;" />
                </Col>
              </Row>
            </Card.Header>
          )}
          {!this.state.emails ? (
            <Spinner
              className="mt-3 mb-3 ml-auto mr-auto"
              animation="grow"
              variant="dark"
            />
          ) : !this.state.emails.length ? (
            <Card.Body className="text-center text-secondary">
              <FontAwesomeIcon icon={faFolderOpen} size="lg" />
              <br />
              <em>Folder empty</em>
            </Card.Body>
          ) : (
            <Container fluid>
              {this.state.displayTableOptions && (
                <FolderTableOptions
                  toggleActionModal={this.toggleActionModal}
                />
              )}
              {this.state.displayTableHeader && (
                <FolderTableHeader
                  emails={this.emails ?? []}
                  toggleSelection={this.toggleSelection}
                  updateEmails={this.updateVisibleEmails}
                />
              )}
              {this.state.emails.map((email: IFolderEmail) => (
                <FolderEmailEntry
                  key={email.id}
                  email={email}
                  toggleSelection={this.toggleSelection}
                  viewEmail={this.viewEmail}
                  replyToEmail={this.replyToEmail}
                  forwardEmail={this.forwardEmail}
                  deleteEmail={this.deleteEmail}
                />
              ))}
            </Container>
          )}
        </Card>
        <FolderEmailActions
          actionUids={this.state.actionUids}
          actionType={this.state.actionType}
          showActionModal={this.state.showActionModal}
          imapHelper={this.imapHelper}
          imapSocket={this.imapSocket}
          onHide={() => this.setState({ showActionModal: false })}
        />
      </React.Fragment>
    );
  }
}
