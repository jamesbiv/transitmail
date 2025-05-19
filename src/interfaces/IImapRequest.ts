import { IImapResponseData } from ".";

export interface IImapRequest {
  id: string;
  request: string;
  ok?: (event: IImapResponseData | Event) => void;
  no?: (event: IImapResponseData | Event) => void;
  bad?: (event: IImapResponseData | Event) => void;
  response?: string[][];
}
