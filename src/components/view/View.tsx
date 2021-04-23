import React from "react";
import { Card, ProgressBar, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelopeOpen,
  faTimes,
  faCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import {
  ImapHelper,
  ImapSocket,
  LocalStorage,
  MimeTools,
  StateManager,
} from "classes";
import {
  IEmail,
  EImapResponseStatus,
  IComposeAttachment,
  IEmailAttachment,
  IImapResponse,
  IEmailFlags,
} from "interfaces";
import { ViewActions, EViewActionType, ViewAttachments, ViewHeader } from ".";

interface IViewProps {
  dependencies: {
    imapHelper: ImapHelper;
    imapSocket: ImapSocket;
    localStorage: LocalStorage;
    mimeTools: MimeTools;
    stateManager: StateManager;
  };
}

interface IViewState {
  email?: IEmail;
  emailFlags?: IEmailFlags;
  progressBarNow: number;
  message: string;
  messageType: string;
  showEmail: boolean;
  actionUid?: number;
  actionType: EViewActionType;
  showActionModal: boolean;
}

interface IViewProgressBar {
  max: number;
  now: number;
}

export class View extends React.PureComponent<IViewProps, IViewState> {
  /**
   * @var {MimeTools} mimeTools
   */
  protected mimeTools: MimeTools;

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
   * @var {IViewProgressBar} progressBar
   */
  protected progressBar: IViewProgressBar;

  /**
   * @constructor
   * @param {IViewProps} props
   */
  constructor(props: IViewProps) {
    super(props);

    this.imapHelper = props.dependencies.imapHelper;
    this.imapSocket = props.dependencies.imapSocket;
    this.localStorage = props.dependencies.localStorage;
    this.mimeTools = props.dependencies.mimeTools;
    this.stateManager = props.dependencies.stateManager;

    this.state = {
      progressBarNow: 0,
      message: "",
      messageType: "",
      showEmail: false,
      actionType: EViewActionType.VIEW,
      showActionModal: false,
    };

    this.progressBar = { max: 0, now: 0 };
  }

  componentDidMount() {
    if (this.imapSocket.getReadyState() !== 1) {
      this.imapSocket.imapConnect();
    }

    this.getEmail();
  }

  getEmail = async () => {
    const folderId: string | undefined = this.stateManager.getFolderId();

    if (!folderId) {
      this.stateManager.updateActiveKey("inbox");
    }

    const selectResponse: IImapResponse = await this.imapSocket.imapRequest(
      `SELECT "${folderId}"`
    );

    if (selectResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const fetchFlagsResponse: IImapResponse = await this.imapSocket.imapRequest(
      `UID FETCH ${this.stateManager.getActiveUid()} (RFC822.SIZE FLAGS)`
    );

    if (fetchFlagsResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const emailFlags:
      | IEmailFlags
      | undefined = this.imapHelper.formatFetchEmailFlagsResponse(
      fetchFlagsResponse.data
    );

    if (!emailFlags) {
      return;
    }

    this.setState({ emailFlags });

    this.progressBar.max = emailFlags.size;
    this.checkProgressBar();

    const fetchEmailResponse: IImapResponse = await this.imapSocket.imapRequest(
      `UID FETCH ${this.stateManager.getActiveUid()} RFC822`
    );

    if (fetchEmailResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const email: IEmail = this.imapHelper.formatFetchEmailResponse(
      fetchEmailResponse.data
    );

    this.setState({ email });
  };

  checkProgressBar = () => {
    const setTimeoutMaxMs: number = 300000; // 5mins
    let setTimeoutFallback: number = 0;

    this.progressBar.now = this.imapSocket.getStreamAmount();

    const progressBarNow: number = Math.ceil(
      (this.progressBar.now / this.progressBar.max) * 100
    );

    this.setState({
      progressBarNow: progressBarNow > 100 ? 100 : progressBarNow,
    });

    const progressBarThreshold: number =
      this.progressBar.max - (this.progressBar.max * 5) / 100;

    if (
      progressBarThreshold > this.progressBar.now &&
      setTimeoutFallback < setTimeoutMaxMs
    ) {
      setTimeout(() => {
        setTimeoutFallback += 10;

        this.checkProgressBar();
      }, 10);
    } else {
      setTimeout(() => {
        this.setState({
          showEmail: true,
        });
      }, 1000);
    }
  };

  replyToEmail = async (all: boolean = false) => {
    const email: IEmail | undefined = this.state.email;

    if (email) {
      const convertedAttachments:
        | IComposeAttachment[]
        | undefined = await this.convertAttachments(email.attachments);

      this.stateManager.setComposePresets({
        from: email?.from,
        subject: email?.subject,
        email: email?.bodyHtml ?? email?.bodyText ?? "",
        attachments: convertedAttachments,
      });

      this.stateManager.updateActiveKey("compose");
    }
  };

  forwardEmail = async () => {
    const email: IEmail | undefined = this.state.email;

    if (email) {
      const convertedAttachments:
        | IComposeAttachment[]
        | undefined = await this.convertAttachments(email.attachments);

      this.stateManager.setComposePresets({
        subject: email.subject,
        email: email.bodyHtml ?? email.bodyText ?? "",
        attachments: convertedAttachments,
      });

      this.stateManager.updateActiveKey("compose");
    }
  };

  convertAttachments = async (
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
        const attachmentContent: Blob = this.mimeTools.base64toBlob(
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

  toggleActionModal = (actionType: EViewActionType): void => {
    const actionUid: number | undefined = this.stateManager.getActiveUid();

    this.setState({ actionUid, actionType, showActionModal: true });
  };

  render() {
    return !this.state.showEmail ? (
      <Card className="mt-0 mt-sm-3">
        <Card.Body>
          <>
            <ProgressBar className="mb-2" now={this.state.progressBarNow} />
          </>
        </Card.Body>
      </Card>
    ) : (
      <React.Fragment>
        <Card className="mt-0 mt-sm-3 mb-3">
          <Card.Header>
            <h4 className="p-0 m-0 text-truncate">
              <FontAwesomeIcon icon={faEnvelopeOpen} />{" "}
              {this.state.email?.subject?.length
                ? this.state.email.subject
                : "(no subject)"}
            </h4>
          </Card.Header>
          <Card.Header>
            <ViewHeader
              toggleActionModal={this.toggleActionModal}
              replyToEmail={this.replyToEmail}
              forwardEmail={this.forwardEmail}
              email={this.state.email!}
            />
          </Card.Header>
          <Card.Body
            className={`border-bottom pt-2 pb-2 pl-3 pr-3 ${
              !this.state.email?.attachments?.length ? "d-none" : "d-block"
            }`}
          >
            <ViewAttachments
              attachments={this.state.email!.attachments}
              base64toBlob={this.mimeTools.base64toBlob}
            />
          </Card.Body>
          <Card.Body>
            <Alert
              className={!this.state.message.length ? "d-none" : "d-block"}
              variant={
                this.state.messageType === "info"
                  ? "success"
                  : this.state.messageType === "warning"
                  ? "warning"
                  : "danger"
              }
            >
              <FontAwesomeIcon
                icon={
                  this.state.messageType === "info"
                    ? faCheck
                    : this.state.messageType === "warning"
                    ? faExclamationTriangle
                    : faTimes
                }
              />{" "}
              {this.state.message}
            </Alert>
            {this.state.email?.bodyHtml ? (
              <iframe
                id="emailBody"
                title="emailBody"
                className="email-body"
                frameBorder="0"
                onLoad={() => {
                  const emailBodyFrame: HTMLIFrameElement = document.getElementById(
                    "emailBody"
                  ) as HTMLIFrameElement;

                  emailBodyFrame.style.height =
                    emailBodyFrame.contentWindow!.document.documentElement
                      .scrollHeight + "px";
                }}
                srcDoc={this.state.email.bodyHtml}
                referrerPolicy="no-referrer"
              />
            ) : (
              <pre>{this.state.email?.bodyText}</pre>
            )}
          </Card.Body>
        </Card>
        <ViewActions
          actionUid={this.state.actionUid}
          actionType={this.state.actionType}
          email={this.state.email!}
          emailFlags={this.state.emailFlags!}
          showActionModal={this.state.showActionModal}
          imapHelper={this.imapHelper}
          imapSocket={this.imapSocket}
          onHide={() => this.setState({ showActionModal: false })}
        />
      </React.Fragment>
    );
  }
}
