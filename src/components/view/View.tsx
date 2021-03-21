import React from "react";
import { Card, ProgressBar, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelopeOpen,
  faTimes,
  faCheck,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { ImapSocket, LocalStorage, EmailParser, StateManager } from "class";
import { IEmail, EImapResponseStatus } from "interfaces";
import { ViewAttachments, ViewHeader } from ".";

interface IViewProps {
  dependencies: {
    imapSocket: ImapSocket;
    localStorage: LocalStorage;
    emailParser: EmailParser;
    stateManager: StateManager;
  };
}

interface IViewState {
  email?: IEmail;
  size: number;
  seen: boolean;
  deleted: boolean;
  flags: string;
  progressBarNow: number;
  message: string;
  messageType: string;
  showEmail: boolean;
}

interface IProgressBar {
  max: number;
  now: number;
}

class View extends React.Component<IViewProps, IViewState> {
  /**
   * @var {EmailParser} emailParser
   */
  protected emailParser: EmailParser;

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
   * @var {IProgressBar} progressBar
   */
  protected progressBar: IProgressBar;

  /**
   * @constructor
   * @param {IViewProps} props
   */
  constructor(props: IViewProps) {
    super(props);

    this.imapSocket = props.dependencies.imapSocket;
    this.localStorage = props.dependencies.localStorage;
    this.emailParser = props.dependencies.emailParser;
    this.stateManager = props.dependencies.stateManager;

    this.state = {
      size: 0,
      seen: false,
      deleted: false,
      progressBarNow: 0,
      flags: "",
      message: "",
      messageType: "",
      showEmail: false,
    };

    this.progressBar = { max: 0, now: 0 };
  }

  componentWillUnmount() {
    // perform clean up on the data when leaving the component
  }

  componentDidMount() {
    if (this.imapSocket.getReadyState() !== 1) {
      this.imapSocket.imapConnect();
    }

    this.getEmail();
  }

  async getEmail() {
    const selectResponse = await this.imapSocket.imapRequest(
      `SELECT "${this.stateManager.getFolderId()}"`
    );

    if (selectResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const fetchFlagsResponse = await this.imapSocket.imapRequest(
      `UID FETCH ${this.stateManager.getActiveUid()} RFC822.SIZE`
    );

    if (selectResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const flagsResult: string = fetchFlagsResponse.data as string;

    let detailsRaw = flagsResult[0][2];
    let details = detailsRaw.match(
      /.*FETCH \(UID(.*)RFC822.SIZE (.*)\)/
    );

    if (details?.length === 3) {
      this.progressBar.max = parseInt(details[1]);

      this.setState({
        size: parseInt(details[1]),
        flags: details[2],
        deleted: /\\Deleted/.test(details[2]),
        seen: /\\Seen/.test(details[2]),
      });

      /* Fetch Email */
      const fetchEmailResponse = await this.imapSocket.imapRequest(
        `UID FETCH ${this.stateManager.getActiveUid()} RFC822`
      );

      const emailRaw: string = fetchEmailResponse.data[1][0];
      const email: IEmail = this.emailParser.processEmail(emailRaw);

      if (email) {
        this.setState({ email: email });
      }

      const setTimeoutMaxMs: number = 300000; // 5mins
      let setTimeoutFallback: number = 0;

      const checkProgressBar = () => {
        this.progressBar.now = this.imapSocket.getStreamAmount();

        let progressBarNow = Math.ceil(
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

            checkProgressBar();
          }, 10);
        } else {
          setTimeout(() => {
            this.setState({
              showEmail: true,
            });
          }, 1000);
        }
      };

      checkProgressBar();
    }
  }

  deleteEmail = () => {
    (async () => {
      await this.imapSocket.imapRequest(
        `UID STORE ${this.stateManager.getActiveUid()} +FLAGS (\\Deleted)`
      );
    })();

    this.setState({
      deleted: true,
      message: "This email has been marked for deletion.",
      messageType: "danger",
    });
  };

  restoreEmail = () => {
    (async () => {
      await this.imapSocket.imapRequest(
        `UID STORE ${this.stateManager.getActiveUid()} -FLAGS (\\Deleted)`
      );
    })();

    this.setState({
      deleted: false,
      message: "This email has been undeleted.",
      messageType: "info",
    });
  };

  replyToEmail = (all: boolean = false) => {
    this.stateManager.setComposePresets({
      from: this.state.email?.from,
      subject: this.state.email?.subject,
      email: this.state.email?.bodyHtml ?? "",
    });

    this.stateManager.updateActiveKey("compose");
  };

  forwardEmail = () => {
    this.stateManager.setComposePresets({
      subject: this.state.email?.subject,
      email: this.state.email?.bodyHtml ?? "",
    });

    this.stateManager.updateActiveKey("compose");
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
      <Card className="mt-0 mt-sm-3">
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
            replyToEmail={this.replyToEmail}
            forwardEmail={this.forwardEmail}
            deleteEmail={this.deleteEmail}
            restoreEmail={this.restoreEmail}
            email={this.state.email!}
            deleted={this.state.deleted}
          />
        </Card.Header>
        <Card.Body
          className={`border-bottom pt-2 pb-2 pl-3 pr-3 ${
            !this.state.email?.attachments?.length ? "d-none" : "d-block"
          }`}
        >
          <ViewAttachments
            attachments={this.state.email!.attachments}
            base64toBlob={this.emailParser.base64toBlob}
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
    );
  }
}

export default View;
