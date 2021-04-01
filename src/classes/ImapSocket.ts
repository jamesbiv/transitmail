import {
  EImapResponseStatus,
  IImapResponse,
  IImapResponseData,
  IImapSession,
  IImapSettings,
} from "interfaces";

type TImapCallback = (event: IImapResponseData | Event) => void;

class ImapSocket {
  /**
   * @var {IImapSession} session
   */
  public session: IImapSession;

  /**
   * @var {IImapSettings} settings
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
      password: password ?? "", // IMAP account password
    };

    // Session variables
    this.session = {
      debug: false, // Dump transaction data to console
      retry: 30000, // Retry on network error 0 for no retry

      // Do not touch variables below
      socket: undefined, // WebSocket
      binaryType: "blob", // WebSocket transmission type
      request: [], // last request
      responseQueue: [], // history of responses
      responseContent: "", // the response being processed
      streamCumlative: 0, // download count of entire session
      stream: 0, // download count of last request
      lock: true, // locking asynchronous messages
    };
  }

  /**
   * @name imapConnect
   * @param {TImapCallback} success
   * @param {TImapCallback} error
   * @param {boolean} authorise
   * @returns void
   */
  public imapConnect(
    success?: TImapCallback,
    error?: TImapCallback,
    authorise: boolean = true
  ): void {
    this.session.socket = new WebSocket(
      `wss://${this.settings.host}:${this.settings.port}`,
      "binary"
    );

    this.session.socket.binaryType = this.session.binaryType;

    this.session.lock = true;

    if (this.session.socket instanceof WebSocket) {
      /* Websocket onopen */
      this.session.socket.onopen = (event: Event) => {
        if (this.session.debug) {
          console.log("[IMAP] Client Connected");
        }

        /* To handle the initial response from the server */
        this.session.request.push({
          id: "",
          request: "",
          ok: () => {},
          no: () => {},
          bad: () => {},
        });

        this.session.lock = false;

        if (authorise) {
          this.imapAuthorise();
        } else {
          success && success(event);
        }
      };

      /* Websocket recieving */
      this.session.socket.onmessage = <T>(message: MessageEvent<T>) => {
        if (message.data instanceof Blob) {
          const reader: FileReader = new FileReader();
          reader.onload = () => {
            const result: string = reader.result as string;

            // add progress loader
            this.session.stream += result.length;
            this.session.streamCumlative += this.session.stream;

            this.imapResponseHandler(result);
          };

          reader.readAsText(message.data);
        }
      };

      /* Websocket onerror */
      this.session.socket.onerror = (event: Event) => {
        if (this.session.debug) {
          console.error("[IMAP] Connection error", event);
        }

        if (this.session.retry > 0) {
          setTimeout(() => {
            this.imapConnect(success, error, authorise);
          }, this.session.retry);
        }

        error && error(event);
      };

      /* Websocket onclose */
      this.session.socket.onclose = (event: Event) => {
        if (this.session.debug) {
          console.log("[IMAP] Connection closed", event);
        }
      };
    }

    return;
  }

  /**
   * @name imapRequest
   * @param {string} request
   * @returns Promise<IImapResponse>
   */
  public async imapRequest(request: string): Promise<IImapResponse> {
    let status: EImapResponseStatus | undefined;

    const responsePayload: Promise<IImapResponseData> = new Promise(
      (fulfilled, rejected) => {
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
      }
    );

    return { data: (await responsePayload).response ?? [], status: status };
  }

  /**
   * @name imapProcessRequest
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

    /* lock imap  */
    this.session.lock = true;

    /* could verify id unquiness here */
    const requestId: string = Math.random().toString(36).substring(5);
    const blob: Blob = new Blob([requestId + " " + request + "\r\n"], {});

    if (this.session.debug) {
      console.log("[IMAP] Request: " + requestId + " " + request);
    }

    this.session.request.push({
      id: requestId,
      request: request,
      ok: ok,
      no: no,
      bad: bad,
    });

    this.session.stream = 0;

    this.session.socket!.send(blob);

    return;
  }

  /**
   * @name imapResponseHandler
   * @param {string} response
   * @returns void
   */
  private imapResponseHandler(response: string): void {
    const index: number = this.session.request.length - 1;
    const responseRows: string[] = response.split("\r\n");

    if (this.session.debug) {
      console.log("[IMAP] Response: " + response);
    }

    const ignoreAsterisk: boolean = false;
    const stripBracketAll: boolean = false;
    const stripBracketLast: boolean = false;

    responseRows.forEach((responseRow: string, responseKey: number) => {
      const responseCols: string[] = responseRow.split(" ");

      let result: string[] = [];

      if (
        (!ignoreAsterisk && responseCols[0] === "*") ||
        responseCols[0] === this.session.request[index].id
      ) {
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
          if (
            stripBracketAll ||
            (stripBracketLast && responseKey === responseRows.length - 3)
          ) {
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

      /* We need to keep appending the data if the response is something like an email
       * Further whitelisting can be done here in the future if need. */
      // if (responseKey === 0 && responseCols[0] === "FETCH") {
      // if (responseCols[3] === "RFC822") {
      //  stripBracketAll = true;
      //  ignoreAsterisk = false;
      // } else if (responseCols[3] === "FLAGS") {
      //  stripBracketLast = true;
      // }
      // }

      /* Proess final command */
      if (
        Array.isArray(result) &&
        result[0] === this.session.request[index].id
      ) {
        const request: IImapResponseData = this.session.request[index];

        if (request) {
          this.session.request[index].response = this.session.responseQueue;
          this.session.responseQueue = [];

          /* unlock imap for next request */
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
              //unknown condition
              break;
          }
        }
      }
    });

    return;
  }

  /**
   * @name imapAuthorise
   * @returns Promise<boolean>
   */
  public async imapAuthorise(): Promise<boolean> {
    const response = await this.imapRequest(
      "LOGIN " + this.settings.username + " " + this.settings.password
    );

    if (response.status !== EImapResponseStatus.OK) {
      return false;
    }

    return true;
  }

  /**
   * @name getReadyState
   * @returns number | false
   */
  public getReadyState(): number | false {
    if (!this.session.socket) {
      return false;
    }

    return this.session.socket.readyState;
  }

  /**
   * @name getStreamAmount
   * @param {number} cumlative
   * @returns number
   */
  public getStreamAmount(cumlative = false): number {
    return cumlative === true
      ? this.session.streamCumlative
      : this.session.stream;
  }

  /**
   * @name getBufferedAmount
   * @returns number | false
   */
  public getBufferedAmount(): number | false {
    if (!this.session.socket) {
      return false;
    }
    return this.session.socket.bufferedAmount;
  }
}

export default ImapSocket;
