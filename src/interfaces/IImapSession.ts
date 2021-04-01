import { IImapRequest } from "./IImapRequest";

export interface IImapSession {
  debug: boolean;
  retry: number;
  socket?: WebSocket;
  binaryType: BinaryType;
  request: IImapRequest[];
  responseQueue: string[][];
  responseContent: string;
  streamCumlative: number;
  stream: number;
  lock: boolean;
}
