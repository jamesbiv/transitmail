import { IComposeRecipient, IComposeAttachment, IComposedEmail } from "interfaces";

/**
 * @interface IEmailData
 */
export interface IEmailData {
  from: {
    email: string;
    displayName: string;
  };
  subject?: string;
  recipients?: IComposeRecipient[];
  attachments?: IComposeAttachment[];
  body?: string;
}

/**
 * @class EmailComposer
 */
export class EmailComposer {
  /**
   * composeEmail
   * @method
   * @param {IEmailData} emailData
   * @returns {IComposedEmail}
   */
  public composeEmail(emailData: IEmailData): IComposedEmail {
    const composedEmail: Partial<IComposedEmail> = {
      boundaryid: Math.random().toString(36).substring(5),
      subject: emailData.subject,
      from: `${emailData.from.displayName} <${emailData.from.email}>`
    };

    emailData.recipients?.forEach((recipient: IComposeRecipient) => {
      if (!recipient.value) {
        return;
      }

      if (recipient.type === "To" && !composedEmail.to) {
        composedEmail.to = recipient.value;
      }

      if (recipient.type === "Cc") {
        composedEmail.cc = composedEmail.cc
          ? `${composedEmail.cc}, ${recipient.value}`
          : recipient.value;
      }

      if (recipient.type === "Bcc") {
        composedEmail.bcc = composedEmail.bcc
          ? `${composedEmail.bcc}, ${recipient.value}`
          : recipient.value;
      }
    });

    composedEmail.contentText = "";
    composedEmail.contentHTML = emailData.body;

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

    return composedEmail as IComposedEmail;
  }
}
