import { ImapHelper } from "classes";
import { IEmail, IEmailFlags, IFolderEmail, IFoldersEntry } from "interfaces";

jest.mock("contexts/DependenciesContext");

describe("Testing the ImapHelper class", () => {
  describe("testing formatFetchEmailFlagsResponse() function", () => {
    it("a successful response", () => {
      const fetchData: string[][] = [
        ["*", "1", "FETCH (UID 1 RFC822.SIZE 100000 FLAGS (\\Seen))"],
        ["clbk0jks", "OK", "UID FETCH completed"]
      ];

      const imapHelper = new ImapHelper();

      const formatFetchEmailFlagsResponse: IEmailFlags | undefined =
        imapHelper.formatFetchEmailFlagsResponse(fetchData);

      expect(formatFetchEmailFlagsResponse).toEqual({
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      });
    });

    it("a unsuccessful response", () => {
      const fetchData: string[][] = [["Invalid request"]];

      const imapHelper = new ImapHelper();

      const formatFetchEmailFlagsResponse: IEmailFlags | undefined =
        imapHelper.formatFetchEmailFlagsResponse(fetchData);

      expect(formatFetchEmailFlagsResponse).toEqual(undefined);
    });
  });

  describe("testing formatFetchEmailResponse() function", () => {
    it("a successful response", () => {
      const mockFetchData: string[][] = [
        ["*", "1971", "FETCH (UID 5968 RFC822 {885}"],
        ["Test email header\r\n\r\nTest email body\r\n\r\n" + "\r\n)\r\n"],
        ["q3ilhxgq", "OK", "UID FETCH completed"]
      ];

      const imapHelper = new ImapHelper();

      const formatFetchEmailResponse: IEmail = imapHelper.formatFetchEmailResponse(mockFetchData);

      expect(formatFetchEmailResponse).toEqual({
        emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
        headersRaw: "Test email header",
        contentRaw: "Test email body\r\n\r\n",
        headers: undefined,
        boundaries: [],
        bodyText: "Test email body\r\n\r\n"
      });
    });

    it("a successful response without a terminator", () => {
      const mockFetchData: string[][] = [
        ["*", "1971", "FETCH (UID 5968 RFC822 {885}"],
        ["Test email header\r\n\r\nTest email body\r\n\r\n"],
        ["q3ilhxgq", "OK", "UID FETCH completed"]
      ];

      const imapHelper = new ImapHelper();

      const formatFetchEmailResponse: IEmail = imapHelper.formatFetchEmailResponse(mockFetchData);

      expect(formatFetchEmailResponse).toEqual({
        emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
        headersRaw: "Test email header",
        contentRaw: "Test email body\r\n\r\n",
        headers: undefined,
        boundaries: [],
        bodyText: "Test email body\r\n\r\n"
      });
    });
  });

  describe("testing formatFetchFolderEmailsResponse() function", () => {
    it("a successful response", () => {
      const folderData: string[][] = [
        ["*", "1", "FETCH (UID 1 FLAGS (\\Seen) BODY[HEADER.FIELDS (DATE FROM SUBJECT)] {1}"],
        [
          "Date: Fri, 24 Jul 2020 00:00:00 -0300\r\n" +
            "Subject: Test Subject\r\n" +
            "From: Test Display Name <test@emailAddress.com>\r\n" +
            "\r\n" +
            ' BODYSTRUCTURE ("text" "plain" ("CHARSET" "utf-8") NIL NIL "7BIT" 337 11 NIL NIL NIL))\r\n'
        ],
        ["3d290h4", "OK", "UID FETCH completed"]
      ];

      const imapHelper = new ImapHelper();

      const formatFetchFolderEmailsResponse: IFolderEmail[] =
        imapHelper.formatFetchFolderEmailsResponse(folderData);

      expect(formatFetchFolderEmailsResponse).toEqual([
        {
          id: 1,
          date: "Fri, 24 Jul 2020 00:00:00 -0300",
          epoch: 1595559600000,
          from: "Test Display Name <test@emailAddress.com>",
          subject: "Test Subject",
          uid: 1,
          ref: "1",
          flags: "\\Seen",
          hasAttachment: false,
          selected: false
        }
      ]);
    });

    it("a successful response without a subject", () => {
      const folderData: string[][] = [
        ["*", "1", "FETCH (UID 1 FLAGS (\\Seen) BODY[HEADER.FIELDS (DATE FROM SUBJECT)] {1}"],
        [
          "Date: Fri, 24 Jul 2020 00:00:00 -0300\r\n" +
            "From: Test Display Name <test@emailAddress.com>\r\n" +
            "\r\n" +
            ' BODYSTRUCTURE ("text" "plain" ("CHARSET" "utf-8") NIL NIL "7BIT" 337 11 NIL NIL NIL))\r\n'
        ],
        ["3d290h4", "OK", "UID FETCH completed"]
      ];

      const imapHelper = new ImapHelper();

      const formatFetchFolderEmailsResponse: IFolderEmail[] =
        imapHelper.formatFetchFolderEmailsResponse(folderData);

      expect(formatFetchFolderEmailsResponse).toEqual([
        {
          id: 1,
          date: "Fri, 24 Jul 2020 00:00:00 -0300",
          epoch: 1595559600000,
          from: "Test Display Name <test@emailAddress.com>",
          subject: "(no subject)",
          uid: 1,
          ref: "1",
          flags: "\\Seen",
          hasAttachment: false,
          selected: false
        }
      ]);
    });

    it("a successful response with mime encoded From or Subject header", () => {
      const folderData: string[][] = [
        ["*", "1", "FETCH (UID 1 FLAGS (\\Seen) BODY[HEADER.FIELDS (DATE FROM SUBJECT)] {1}"],
        [
          "Date: Fri, 24 Jul 2020 00:00:00 -0300\r\n" +
            "Subject: =?UTF-8?B?VGVzdCBTdWJqZWN0?=\r\n" +
            "From: =?UTF-8?B?VGVzdCBEaXNwbGF5IE5hbWUgPHRlc3RAZW1haWxBZGRyZXNzLmNvbT4=?=\r\n" +
            "\r\n" +
            ' BODYSTRUCTURE ("text" "plain" ("CHARSET" "utf-8") NIL NIL "7BIT" 337 11 NIL NIL NIL))\r\n'
        ],
        ["3d290h4", "OK", "UID FETCH completed"]
      ];

      const imapHelper = new ImapHelper();

      const formatFetchFolderEmailsResponse: IFolderEmail[] =
        imapHelper.formatFetchFolderEmailsResponse(folderData);

      expect(formatFetchFolderEmailsResponse).toEqual([
        {
          id: 1,
          date: "Fri, 24 Jul 2020 00:00:00 -0300",
          epoch: 1595559600000,
          from: "Test Display Name <test@emailAddress.com>",
          subject: "Test Subject",
          uid: 1,
          ref: "1",
          flags: "\\Seen",
          hasAttachment: false,
          selected: false
        }
      ]);
    });

    it("an unsuccesful response to an invalid request", () => {
      const folderData: string[][] = [["*"], ["Invalid request"], []];

      const imapHelper = new ImapHelper();

      const formatFetchFolderEmailsResponse: IFolderEmail[] =
        imapHelper.formatFetchFolderEmailsResponse(folderData);

      expect(formatFetchFolderEmailsResponse).toEqual([]);
    });
  });

  describe("testing formatListFoldersResponse() function", () => {
    it("a successful response", () => {
      const folderData: string[][] = [
        ["*", "LIST", '(\\NoSelect \\HasChildren) "/" ""'],
        ["*", "LIST", '() "/" "testFolder"'],
        ["*", "LIST", '() "/" "testFolder/subfolder"'],
        ["*", "LIST", '() "/" "anotherTestFolder"'],
        ["g7xyu52", "OK", "LIST completed"]
      ];

      const imapHelper = new ImapHelper();

      const formatListFoldersResponse: IFoldersEntry[] =
        imapHelper.formatListFoldersResponse(folderData);

      expect(formatListFoldersResponse).toEqual([
        {
          id: 1,
          name: "anotherTestFolder",
          ref: "anotherTestFolder",
          folders: []
        },
        {
          id: 2,
          name: "testFolder",
          ref: "testFolder",
          folders: [{ id: 3, name: "subfolder", ref: "subfolder" }]
        }
      ]);
    });

    it("an unsuccessful response", () => {
      const folderData: string[][] = [["*"]];

      const imapHelper = new ImapHelper();

      const formatListFoldersResponse: IFoldersEntry[] =
        imapHelper.formatListFoldersResponse(folderData);

      expect(formatListFoldersResponse).toEqual([]);
    });
  });
});
