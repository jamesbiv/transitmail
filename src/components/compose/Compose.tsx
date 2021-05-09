import React from "react";
import { Card, Alert, Form, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationTriangle,
  faFeather,
  faPaperPlane,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  CharacterMetadata,
  CompositeDecorator,
  ContentBlock,
  ContentState,
  DraftHandleValue,
  Editor,
  EditorState,
  RichUtils,
} from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import { SmtpSocket, EmailComposer, LocalStorage, StateManager } from "classes";
import {
  ComposeAttachments,
  ComposeRecipientDetails,
  ComposeEditorToolbar,
} from ".";
import {
  IComposeRecipient,
  IComposeAttachment,
  IComposedEmail,
  ISmtpResponse,
  IComposePresets,
} from "interfaces";
import { ESmtpResponseStatus } from "interfaces";

interface IComposeProps {
  dependencies: {
    smtpSocket: SmtpSocket;
    localStorage: LocalStorage;
    stateManager: StateManager;
  };
}

interface IComposeState {
  editorState: EditorState;
  from: string;
  subject?: string;
  recipients: IComposeRecipient[];
  attachments: IComposeAttachment[];
  content: string;
  message?: string;
  messageType?: string;
}

export class Compose extends React.Component<IComposeProps, IComposeState> {
  /**
   * @var {SmtpSocket} smtpSocket
   */
  protected smtpSocket: SmtpSocket;

  /**
   * @var {LocalStorage} localStorage
   */
  protected localStorage: LocalStorage;

  /**
   * @var {StateManager} stateManager
   */
  protected stateManager: StateManager;

  /**
   * @var {EmailComposer} emailComposer
   */
  protected emailComposer: EmailComposer;

  constructor(props: IComposeProps) {
    super(props);

    this.smtpSocket = props.dependencies.smtpSocket;
    this.localStorage = props.dependencies.localStorage;
    this.stateManager = props.dependencies.stateManager;
    this.emailComposer = new EmailComposer();

    const emailSignature: string =
      this.localStorage.getSetting("signature") ?? "";

    const emailFrom: string = `"${this.localStorage.getSetting(
      "name"
    )}" <${this.localStorage.getSetting("email")}>`;

    this.state = {
      editorState: EditorState.createWithContent(
        /<\/?[a-z][\s\S]*>/i.test(emailSignature)
          ? stateFromHTML(emailSignature)
          : ContentState.createFromText(emailSignature),
        new CompositeDecorator([
          {
            strategy: this.findLinkEntities,
            component: this.Link,
          },
        ])
      ),
      from: emailFrom,
      recipients: [{ id: 1, type: "To", value: "" }],
      attachments: [],
      content: "",
    };
  }

  findLinkEntities(
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState
  ) {
    contentBlock.findEntityRanges((entityRange: CharacterMetadata) => {
      const entityKey = entityRange.getEntity();

      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "LINK"
      );
    }, callback);
  }

  Link = (props: {
    contentState: ContentState;
    entityKey: string;
    children: string;
  }) => {
    return (
      <a
        href={props.contentState.getEntity(props.entityKey).getData()}
        style={{ color: "#0000FF", textDecoration: "underline" }}
      >
        {props.children}
      </a>
    );
  };

  componentDidMount() {
    const composePresets:
      | IComposePresets
      | undefined = this.stateManager.getComposePresets();

    if (composePresets) {
      this.setState({
        editorState: EditorState.createWithContent(
          /<\/?[a-z][\s\S]*>/i.test(composePresets.email)
            ? stateFromHTML(composePresets.email)
            : ContentState.createFromText(composePresets.email)
        ),
        recipients: [{ id: 1, type: "To", value: composePresets.from }],
        subject: "RE: " + composePresets.subject ?? "(no subject)",
        attachments: composePresets.attachments ?? [],
      });

      this.stateManager.setComposePresets();
    }
  }

  async sendEmail(): Promise<void> {
    this.smtpSocket.smtpConnect();

    const emailData: IComposedEmail = this.emailComposer.composeEmail({
      editorState: this.state.editorState,
      from: this.state.from,
      subject: this.state.subject,
      recipients: this.state.recipients,
      attachments: this.state.attachments,
    });

    const mailResponse: ISmtpResponse = await this.smtpSocket.smtpRequest(
      `MAIL from: ${emailData.from}`,
      250
    );

    if (mailResponse.status !== ESmtpResponseStatus.Success) {
      return;
    }

    const rcptResponse: ISmtpResponse = await this.smtpSocket.smtpRequest(
      `RCPT to: ${emailData.to}`,
      250
    );

    if (rcptResponse.status !== ESmtpResponseStatus.Success) {
      return;
    }

    const dataResponse: ISmtpResponse = await this.smtpSocket.smtpRequest(
      "DATA",
      354
    );

    if (dataResponse.status !== ESmtpResponseStatus.Success) {
      return;
    }

    const payloadResponse: ISmtpResponse = await this.smtpSocket.smtpRequest(
      `${emailData.payload}\r\n\r\n.`,
      250
    );

    if (payloadResponse.status !== ESmtpResponseStatus.Success) {
      return;
    }

    const quitResponse: ISmtpResponse = await this.smtpSocket.smtpRequest(
      `QUIT`,
      221
    );

    if (quitResponse.status !== ESmtpResponseStatus.Success) {
      return;
    }

    this.stateManager.showMessageModal({
      title: "Your email has been sent",
      content: "Your email has been sent successfully!",
      action: () => {},
    });
  }

  handleKeyCommand(
    command: string,
    editorState: EditorState
  ): DraftHandleValue {
    const newEditorState: EditorState | undefined =
      RichUtils.handleKeyCommand(editorState, command) ?? undefined;

    if (newEditorState) {
      // this.updateEditorState(newEditorState);

      return "handled";
    }

    return "not-handled";
  }

  blockStyleFn(contentBlock: ContentBlock): string {
    switch (contentBlock.getType()) {
      case "text-left":
        return "text-left";

      case "text-center":
        return "text-center";

      case "text-right":
        return "text-right";

      case "text-indent":
        return "text-indent";

      default:
        return "";
    }
  }

  updateEditorState = (editorState: EditorState): void => {
    this.setState({ editorState });
  };

  updateRecipients = (recipients: IComposeRecipient[]): void => {
    this.setState({ recipients });
  };

  updateSubject = (subject: string): void => {
    this.setState({ subject });
  };

  updateAttachments = (attachments: IComposeAttachment[]): void => {
    this.setState({ attachments });
  };

  render() {
    return (
      <Card className="mt-0 mt-sm-3">
        <Card.Header>
          <Row>
            <Col xs={6}>
              <h4 className="p-0 m-0 text-nowrap middle">
                <span className="align-middle">
                  <FontAwesomeIcon icon={faFeather} /> Compose
                </span>
              </h4>
            </Col>
            <Col
              className="d-none d-sm-block text-right text-sm-right text-nowrap"
              xs={6}
            >
              <Button
                onClick={() => this.sendEmail()}
                className="mr-2"
                variant="primary"
                type="button"
              >
                <FontAwesomeIcon icon={faPaperPlane} /> Send
              </Button>
              <Button
                size="sm"
                variant="outline-dark"
                type="button"
                className="mr-2"
              >
                Save
              </Button>
              <Button size="sm" variant="danger" type="button">
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Form>
          <Card.Body className="pt-3 pl-3 pr-3 pb-0">
            <Alert
              className={!this.state.message ? "d-none" : "d-block"}
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
            <ComposeRecipientDetails
              updateRecipients={this.updateRecipients}
              updateSubject={this.updateSubject}
              recipients={this.state.recipients}
              subject={this.state.subject}
            />
          </Card.Body>
          <div className="border-top border-gray">
            <ComposeEditorToolbar
              updateEditorState={this.updateEditorState}
              editorState={this.state.editorState}
            />
            <div className="mt-2 ml-2 mr-2 mb-2 p-3 border rounded inner-shaddow">
              <Editor
                customStyleMap={{
                  link: {
                    color: "#ff0000",
                    textDecoration: "underline",
                  },
                }}
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                blockStyleFn={this.blockStyleFn}
                onChange={this.updateEditorState}
              />
            </div>
            <ComposeAttachments
              updateAttachments={this.updateAttachments}
              attachments={this.state.attachments}
            />
          </div>
          <Card.Footer className="d-block d-sm-none">
            <Button
              block
              onClick={() => this.sendEmail()}
              variant="primary"
              type="button"
            >
              <FontAwesomeIcon icon={faPaperPlane} /> Send
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    );
  }
}
