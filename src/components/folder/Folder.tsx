import React from "react";
import {
  ImapHelper,
  ImapSocket,
  EmailParser,
  LocalStorage,
  StateManager,
  InfiniteScroll,
} from "classes";
import { MimeTools } from "lib";
import {
  EImapResponseStatus,
  IComposeAttachment,
  IEmail,
  IEmailAttachment,
  IFolderEmail,
  IFolderLongPress,
  IFolderPlaceholder,
  IFolderScrollSpinner,
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
  FolderPlaceholder,
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
  folderPlaceholder?: IFolderPlaceholder;
  folderScrollSpinner?: IFolderScrollSpinner;
}

export class Folder extends React.PureComponent<IFolderProps, IFolderState> {
  /**
   * @var {number} folderPageSize
   */
  protected folderPageSize: number = 15;

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

  /**
   * @var {IFolderLongPress} longPress
   */
  protected folderLongPress: IFolderLongPress;

  /**
   * @constructor
   */
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
      "topObserver",
      "bottomObserver",
      ({
        minIndex,
        maxIndex,
        folderPlaceholder,
        folderScrollSpinner,
        callback,
      }) => {
        this.setState(
          {
            emails: this.emails?.slice(minIndex, maxIndex),
            displayTableHeader: minIndex === 0,
            folderPlaceholder,
            folderScrollSpinner,
          },
          callback
        );
      },
      this.folderPageSize
    );

    this.state = {
      displayTableHeader: true,
      displayTableOptions: false,
      showActionModal: false,
      actionType: EFolderEmailActionType.COPY,
      folderSpinner: false,
    };

    this.folderLongPress = {
      timer: 0,
      isReturned: false,
    };
  }

  public async componentDidMount() {
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

    this.setState(
      {
        emails: this.emails?.slice(0, this.folderPageSize),
        folderSpinner: false,
      },
      () => {
        if (this.emails?.length) {
          this.infiniteScroll.setTotalEntries(this.emails.length ?? 0);

          this.infiniteScroll.startObservation();
          this.infiniteScroll.startHandleScroll();

          this.clearAllSelections();
        }
      }
    );
  }

  public componentWillUnmount() {
    this.infiniteScroll.stopObservertion();
    this.infiniteScroll.stopHandleScroll();
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
      `UID FETCH ${fetchUid}:* (FLAGS BODY[HEADER.FIELDS (DATE FROM SUBJECT)] BODYSTRUCTURE)`
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

  public searchEmails(searchQuery: string) {
    const searchQueryLowercase: string = searchQuery.toLowerCase();
    
    const currentEmails: IFolderEmail[] =
      this.stateManager.getCurrentFolder()?.emails ?? [];

    this.emails =
      searchQuery.length > 0
        ? currentEmails.filter((email: IFolderEmail) => {
            let queryFound: boolean = false;

            if (
              email.date.toLowerCase().indexOf(searchQueryLowercase) > -1 ||
              email.from.toLowerCase().indexOf(searchQueryLowercase) > -1 ||
              email.subject.toLowerCase().indexOf(searchQueryLowercase) > -1
            ) {
              queryFound = true;
            }

            return queryFound;
          })
        : currentEmails;

    this.infiniteScroll.setTotalEntries(this.emails.length);

    this.updateVisibleEmails(this.folderPageSize);
  }

  public viewEmail = (uid: number): void => {
    this.stateManager.setActiveUid(uid);

    this.stateManager.updateActiveKey("view");
  };

  public deleteEmail = (uid: number): void => {
    this.setState({
      actionUids: [uid],
      actionType: EFolderEmailActionType.DELETE,
      showActionModal: true,
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

    const convertedAttachments:
      | IComposeAttachment[]
      | undefined = await this.convertAttachments(email.attachments);

    this.stateManager.setComposePresets({
      subject: email.subject,
      from: email.from,
      email: email.bodyHtml ?? email.bodyText ?? "",
      attachments: convertedAttachments,
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

    const convertedAttachments:
      | IComposeAttachment[]
      | undefined = await this.convertAttachments(email.attachments);

    this.stateManager.setComposePresets({
      subject: email.subject,
      email: email.bodyHtml ?? email.bodyText ?? "",
      attachments: convertedAttachments,
    });

    this.stateManager.updateActiveKey("compose");
  };

  public convertAttachments = async (
    attachments: IEmailAttachment[] | undefined
  ): Promise<IComposeAttachment[] | undefined> => {
    if (!attachments) {
      return undefined;
    }

    let count: number = 0;

    return await attachments.reduce(
      async (
        convertedAttachments: Promise<IComposeAttachment[]>,
        attachment: IEmailAttachment
      ) => {
        const attachmentContent: Blob = MimeTools.base64toBlob(
          attachment.content,
          attachment.mimeType
        );

        const fileReaderResponse: FileReader = await new Promise((resolve) => {
          const fileReader = new FileReader();

          fileReader.onload = () => resolve(fileReader);
          fileReader.readAsBinaryString(attachmentContent);
        });

        (await convertedAttachments).push({
          id: count++,
          filename: attachment.filename,
          size: 0,
          mimeType: attachment.mimeType,
          data: fileReaderResponse.result,
        });

        return Promise.resolve(convertedAttachments);
      },
      Promise.resolve([])
    );
  };

  public removeUids = (uids?: number[]): void => {
    uids?.forEach((uid: number) => {
      this.emails?.forEach((email: IFolderEmail, emailKey: number) => {
        if (email.uid === uid) {
          this.emails?.splice(emailKey, 1);
        }
      });
    });

    this.updateVisibleEmails();
  };

  public updateVisibleEmails = (definedLength?: number): void => {
    if (this.emails) {
      const currentSlice = this.infiniteScroll.getCurrentSlice();
      const currentSliceLength: number | undefined = definedLength
        ? definedLength
        : currentSlice.maxIndex - currentSlice.minIndex;

      if (currentSlice && currentSliceLength) {
        this.setState({
          emails: this.emails.slice(currentSlice.minIndex, currentSliceLength),
        });
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

  public toggleSelection = (uid: number, forceToogle?: boolean): void => {
    if (this.emails) {
      if (uid === -1) {
        if (forceToogle !== undefined) {
          this.toggleSelectionAll = forceToogle;
        } else {
          this.toggleSelectionAll = this.toggleSelectionAll ? false : true;
        }
      }

      this.emails.forEach((email: IFolderEmail, emailKey: number) => {
        if (uid === -1) {
          this.emails![emailKey].selected = this.toggleSelectionAll;
        } else if (email.uid === uid) {
          if (forceToogle !== undefined) {
            this.emails![emailKey].selected = forceToogle;
          } else {
            this.emails![emailKey].selected = this.emails![emailKey].selected
              ? false
              : true;
          }
        }
      });

      this.updateVisibleEmails();

      this.toggleTableOptionsDisplay();
    }
  };

  public clearAllSelections = (): void => {
    if (this.emails) {
      this.emails.forEach((email: IFolderEmail, emailKey: number) => {
        this.emails![emailKey].selected = false;
      });
    }
  };

  public handleLongPress: (emailUid: number, delay?: number) => void = (
    emailUid,
    delay = 1000
  ) => {
    this.folderLongPress.isReturned = false;

    this.folderLongPress.timer = setTimeout((handler: TimerHandler): void => {
      this.folderLongPress.isReturned = true;

      this.toggleSelection(emailUid);
    }, delay);
  };

  public handleLongRelease: () => void = () => {
    clearTimeout(this.folderLongPress.timer);

    this.folderLongPress.timer = 0;
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
                  <Form.Control
                    type="text"
                    placeholder="Search &hellip;"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      this.searchEmails(event.target.value)
                    }
                  />
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
              <FolderTableOptions
                displayTableOptions={this.state.displayTableOptions}
                toggleSelection={this.toggleSelection}
                toggleActionModal={this.toggleActionModal}
              />
              {this.state.displayTableHeader && (
                <FolderTableHeader
                  emails={this.emails ?? []}
                  toggleSelection={this.toggleSelection}
                  updateVisibleEmails={this.updateVisibleEmails}
                />
              )}
              <FolderPlaceholder height={this.state.folderPlaceholder?.top} />
              {this.state.folderScrollSpinner?.top && (
                <div className="w-100 text-center d-block d-sm-none">
                  <Spinner
                    className="mt-3 mb-3"
                    animation="grow"
                    variant="dark"
                  />
                </div>
              )}
              <div id="topObserver"></div>
              {this.state.emails.map((email: IFolderEmail) => (
                <FolderEmailEntry
                  key={email.id}
                  email={email}
                  toggleSelection={this.toggleSelection}
                  viewEmail={this.viewEmail}
                  replyToEmail={this.replyToEmail}
                  forwardEmail={this.forwardEmail}
                  deleteEmail={this.deleteEmail}
                  folderLongPress={this.folderLongPress}
                  handleLongPress={this.handleLongPress}
                  handleLongRelease={this.handleLongRelease}
                />
              ))}
              <div id="bottomObserver"></div>
              {this.state.folderScrollSpinner?.bottom && (
                <div className="w-100 text-center d-block d-sm-none">
                  <Spinner
                    className="mt-3 mb-3"
                    animation="grow"
                    variant="dark"
                  />
                </div>
              )}
              <FolderPlaceholder
                height={this.state.folderPlaceholder?.bottom}
              />
            </Container>
          )}
        </Card>
        <FolderEmailActions
          actionUids={this.state.actionUids}
          actionType={this.state.actionType}
          showActionModal={this.state.showActionModal}
          removeUids={this.removeUids}
          imapHelper={this.imapHelper}
          imapSocket={this.imapSocket}
          onHide={() => this.setState({ showActionModal: false })}
        />
      </React.Fragment>
    );
  }
}
