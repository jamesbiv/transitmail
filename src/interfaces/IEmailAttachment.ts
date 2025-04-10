import { IEmailHeaders } from "interfaces";

export interface IEmailAttachment {
  key: string;
  id?: number;
  filename: string;
  size?: number;
  encoding: string;
  mimeType: string;
  content: string;
  contentRaw?: string;
  headers?: IEmailHeaders;
  isAttachment?: boolean;
}
