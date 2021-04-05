import { IFolderEmail, IFoldersEntry } from "interfaces";
import { EmailParser } from "classes";

interface IImapHelper {
  emailParser: EmailParser;
}

export class ImapHelper {
  protected emailParser: EmailParser;
  /**
   * @constructor
   */
  constructor({ emailParser }: IImapHelper) {
    this.emailParser = emailParser;
  }

  /**
   * formatFetchResponse
   * @param response
   * @returns {}
   */
  public formatFetchEmailResponse(response: string): {} {
    return {};
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

    for (let i = 1; i < folderData.length - 1; i = i + 2) {
      const emailFlags: string[] | undefined =
        folderData[i - 1][2].match(
          /FETCH \(UID (.*) FLAGS \((.*)\) BODY\[HEADER\.FIELDS \(DATE FROM SUBJECT\)\] \{(.*)\}/
        ) ?? undefined;

      const emailDate: string | undefined =
        folderData[i][0].match(/.*Date: (.*).*/)?.[1] ?? undefined;

      let emailSubject: string | undefined =
        folderData[i][0].match(/.*Subject: (.*).*/)?.[1] ?? undefined;

      let emailFrom: string | undefined =
        folderData[i][0].match(/.*From: (.*).*/)?.[1] ?? undefined;

      if (emailSubject && emailSubject.indexOf("=?") > -1) {
        emailSubject = this.emailParser.parseMimeWords(emailSubject);
      }

      if (emailFrom && emailFrom?.indexOf("=?") > -1) {
        emailFrom = this.emailParser.parseMimeWords(emailFrom);
      }

      if (emailFlags && emailDate && emailFrom) {
        emails.push({
          id: Number(emailFlags[1]),
          date: emailDate,
          epoch: new Date(emailDate).getTime(),
          from: emailFrom,
          subject: emailSubject ?? "(no subject)",
          uid: Number(emailFlags[1]),
          ref: emailFlags[3],
          flags: emailFlags[2],
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
        const rawFolder = folderDataRow[2].match(/\((.*)\) "(.*)" (.*)/);

        if (rawFolder?.length === 4) {
          rawFolders.push(rawFolder[3].replace(/"/g, ""));
        }
      }
    });

    let id = 0;
    [...rawFolders].sort().forEach((rawFolderRow) => {
      const slash = rawFolderRow.indexOf("/");

      if (slash > 0) {
        const parent = rawFolderRow.slice(0, slash);
        const name = rawFolderRow.slice(slash + 1, rawFolderRow.length);

        for (let i = 0; i < folders.length; i++) {
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
