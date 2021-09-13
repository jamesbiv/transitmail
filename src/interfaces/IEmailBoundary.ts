import { IEmailHeaders } from ".";

export interface IEmailBoundary {
  boundaryId?: string;
  contents: IEmailBoundaryContent[];
}

export interface IEmailBoundaryContent {
  contentRaw: string;
  headers: IEmailHeaders;
  content: string;
  mimeType: string;
  isAttachment?: boolean;
  filename?: string;
  encoding?: string;
  charset?: string;
  subBoundaryId?: string;
}
