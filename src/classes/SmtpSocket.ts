import {
  ISmtpSettings,
  ISmtpSession,
  ISmtpResponse,
  ESmtpResponseStatus,
  ISmtpResponseData
} from "interfaces";

type TSmtpCallback = (event: ISmtpResponseData | Event) => void;

export class SmtpSocket {
  /**
   * @var {ISmtpSession} session
   */
  public session: ISmtpSession;

  /**
   * @var {ISmtpSettings} settings
   */
  public settings: ISmtpSettings;

  /**
   * @constuctor
   * @param {Partial<ISmtpSettings>}
   */
  constructor({ host, port, username, password }: Partial<ISmtpSettings> = {}) {
    this.settings = {
      host: host ?? "", // SMTP WebSocket host
      port: port ?? 8025, // SMTP WebSocket port
      username: username ?? "", // SMTP account username
      password: password ?? "" // SMTP account password
    };

    // Session variables
    this.session = {
      debug: process.env.NODE_ENV === "development", // Dump transaction data to console
      retry: 3000, // Retry on network error 0 for no retry

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
   * @name smtpConnect
   * @param {boolean} authorise
   * @param {TSmtpCallback} success
   * @param {TSmtpCallback} error
   * @returns boolean
   */
  public smtpConnect(
    authorise: boolean = true,
    success?: TSmtpCallback,
    error?: TSmtpCallback
  ): boolean {
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
        console.log("[SMTP] Client Connected");
      }

      this.session.request.push({
        code: 250,
        request: "",
        success: () => {},
        failure: () => {}
      });

      this.session.lock = false;

      if (authorise) {
        this.smtpAuthorise();
      } else {
        success && success(event);
      }
    };

    this.session.socket.onmessage = <T>(message: MessageEvent<T>) => {
      if (message.data instanceof Blob) {
        const reader: FileReader = new FileReader();

        reader.onload = () => {
          const result: string = reader.result as string;

          this.smtpResponseHandler(result);
        };

        reader.readAsText(message.data);
      }
    };

    this.session.socket.onerror = (event: Event) => {
      if (this.session.debug) {
        console.error("[SMTP] Connection error", event);
      }

      if (this.session.retry > 0) {
        setTimeout(() => {
          this.smtpConnect(authorise, success, error);
        }, this.session.retry);
      }

      error && error(event);
    };

    this.session.socket.onclose = (event: Event) => {
      if (this.session.debug) {
        console.log("[SMTP] Connection closed", event);
      }
    };

    return false;
  }

  /**
   * @name smtpClose
   * @returns boolean
   */
  public smtpClose(): boolean {
    this.session.socket?.close();

    return true;
  }

  /**
   * @name smtpRequest
   * @param {string} request
   * @param {number} code
   * @returns Promise<ISmtpResponse>
   */
  public async smtpRequest(request: string, code: number | number[]): Promise<ISmtpResponse> {
    let status: ESmtpResponseStatus | undefined;

    const responsePayload: Promise<ISmtpResponseData> = new Promise((fulfilled, rejected) => {
      this.smtpProcessRequest(
        request,
        code,
        (event: ISmtpResponseData | Event) => {
          fulfilled(event as ISmtpResponseData);
          status = ESmtpResponseStatus.Success;
        },
        (event: ISmtpResponseData | Event) => {
          fulfilled(event as ISmtpResponseData);
          status = ESmtpResponseStatus.Failure;
        }
      );
    });

    const resolvedResponsePayload = await responsePayload;

    return { data: resolvedResponsePayload.response ?? [], status };
  }

  /**
   * @name smtpProcessRequest
   * @param {string} request
   * @param {number} code
   * @param {TSmtpCallback} success
   * @param {TSmtpCallback} failure
   * @returns void
   */
  private smtpProcessRequest(
    request: string,
    code: number | number[],
    success?: TSmtpCallback,
    failure?: TSmtpCallback
  ): void {
    if (this.session.lock) {
      setTimeout(() => {
        this.smtpProcessRequest(request, code, success, failure);
      }, 100);

      return;
    }

    this.session.lock = true;
    this.session.stream = 0;

    const blob: Blob = new Blob([request + "\r\n"], {});

    if (this.session.debug) {
      console.log("[SMTP] Request: " + request);
    }

    this.session.request.push({
      request: request,
      code: code,
      success: success,
      failure: failure
    });

    const readyStateCallack = () =>
      setTimeout(() => {
        const currentReadyState: number | undefined = this.getReadyState();

        if (this.session.socket && currentReadyState && currentReadyState === 1) {
          this.session.socket.send(blob);
        } else {
          readyStateCallack();
        }
      }, 10);

    readyStateCallack();
  }

  /**
   * @name smtpResponseHandler
   * @param {string} response
   * @returns void
   */
  public smtpResponseHandler(response: string): void {
    const index: number = this.session.request.length - 1;
    const responseRows: string[] = response.split("\r\n");

    if (this.session.debug) {
      console.log("[SMTP] Response: " + response);
    }

    let responseCode: string = "";

    responseRows.forEach((responseRow: string) => {
      const firstSpace: number = responseRow.indexOf(" ");

      if (firstSpace === 3) {
        responseCode = responseRow.slice(0, firstSpace);
      }

      if (responseRow.length) {
        this.session.responseQueue.push([responseRow]);
      }
    });

    this.session.request[index].response = this.session.responseQueue;
    this.session.request[index].responseCode = responseCode;
    this.session.responseQueue = [];

    this.session.lock = false;

    const request: ISmtpResponseData = this.session.request[index];

    if (request) {
      const requestCodeArray = Array.isArray(request.code) ? request.code : [request.code];
      console.log(request.code, responseCode);

      requestCodeArray.includes(Number(responseCode))
        ? request.success && request.success(request)
        : request.failure && request.failure(request);
    }
  }

  /**
   * @name smtpAuthorise
   * @returns Promise<ISmtpResponse>
   */
  public async smtpAuthorise(): Promise<ISmtpResponse> {
    const ehloResponse: ISmtpResponse = await this.smtpRequest(`EHLO ${this.settings.host}`, 220);

    if (ehloResponse.status !== ESmtpResponseStatus.Success) {
      return ehloResponse;
    }

    const authResponse: ISmtpResponse = await this.smtpRequest("AUTH LOGIN", 250);

    if (authResponse.status !== ESmtpResponseStatus.Success) {
      return authResponse;
    }

    const userResponse: ISmtpResponse = await this.smtpRequest(btoa(this.settings.username), 334);

    if (userResponse.status !== ESmtpResponseStatus.Success) {
      return userResponse;
    }

    const passResponse: ISmtpResponse = await this.smtpRequest(
      btoa(this.settings.password),
      [235, 250, 334]
    );

    return passResponse;
  }

  /**
   * @name getReadyState
   * @returns number | false
   */
  public getReadyState(): number | undefined {
    return this.session.socket?.readyState;
  }

  /**
   * @name getStreamAmount
   * @returns number
   */
  public getBufferedAmount = (): number => {
    return this.session.socket?.bufferedAmount ?? 0;
  };
}
