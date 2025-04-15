import {
  EImapResponseStatus,
  IImapResponse,
  IImapResponseData,
  IImapSession,
  IImapSettings
} from "interfaces";

type TImapCallback = (event: IImapResponseData | Event) => void;

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
   * @param {TImapCallback} success
   * @param {TImapCallback} error
   * @returns boolean
   */
  public imapCheckOrConnect(
    authorise: boolean = true,
    success?: TImapCallback,
    error?: TImapCallback
  ): boolean {
    if (this.getReadyState() === WebSocket.OPEN) {
      return true;
    }

    return this.imapConnect(authorise, success, error);
  }

  /**
   * @method imapConnect
   * @param {boolean} authorise
   * @param {TImapCallback} success
   * @param {TImapCallback} error
   * @returns boolean
   */
  public imapConnect(
    authorise: boolean = true,
    success?: TImapCallback,
    error?: TImapCallback
  ): boolean {
    if (this.getReadyState() === WebSocket.OPEN) {
      return true;
    }

    this.session.socket = new WebSocket(
      `wss://${this.settings.host}:${this.settings.port}`,
      "binary"
    );

    this.session.socket.binaryType = this.session.binaryType;

    if (!(this.session.socket instanceof WebSocket)) {
      return false;
    }

    this.session.lock = true;

    this.session.socket.onopen = (event: Event) => {
      if (this.session.debug) {
        // eslint-disable-next-line no-console
        console.log("[IMAP] Client Connected");
      }

      this.session.request.push({
        id: "",
        request: "",
        ok: () => {},
        no: () => {},
        bad: () => {}
      });

      this.session.lock = false;

      if (authorise) {
        this.imapAuthorise();
      } else {
        success && success(event);
      }
    };

    this.session.socket.onmessage = <T>(message: MessageEvent<T>) => {
      if (message.data instanceof Blob) {
        const reader: FileReader = new FileReader();

        reader.onload = () => {
          const result: string = reader.result as string;

          this.session.stream += result.length;
          this.session.streamCumlative += this.session.stream;

          this.imapResponseHandler(result);
        };

        reader.readAsText(message.data);
      }
    };

    this.session.socket.onerror = (event: Event) => {
      if (this.session.debug) {
        // eslint-disable-next-line no-console
        console.error("[IMAP] Connection error", JSON.stringify(event));
      }

      if (this.session.retry > 0) {
        setTimeout(() => {
          this.imapConnect(authorise, success, error);
        }, this.session.retry);
      }

      error && error(event);
    };

    this.session.socket.onclose = (event: CloseEvent) => {
      if (this.session.debug) {
        // eslint-disable-next-line no-console
        console.log("[IMAP] Connection closed", JSON.stringify(event));
      }
    };

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

    const responsePayload: Promise<IImapResponseData> = new Promise((fulfilled, rejected) => {
      this.imapProcessRequest(
        request,
        (event: IImapResponseData | Event) => {
          fulfilled(event as IImapResponseData);
          status = EImapResponseStatus.OK;
        },
        (event: IImapResponseData | Event) => {
          fulfilled(event as IImapResponseData);
          status = EImapResponseStatus.NO;
        },
        (event: IImapResponseData | Event) => {
          fulfilled(event as IImapResponseData);
          status = EImapResponseStatus.BAD;
        }
      );
    });

    const resolvedResponsePayload = await responsePayload;

    return { data: resolvedResponsePayload.response ?? [], status: status };
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
      setTimeout(() => {
        this.imapProcessRequest(request, ok, no, bad);
      }, 100);

      return;
    }

    this.session.lock = true;

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

    this.session.stream = 0;

    this.session.socket!.send(blob);
  }

  /**
   * @method imapResponseHandler
   * @param {string} response
   * @returns void
   */
  private imapResponseHandler(response: string): void {
    const index: number = this.session.request.length - 1;
    const responseRows: string[] = response.split("\r\n");

    if (this.session.debug) {
      // eslint-disable-next-line no-console
      console.log("[IMAP] Response: " + response);
    }

    responseRows.forEach((responseRow: string, responseKey: number) => {
      const responseCols: string[] = responseRow.split(" ");

      let result: string[] = [];

      if (responseCols[0] === "*" || responseCols[0] === this.session.request[index].id) {
        if (this.session.responseContent.length) {
          if (this.session.responseContent !== "\r\n") {
            this.session.responseQueue.push([this.session.responseContent]);
          }

          this.session.responseContent = "";
        }

        result = responseCols.splice(0, 2);
        result.push(responseCols.join(" "));

        this.session.responseQueue.push(result);
      } else {
        if (responseRow.length) {
          if (responseKey === responseRows.length - 3) {
            if (responseRow !== ")") {
              this.session.responseContent += responseRow + "\r\n";
            }
          } else {
            this.session.responseContent += responseRow + "\r\n";
          }
        } else {
          this.session.responseContent += "\r\n";
        }
      }

      if (Array.isArray(result) && result[0] === this.session.request[index].id) {
        const request: IImapResponseData = this.session.request[index];

        if (request) {
          this.session.request[index].response = this.session.responseQueue;
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

            default:
              // unknown condition
              break;
          }
        }
      }
    });
  }

  /**
   * @method imapAuthorise
   * @returns Promise<IImapResponse>
   */
  public async imapAuthorise(): Promise<IImapResponse> {
    return await this.imapRequest("LOGIN " + this.settings.username + " " + this.settings.password);
  }

  /**
   * @method getReadyState
   * @returns number | false
   */
  public getReadyState(): number | false {
    if (!this.session.socket) {
      return false;
    }

    return this.session.socket.readyState;
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
   * @returns number | false
   */
  public getBufferedAmount(): number | false {
    if (!this.session.socket) {
      return false;
    }

    return this.session.socket.bufferedAmount;
  }
}
