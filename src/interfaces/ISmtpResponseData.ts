export interface ISmtpResponseData {
  responseCodes: number[];
  request: string;
  response: string[][];
  responseCode: string;
  failure?: (event: ISmtpResponseData | Event) => void;
  success?: (event: ISmtpResponseData | Event) => void;
}
