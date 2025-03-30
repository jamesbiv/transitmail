import {
  ISmtpSettings,
  ISmtpSession,
  ISmtpResponse,
  ESmtpResponseStatus,
  ISmtpResponseData,
  ESmtpResponseCodeType,
  ISmtpResponseCode
} from "interfaces";
import { smtpResponseCodes } from "lib";

/**
 * @type TSmtpCallback
 */
type TSmtpCallback = (event: ISmtpResponseData | Event) => void;

/**
 * @class SmtpSocket
 */
export class SmtpSocket {
  /**
   * @public {ISmtpSession} session
   */
  public session: ISmtpSession;

  /**
   * @public {ISmtpSettings} settings
   */
  public settings: ISmtpSettings;

  /**
   * @public {number[]} responseCodes
   */
  public responseCodes: { positive: number[]; negative: number[] };

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

    // Response codes
    this.responseCodes = {
      positive: this.getResponseCodesByType([
        ESmtpResponseCodeType.PositiveCompletion,
        ESmtpResponseCodeType.PositiveIntermediate
      ]),
      negative: this.getResponseCodesByType([
        ESmtpResponseCodeType.NegativePermanent,
        ESmtpResponseCodeType.NegativeTransient
      ])
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
        // eslint-disable-next-line no-console
        console.log("[SMTP] Client Connected");
      }

      this.session.request.push({
        responseCodes: [250],
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
        // eslint-disable-next-line no-console
        console.error("[SMTP] Connection error", JSON.stringify(event));
      }

      if (this.session.retry > 0) {
        setTimeout(() => {
          this.smtpConnect(authorise, success, error);
        }, this.session.retry);
      }

      error && error(event);
    };

    this.session.socket.onclose = (event: CloseEvent) => {
      if (this.session.debug) {
        // eslint-disable-next-line no-console
        console.log("[SMTP] Connection closed", JSON.stringify(event));
      }
    };

    return true;
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
  public async smtpRequest(
    request: string,
    responseCodes: number[] = this.responseCodes["positive"]
  ): Promise<ISmtpResponse> {
    let status: ESmtpResponseStatus | undefined;

    const responsePayload: Promise<ISmtpResponseData> = new Promise((fulfilled, rejected) => {
      this.smtpProcessRequest(
        request,
        responseCodes,
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
    responseCodes: number[],
    success?: TSmtpCallback,
    failure?: TSmtpCallback
  ): void {
    if (this.session.lock) {
      setTimeout(() => {
        this.smtpProcessRequest(request, responseCodes, success, failure);
      }, 100);

      return;
    }

    this.session.lock = true;
    this.session.stream = 0;

    const blob: Blob = new Blob([request + "\r\n"], {});

    if (this.session.debug) {
      // eslint-disable-next-line no-console
      console.log("[SMTP] Request: " + request);
    }

    this.session.request.push({
      request: request,
      responseCodes: responseCodes,
      success: success,
      failure: failure
    });

    const readyStateCallack = () =>
      setTimeout(() => {
        const currentReadyState: number | undefined = this.getReadyState();

        if (this.session.socket && currentReadyState && currentReadyState === WebSocket.OPEN) {
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
  private smtpResponseHandler(response: string): void {
    const index: number = this.session.request.length - 1;
    const responseRows: string[] = response.split("\r\n");

    if (this.session.debug) {
      // eslint-disable-next-line no-console
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
      request.responseCodes.includes(Number(responseCode))
        ? request.success && request.success(request)
        : request.failure && request.failure(request);
    }
  }

  /**
   * @name smtpAuthorise
   * @returns Promise<ISmtpResponse>
   */
  public async smtpAuthorise(): Promise<ISmtpResponse> {
    const ehloResponse: ISmtpResponse = await this.smtpRequest(`EHLO ${this.settings.host}`);

    if (ehloResponse.status !== ESmtpResponseStatus.Success) {
      return ehloResponse;
    }

    const authResponse: ISmtpResponse = await this.smtpRequest("AUTH LOGIN");

    if (authResponse.status !== ESmtpResponseStatus.Success) {
      return authResponse;
    }

    const userResponse: ISmtpResponse = await this.smtpRequest(btoa(this.settings.username));

    if (userResponse.status !== ESmtpResponseStatus.Success) {
      return userResponse;
    }

    const passResponse: ISmtpResponse = await this.smtpRequest(btoa(this.settings.password));

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

  /**
   * getResponseCodesByType
   * @param responseCodeTypes
   * @returns number[]
   */
  private getResponseCodesByType(responseCodeTypes: ESmtpResponseCodeType[]) {
    return smtpResponseCodes.reduce(
      (responseCode: number[], smtpResponseCode: ISmtpResponseCode) => {
        const { code, type } = smtpResponseCode;

        if (responseCodeTypes.includes(type)) {
          responseCode.push(code);
        }

        return responseCode;
      },
      []
    );
  }
}
