import { Dispatch } from "react";
import { directAccessToDependencies } from "contexts";
import {
  EImapResponseStatus,
  ESmtpResponseStatus,
  IComposedEmail,
  IComposePresets,
  IEmail,
  IEmailFlags,
  IImapResponse,
  ISmtpResponse
} from "interfaces";
import { EmailComposer, SmtpSocket } from "classes";
import { IEmailData } from "classes/EmailComposer";
import { initiateProgressBar } from "lib";

/**
 * downloadEmail
 * @param {IComposePresets} composePresets
 * @param {Dispatch<boolean>} setShowComposer
 * @param {() => void} progressBarCallbackFn
 * @returns Promise<IEmail | undefined>
 */
export const downloadEmail = async (
  composePresets: IComposePresets,
  setProgressBarNow?: Dispatch<number>,
  progressBarCallbackFn?: () => void
): Promise<IEmail | undefined> => {
  const { imapSocket, imapHelper } = directAccessToDependencies();

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

  if (setProgressBarNow && progressBarCallbackFn) {
    initiateProgressBar(
      emailFlags.size,
      setProgressBarNow,
      () => imapSocket.getStreamAmount(),
      progressBarCallbackFn
    );
  }

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
 * sendEmail
 * @param emailData
 * @returns Promise<ISmtpResponse>
 */
export const sendEmail = async (emailData: IEmailData): Promise<ISmtpResponse> => {
  const { smtpSocket } = directAccessToDependencies();

  smtpSocket.smtpConnect();

  const response: ISmtpResponse = await sendEmailAction(smtpSocket, emailData);

  smtpSocket.smtpClose();

  return response;
};

/**
 * sendEmailAction
 * @param {SmtpSocket} smtpSocket
 * @param {IEmailData} emailData
 * @returns Promise<ISmtpResponse>
 */
const sendEmailAction = async (
  smtpSocket: SmtpSocket,
  emailData: IEmailData
): Promise<ISmtpResponse> => {
  const emailComposer = new EmailComposer();

  const composedEmailData: IComposedEmail = emailComposer.composeEmail(emailData);

  const mailResponse: ISmtpResponse = await smtpSocket.smtpRequest(
    `MAIL from: ${emailData.from.email}`
  );

  if (mailResponse.status !== ESmtpResponseStatus.Success) {
    return mailResponse;
  }

  const composedEmailDataTo =
    /(.*) <(.*)>/i.exec(composedEmailData.to)?.[2] ?? composedEmailData.to;

  const rcptResponse: ISmtpResponse = await smtpSocket.smtpRequest(
    `RCPT to: ${composedEmailDataTo}`
  );

  if (rcptResponse.status !== ESmtpResponseStatus.Success) {
    return rcptResponse;
  }

  const dataResponse: ISmtpResponse = await smtpSocket.smtpRequest("DATA");

  if (dataResponse.status !== ESmtpResponseStatus.Success) {
    return dataResponse;
  }

  const payloadResponse: ISmtpResponse = await smtpSocket.smtpRequest(
    `${composedEmailData.payload}\r\n\r\n.`
  );

  if (payloadResponse.status !== ESmtpResponseStatus.Success) {
    return payloadResponse;
  }

  const quitResponse: ISmtpResponse = await smtpSocket.smtpRequest(`QUIT`);

  return quitResponse;
};
