export interface ISmtpResponseData {
  code?: number | number[];
  failure?: (event: ISmtpResponseData | Event) => void;
  request?: string;
  response?: string[][];
  responseCode?: string;
  success?: (event: ISmtpResponseData | Event) => void;
}
