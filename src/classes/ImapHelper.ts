import { IEmail, IEmailFlags, IFolderEmail, IFoldersEntry } from "interfaces";
import { EmailParser } from "classes";
import { MimeTools } from "lib";

/**
 * @class ImapHelper
 * @extends EmailParser
 */
export class ImapHelper extends EmailParser {
  /**
   * formatFetchEmailFlagsResponse
   * @method
   * @param {string[][]} fetchData
   * @returns {flagData}
   */
  public formatFetchEmailFlagsResponse(fetchData: string[][]): IEmailFlags | undefined {
    const flagDataRaw: string = fetchData[0][2];
    const flagData: RegExpMatchArray | [] | undefined =
      /.*FETCH \(UID (.*) RFC822.SIZE (.*) FLAGS \((.*)\)\)/.exec(flagDataRaw) ?? undefined;

    if (flagData?.length !== 4) {
      return undefined;
    }

    return {
      size: parseInt(flagData[2]),
      flags: flagData[3],
      deleted: /\\Deleted/.test(flagData[3]),
      seen: /\\Seen/.test(flagData[3])
    };
  }

  /**
   * @method formatFetchEmailResponse
   * @param {string[][]} fetchData
   * @returns {IEmail}
   */
  public formatFetchEmailResponse(fetchData: string[][]): IEmail {
    let emailRaw: string = fetchData[1][0];

    if (emailRaw.endsWith("\r\n)\r\n")) {
      emailRaw = emailRaw.substring(0, emailRaw.length - 5);
    }

    return this.processEmail(emailRaw);
  }

  /**
   * formatFetchAllResponse
   * @method
   * @param {string[][]} folderData
   * @returns {IFolderEmail[]}
   */
  public formatFetchFolderEmailsResponse(folderData: string[][]): IFolderEmail[] {
    const emails: IFolderEmail[] = [];

    for (let i: number = 1; i < folderData.length - 1; i = i + 2) {
      const emailFlags: string[] | undefined =
        /FETCH \(UID (.*) FLAGS \((.*)\) BODY\[HEADER\.FIELDS \(DATE FROM SUBJECT\)\] \{(.*)\}/.exec(
          folderData[i - 1][2] ?? ""
        ) ?? undefined;

      const emailDate: string | undefined =
        /.*date: (.*).*/i.exec(folderData[i][0])?.[1] ?? undefined;

      let emailSubject: string | undefined =
        /.*subject: (.*).*/i.exec(folderData[i][0])?.[1] ?? undefined;

      let emailFrom: string | undefined =
        /.*from: (.*).*/i.exec(folderData[i][0])?.[1] ?? undefined;

      if (emailSubject && emailSubject.indexOf("=?") > -1) {
        emailSubject = MimeTools.parseMimeWords(emailSubject);
      }

      if (emailFrom && emailFrom?.indexOf("=?") > -1) {
        emailFrom = MimeTools.parseMimeWords(emailFrom);
      }

      const emailBodyStructure =
        /.*bodystructure \((.*)\)/i.exec(folderData[i][0])?.[1] ?? undefined;

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
          selected: false
        });
      }
    }

    return emails;
  }

  /**
   * formatListFoldersResponse
   * @method
   * @param {string[][]} folderData
   * @returns {IFoldersEntry[]}
   */
  public formatListFoldersResponse(folderData: string[][]): IFoldersEntry[] {
    const rawFolders: string[] = [];
    const folders: IFoldersEntry[] = [];

    folderData.forEach((folderDataRow: string[]) => {
      if (folderDataRow[0] === "*") {
        const rawFolder: RegExpMatchArray | [] | undefined =
          /\((.*)\) "(.*)" (.*)/.exec(folderDataRow[2]) ?? undefined;

        const santatisedRawfolder: string | undefined = rawFolder?.[3].replace(/"/g, "");

        if (santatisedRawfolder) {
          rawFolders.push(santatisedRawfolder);
        }
      }
    });

    let id: number = 1;

    [...rawFolders]
      .sort((first: string, second: string) => first.localeCompare(second))
      .forEach((rawFolderRow: string) => {
        const slash: number = rawFolderRow.indexOf("/");

        if (slash === -1) {
          folders.push({ id: id++, name: rawFolderRow, ref: rawFolderRow, folders: [] });

          return;
        }

        const parent: string = rawFolderRow.slice(0, slash);
        const name: string = rawFolderRow.slice(slash + 1, rawFolderRow.length);

        folders.forEach((folder: IFoldersEntry, folderIndex: number) => {
          if (folders[folderIndex].name === parent) {
            folders[folderIndex].folders.push({ id: id++, name: name, ref: name });
          }
        });
      });

    return folders;
  }
}
