import { IImapRequest } from "./IImapRequest";

export interface IImapSession {
  debug: boolean;
  retry: number;
  socket?: WebSocket;
  binaryType: BinaryType;
  request: IImapRequest[];
  responseQueue: any;
  responseContent: string;
  streamCumlative: number;
  stream: number;
  lock: boolean;
}

export type TImapResponseQueue = string;
