export interface IComposeAttachment {
  id: number;
  filename: string;
  size: number;
  mimeType: string;
  data: string | ArrayBuffer | null;
}
