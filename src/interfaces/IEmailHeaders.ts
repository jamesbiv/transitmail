export interface IEmailHeaders {
  [key: string]: string | undefined;

  date?: string;
  to?: string;
  cc?: string;
  from?: string;
  "reply-to"?: string;
  subject?: string;
  "content-transfer-encoding"?: string;
  "content-type"?: string;
}
