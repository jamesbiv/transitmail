import { MimeTools } from "lib";
import {
  IEmail,
  IEmailAttachment,
  IEmailBoundary,
  IEmailBoundaryContent,
  IEmailHeaders
} from "interfaces";

export class EmailParser {
  /**
   * @var {IEmail} email
   */
  protected email: IEmail;

  /**
   * @constructor
   */
  constructor() {
    this.email = {
      emailRaw: "",
      headersRaw: "",
      contentRaw: ""
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
      contentRaw: emailRaw.substring(headerPosition + 4, emailRaw.length - 1)
    };

    email.headers = this.splitHeaders(email.headersRaw, false);

    this.extractDetailsFromHeaders(email);

    email.boundaries = this.parseBoundaries(email.contentRaw, email.boundaryIds);

    email.boundaries.length
      ? this.extractContentFromBoundaries(email)
      : this.extractContentFromBody(email);

    if (email.bodyHtml) {
      email.bodyHtml = this.stripScripts(email.bodyHtml).replace(/http/gi, "#http");
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
  private splitHeaders(headerRaw: string, returnContent: boolean = true): IEmailHeaders {
    const headerRows: string[] = headerRaw.split(/\r?\n|\r/);
    const headerMaxLength: number = 76;

    const headers: IEmailHeaders = {};

    let currentHeaderName: string;
    let currentHeaderData: string | undefined;

    let headerEnd: boolean = false;
    let headerContent: string = "";

    headerRows.forEach((headerRow: string) => {
      const [_, contentHeaderName, contentHeaderData]: RegExpMatchArray | [] =
        /(^\S*):\s*(.*)/.exec(headerRow) ?? [];

      if (headerEnd) {
        if (returnContent) {
          headerContent += headerRow + "\r\n";
        }

        return;
      }

      switch (true) {
        case !!contentHeaderName:
          currentHeaderName = contentHeaderName.toLowerCase();
          currentHeaderData = headers[currentHeaderName];

          headers[currentHeaderName] = !currentHeaderData
            ? (contentHeaderData ?? "")
            : currentHeaderData + " " + (contentHeaderData ?? "").trimStart();
          break;

        case !contentHeaderName && (headerRow.startsWith("\t") || headerRow.startsWith(" ")):
          {
            currentHeaderData = headers[currentHeaderName];

            const lastHeaderLength: number = currentHeaderData ? currentHeaderData.length - 1 : 0;

            headers[currentHeaderName] =
              lastHeaderLength >= headerMaxLength
                ? currentHeaderData + headerRow.trimStart()
                : currentHeaderData + " " + headerRow.trimStart();
          }
          break;

        default:
          headerEnd = true;

          break;
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
          email.to = MimeTools.parseMimeWords(headerData);
          break;

        case "cc":
          email.cc = MimeTools.parseMimeWords(headerData);
          break;

        case "from":
          email.from = MimeTools.parseMimeWords(headerData);
          break;

        case "reply-to":
          email.replyTo = MimeTools.parseMimeWords(headerData);
          break;

        case "subject":
          email.subject = MimeTools.parseMimeWords(headerData);
          break;

        case "content-transfer-encoding":
          email.encoding = headerData;
          break;

        case "content-type":
          {
            const [_, mimeType]: RegExpMatchArray | [] =
              /['|"]?(\S+)['|"]?;(.*)/i.exec(headerData) ??
              /['|"]?(\S+)['|"]?/i.exec(headerData) ??
              [];

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
      }
    });
  }

  /**
   * @name parseBoundaries
   * @param {string} boundaryIds
   * @param {string} contentRaw
   * @returns IEmailBoundary[]
   */
  private parseBoundaries(contentRaw: string, boundaryIds?: string[]): IEmailBoundary[] {
    if (!boundaryIds?.length || !contentRaw.length) {
      return [];
    }

    return boundaryIds.reduce(
      (boundaries: IEmailBoundary[], boundaryId: string): IEmailBoundary[] => {
        const boundary = this.filterContentByBoundaries(boundaryId, contentRaw);

        if (this.sanitiseRawBoundry(boundary)) {
          boundaries.push(boundary);

          boundary.contents.forEach((contentRow: IEmailBoundaryContent) => {
            if (!contentRow.subBoundaryId) {
              return;
            }

            const subBoundary: IEmailBoundary = this.filterContentByBoundaries(
              contentRow.subBoundaryId,
              contentRow.contentRaw
            );

            if (this.sanitiseRawBoundry(subBoundary)) {
              boundaries.push(subBoundary);
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
                email.bodyHtml += MimeTools.decodeQuotedPrintable(contentRow.content);
                break;

              case "base64":
                email.bodyHtml += MimeTools.decodeBase64(contentRow.content);
                break;

              default:
                email.bodyHtml += contentRow.content;
                break;
            }
            break;

          case "text/plain":
            if (!email.bodyText) {
              email.bodyText = "";
            }

            email.bodyTextHeaders = contentRow.headers;

            switch (contentRow.encoding?.toLowerCase()) {
              case "quoted-printable":
                email.bodyText += MimeTools.decodeQuotedPrintable(contentRow.content);
                break;

              case "base64":
                email.bodyText += MimeTools.decodeBase64(contentRow.content);
                break;

              default:
                email.bodyText += contentRow.content;
                break;
            }
            break;
        }

        if (contentRow.isAttachment) {
          if (!email.attachments) {
            email.attachments = [];
          }

          email.attachments.push(contentRow as IEmailAttachment);
        }
      });
    });
  }

  /**
   * extractContentFromBody
   * @param {IEmail} email
   * @returns void
   */
  private extractContentFromBody(email: IEmail): void {
    if (email.mimeType === "text/html") {
      switch (email.encoding?.toLowerCase()) {
        case "quoted-printable":
          email.bodyHtml = MimeTools.decodeQuotedPrintable(email.contentRaw);
          break;

        case "base64":
          email.bodyHtml = MimeTools.decodeBase64(email.contentRaw);
          break;

        default:
          email.bodyHtml = email.contentRaw;
          break;
      }
    } else {
      switch (email.encoding?.toLowerCase()) {
        case "quoted-printable":
          email.bodyText = MimeTools.decodeQuotedPrintable(email.contentRaw);
          break;

        case "base64":
          email.bodyText = MimeTools.decodeBase64(email.contentRaw);
          break;

        default:
          email.bodyText = email.contentRaw;
          break;
      }
    }
  }

  /**
   * @name filterContentByBoundaries
   * @param {string} boundaryId
   * @param {string} contentRaw
   * @returns IEmailBoundary
   */
  private filterContentByBoundaries(boundaryId: string, contentRaw: string): IEmailBoundary {
    const contentRows: string[] = contentRaw.split("\r\n");

    let contentIndex: number = 0;
    let allBoundariesMet: boolean = false;

    return {
      contents: contentRows.reduce(
        (contents: IEmailBoundaryContent[], contentRow: string): IEmailBoundaryContent[] => {
          contentRow = contentRow.replace(/(\r\n|\n|\r)/gm, "");

          switch (true) {
            case contentRow === "--" + boundaryId:
              contents.push({
                contentRaw: "",
                headers: {},
                content: "",
                mimeType: ""
              });

              contentIndex = contents.length - 1;
              break;

            case contentRow === "--" + boundaryId + "--":
              allBoundariesMet = true;

              break;

            case !allBoundariesMet && !!contents[contentIndex]:
              contents[contentIndex].contentRaw += contentRow + "\r\n";

              break;
          }

          return contents;
        },
        []
      )
    };
  }

  /**
   * @name sanitiseRawBoundry
   * @param {IEmailBoundary} boundary
   * @returns true
   */
  private sanitiseRawBoundry(boundary: IEmailBoundary): true {
    boundary.contents.forEach((contentRow: IEmailBoundaryContent, contentIndex: number) => {
      const contentRaw: string = boundary.contents[contentIndex].contentRaw;

      const headers: IEmailHeaders = this.splitHeaders(contentRaw);
      const content: string | undefined = headers.content;

      Object.keys(headers).forEach((headerKey: string) => {
        const headerData: string = headers[headerKey]!;

        switch (headerKey.toLowerCase()) {
          case "content-disposition":
            {
              const [_, mimeType, contentData]: RegExpMatchArray | [] =
                /['|"]?(\S+)['|"]?;(.*)/i.exec(headerData) ??
                /['|"]?(\S+)['|"]?/i.exec(headerData) ??
                [];

              if (!mimeType) {
                break;
              }

              boundary.contents[contentIndex].isAttachment = true;

              if (!boundary.contents[contentIndex].filename) {
                boundary.contents[contentIndex].filename = "Untitled";
              }

              if (!contentData) {
                break;
              }

              const filename: string | undefined = this.getHeaderAttribute("name", contentData);

              if (filename) {
                boundary.contents[contentIndex].filename = filename;
              }
            }
            break;

          case "content-transfer-encoding":
            boundary.contents[contentIndex].encoding = headerData;
            break;

          case "content-type":
            {
              const [_, mimeType, contentData]: RegExpMatchArray | [] =
                /['|"]?(\S+)['|"]?;(.*)/i.exec(headerData) ??
                /['|"]?(\S+)['|"]?/i.exec(headerData) ??
                [];

              if (!mimeType) {
                break;
              }

              boundary.contents[contentIndex].mimeType = mimeType.toLowerCase();

              if (!contentData) {
                break;
              }

              const charset: string | undefined = this.getHeaderAttribute("charset", contentData);

              if (charset) {
                boundary.contents[contentIndex].charset = charset;
              }

              const subBoundaryId: string | undefined = this.getHeaderAttribute(
                "boundary",
                contentData
              );

              if (subBoundaryId) {
                boundary.contents[contentIndex].subBoundaryId = subBoundaryId;
              }
            }
            break;
        }
      });

      boundary.contents[contentIndex].headers = headers;
      boundary.contents[contentIndex].content = content ?? "";
    });

    return true;
  }

  /**
   * @name stripScripts
   * @param {string} content
   * @returns string
   */
  private stripScripts(content: string): string {
    const div: HTMLDivElement = document.createElement("div");
    const scripts: HTMLCollectionOf<HTMLScriptElement> = div.getElementsByTagName("script");

    div.innerHTML = content;

    let scriptsLength: number = scripts.length;

    while (scriptsLength--) {
      scripts[scriptsLength].parentNode?.removeChild(scripts[scriptsLength]);
    }

    return div.innerHTML;
  }

  /**
   * @name getHeaderAttribute
   * @param {string} attribute
   * @param {string} data
   * @returns string | undefined
   */
  private getHeaderAttribute(attribute: string, data: string): string | undefined {
    if (data.indexOf(attribute) === -1) {
      return undefined;
    }

    const regex = new RegExp(attribute + "=['|\"]?(\\S+)", "i");
    const [_, attributeValue]: RegExpMatchArray | [] = regex.exec(data) ?? [];

    return attributeValue?.replace(/['|"]/g, "") || undefined;
  }
}
