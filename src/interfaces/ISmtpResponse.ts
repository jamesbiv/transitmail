export interface ISmtpResponse {
  status?: ESmtpResponseStatus;
  data: string[];
}

export enum ESmtpResponseStatus {
  Success,
  Failure,
}
