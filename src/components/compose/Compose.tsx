import React, { Fragment, FunctionComponent, useContext, useEffect, useRef, useState } from "react";
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
  ComposeAttachments,
  ComposeEditor,
  ComposeRecipientDetails,
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
import { convertAttachments, initiateProgressBar } from "lib";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $insertNodes,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode
} from "lexical";

import { $generateNodesFromDOM, $generateHtmlFromNodes } from "@lexical/html";

const emailComposer = new EmailComposer();

export const Compose: FunctionComponent = () => {
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

  const [body, setBody] = useState<string | undefined>(undefined);

  const [attachments, setAttachments] = useState<IComposeAttachment[]>([]);

  const [message, setMessage] = useState<string | undefined>(undefined);
  const [messageType, setMessageType] = useState<string | undefined>(undefined);

  const [progressBarNow, setProgressBarNow] = useState<number>(0);

  const composeEditorReference = useRef<LexicalEditor | undefined>(undefined);

  const composePresets: IComposePresets | undefined = stateManager.getComposePresets();

  const emailSignature: string = secureStorage.getSetting("signature") ?? "";

  const secondaryEmails: ISettingsSecondaryEmail[] = secureStorage.getSetting("secondaryEmails");

  const [showComposer, setShowComposer] = useState<boolean>(composePresets?.uid === undefined);

  useEffect(() => {
    (async () => {
      if (composePresets) {
        const presetEmail: IEmail | undefined = composePresets.uid
          ? await downloadEmail(composePresets)
          : composePresets.email;

        if (!presetEmail) {
          // throw an error here
          return;
        }

        const convertedAttachments: IComposeAttachment[] | undefined = await convertAttachments(
          presetEmail.attachments
        );

        updateComposeEditor(presetEmail);

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
    })();
  }, []);

  const downloadEmail = async (composePresets: IComposePresets): Promise<IEmail | undefined> => {
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

    initiateProgressBar(
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

    const formattedEmailResponse: IEmail = imapHelper.formatFetchEmailResponse(
      fetchEmailResponse.data
    );

    return formattedEmailResponse;
  };

  /**
   * Need to refactor to deal with email signature
   */
  const updateComposeEditor = (email: IEmail): void => {
    const editor: LexicalEditor = composeEditorReference.current!;

    editor.update(() => {
      if (email.bodyHtml) {
        const htmlString: string = email.bodyHtml;

        const parser = new DOMParser();
        const dom: Document = parser.parseFromString(htmlString, "text/html");
        const nodes: LexicalNode[] = $generateNodesFromDOM(editor, dom);

        $getRoot().clear();

        $insertNodes(nodes);
      } else {
        const bodyText: string = email.bodyHtml!;

        const textNode: TextNode = $createTextNode(bodyText);
        const paragraphNode: ParagraphNode = $createParagraphNode().append(textNode);

        $getRoot().clear().append(paragraphNode);
      }
    });
  };

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

    stateManager.showMessageModal(
      emailResponse.status === ESmtpResponseStatus.Success
        ? {
            title: "Your email has been sent",
            content: "Your email has been sent successfully!",
            action: () => {}
          }
        : {
            title: "Unable to send email",
            content: emailResponse.data[0].join(),
            action: () => {}
          }
    );

    lockSendEmail = false;

    return;
  };

  const getEmailHtmlBodyFromEditor: () => string | undefined = () => {
    const editor: LexicalEditor = composeEditorReference.current!;

    let htmlString: string | undefined;

    editor.read(() => {
      htmlString = $generateHtmlFromNodes(editor);
    });

    return htmlString;
  };

  const sendEmailRequest = async (): Promise<ISmtpResponse> => {
    const body = getEmailHtmlBodyFromEditor();

    const emailData: IComposedEmail = emailComposer.composeEmail({
      from: `"${from.displayName}" <${from.email}>`,
      subject: subject,
      recipients: recipients,
      attachments: attachments,
      body: body
    });

    const mailResponse: ISmtpResponse = await smtpSocket.smtpRequest(
      `MAIL from: ${from.email}`,
      [235, 250, 334]
    );

    if (mailResponse.status !== ESmtpResponseStatus.Success) {
      return mailResponse;
    }

    const rcptResponse: ISmtpResponse = await smtpSocket.smtpRequest(
      `RCPT to: ${emailData.to}`,
      [235, 250, 334]
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
    const editor: LexicalEditor = composeEditorReference.current!;

    editor.update(() => {
      $getRoot().clear();
    });

    setRecipients([{ id: 1, type: "To", value: "" }]);
    setSubject(undefined);
    setAttachments([]);
  };

  return !showComposer ? (
    <Card className="mt-0 mt-sm-3">
      <CardBody>
        <Fragment>
          <ProgressBar className="mb-2" now={progressBarNow} />
        </Fragment>
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
          <ComposeEditor composeEditorReference={composeEditorReference} />
          <ComposeAttachments attachments={attachments} setAttachments={setAttachments} />
        </CardBody>

        <CardFooter className="d-block d-sm-none">
          <Button onClick={() => sendEmail()} variant="primary" type="button">
            <FontAwesomeIcon icon={faPaperPlane} /> Send
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
};
