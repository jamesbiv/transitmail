import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Alert,
  Form,
  Button,
  Row,
  Col,
  ProgressBar,
  CardBody,
  CardHeader,
  CardFooter
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationTriangle,
  faFeather,
  faPaperPlane,
  faTimes,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import {
  CharacterMetadata,
  CompositeDecorator,
  ContentBlock,
  ContentState,
  DraftHandleValue,
  Editor,
  EditorState,
  RichUtils
} from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import {
  ComposeAttachments,
  ComposeRecipientDetails,
  ComposeEditorToolbar,
  ComposeSecondaryEmail
} from ".";
import {
  IComposeRecipient,
  IComposeAttachment,
  IComposedEmail,
  ISmtpResponse,
  IComposePresets,
  ISettingsSecondaryEmail,
  IEmail,
  IImapResponse,
  EImapResponseStatus,
  IEmailFlags,
  EComposePresetType,
  IComposeSender
} from "interfaces";
import { ESmtpResponseStatus } from "interfaces";
import { DependenciesContext } from "contexts";
import { EmailComposer } from "classes";
import { convertAttachments, initateProgressBar } from "lib";

const emailComposer = new EmailComposer();

export const Compose: React.FC = () => {
  const { imapHelper, imapSocket, secureStorage, stateManager, smtpSocket } =
    useContext(DependenciesContext);

  const defaultSender: IComposeSender = {
    email: secureStorage.getSetting("email") ?? "",
    displayName: secureStorage.getSetting("name") ?? ""
  };

  const [from, setFrom] = useState<IComposeSender>(defaultSender);

  const [subject, setSubject] = useState<string | undefined>(undefined);

  const [recipients, setRecipients] = useState<IComposeRecipient[]>([
    { id: 1, type: "To", value: "" }
  ]);

  const [attachments, setAttachments] = useState<IComposeAttachment[]>([]);

  const [message, setMessage] = useState<string | undefined>(undefined);
  const [messageType, setMessageType] = useState<string | undefined>(undefined);

  const [progressBarNow, setProgressBarNow] = useState<number>(0);

  const composePresets: IComposePresets | undefined = stateManager.getComposePresets();

  const emailSignature: string = secureStorage.getSetting("signature") ?? "";

  const secondaryEmails: ISettingsSecondaryEmail[] = secureStorage.getSetting("secondaryEmails");

  const findLinkEntities = (
    contentBlock: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState
  ) => {
    contentBlock.findEntityRanges((entityRange: CharacterMetadata) => {
      const entityKey = entityRange.getEntity();

      return entityKey !== null && contentState.getEntity(entityKey).getType() === "LINK";
    }, callback);
  };

  const Link = (props: { contentState: ContentState; entityKey: string; children: string }) => {
    return (
      <a
        href={props.contentState.getEntity(props.entityKey).getData()}
        style={{ color: "#0000FF", textDecoration: "underline" }}
      >
        {props.children}
      </a>
    );
  };

  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createWithContent(
      /<\/?[a-z][\s\S]*>/i.test(emailSignature)
        ? stateFromHTML(emailSignature)
        : ContentState.createFromText(emailSignature),
      new CompositeDecorator([
        {
          strategy: findLinkEntities,
          component: Link
        }
      ])
    )
  );

  const [showComposer, setShowComposer] = useState<boolean>(composePresets?.uid === undefined);

  useEffect(() => {
    (async () => {
      if (composePresets) {
        let presetEmail: IEmail | undefined;

        if (composePresets.uid) {
          const fetchFlagsResponse: IImapResponse = await imapSocket.imapRequest(
            `UID FETCH ${composePresets.uid} (RFC822.SIZE FLAGS)`
          );

          if (fetchFlagsResponse.status !== EImapResponseStatus.OK) {
            return;
          }

          const emailFlags: IEmailFlags | undefined = imapHelper.formatFetchEmailFlagsResponse(
            fetchFlagsResponse.data
          );

          if (!emailFlags) {
            return;
          }

          initateProgressBar(
            emailFlags.size,
            setProgressBarNow,
            () => imapSocket.getStreamAmount(),
            () => setShowComposer(true)
          );

          const fetchEmailResponse: IImapResponse = await imapSocket.imapRequest(
            `UID FETCH ${composePresets.uid} RFC822`
          );

          if (fetchEmailResponse.status !== EImapResponseStatus.OK) {
            return;
          }

          presetEmail = imapHelper.formatFetchEmailResponse(fetchEmailResponse.data);
        } else {
          presetEmail = composePresets.email;
        }

        if (presetEmail) {
          const convertedAttachments: IComposeAttachment[] | undefined = await convertAttachments(
            presetEmail.attachments
          );

          setEditorState(
            EditorState.createWithContent(
              presetEmail.bodyHtml
                ? stateFromHTML(presetEmail.bodyHtml)
                : ContentState.createFromText(presetEmail.bodyText ?? "")
            )
          );

          switch (composePresets.type) {
            case EComposePresetType.Reply:
              setRecipients([{ id: 1, type: "To", value: presetEmail.from }]);
              break;

            case EComposePresetType.ReplyAll:
              // Add functionality
              break;

            default:
            case EComposePresetType.Forward:
              break;
          }

          setSubject("RE: " + (presetEmail.subject ?? "(no subject)"));

          if (convertedAttachments) {
            setAttachments(convertedAttachments);
          }

          stateManager.setComposePresets();
        }
      }
    })();
  }, []);

  let lockSendEmail: boolean = false;

  const sendEmail = async (): Promise<void> => {
    if (lockSendEmail) {
      stateManager.showMessageModal({
        title: "Unable to send email",
        content: "An email is already currently being processed",
        action: () => {}
      });

      return;
    }

    lockSendEmail = true;

    smtpSocket.smtpConnect();

    const emailResponse: ISmtpResponse = await sendEmailRequest();

    smtpSocket.smtpClose();

    if (emailResponse.status === ESmtpResponseStatus.Success) {
      stateManager.showMessageModal({
        title: "Your email has been sent",
        content: "Your email has been sent successfully!",
        action: () => {}
      });
    } else {
      stateManager.showMessageModal({
        title: "Unable to send email",
        content: emailResponse.data[0].join(),
        action: () => {}
      });
    }

    lockSendEmail = false;

    return;
  };

  const sendEmailRequest = async (): Promise<ISmtpResponse> => {
    const emailData: IComposedEmail = emailComposer.composeEmail({
      editorState: editorState,
      from: `"${from.displayName}" <${from.email}>`,
      subject: subject,
      recipients: recipients,
      attachments: attachments
    });

    const mailResponse: ISmtpResponse = await smtpSocket.smtpRequest(
      `MAIL from: ${from.email}`,
      [235, 250]
    );

    if (mailResponse.status !== ESmtpResponseStatus.Success) {
      return mailResponse;
    }

    const rcptResponse: ISmtpResponse = await smtpSocket.smtpRequest(
      `RCPT to: ${emailData.to}`,
      [235, 250]
    );

    if (rcptResponse.status !== ESmtpResponseStatus.Success) {
      return rcptResponse;
    }

    const dataResponse: ISmtpResponse = await smtpSocket.smtpRequest("DATA", [235, 250, 354]);

    if (dataResponse.status !== ESmtpResponseStatus.Success) {
      return dataResponse;
    }

    const payloadResponse: ISmtpResponse = await smtpSocket.smtpRequest(
      `${emailData.payload}\r\n\r\n.`,
      [235, 250, 354]
    );

    if (payloadResponse.status !== ESmtpResponseStatus.Success) {
      return payloadResponse;
    }

    const quitResponse: ISmtpResponse = await smtpSocket.smtpRequest(`QUIT`, [221, 250]);

    return quitResponse;
  };

  const handleKeyCommand = (command: string, editorState: EditorState): DraftHandleValue => {
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
      case "text-start":
        return "text-start";

      case "text-center":
        return "text-center";

      case "text-end":
        return "text-end";

      case "text-indent":
        return "text-indent";

      default:
        return "";
    }
  };

  const updateSenderDetails = (secondaryEmailKey?: number): void => {
    const secondaryEmail = secondaryEmails[secondaryEmailKey ?? NaN];

    const updatedDetails: IComposeSender = secondaryEmail
      ? { displayName: secondaryEmail.name, email: secondaryEmail.email }
      : {
          displayName: secureStorage.getSetting("name"),
          email: secureStorage.getSetting("email")
        };

    setFrom(updatedDetails);
  };

  const saveEmail: () => void = () => {
    alert(`create functionality`);
  };

  const deleteEmail: () => void = () => {
    setEditorState(EditorState.createEmpty());

    setRecipients([{ id: 1, type: "To", value: "" }]);
    setSubject(undefined);
    setAttachments([]);
  };

  return !showComposer ? (
    <Card className="mt-0 mt-sm-3">
      <CardBody>
        <React.Fragment>
          <ProgressBar className="mb-2" now={progressBarNow} />
        </React.Fragment>
      </CardBody>
    </Card>
  ) : (
    <Card className="mt-0 mt-sm-3">
      <CardHeader>
        <Row className="pt-2 pt-sm-0 pb-2 pb-sm-0">
          <Col xs={6}>
            <h4 className="p-0 m-0 text-nowrap middle">
              <span className="align-middle">
                <FontAwesomeIcon icon={faFeather} /> Compose
              </span>
            </h4>
          </Col>
          <Col className="d-none d-sm-block text-end text-sm-end text-nowrap" xs={6}>
            <Button onClick={() => sendEmail()} className="me-2" variant="primary" type="button">
              <FontAwesomeIcon icon={faPaperPlane} /> Send
            </Button>
            <Button
              size="sm"
              variant="outline-dark"
              type="button"
              className="me-2"
              onClick={() => saveEmail()}
            >
              Save
            </Button>
            <Button size="sm" variant="danger" type="button" onClick={() => deleteEmail()}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Col>
        </Row>
      </CardHeader>
      <Form>
        <CardBody className="p-2 ps-3 pe-3">
          <Alert
            className={!message ? "d-none" : "d-block"}
            variant={
              messageType === "info" ? "success" : messageType === "warning" ? "warning" : "danger"
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
              defaultSender={defaultSender}
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
        </CardBody>
        <div className="border-top border-gray">
          <ComposeEditorToolbar
            editorState={editorState}
            setEditorState={setEditorState}
            saveEmail={saveEmail}
            deleteEmail={deleteEmail}
          />
          <div className="mt-2 ms-2 me-2 mb-2 p-3 border rounded inner-shaddow">
            <Editor
              customStyleMap={{
                link: {
                  color: "#ff0000",
                  textDecoration: "underline"
                }
              }}
              editorState={editorState}
              handleKeyCommand={handleKeyCommand}
              blockStyleFn={blockStyleFn}
              onChange={setEditorState}
            />
          </div>
          <ComposeAttachments attachments={attachments} setAttachments={setAttachments} />
        </div>
        <CardFooter className="d-block d-sm-none">
          <Button onClick={() => sendEmail()} variant="primary" type="button">
            <FontAwesomeIcon icon={faPaperPlane} /> Send
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
};
