export interface IFolderEmail {
  [key: string]: number | boolean | string;

  id: number;
  date: string;
  epoch: number;
  from: string;
  subject: string;
  uid: number;
  ref: string;
  flags: string;
  hasAttachment: boolean;
  selected: boolean;
}
