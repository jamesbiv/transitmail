export interface IImapResponse {
  status?: EImapResponseStatus;
  data: any;
}

export enum EImapResponseStatus {
  OK,
  NO,
  BAD,
}
