import { IEmail, IEmailFlags, IFolderEmail, IFoldersEntry } from "interfaces";
import { MimeTools, EmailParser } from "classes";

interface IImapHelper {
  emailParser: EmailParser;
  mimeTools: MimeTools;
}

export class ImapHelper {
  /**
   * @var {EmailParser} emailParser
   */
  protected emailParser: EmailParser;

  /**
   * @var {MimeTools} mimeTools
   */
  protected mimeTools: MimeTools;

  /**
   * @constructor
   */
  constructor({ emailParser, mimeTools }: IImapHelper) {
    this.emailParser = emailParser;
    this.mimeTools = mimeTools;
  }

  /**
   * formatFetchEmailFlagsResponse
   * @param {string[][]} fetchData
   * @returns {flagData}
   */
  public formatFetchEmailFlagsResponse(
    fetchData: string[][]
  ): IEmailFlags | undefined {
    const flagDataRaw: string = fetchData[0][2];
    const flagData: RegExpMatchArray | undefined =
      flagDataRaw.match(
        /.*FETCH \(UID (.*) RFC822.SIZE (.*) FLAGS \((.*)\)\)/
      ) ?? undefined;

    if (flagData?.length !== 4) {
      return undefined;
    }

    return {
      size: parseInt(flagData[2]),
      flags: flagData[3],
      deleted: /\\Deleted/.test(flagData[3]),
      seen: /\\Seen/.test(flagData[3]),
    };
  }

  /**
   * formatFetchEmailResponse
   * @param {string[][]} fetchData
   * @returns {IEmail}
   */
  public formatFetchEmailResponse(fetchData: string[][]): IEmail {
    let emailRaw: string = fetchData[1][0];

    if (emailRaw.substring(emailRaw.length - 5) === "\r\n)\r\n") {
      emailRaw = emailRaw.substring(0, emailRaw.length - 5);
    }

    return this.emailParser.processEmail(emailRaw);
  }

  /**
   * formatFetchAllResponse
   * @param {string[][]} folderData
   * @returns IFolderEmail[]
   */
  public formatFetchFolderEmailsResponse(
    folderData: string[][]
  ): IFolderEmail[] {
    const emails: IFolderEmail[] = [];

    for (let i: number = 1; i < folderData.length - 1; i = i + 2) {
      const emailFlags: string[] | undefined =
        (folderData[i - 1][2] ?? "").match(
          /FETCH \(UID (.*) FLAGS \((.*)\) BODY\[HEADER\.FIELDS \(DATE FROM SUBJECT\)\] \{(.*)\}/
        ) ?? undefined;

      const emailDate: string | undefined =
        folderData[i][0].match(/.*date: (.*).*/i)?.[1] ?? undefined;

      let emailSubject: string | undefined =
        folderData[i][0].match(/.*subject: (.*).*/i)?.[1] ?? undefined;

      let emailFrom: string | undefined =
        folderData[i][0].match(/.*from: (.*).*/i)?.[1] ?? undefined;

      if (emailSubject && emailSubject.indexOf("=?") > -1) {
        emailSubject = this.mimeTools.parseMimeWords(emailSubject);
      }

      if (emailFrom && emailFrom?.indexOf("=?") > -1) {
        emailFrom = this.mimeTools.parseMimeWords(emailFrom);
      }

      const emailBodyStructure =
        folderData[i][0].match(/.*bodystructure \((.*)\)/i)?.[1] ?? undefined;

      if (emailFlags && emailDate && emailFrom && emailBodyStructure) {
        emails.push({
          id: Number(emailFlags[1]),
          date: emailDate,
          epoch: new Date(emailDate).getTime(),
          from: emailFrom,
          subject: emailSubject ?? "(no subject)",
          uid: Number(emailFlags[1]),
          ref: emailFlags[3],
          flags: emailFlags[2],
          hasAttachment: /attachment/i.test(emailBodyStructure),
          selected: false,
        });
      }
    }

    return emails;
  }

  /**
   * formatListFoldersResponse
   * @param {string[][]} folderData
   * @returns IFoldersEntry[]
   */
  public formatListFoldersResponse(folderData: string[][]): IFoldersEntry[] {
    const rawFolders: string[] = [];
    const folders: IFoldersEntry[] = [];

    folderData.forEach((folderDataRow: string[]) => {
      if (folderDataRow[0] === "*") {
        const rawFolder: RegExpMatchArray | undefined =
          folderDataRow[2].match(/\((.*)\) "(.*)" (.*)/) ?? undefined;

        if (rawFolder?.length === 4) {
          rawFolders.push(rawFolder[3].replace(/"/g, ""));
        }
      }
    });

    let id: number = 0;

    [...rawFolders].sort().forEach((rawFolderRow: string) => {
      const slash: number | undefined = rawFolderRow.indexOf("/");

      if (slash > 0) {
        const parent: string = rawFolderRow.slice(0, slash);
        const name: string = rawFolderRow.slice(slash + 1, rawFolderRow.length);

        for (let i: number = 0; i < folders.length; i++) {
          if (folders[i].name === parent) {
            folders[i].folders.push({ id: id++, name: name, ref: name });
          }
        }
      } else {
        folders.push({
          id: id++,
          name: rawFolderRow,
          ref: rawFolderRow,
          folders: [],
        });
      }
    });

    return folders;
  }
}
