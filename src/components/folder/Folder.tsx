import React from "react";
import {
  ImapHelper,
  ImapSocket,
  EmailParser,
  LocalStorage,
  StateManager,
  InfiniteScroll,
} from "classes";
import { EImapResponseStatus, IFolderEmail } from "interfaces";
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
import { FolderEmailEntry, FolderTableHeader } from ".";

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
  folderSpinner: boolean;
  message?: string;
  messageType?: string;
}

class Folder extends React.PureComponent<IFolderProps, IFolderState> {
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

    this.infiniteScroll = new InfiniteScroll(
      "container-main",
      (minIndex: number, maxIndex: number) => {
        if (this.emails && maxIndex <= this.emails.length) {
          this.setState({
            emails: this.emails?.slice(minIndex, maxIndex),
            displayTableHeader: minIndex === 0,
          });
        }
      }
    );

    this.state = {
      displayTableHeader: true,
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

    this.setState({
      folderSpinner: false,
      emails: this.emails?.slice(0, 15),
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

    this.emails = latestEmails
      ? [
          ...latestEmails,
          ...(this.stateManager.getCurrentFolder()?.emails ?? []),
        ]
      : this.stateManager.getCurrentFolder()?.emails;

    this.stateManager.updateCurrentFolder(this.emails);

    this.setState({
      folderSpinner: false,
      emails: this.emails?.slice(0, 15),
    });
  };

  private async getLatestEmails(
    lastUid?: number
  ): Promise<IFolderEmail[] | undefined> {
    const folderId: string | undefined = this.stateManager.getFolderId();

    const selectResponse = await this.imapSocket.imapRequest(
      `SELECT "${folderId}"`
    );

    if (selectResponse.status !== EImapResponseStatus.OK) {
      return undefined;
    }

    // Can use ENVELOPE instead of FETCH here aswell
    const fetchResponse = await this.imapSocket.imapRequest(
      `UID FETCH ${
        lastUid ?? 1
      }:* (FLAGS BODY[HEADER.FIELDS (DATE FROM SUBJECT)])`
    );

    if (fetchResponse.status !== EImapResponseStatus.OK) {
      return undefined;
    }

    const emails = this.imapHelper.formatFetchFolderEmailsResponse(
      fetchResponse.data
    );

    emails.sort((a, b) => [1, -1][Number(a.epoch > b.epoch)]);

    return emails;
  }

  public updateActiveKeyUid = (activeKey: string, activeUid: number): void => {
    this.stateManager.setActiveUid(activeUid);
    this.stateManager.updateActiveKey(activeKey);
  };

  deleteEmail = (uid: number): void => {
    (async () => {
      await this.imapSocket.imapRequest(`UID STORE ${uid} +FLAGS (\\Deleted)`);
    })();

    this.setState({
      message: "This email has been marked for deletion.",
      messageType: "danger",
    });
  };

  unDeleteEmail = (uid: number): void => {
    (async () => {
      await this.imapSocket.imapRequest(`UID STORE ${uid} -FLAGS (\\Deleted)`);
    })();

    this.setState({
      message: "This email has been undeleted.",
      messageType: "info",
    });
  };

  replyToEmail = async (uid: number): Promise<void> => {
    const fetchEmailResponse = await this.imapSocket.imapRequest(
      `UID FETCH ${uid} RFC822`
    );

    const emailRaw: string = fetchEmailResponse.data[1][0];
    const email = this.emailParser.processEmail(emailRaw);

    this.stateManager.setComposePresets({
      subject: email.subject,
      from: email.from,
      email: email.bodyHtml ?? email.bodyText ?? "",
    });

    this.stateManager.updateActiveKey("compose");
  };

  forwardEmail = async (uid: number): Promise<void> => {
    const fetchEmailResponse = await this.imapSocket.imapRequest(
      `UID FETCH ${uid} RFC822`
    );

    const emailRaw: string = fetchEmailResponse.data[1][0];
    const email = this.emailParser.processEmail(emailRaw);

    this.stateManager.setComposePresets({
      subject: email.subject,
      email: email.bodyHtml ?? email.bodyText ?? "",
    });

    this.stateManager.updateActiveKey("compose");
  };

  setEmails = (emails: IFolderEmail[]): void => {
    this.emails = emails;
    this.setState({ emails: this.emails?.slice(0, 15) });
  };

  render() {
    return (
      <Card className={this.state.displayTableHeader ? "mt-0 mt-sm-3" : ""}>
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
            {this.state.displayTableHeader && (
              <FolderTableHeader
                emails={this.emails ?? []}
                setEmails={this.setEmails}
              />
            )}
            {this.state.emails.map((email: IFolderEmail) => (
              <FolderEmailEntry
                key={email.id}
                email={email}
                updateActiveKeyUid={this.updateActiveKeyUid}
                replyToEmail={this.replyToEmail}
                forwardEmail={this.forwardEmail}
                deleteEmail={this.deleteEmail}
              />
            ))}
          </Container>
        )}
      </Card>
    );
  }
}

export default Folder;
