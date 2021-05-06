import { ImapHelper, EmailParser } from "classes";

const imapHelper = new ImapHelper({
  emailParser: new EmailParser(),
});

describe("Testing the ImapHelper class", () => {
  describe("Test formatFetchEmailFlagsResponse", () => {
    const mockFetchData: any = {};

    const mockFormatFetchEmailFlagsResponse: any = {};

    test("Test populated string", () => {
      const formatFetchEmailFlagsResponse: any = imapHelper.formatFetchEmailFlagsResponse(
        mockFetchData
      );

      expect(formatFetchEmailFlagsResponse).toEqual(
        mockFormatFetchEmailFlagsResponse
      );
    });
  });

  describe("Test formatFetchEmailResponse", () => {
    const mockFetchData: any = {};

    const mockFormatFetchEmailResponse: any = {};

    test("Test populated string", () => {
      const formatFetchEmailResponse: any = imapHelper.formatFetchEmailResponse(
        mockFetchData
      );

      expect(formatFetchEmailResponse).toEqual(mockFormatFetchEmailResponse);
    });
  });

  describe("Test formatFetchFolderEmailsResponse", () => {
    const mockFolderData: any = {};

    const mockFormatFetchFolderEmailsResponse: any = {};

    test("Test populated string", () => {
      const formatFetchFolderEmailsResponse: any = imapHelper.formatFetchFolderEmailsResponse(
        mockFolderData
      );

      expect(formatFetchFolderEmailsResponse).toEqual(
        mockFormatFetchFolderEmailsResponse
      );
    });
  });

  describe("Test formatListFoldersResponse", () => {
    const mockFolderData: any = {};

    const mockFormatListFoldersResponse: any = {};

    test("Test populated string", () => {
      const formatListFoldersResponse: any = imapHelper.formatListFoldersResponse(
        mockFolderData
      );

      expect(formatListFoldersResponse).toEqual(mockFormatListFoldersResponse);
    });
  });
});
