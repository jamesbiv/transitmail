import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import {
  Card,
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
import { faFeather, faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  ComposeAttachments,
  ComposeEditor,
  ComposeMessage,
  ComposeRecipientDetails,
  ComposeSecondaryEmail
} from ".";
import {
  EComposePresetType,
  ESmtpResponseStatus,
  IComposeRecipient,
  IComposeAttachment,
  ISmtpResponse,
  IComposePresets,
  ISettingsSecondaryEmail,
  IEmail,
  IComposeSender,
  IComposeMessage
} from "interfaces";
import { DependenciesContext } from "contexts";
import { convertAttachments, downloadEmail, sendEmail } from "lib";

/**
 * Compose
 * @returns {ReactNode}
 */
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
  const [bodyPlaceholder, setBodyPlaceholder] = useState<string | undefined>(undefined);

  const [bodyMimeType, setBodyMimeType] = useState<string | undefined>("text/html");

  const [attachments, setAttachments] = useState<IComposeAttachment[]>([]);

  const [composeMessage, setComposeMessage] = useState<IComposeMessage | undefined>(undefined);

  const [progressBarNow, setProgressBarNow] = useState<number>(0);

  const composerPresets: IComposePresets | undefined = stateManager.getComposePresets();

  const emailSignature: string | undefined = secureStorage.getSetting("signature");

  const secondaryEmails: ISettingsSecondaryEmail[] = secureStorage.getSetting("secondaryEmails");

  const [showComposer, setShowComposer] = useState<boolean>(composerPresets?.uid === undefined);

  useEffect(() => {
    (async () => {
      if (!composerPresets) {
        return;
      }

      const presetEmail: IEmail | undefined = composerPresets.uid
        ? await downloadEmail(composerPresets, setProgressBarNow, () => setShowComposer(true))
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

        // case EComposePresetType.ReplyAll:
        // Add functionality
        // break;

        case EComposePresetType.Forward:
        default:
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
        setBodyPlaceholder(presetEmail.bodyHtml);
      } else {
        setBodyMimeType("text/plain");
        setBodyPlaceholder(presetEmail.bodyText);
      }

      stateManager.setComposePresets();
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
  };

  const updateSenderDetails = (secondaryEmailKey: number): void => {
    const secondaryEmail: ISettingsSecondaryEmail | undefined = secondaryEmails[secondaryEmailKey];

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
        <ProgressBar now={progressBarNow} />
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
          <ComposeMessage composeMessage={composeMessage} />
          {!!secondaryEmails?.length && (
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
          <ComposeEditor
            bodyMimeType={bodyMimeType}
            bodyPlaceholder={bodyPlaceholder}
            setBody={setBody}
            saveEmail={saveEmail}
            clearComposer={clearComposer}
          />
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
