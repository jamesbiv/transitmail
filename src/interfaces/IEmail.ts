import { IEmailBoundary, IEmailHeaders, IEmailAttachment } from ".";

export interface IEmail {
  emailRaw?: string;
  boundary?: string[];
  boundaries: IEmailBoundary[];
  boundaryIds: string[];
  headers: IEmailHeaders;
  headersRaw: string;
  content?: string;
  contentRaw: string;
  attachments: IEmailAttachment[];
  date?: string;
  from?: string;
  replyTo?: string;
  to?: string;
  cc?: string;
  charset?: string;
  encoding?: string;
  mimeType?: string;
  subject?: string;
  bodyHtml?: string;
  bodyHtmlHeaders?: IEmailHeaders;
  bodyText?: string;
  bodyTextHeaders?: IEmailHeaders;
}
