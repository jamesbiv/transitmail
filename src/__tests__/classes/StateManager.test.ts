import { StateManager } from "classes";

const mockItem: any = {};

const stateManager = new StateManager({} as any);

describe("Testing the StateManager class", () => {
  describe("Test ", () => {
    test("", () => {
      const mockUid: number = 1;

      stateManager.setActiveUid(mockUid);

      const getActiveUidResponse:
        | number
        | undefined = stateManager.getActiveUid();

      expect(getActiveUidResponse).toEqual(mockUid);
    });
  });

  describe("Test ", () => {
    test("", () => {
      const mockFolderId: string = "folder";

      stateManager.setFolderId(mockFolderId);

      const getFolderIdResponse:
        | string
        | undefined = stateManager.getFolderId();

      expect(getFolderIdResponse).toEqual(mockFolderId);
    });
  });

  describe("Test ", () => {
    test("", () => {
      const mockFolderEmails: any = [
        {
          id: 1,
          date: "",
          epoch: 1,
          from: "",
          subject: "",
          uid: 1,
          ref: "",
          flags: "",
          hasAttachment: false,
          selected: true,
        },
      ];

      const mockFolderEmailsReponse: any = {
        emails: [
          {
            date: "",
            epoch: 1,
            flags: "",
            from: "",
            hasAttachment: false,
            id: 1,
            ref: "",
            selected: true,
            subject: "",
            uid: 1,
          },
        ],
        latestUid: "1",
      };

      stateManager.updateCurrentFolder(mockFolderEmails, "1");

      const updateCurrentFolderResponse:
        | any
        | undefined = stateManager.getCurrentFolder();

      expect(updateCurrentFolderResponse).toEqual(mockFolderEmailsReponse);
    });
  });
});
