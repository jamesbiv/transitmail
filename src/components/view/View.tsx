import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import { Card, ProgressBar, CardBody, CardHeader } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { DependenciesContext } from "contexts";
import {
  IEmail,
  EImapResponseStatus,
  IImapResponse,
  IEmailFlags,
  EComposePresetType,
  IViewMessage
} from "interfaces";
import { ViewActions, EViewActionType, ViewAttachments, ViewHeader, ViewMessage } from ".";
import { initiateProgressBar } from "lib";

/**
 * View
 * @returns FunctionComponent
 */
export const View: FunctionComponent = () => {
  const { imapHelper, imapSocket, stateManager } = useContext(DependenciesContext);

  const [email, setEmail] = useState<IEmail | undefined>(undefined);
  const [emailFlags, setEmailFlags] = useState<IEmailFlags | undefined>(undefined);

  const [progressBarNow, setProgressBarNow] = useState<number>(0);

  const [viewMessage, setViewMessage] = useState<IViewMessage | undefined>(undefined);

  const [showEmail, setShowEmail] = useState<boolean>(false);

  const [actionUid, setActionUid] = useState<number | undefined>(undefined);
  const [actionType, setActionType] = useState<EViewActionType>(EViewActionType.VIEW);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);

  useEffect(() => {
    imapSocket.imapCheckOrConnect();

    getEmail();
  }, []);

  const getEmail = async (): Promise<void> => {
    const folderId: string | undefined = stateManager.getFolderId();

    if (!folderId) {
      stateManager.updateActiveKey("inbox");
    }

    const selectResponse: IImapResponse = await imapSocket.imapRequest(`SELECT "${folderId}"`);

    if (selectResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const fetchFlagsResponse: IImapResponse = await imapSocket.imapRequest(
      `UID FETCH ${stateManager.getActiveUid()} (RFC822.SIZE FLAGS)`
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

    setEmailFlags(emailFlags);

    initiateProgressBar(
      emailFlags.size,
      setProgressBarNow,
      () => imapSocket.getStreamAmount(),
      () => setShowEmail(true)
    );

    const fetchEmailResponse: IImapResponse = await imapSocket.imapRequest(
      `UID FETCH ${stateManager.getActiveUid()} RFC822`
    );

    if (fetchEmailResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const email: IEmail = imapHelper.formatFetchEmailResponse(fetchEmailResponse.data);

    setEmail(email);
  };

  const replyToEmail = async (all: boolean = false): Promise<void> => {
    if (!email) {
      return;
    }

    stateManager.setComposePresets({
      type: all ? EComposePresetType.ReplyAll : EComposePresetType.Reply,
      email
    });

    stateManager.updateActiveKey("compose");
  };

  const forwardEmail = async (): Promise<void> => {
    if (!email) {
      return;
    }

    stateManager.setComposePresets({
      type: EComposePresetType.Forward,
      email
    });

    stateManager.updateActiveKey("compose");
  };

  const toggleActionModal = (actionType: EViewActionType): void => {
    const actionUid: number | undefined = stateManager.getActiveUid();

    setActionUid(actionUid);
    setActionType(actionType);
    setShowActionModal(true);
  };

  return !showEmail ? (
    <Card className="mt-0 mt-sm-3">
      <CardBody>
        <ProgressBar now={progressBarNow} />
      </CardBody>
    </Card>
  ) : (
    <Fragment>
      <Card className="mt-0 mt-sm-3 mb-3">
        <CardHeader>
          <h4 className="p-0 m-0 text-truncate">
            <FontAwesomeIcon icon={faEnvelopeOpen} />{" "}
            {email?.subject?.length ? email.subject : "(no subject)"}
          </h4>
        </CardHeader>
        <CardHeader>
          <ViewHeader
            toggleActionModal={toggleActionModal}
            replyToEmail={replyToEmail}
            forwardEmail={forwardEmail}
            email={email!}
          />
        </CardHeader>
        <CardBody
          className={`border-bottom pt-2 pb-2 ps-3 pe-3 ${
            !email?.attachments?.length ? "d-none" : "d-block"
          }`}
        >
          <ViewAttachments attachments={email!.attachments} />
        </CardBody>
        <CardBody>
          <ViewMessage viewMessage={viewMessage} />
          {email?.bodyHtml ? (
            <iframe
              id="emailBody"
              title="emailBody"
              className="email-body"
              onLoad={() => {
                const emailBodyFrame: HTMLIFrameElement = document.getElementById(
                  "emailBody"
                ) as HTMLIFrameElement;

                emailBodyFrame.style.height =
                  emailBodyFrame.contentWindow!.document.documentElement.scrollHeight + "px";
              }}
              srcDoc={email.bodyHtml}
              referrerPolicy="no-referrer"
            />
          ) : (
            <pre>{email?.bodyText}</pre>
          )}
        </CardBody>
      </Card>
      <ViewActions
        actionUid={actionUid}
        actionType={actionType}
        email={email!}
        emailFlags={emailFlags!}
        showActionModal={showActionModal}
        hideActionModal={() => setShowActionModal(false)}
      />
    </Fragment>
  );
};
