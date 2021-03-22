export interface ISmtpResponse {
  status?: ESmtpResponseStatus;
  data: any;
}

export enum ESmtpResponseStatus {
  Success,
  Failure,
}
