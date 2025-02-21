export interface IImapResponse {
  status?: EImapResponseStatus;
  data: string[][];
}

export enum EImapResponseStatus {
  OK,
  NO,
  BAD
}
