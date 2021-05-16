import React, { useContext, useEffect, useState } from "react";
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
import {
  ComposeAttachments,
  ComposeRecipientDetails,
  ComposeEditorToolbar,
  ComposeSecondaryEmail,
} from ".";
import {
  IComposeRecipient,
  IComposeAttachment,
  IComposedEmail,
  ISmtpResponse,
  IComposePresets,
  ISettingsSecondaryEmail,
} from "interfaces";
import { ESmtpResponseStatus } from "interfaces";
import { DependenciesContext } from "contexts";
import { EmailComposer } from "classes";

export const Compose: React.FC = () => {
  const { localStorage, stateManager, smtpSocket } = useContext(
    DependenciesContext
  );

  const emailComposer = new EmailComposer();

  const [from, setFrom] = useState<string>(
    `"${localStorage.getSetting("name")}" <${localStorage.getSetting("email")}>`
  );

  const [subject, setSubject] = useState<string | undefined>(undefined);

  const [recipients, setRecipients] = useState<IComposeRecipient[]>([
    { id: 1, type: "To", value: "" },
  ]);

  const [attachments, setAttachments] = useState<IComposeAttachment[]>([]);

  const [content, setContent] = useState<string>("");

  const [message, setMessage] = useState<string | undefined>(undefined);
  const [messageType, setMessageType] = useState<string | undefined>(undefined);

  const [secondaryEmails, setSecondaryEmails] = useState<
    ISettingsSecondaryEmail[]
  >(localStorage.getSetting("secondaryEmails"));

  const findLinkEntities = (
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState
  ) => {
    contentBlock.findEntityRanges((entityRange: CharacterMetadata) => {
      const entityKey = entityRange.getEntity();

      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "LINK"
      );
    }, callback);
  };

  const Link = (props: {
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

  const emailSignature: string = localStorage.getSetting("signature") ?? "";
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createWithContent(
      /<\/?[a-z][\s\S]*>/i.test(emailSignature)
        ? stateFromHTML(emailSignature)
        : ContentState.createFromText(emailSignature),
      new CompositeDecorator([
        {
          strategy: findLinkEntities,
          component: Link,
        },
      ])
    )
  );

  useEffect(() => {
    const composePresets:
      | IComposePresets
      | undefined = stateManager.getComposePresets();

    if (composePresets) {
      setEditorState(
        EditorState.createWithContent(
          /<\/?[a-z][\s\S]*>/i.test(composePresets.email)
            ? stateFromHTML(composePresets.email)
            : ContentState.createFromText(composePresets.email)
        )
      );

      setRecipients([{ id: 1, type: "To", value: composePresets.from }]);
      setSubject("RE: " + composePresets.subject ?? "(no subject)");
      setAttachments(composePresets.attachments ?? []);

      stateManager.setComposePresets();
    }
  }, []);

  const sendEmail = async (): Promise<void> => {
    smtpSocket.smtpConnect();

    const emailData: IComposedEmail = emailComposer.composeEmail({
      editorState: editorState,
      from: from,
      subject: subject,
      recipients: recipients,
      attachments: attachments,
    });

    const mailResponse: ISmtpResponse = await smtpSocket.smtpRequest(
      `MAIL from: ${emailData.from}`,
      250
    );

    if (mailResponse.status !== ESmtpResponseStatus.Success) {
      return;
    }

    const rcptResponse: ISmtpResponse = await smtpSocket.smtpRequest(
      `RCPT to: ${emailData.to}`,
      250
    );

    if (rcptResponse.status !== ESmtpResponseStatus.Success) {
      return;
    }

    const dataResponse: ISmtpResponse = await smtpSocket.smtpRequest(
      "DATA",
      354
    );

    if (dataResponse.status !== ESmtpResponseStatus.Success) {
      return;
    }

    const payloadResponse: ISmtpResponse = await smtpSocket.smtpRequest(
      `${emailData.payload}\r\n\r\n.`,
      250
    );

    if (payloadResponse.status !== ESmtpResponseStatus.Success) {
      return;
    }

    const quitResponse: ISmtpResponse = await smtpSocket.smtpRequest(
      `QUIT`,
      221
    );

    if (quitResponse.status !== ESmtpResponseStatus.Success) {
      return;
    }

    stateManager.showMessageModal({
      title: "Your email has been sent",
      content: "Your email has been sent successfully!",
      action: () => {},
    });
  };

  const handleKeyCommand = (
    command: string,
    editorState: EditorState
  ): DraftHandleValue => {
    const newEditorState: EditorState | undefined =
      RichUtils.handleKeyCommand(editorState, command) ?? undefined;

    if (newEditorState) {
      // updateEditorState(newEditorState);

      return "handled";
    }

    return "not-handled";
  };

  const blockStyleFn = (contentBlock: ContentBlock): string => {
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
  };

  const updateSenderDetails = (secondaryEmailKey?: number): void => {};

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
              onClick={() => sendEmail()}
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
            className={!message ? "d-none" : "d-block"}
            variant={
              messageType === "info"
                ? "success"
                : messageType === "warning"
                ? "warning"
                : "danger"
            }
          >
            <FontAwesomeIcon
              icon={
                messageType === "info"
                  ? faCheck
                  : messageType === "warning"
                  ? faExclamationTriangle
                  : faTimes
              }
            />{" "}
            {message}
          </Alert>
          {secondaryEmails && (
            <ComposeSecondaryEmail
              secondaryEmails={secondaryEmails}
              updateSenderDetails={updateSenderDetails}
            />
          )}
          <ComposeRecipientDetails
            recipients={recipients}
            subject={subject}
            setRecipients={setRecipients}
            setSubject={setSubject}
          />
        </Card.Body>
        <div className="border-top border-gray">
          <ComposeEditorToolbar
            editorState={editorState}
            setEditorState={setEditorState}
          />
          <div className="mt-2 ml-2 mr-2 mb-2 p-3 border rounded inner-shaddow">
            <Editor
              customStyleMap={{
                link: {
                  color: "#ff0000",
                  textDecoration: "underline",
                },
              }}
              editorState={editorState}
              handleKeyCommand={handleKeyCommand}
              blockStyleFn={blockStyleFn}
              onChange={setEditorState}
            />
          </div>
          <ComposeAttachments
            attachments={attachments}
            setAttachments={setAttachments}
          />
        </div>
        <Card.Footer className="d-block d-sm-none">
          <Button
            block
            onClick={() => sendEmail()}
            variant="primary"
            type="button"
          >
            <FontAwesomeIcon icon={faPaperPlane} /> Send
          </Button>
        </Card.Footer>
      </Form>
    </Card>
  );
};
