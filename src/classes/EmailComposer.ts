import { EditorState, convertToRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import {
  IComposeRecipient,
  IComposeAttachment,
  IComposedEmail,
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
   * @name composeEmail
   * @param {IEmailData} emailData
   * @returns IComposedEmail
   */
  public composeEmail(emailData: IEmailData): IComposedEmail {
    const composedEmail: IComposedEmail = {
      boundaryid: Math.random().toString(36).substring(5),
    };

    composedEmail.subject = emailData.subject;
    
    composedEmail.from = emailData.from;

    emailData.recipients?.forEach((recipient: IComposeRecipient) => {
      if (recipient.type === "To") {
        if (composedEmail.to) {
          // nothing
        } else {
          if (recipient.value) {
            composedEmail.to = recipient.value;
          }
        }
      }

      if (recipient.type === "Cc") {
        composedEmail.cc
          ? (composedEmail.cc += ", " + recipient.value)
          : (composedEmail.cc = recipient.value ?? "");
      }
      
      if (recipient.type === "Bcc") {
        composedEmail.bcc
          ? (composedEmail.bcc += ", " + recipient.value)
          : (composedEmail.bcc = recipient.value ?? "");
      }
    });

    composedEmail.contentText = "";

    [...convertToRaw(emailData.editorState.getCurrentContent()).blocks].forEach(
      (contentRow) => {
        composedEmail.contentText += contentRow.text + "\r\n";
      }
    );

    composedEmail.contentHTML = stateToHTML(
      emailData.editorState.getCurrentContent()
    );

    if (emailData.attachments) {
      composedEmail.attachmentsEncoded = "";

      emailData.attachments.forEach((attachment: IComposeAttachment) => {
        const attachmentEncoded = btoa(attachment.data as string);

        composedEmail.attachmentsEncoded += `\
--transit--client--${composedEmail.boundaryid}\r\n\
Content-Type: ${attachment.mimeType}; name="${attachment.filename}"\r\n\
Content-Disposition: attachment; filename="${attachment.filename}"\r\n\
Content-Transfer-Encoding: base64\r\n\r\n\
${attachmentEncoded}\r\n\r\n`;
      });
    }

    composedEmail.payload = `\
Subject: ${composedEmail.subject ?? "(no subject)"}\r\n\
To: ${composedEmail.to}\r\n\
Cc: ${composedEmail.cc ?? ""}\r\n\
Bcc: ${composedEmail.bcc ?? ""}\r\n\
From: ${composedEmail.from}\r\n\
MIME-Version: 1.0\r\n\
X-Mailer: Transit alpha0.0.1\r\n\
Content-Type: multipart/alternative; boundary="transit--client--${
      composedEmail.boundaryid
    }"\r\n\r\n\
--transit--client--${composedEmail.boundaryid}\r\n\
Content-Type: text/plain; charset="utf-8"\r\n\r\n\
${composedEmail.contentText}\r\n\r\n\
--transit--client--${composedEmail.boundaryid}\r\n\
Content-Type: text/html; charset="utf-8"\r\n\r\n\
${composedEmail.contentHTML}\r\n\r\n\
${composedEmail.attachmentsEncoded}\
--transit--client--${composedEmail.boundaryid}--`;

    return composedEmail;
  }
}