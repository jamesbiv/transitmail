import React, { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
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
  ISmtpResponse,
  IComposePresets,
  ISettingsSecondaryEmail,
  IEmail,
  EComposePresetType,
  IComposeSender
} from "interfaces";
import { ESmtpResponseStatus } from "interfaces";
import { DependenciesContext } from "contexts";
import { convertAttachments, downloadEmail, sendEmail } from "lib";

export const Compose: FunctionComponent = () => {
  const { secureStorage, stateManager } = useContext(DependenciesContext);

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

  const [bodyMimeType, setBodyMimeType] = useState<string | undefined>("text/html");

  const [attachments, setAttachments] = useState<IComposeAttachment[]>([]);

  const [message, setMessage] = useState<string | undefined>(undefined);
  const [messageType, setMessageType] = useState<string | undefined>(undefined);

  const [progressBarNow, setProgressBarNow] = useState<number>(0);

  const composerPresets: IComposePresets | undefined = stateManager.getComposePresets();

  const emailSignature: string = secureStorage.getSetting("signature") ?? "";

  const secondaryEmails: ISettingsSecondaryEmail[] = secureStorage.getSetting("secondaryEmails");

  const [showComposer, setShowComposer] = useState<boolean>(composerPresets?.uid === undefined);

  useEffect(() => {
    (async () => {
      if (!composerPresets) {
        return;
      }

      const presetEmail: IEmail | undefined = composerPresets.uid
        ? await downloadEmail(composerPresets, setShowComposer, setProgressBarNow)
        : composerPresets.email;

      if (!presetEmail) {
        // throw an error here
        return;
      }

      const convertedAttachments: IComposeAttachment[] | undefined = await convertAttachments(
        presetEmail.attachments
      );

      switch (composerPresets.type) {
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

      /**
       * This needs to be more robust to support other mimes such as richtext and possibly even markdown
       * Change to a switch/case like system that can support multiple mimeTypes. Further, consider adding
       * a toolbar dropdown which allows for switching between types
       */
      if (presetEmail.bodyHtml) {
        setBodyMimeType("text/html");
        setBody(presetEmail.bodyHtml);
      } else {
        setBodyMimeType("text/plain");
        setBody(presetEmail.bodyText);
      }

      stateManager.setComposePresets(undefined);
    })();
  }, []);

  let lockSendEmail: boolean = false;

  const triggerSendEmail = async (): Promise<void> => {
    if (lockSendEmail) {
      stateManager.showMessageModal({
        title: "Unable to send email",
        content: "An email is already currently being processed",
        action: () => {}
      });

      return;
    }

    lockSendEmail = true;

    const emailResponse: ISmtpResponse = await sendEmail({
      from,
      subject,
      recipients,
      attachments,
      body
    });

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

  const clearComposer: () => void = () => {
    setRecipients([{ id: 1, type: "To", value: "" }]);
    setSubject(undefined);
    setAttachments([]);
    setBody(undefined);
  };

  return !showComposer ? (
    <Card className="mt-0 mt-sm-3">
      <CardBody>
        <ProgressBar className="mb-2" now={progressBarNow} />
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
            <Button
              onClick={() => triggerSendEmail()}
              className="me-2"
              variant="primary"
              type="button"
            >
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
            <Button size="sm" variant="danger" type="button" onClick={() => clearComposer()}>
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
          <ComposeEditor bodyMimeType={bodyMimeType} body={body} setBody={setBody} />
          <ComposeAttachments attachments={attachments} setAttachments={setAttachments} />
        </CardBody>

        <CardFooter className="d-block d-sm-none">
          <Button onClick={() => triggerSendEmail()} variant="primary" type="button">
            <FontAwesomeIcon icon={faPaperPlane} /> Send
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
};
