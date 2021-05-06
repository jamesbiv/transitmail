export interface IEmailAttachment {
  id?: number;
  filename: string;
  size?: number;
  encoding: string;
  mimeType: string;
  content: string;
}
