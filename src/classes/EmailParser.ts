import { MimeTools } from "classes";
import {
  IEmail,
  IEmailAttachment,
  IEmailBoundary,
  IEmailBoundaryContent,
  IEmailHeaders,
} from "interfaces";

interface IEmailParser {
  mimeTools: MimeTools;
}

export class EmailParser {
  /**
   * @var {IEmail} email
   */
  protected email: IEmail;

  /**
   * @var {MimeTools} mimeTools
   */
  protected mimeTools;

  /**
   * @constructor
   * @param param0
   */
  constructor({ mimeTools }: IEmailParser) {
    this.mimeTools = mimeTools;
    this.email = {
      emailRaw: "",
      headersRaw: "",
      contentRaw: "",
    };
  }

  /**
   * @name getEmail
   * return IEmail
   */
  public getEmail(): IEmail {
    return this.email;
  }

  /**
   * @name processEmail
   * @param {string} emailRaw
   * @reuturns IEmail
   * @description The key method for processing raw email data which should
   *              return a complete object of processed data ready to be used by
   *              the controller.
   */
  public processEmail(emailRaw: string): IEmail {
    const headerPosition: number = emailRaw.indexOf("\r\n\r\n");

    const email: IEmail = {
      emailRaw,
      headersRaw: emailRaw.substring(0, headerPosition),
      contentRaw: emailRaw.substring(headerPosition + 4, emailRaw.length - 1),
    };

    email.headers = this.splitHeaders(email.headersRaw, false);

    this.extractDetailsFromHeaders(email);

    email.boundaries = this.parseBoundaries(
      email.contentRaw,
      email.boundaryIds
    );

    this.extractContentFromBoundaries(email);

    if (!email.boundaries.length) {
      if (email.mimeType === "text/html") {
        if (email.encoding?.toLowerCase() === "quoted-printable") {
          email.bodyHtml = this.mimeTools.decodeQuotedPrintable(email.contentRaw);
        } else if (email.encoding?.toLowerCase() === "base64") {
          email.bodyHtml = this.mimeTools.decodeBase64(email.contentRaw);
        } else {
          email.bodyHtml = email.contentRaw;
        }
      } else {
        if (email.encoding?.toLowerCase() === "quoted-printable") {
          email.bodyText = this.mimeTools.decodeQuotedPrintable(email.contentRaw);
        } else if (email.encoding?.toLowerCase() === "base64") {
          email.bodyHtml = this.mimeTools.decodeBase64(email.contentRaw);
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
   * @name splitHeaders
   * @param {string} contentRaw
   * @param {boolean} returnContent
   * @returns IEmailHeaders
   */
  private splitHeaders(
    headerRaw: string,
    returnContent: boolean = true
  ): IEmailHeaders {
    const headerRows: string[] = headerRaw.split(/\r?\n|\r/);
    const headerMaxLength: number = 76;

    const headers: IEmailHeaders = {};

    let currentHeaderName: string;
    let currentHeaderData: string | undefined;

    let headerEnd: boolean = false;
    let headerContent: string = "";

    headerRows.forEach((headerRow: string) => {
      const [match, contentHeaderName, contentHeaderData]: RegExpMatchArray =
        headerRow.match(/(^\S*):\s*(.*)/) ?? [];

      if (!headerEnd) {
        if (contentHeaderName) {
          currentHeaderName = contentHeaderName.toLowerCase();
          currentHeaderData = headers[currentHeaderName];

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

          const lastHeaderLength: number = currentHeaderData
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

    return headers;
  }

  /**
   * extractDetailsFromHeaders
   * @param {IEmail} email
   * @returns void
   */
  private extractDetailsFromHeaders(email: IEmail): void {
    Object.keys(email.headers ?? {}).forEach((headerKey: string) => {
      const headerData: string = email.headers![headerKey]!;

      switch (headerKey.toLowerCase()) {
        case "date":
          email.date = headerData;
          break;

        case "to":
          email.to = this.mimeTools.parseMimeWords(headerData);
          break;

        case "cc":
          email.cc = this.mimeTools.parseMimeWords(headerData);
          break;

        case "from":
          email.from = this.mimeTools.parseMimeWords(headerData);
          break;

        case "reply-to":
          email.replyTo = this.mimeTools.parseMimeWords(headerData);
          break;

        case "subject":
          email.subject = this.mimeTools.parseMimeWords(headerData);
          break;

        case "content-transfer-encoding":
          email.encoding = headerData;
          break;

        case "content-type":
          {
            const [match, mimeType]: RegExpMatchArray =
              headerData.match(/['|"]?(\S+)['|"]?;(.*)/i) ?? [];

            if (mimeType) {
              email.mimeType = mimeType.toLowerCase();
            }

            email.charset = this.getHeaderAttribute("charset", headerData);

            const newBoundaryId: string | undefined = this.getHeaderAttribute(
              "boundary",
              headerData
            );

            if (newBoundaryId) {
              if (!email.boundaryIds) {
                email.boundaryIds = [];
              }

              email.boundaryIds.push(newBoundaryId);
            }
          }
          break;

        default:
          break;
      }
    });
  }

  /**
   * @name parseBoundaries
   * @param {string} boundaryIds
   * @param {string} contentRaw
   * @returns IEmailBoundary[]
   */
  private parseBoundaries(
    contentRaw: string,
    boundaryIds?: string[]
  ): IEmailBoundary[] {
    if (!boundaryIds?.length || !contentRaw.length) {
      return [];
    }

    return boundaryIds.reduce(
      (boundaries: IEmailBoundary[], boundaryId: string): IEmailBoundary[] => {
        const boundary = this.filterContentByBoundaries(boundaryId, contentRaw);

        if (this.sanitizeRawBoundry(boundary)) {
          boundaries.push(boundary);

          boundary.contents.forEach((contentRow: IEmailBoundaryContent) => {
            if (contentRow.subBoundaryId) {
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
   * extractContentFromBoundaries
   * @param {IEmail} email
   * @returns void
   */
  private extractContentFromBoundaries(email: IEmail): void {
    email.boundaries?.forEach((boundary: IEmailBoundary) => {
      boundary.contents.forEach((contentRow: IEmailBoundaryContent) => {
        switch (contentRow.mimeType) {
          case "text/html":
            if (!email.bodyHtml) {
              email.bodyHtml = "";
            }

            email.bodyHtmlHeaders = contentRow.headers;

            switch (contentRow.encoding?.toLowerCase()) {
              case "quoted-printable":
                email.bodyHtml += this.mimeTools.decodeQuotedPrintable(
                  contentRow.content
                );
                break;

              case "base64":
                email.bodyHtml += this.mimeTools.decodeBase64(contentRow.content);
                break;

              default:
                email.bodyHtml += contentRow.content;
                break;
            }
            break;

          case "text/plain":
            if (!email.bodyText) {
              email.bodyHtml = "";
            }

            email.bodyTextHeaders = contentRow.headers;

            switch (contentRow.encoding?.toLowerCase()) {
              case "quoted-printable":
                email.bodyText += this.mimeTools.decodeQuotedPrintable(
                  contentRow.content
                );
                break;

              case "base64":
                email.bodyText += this.mimeTools.decodeBase64(contentRow.content);
                break;

              default:
                email.bodyText += contentRow.content;
                break;
            }
            break;

          default:
            if (contentRow.isAttachment) {
              if (!email.attachments) {
                email.attachments = [];
              }

              email.attachments.push(contentRow as IEmailAttachment);
            }
            break;
        }
      });
    });
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
        const contentRaw: string = boundary.contents[contentIndex].contentRaw;

        const headers: IEmailHeaders = this.splitHeaders(contentRaw, true);
        const content: string | undefined = headers.content;

        Object.keys(headers).forEach((headerKey: string) => {
          const headerData: string = headers[headerKey]!;

          switch (headerKey.toLowerCase()) {
            case "content-disposition":
              {
                const [match, mimeType, contentData]: RegExpMatchArray =
                  headerData.match(/['|"]?(\S+)['|"]?;(.*)/) ?? [];

                if (mimeType) {
                  boundary.contents[contentIndex].isAttachment = true;

                  if (contentData) {
                    const filename:
                      | string
                      | undefined = this.getHeaderAttribute(
                      "name",
                      contentData
                    );

                    if (filename) {
                      boundary.contents[contentIndex].filename = filename;
                    }
                  }

                  if (!boundary.contents[contentIndex].filename) {
                    boundary.contents[contentIndex].filename = "Untitled";
                  }
                }
              }
              break;

            case "content-transfer-encoding":
              boundary.contents[contentIndex].encoding = headerData;
              break;

            case "content-type":
              {
                const [match, mimeType, contentData]: RegExpMatchArray =
                  headerData.match(/['|"]?(\S+)['|"]?;(.*)/i) ?? [];

                if (mimeType) {
                  boundary.contents[
                    contentIndex
                  ].mimeType = mimeType.toLowerCase();

                  if (contentData) {
                    const charSet: string | undefined = this.getHeaderAttribute(
                      "charset",
                      contentData
                    );

                    if (charSet) {
                      boundary.contents[contentIndex].charset = charSet;
                    }

                    const subBoundaryId:
                      | string
                      | undefined = this.getHeaderAttribute(
                      "boundary",
                      contentData
                    );

                    if (subBoundaryId) {
                      boundary.contents[
                        contentIndex
                      ].subBoundaryId = subBoundaryId;
                    }
                  }
                }
              }
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
   * @name stripScripts
   * @param {string} content
   * @returns string
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
}
