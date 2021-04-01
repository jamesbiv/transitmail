import {
  IEmail,
  IEmailAttachment,
  IEmailBoundary,
  IEmailBoundaryContent,
  IEmailHeaders,
} from "interfaces";

class EmailParser {
  /**
   * @var {IEmail} email
   */
  protected email: IEmail = {
    attachments: [],
    boundaries: [],
    boundaryIds: [],
    headers: {},
    headersRaw: "",
    contentRaw: "",
  };

  /**
   * @name processEmail
   * @param {string} emailRaw
   * @reuturns IEmail
   * @description The key method for processing raw email data which should
   *              return a complete object of processed data ready to be used by
   *              the controller.
   */
  public processEmail(emailRaw: string): IEmail {
    const posHeader = emailRaw.indexOf("\r\n\r\n");

    const email: IEmail = {
      attachments: [],
      bodyHtml: "",
      bodyText: "",
      boundaries: [],
      boundaryIds: [],
      headers: {},
      headersRaw: emailRaw.substring(0, posHeader),
      contentRaw: emailRaw.substring(posHeader + 4, emailRaw.length - 1),
    };

    email.headers = this.splitHeaders(email.headersRaw, false);

    /* Sort header data */
    Object.keys(email.headers).forEach((headerKey: string) => {
      let values: RegExpMatchArray | undefined = undefined;
      let newBoundaryId: string | undefined = undefined;

      const headerData: string = email.headers[headerKey]!;

      switch (headerKey.toLowerCase()) {
        case "date":
          email.date = headerData;
          break;

        case "to":
          email.to = this.parseMimeWords(headerData);
          break;

        case "cc":
          email.cc = this.parseMimeWords(headerData);
          break;

        case "from":
          email.from = this.parseMimeWords(headerData);
          break;

        case "reply-to":
          email.replyTo = this.parseMimeWords(headerData);
          break;

        case "subject":
          email.subject = this.parseMimeWords(headerData);
          break;

        case "content-transfer-encoding":
          email.encoding = headerData;
          break;

        case "content-type":
          values = headerData.match(/['|"]?(\S+)['|"]?;(.*)/) ?? undefined;

          if (values && values.length > 1) {
            email.mimeType = values[1].toLowerCase();
          }

          email.charset = this.getHeaderAttribute("charset", headerData);
          newBoundaryId = this.getHeaderAttribute("boundary", headerData);

          if (newBoundaryId) {
            email.boundaryIds.push(newBoundaryId);
          }
          break;

        default:
          break;
      }
    });

    email.boundaries = this.parseBoundaries(
      email.contentRaw,
      email.boundaryIds
    );

    email.boundaries.forEach((boundary: IEmailBoundary) => {
      boundary.contents.forEach((contentRow: IEmailBoundaryContent) => {
        switch (contentRow.mimeType) {
          case "text/html":
            email.bodyHtmlHeaders = contentRow.headers;

            switch (contentRow.encoding?.toLowerCase()) {
              case "quoted-printable":
                email.bodyHtml += this.decodeQuotedPrintable(
                  contentRow.content
                );
                break;

              case "base64":
                email.bodyHtml += this.decodeBase64(contentRow.content);
                break;

              default:
                email.bodyHtml += contentRow.content;
                break;
            }
            break;

          case "text/plain":
            email.bodyTextHeaders = contentRow.headers;

            switch (contentRow.encoding?.toLowerCase()) {
              case "quoted-printable":
                email.bodyText += this.decodeQuotedPrintable(
                  contentRow.content
                );
                break;

              case "base64":
                email.bodyText += this.decodeBase64(contentRow.content);
                break;

              default:
                email.bodyText += contentRow.content;
                break;
            }
            break;

          default:
            if (contentRow.isAttachment) {
              email.attachments.push(contentRow as IEmailAttachment);
            }
            break;
        }
      });
    });

    if (!email.boundaries.length) {
      if (email.mimeType === "text/html") {
        if (email.encoding?.toLowerCase() === "quoted-printable") {
          email.bodyHtml = this.decodeQuotedPrintable(email.contentRaw);
        } else if (email.encoding?.toLowerCase() === "base64") {
          email.bodyHtml = this.decodeBase64(email.contentRaw);
        } else {
          email.bodyHtml = email.contentRaw;
        }
      } else {
        if (email.encoding?.toLowerCase() === "quoted-printable") {
          email.bodyText = this.decodeQuotedPrintable(email.contentRaw);
        } else if (email.encoding?.toLowerCase() === "base64") {
          email.bodyHtml = this.decodeBase64(email.contentRaw);
        } else {
          email.bodyText = email.contentRaw;
        }
      }
    }

    if (email.bodyHtml) {
      email.bodyHtml = this.stripScripts(email.bodyHtml).replace(
        /http/gi,
        "#http"
      );
    }

    this.email = email;

    return email;
  }

  /**
   * @name getEmail
   * return IEmail
   */
  public getEmail(): IEmail {
    return this.email;
  }

  /**
   * @name getHeaderAttribute
   * @param {string} field
   * @param {string} data
   * @returns string | undefined
   */
  private getHeaderAttribute(field: string, data: string): string | undefined {
    if (data.indexOf(field) === -1) {
      return undefined;
    }

    const regex = new RegExp(field + "=['|\"]?(\\S+)");
    const match: RegExpMatchArray | undefined = data.match(regex) ?? undefined;

    let value: string | undefined;

    if (match && match.length > 1) {
      let matchedValue: string = match[1];

      ["'", '"'].forEach((char: string) => {
        const trim = matchedValue.indexOf(char);

        if (trim > -1) {
          matchedValue = matchedValue.substring(0, trim);
        }
      });

      value = matchedValue;
    }

    return value;
  }

  /**
   * @name parseBoundaries
   * @param {string} boundaryIds
   * @param {string} contentRaw
   * @returns IEmailBoundary[]
   * @description Creates an array of IEmailBoundary which form parts of the email body
   */
  private parseBoundaries(
    contentRaw: string,
    boundaryIds: string[]
  ): IEmailBoundary[] {
    if (!boundaryIds.length || !contentRaw.length) {
      return [];
    }

    return boundaryIds.reduce(
      (boundaries: IEmailBoundary[], boundaryId: string): IEmailBoundary[] => {
        const boundary = this.filterContentByBoundaries(boundaryId, contentRaw);

        if (this.sanitizeRawBoundry(boundary)) {
          boundaries.push(boundary);

          // Check for boundaries within boundaries
          boundary.contents.forEach((contentRow: IEmailBoundaryContent) => {
            if (contentRow.subBoundaryId !== undefined) {
              const subBoundary: IEmailBoundary = this.filterContentByBoundaries(
                contentRow.subBoundaryId,
                contentRow.contentRaw
              );

              if (this.sanitizeRawBoundry(subBoundary)) {
                boundaries.push(subBoundary);
              }
            }
          });
        }

        return boundaries;
      },
      []
    );
  }

  /**
   * @name filterContentByBoundaries
   * @param {string} boundaryId
   * @param {string} contentRaw
   * @returns IEmailBoundary
   */
  private filterContentByBoundaries(
    boundaryId: string,
    contentRaw: string
  ): IEmailBoundary {
    const contentRows: string[] = contentRaw.split("\r\n");

    let contentIndex: number = 0;
    let allBoundariesMet: boolean = false;

    return {
      contents: contentRows.reduce(
        (
          contents: IEmailBoundaryContent[],
          contentRow: string
        ): IEmailBoundaryContent[] => {
          contentRow = contentRow.replace(/(\r\n|\n|\r)/gm, "");

          if (contentRow === "--" + boundaryId) {
            contents.push({
              contentRaw: "",
              headers: {},
              content: "",
              mimeType: "",
            });
            contentIndex = contents.length - 1;
          } else if (contentRow === "--" + boundaryId + "--") {
            allBoundariesMet = true;
          } else {
            // may need to change this
            if (!allBoundariesMet && contents[contentIndex]) {
              contents[contentIndex].contentRaw += contentRow + "\r\n";
            }
          }

          return contents;
        },
        []
      ),
    };
  }

  /**
   * @name sanitizeRawBoundry
   * @param {IEmailBoundary} boundary
   * @returns true
   */
  private sanitizeRawBoundry(boundary: IEmailBoundary): true {
    boundary.contents.forEach(
      (contentRow: IEmailBoundaryContent, contentIndex: number) => {
        const contentRaw = boundary.contents[contentIndex].contentRaw;
        const headers = this.splitHeaders(contentRaw, true);
        const content = headers.content;

        Object.keys(headers).forEach((headerKey: string) => {
          let values: RegExpMatchArray | undefined = undefined;

          const headerData: string = headers[headerKey]!;

          switch (headerKey.toLowerCase()) {
            case "content-disposition":
              //headerData.forEach((headerRow: string) => {
              values = headerData.match(/['|"]?(\S+)['|"]?;(.*)/) ?? undefined;

              if (values && values.length > 1) {
                boundary.contents[contentIndex].isAttachment = true;

                if (values.length > 2) {
                  const filename = this.getHeaderAttribute("name", values[2]);

                  if (filename) {
                    boundary.contents[contentIndex].filename = filename;
                  }
                }

                if (!boundary.contents[contentIndex].filename) {
                  boundary.contents[contentIndex].filename = "Untitled";
                }
              }
              //});
              break;

            case "content-transfer-encoding":
              //headerData.forEach((headerRow: string) => {
              boundary.contents[contentIndex].encoding = headerData;
              //});
              break;

            case "content-type":
              //headerData.forEach((headerRow: string) => {
              values = headerData.match(/['|"]?(\S+)['|"]?;(.*)/) ?? undefined;

              if (values && values.length > 1) {
                boundary.contents[
                  contentIndex
                ].mimeType = values[1].toLowerCase();

                if (values.length > 2) {
                  const charset = this.getHeaderAttribute("charset", values[2]);

                  if (charset) {
                    boundary.contents[contentIndex].charset = charset;
                  }

                  const subBoundaryId = this.getHeaderAttribute(
                    "boundary",
                    values[2]
                  );

                  if (subBoundaryId) {
                    boundary.contents[
                      contentIndex
                    ].subBoundaryId = subBoundaryId;
                  }
                }
              }
              //});
              break;

            default:
              break;
          }
        });

        boundary.contents[contentIndex].headers = headers;
        boundary.contents[contentIndex].content = content ?? "";
      }
    );

    return true;
  }

  /**
   * @name splitHeaders
   * @param contentRaw
   * @param returnContent
   * @returns IEmailHeaders
   */
  private splitHeaders(
    headerRaw: string,
    returnContent: boolean = true
  ): IEmailHeaders {
    const headerRows = headerRaw.split(/\r?\n|\r/);
    const headerMaxLength: number = 76;

    const headers: IEmailHeaders = {};

    let currentHeaderName: string;
    let currentHeaderData: string | undefined;

    let headerEnd: boolean = false;
    let headerContent: string = "";

    headerRows.forEach((headerRow: string) => {
      const [
        fullMatch,
        contentHeaderName,
        contentHeaderData,
      ]: RegExpMatchArray = headerRow.match(/(^\S*):\s*(.*)/) ?? [];

      if (!headerEnd) {
        if (contentHeaderName) {
          currentHeaderName = contentHeaderName.toLowerCase();
          currentHeaderData = headers[currentHeaderName];

          // We can transform this into string[] later if needed
          if (!currentHeaderData) {
            headers[currentHeaderName] = contentHeaderData ?? "";
          } else {
            headers[currentHeaderName] =
              currentHeaderData + " " + (contentHeaderData ?? "").trimLeft();
          }
        } else if (
          !contentHeaderName &&
          (headerRow[0] === "\t" || headerRow[0] === " ")
        ) {
          currentHeaderData = headers[currentHeaderName];

          const lastHeaderLength = currentHeaderData
            ? currentHeaderData.length - 1
            : 0;

          if (lastHeaderLength >= headerMaxLength) {
            headers[currentHeaderName] =
              currentHeaderData + headerRow.trimLeft();
          } else {
            headers[currentHeaderName] =
              currentHeaderData + " " + headerRow.trimLeft();
          }
        } else {
          headerEnd = true;
        }
      } else if (returnContent) {
        headerContent += headerRow + "\r\n";
      }
    });

    if (returnContent) {
      headers.content = headerContent;
    }
    console.log(headers);
    return headers;
  }

  /**
   * @name stripScripts
   * @param {string} content
   * @returns string
   * @description Securifys agaisnt bad script injections
   */
  private stripScripts(content: string): string {
    const div: HTMLDivElement = document.createElement("div");
    const scripts: HTMLCollectionOf<HTMLScriptElement> = div.getElementsByTagName(
      "script"
    );

    div.innerHTML = content;

    let scriptsLength: number = scripts.length;

    while (scriptsLength--) {
      scripts[scriptsLength].parentNode?.removeChild(scripts[scriptsLength]);
    }

    return div.innerHTML;
  }

  /**
   * @name decodeQuotedPrintable
   * @param {string} content
   * @returns string
   */
  private decodeQuotedPrintable(content: string): string {
    return this.mimeDecode(content.replace(/=(?:\r?\n|$)/g, ""));
  }

  /**
   * @name parseMimeWords
   * @param {string} content
   * @returns string
   */
  public parseMimeWords(content: string): string {
    const joinRegex: RegExp = /(=\?[^?]+\?[Bb]\?)([^?]+)\?=\s*\1([^?]+)\?=/g;
    const decodeRegex: RegExp = /=\?([\w_-]+)\?([QqBb])\?[^?]*\?=/g;

    const joinCallback: (...args: string[]) => string = (
      match: string,
      header: string,
      part1: string,
      part2: string
    ) => {
      const result: string = Buffer.concat([
        Buffer.from(part1, "base64"),
        Buffer.from(part2, "base64"),
      ]).toString("base64");

      return `${header}${result}?=`;
    };

    const decodeCallback: (...args: string[]) => string = (
      mimeWord: string
    ) => {
      return this.decodeMimeWord(mimeWord.replace(/\s+/g, ""));
    };

    for (let loop; ; ) {
      loop = content.replace(
        /(=\?[^?]+\?[Qq]\?)([^?]*)\?=\s*\1([^?]*\?=)/g,
        "$1$2$3"
      );

      if (loop === content) {
        break;
      }

      content = loop;
    }

    return content
      .replace(joinRegex, joinCallback)
      .replace(decodeRegex, decodeCallback);
  }

  /**
   * @name decodeMimeWord
   * @param {string} content
   * @resturns string
   */
  private decodeMimeWord(content: string): string {
    const match = content.trim().match(/^=\?([\w_-]+)\?([QqBb])\?([^?]*)\?=$/i);
    if (!match) {
      return content;
    }

    content = (match[3] ?? "").replace(/_/g, " ");

    const encoding: string = (match[2] || "Q").toUpperCase();

    switch (encoding) {
      case "B":
        return this.decodeBase64(content);

      case "Q":
        return this.mimeDecode(content);

      default:
        return content;
    }
  }

  /**
   * @name mimeDecode
   * @param {string} content
   * @returns string
   */
  private mimeDecode(content: string): string {
    const encodedBytesCount: number = (content.match(/=[\da-fA-F]{2}/g) || [])
      .length;
    const bufferLength: number = content.length - encodedBytesCount * 2;
    const buffer: Buffer = Buffer.alloc(bufferLength);

    let bufferPos: number = 0;

    let char: string, hexValue: string;

    for (let i = 0, contentLength = content.length; i < contentLength; i++) {
      char = content.charAt(i);

      if (
        char === "=" &&
        (hexValue = content.substr(i + 1, 2)) &&
        /[\da-fA-F]{2}/.test(hexValue)
      ) {
        buffer[bufferPos++] = parseInt(hexValue, 16);
        i += 2;
        continue;
      }

      buffer[bufferPos++] = char.charCodeAt(0);
    }

    return buffer.toString();
  }

  /**
   * @name decodeBase64
   * @param {string} content
   * @returns string
   */
  private decodeBase64(content: string): string {
    return Buffer.from(content, "base64").toString();
  }

  /**
   * @name base64toBlob
   * @param {string} content
   * @param {string} contentType
   * @param {number} sliceSize
   * @returns Blob
   */
  public base64toBlob(
    content: string,
    contentType: string,
    sliceSize: number = 512
  ): Blob {
    const byteCharacters: string = atob(content);
    const byteArrays: Uint8Array[] = [];

    for (
      let byteOffset: number = 0;
      byteOffset < byteCharacters.length;
      byteOffset += sliceSize
    ) {
      const byteSlice = byteCharacters.slice(
        byteOffset,
        byteOffset + sliceSize
      );
      const byteNumbers = new Array(byteSlice.length);

      for (let i: number = 0; i < byteSlice.length; i++) {
        byteNumbers[i] = byteSlice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
  }
}

export default EmailParser;
