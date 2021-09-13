import { IEmail } from "./IEmail";

export enum EComposePresetType {
  Reply,
  ReplyAll,
  Forward,
}

export interface IComposePresets {
  email?: IEmail;
  type: EComposePresetType;
  uid?: number;
}
