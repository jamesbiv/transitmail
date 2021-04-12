import { IEmailBoundary, IEmailHeaders, IEmailAttachment } from ".";

export interface IEmail {
  attachments?: IEmailAttachment[];
  bcc?: string;
  bodyHtml?: string;
  bodyHtmlHeaders?: IEmailHeaders;
  bodyText?: string;
  bodyTextHeaders?: IEmailHeaders;
  boundary?: string[];
  boundaries?: IEmailBoundary[];
  boundaryIds?: string[];
  cc?: string;
  charset?: string;
  content?: string;
  contentRaw: string;
  date?: string;
  encoding?: string;
  emailRaw: string;
  from?: string;
  headers?: IEmailHeaders;
  headersRaw: string;
  mimeType?: string;
  replyTo?: string;
  to?: string;
  subject?: string;
}
