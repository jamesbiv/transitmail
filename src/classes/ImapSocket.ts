import {
  EImapResponseStatus,
  IImapResponse,
  IImapResponseData,
  IImapSession,
  IImapSettings
} from "interfaces";

/**
 * @type TImapCallback
 */
type TImapCallback = (event: IImapResponseData | Event) => void;

/**
 * @class ImapSocket
 */
export class ImapSocket {
  /**
   * @public {IImapSession} session
   */
  public session: IImapSession;

  /**
   * @public {IImapSettings} settings
   */
  public settings: IImapSettings;

  /**
   * @constuctor
   * @param {Partial<IImapSettings>}
   */
  constructor({ host, port, username, password }: Partial<IImapSettings> = {}) {
    this.settings = {
      host: host ?? "", // IMAP WebSocket host
      port: port ?? 8143, // IMAP WebSocket port
      username: username ?? "", // IMAP account username
      password: password ?? "" // IMAP account password
    };

    // Session variables
    this.session = {
      debug: process.env.NODE_ENV === "development", // Dump transaction data to console
      retry: 30000, // Retry on network error 0 for no retry

      // Do not touch variables below
      socket: undefined, // WebSocket
      binaryType: "blob", // WebSocket transmission type
      request: [], // last request
      responseQueue: [], // history of responses
      responseContent: "", // the response being processed
      streamCumlative: 0, // download count of entire session
      stream: 0, // download count of last request
      lock: true // locking asynchronous messages
    };
  }

  /**
   * @method imapCheckOrConnect
   * @param {boolean} authorise
   * @returns boolean
   */
  public async imapCheckOrConnect(authorise: boolean = true): Promise<boolean> {
    if (this.getReadyState() === WebSocket.OPEN) {
      return true;
    }

    return this.imapConnect(authorise);
  }

  /**
   * @method imapConnect
   * @param {boolean} authorise

   * @returns boolean
   */
  public async imapConnect(authorise: boolean = true): Promise<boolean> {
    this.session.socket = new WebSocket(
      `wss://${this.settings.host}:${this.settings.port}`,
      "binary"
    );

    this.session.socket.binaryType = this.session.binaryType;
    this.session.lock = true;

    const isConnected: boolean = await new Promise((resolve, reject) => {
      this.session.socket!.onopen = (event: Event) => {
        if (this.session.debug) {
          // eslint-disable-next-line no-console
          console.log("[IMAP] Client Connected");
        }

        this.session.request.push({ id: "", request: "" });

        resolve(true);
      };

      this.session.socket!.onerror = (event: Event) => {
        if (this.session.debug) {
          // eslint-disable-next-line no-console
          console.error("[IMAP] Connection error", JSON.stringify(event));
        }

        resolve(false);
      };
    });

    if (!isConnected) {
      if (this.session.retry > 0) {
        setTimeout(() => this.imapConnect(authorise), this.session.retry);
      }

      this.session.lock = false;

      return false;
    }

    this.session.socket.onopen = undefined as never;
    this.session.socket.onerror = undefined as never;

    this.session.socket.onmessage = <T>(message: MessageEvent<T>) => {
      if (!(message.data instanceof Blob)) {
        this.imapResponseHandler(message.data as string);

        return;
      }

      const reader: FileReader = new FileReader();

      reader.onload = () => {
        const result: string = reader.result as string;

        this.session.stream += result.length;
        this.session.streamCumlative += this.session.stream;

        this.imapResponseHandler(result);
      };

      reader.readAsText(message.data);
    };

    this.session.socket.onclose = (event: CloseEvent) => {
      if (this.session.debug) {
        // eslint-disable-next-line no-console
        console.log("[IMAP] Connection closed", JSON.stringify(event));
      }
    };

    this.session.lock = false;

    if (authorise) {
      await this.imapAuthorise();
    }

    return true;
  }

  /**
   * @method imapClose
   * @returns boolean
   */
  public imapClose(): boolean {
    this.session.socket?.close();

    return true;
  }

  /**
   * @method imapRequest
   * @param {string} request
   * @returns Promise<IImapResponse>
   */
  public async imapRequest(request: string): Promise<IImapResponse> {
    let status: EImapResponseStatus | undefined;

    const responsePayload: IImapResponseData = await new Promise((resolve, reject) => {
      this.imapProcessRequest(
        request,
        (event: IImapResponseData | Event) => {
          resolve(event as IImapResponseData);
          status = EImapResponseStatus.OK;
        },
        (event: IImapResponseData | Event) => {
          resolve(event as IImapResponseData);
          status = EImapResponseStatus.NO;
        },
        (event: IImapResponseData | Event) => {
          resolve(event as IImapResponseData);
          status = EImapResponseStatus.BAD;
        }
      );
    });

    return { data: responsePayload.response!, status: status };
  }

  /**
   * @method imapProcessRequest
   * @param {string} request
   * @param {TImapCallback} ok
   * @param {TImapCallback} no
   * @param {TImapCallback} bad
   * @returns void
   */
  private imapProcessRequest(
    request: string,
    ok: TImapCallback,
    no: TImapCallback,
    bad: TImapCallback
  ): void {
    if (this.session.lock) {
      setTimeout(() => this.imapProcessRequest(request, ok, no, bad), 100);
      return;
    }

    this.session.lock = true;
    this.session.stream = 0;

    const requestId: string = Math.random().toString(36).substring(5);
    const blob: Blob = new Blob([requestId + " " + request + "\r\n"], {});

    if (this.session.debug) {
      // eslint-disable-next-line no-console
      console.log("[IMAP] Request: " + requestId + " " + request);
    }

    this.session.request.push({
      id: requestId,
      request: request,
      ok: ok,
      no: no,
      bad: bad
    });

    this.session.socket!.send(blob);
  }

  /**
   * @method imapResponseHandler
   * @param {string} response
   * @returns void
   */
  private imapResponseHandler(response: string): void {
    const requestIndex: number = this.session.request.length - 1;
    const responseRows: string[] = response.split("\r\n");

    if (this.session.debug) {
      // eslint-disable-next-line no-console
      console.log("[IMAP] Response: " + response);
    }

    const request: IImapResponseData = this.session.request[requestIndex];
    const requestId: string = this.session.request[requestIndex].id;

    responseRows.forEach((responseRow: string, responseKey: number) => {
      const responseCols: string[] = responseRow.split(" ");

      let result: string[] = [];

      switch (true) {
        case !!(responseCols[0] === "*" || responseCols[0] === requestId):
          if (this.session.responseContent && this.session.responseContent !== "\r\n") {
            this.session.responseQueue.push([this.session.responseContent]);
          }

          if (this.session.responseContent.length) {
            this.session.responseContent = "";
          }

          result = responseCols.splice(0, 2);
          result.push(responseCols.join(" "));

          this.session.responseQueue.push(result);
          break;

        case !!(responseKey === responseRows.length - 3 && responseRow === ")"):
          break;

        case !!responseRow.length:
          this.session.responseContent += responseRow + "\r\n";
          break;

        default:
          this.session.responseContent += "\r\n";
          break;
      }

      if (result?.[0] === requestId) {
        this.session.request[requestIndex].response = this.session.responseQueue;
        this.session.responseQueue = [];

        this.session.lock = false;

        switch (result[1]) {
          case "NO":
            request.no && request.no(request);
            break;

          case "BAD":
            request.bad && request.bad(request);
            break;

          case "OK":
            request.ok && request.ok(request);
            break;
        }
      }
    });
  }

  /**
   * @method imapAuthorise
   * @returns Promise<IImapResponse>
   */
  public async imapAuthorise(): Promise<IImapResponse> {
    return await this.imapRequest(`LOGIN ${this.settings.username} ${this.settings.password}`);
  }

  /**
   * @method getReadyState
   * @returns number | undefined
   */
  public getReadyState(): number | undefined {
    return this.session.socket?.readyState;
  }

  /**
   * @method getStreamAmount
   * @returns number
   */
  public getStreamAmount(): number {
    return this.session.stream;
  }

  /**
   * @method getStreamCumlativeAmount
   * @returns number
   */
  public getStreamCumlativeAmount(): number {
    return this.session.streamCumlative;
  }

  /**
   * @method getBufferedAmount
   * @returns number
   */
  public getBufferedAmount = (): number => {
    return this.session.socket?.bufferedAmount ?? 0;
  };
}
