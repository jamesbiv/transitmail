export interface ISmtpResponseData {
  code?: number;
  failure?: (event: ISmtpResponseData | Event) => void;
  request?: string;
  response?: any;
  responseCode?: string;
  success?: (event: ISmtpResponseData | Event) => void;
}
