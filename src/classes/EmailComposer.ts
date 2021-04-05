import { EditorState, convertToRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import {
  IComposeRecipient,
  IComposeAttachment,
  IPreparedEmail,
} from "interfaces";

interface IEmailData {
  editorState: EditorState;
  from: string;
  subject?: string;
  recipients?: IComposeRecipient[];
  attachments?: IComposeAttachment[];
}

export class EmailComposer {
  /**
   * prepareEmail
   * @param {IEmailData} emailData
   * @returns IPreparedEmail
   */
  public prepareEmail(emailData: IEmailData): IPreparedEmail {
    const preparedEmail: IPreparedEmail = {
      boundaryid: Math.random().toString(36).substring(5),
    };

    preparedEmail.from = emailData.from;

    emailData.recipients?.forEach((recipient: IComposeRecipient) => {
      if (recipient.type === "To") {
        if (preparedEmail.to) {
          // nothing
        } else {
          if (recipient.value) {
            preparedEmail.to = recipient.value;
          }
        }
      }
      if (recipient.type === "Cc") {
        preparedEmail.cc
          ? (preparedEmail.cc += ", " + recipient.value)
          : (preparedEmail.cc = recipient.value ?? "");
      }
      if (recipient.type === "Bcc") {
        preparedEmail.bcc
          ? (preparedEmail.bcc += ", " + recipient.value)
          : (preparedEmail.bcc = recipient.value ?? "");
      }
    });

    preparedEmail.contentText = "";

    [...convertToRaw(emailData.editorState.getCurrentContent()).blocks].forEach(
      (contentRow) => {
        preparedEmail.contentText += contentRow.text + "\r\n";
      }
    );

    preparedEmail.contentHTML = stateToHTML(
      emailData.editorState.getCurrentContent()
    );

    if (emailData.attachments) {
      preparedEmail.attachmentsEncoded = "";

      emailData.attachments.forEach((attachment: IComposeAttachment) => {
        const attachmentEncoded = btoa(attachment.data as string);

        preparedEmail.attachmentsEncoded += `\
--transit--client--${preparedEmail.boundaryid}\r\n\
Content-Type: ${attachment.mimeType}; name="${attachment.filename}"\r\n\
Content-Disposition: attachment; filename="${attachment.filename}"\r\n\
Content-Transfer-Encoding: base64\r\n\r\n\
${attachmentEncoded}\r\n\r\n`;
      });
    }

    preparedEmail.payload = `\
Subject: ${preparedEmail.subject ?? "(no subject)"}\r\n\
To: ${preparedEmail.to}\r\n\
Cc: ${preparedEmail.cc ?? ""}\r\n\
Bcc: ${preparedEmail.bcc ?? ""}\r\n\
From: ${preparedEmail.from}\r\n\
MIME-Version: 1.0\r\n\
X-Mailer: Transit alpha0.0.1\r\n\
Content-Type: multipart/alternative; boundary="transit--client--${
      preparedEmail.boundaryid
    }"\r\n\r\n\
--transit--client--${preparedEmail.boundaryid}\r\n\
Content-Type: text/plain; charset="utf-8"\r\n\r\n\
${preparedEmail.contentText}\r\n\r\n\
--transit--client--${preparedEmail.boundaryid}\r\n\
Content-Type: text/html; charset="utf-8"\r\n\r\n\
${preparedEmail.contentHTML}\r\n\r\n\
${preparedEmail.attachmentsEncoded}\
--transit--client--${preparedEmail.boundaryid}--`;

    return preparedEmail;
  }
}