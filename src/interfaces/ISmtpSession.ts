import { ISmtpRequest } from "./ISmtpRequest";

export interface ISmtpSession {
  debug: boolean;
  retry: number;
  socket?: WebSocket;
  binaryType: BinaryType;
  request: ISmtpRequest[];
  responseQueue: string[][];
  responseContent: string;
  streamCumlative: number;
  stream: number;
  lock: boolean;
}
