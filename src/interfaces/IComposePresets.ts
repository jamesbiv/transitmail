import { IComposeAttachment } from ".";

export interface IComposePresets {
  email: string;
  subject?: string;
  from?: string;
  attachments?: IComposeAttachment[];
}
