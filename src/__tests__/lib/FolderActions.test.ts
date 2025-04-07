import { ImapSocket, StateManager } from "classes";
import { EImapResponseStatus } from "interfaces";
import { copyEmailToFolder, deleteEmailFromFolder, moveEmailToFolder } from "lib";

const mockDirectAccessToDependencies = {
  imapSocket: new ImapSocket(),
  stateManager: new StateManager()
};

jest.mock("contexts/DependenciesContext", () => {
  return {
    directAccessToDependencies: () => mockDirectAccessToDependencies
  };
});

describe("Test FlagActions", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Test copyEmailToFolder() function", () => {
    it("a successful response", () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        switch (true) {
          case /UID COPY (.*) "(.*)"/i.test(request):
            return {
              data: [[""]],
              status: EImapResponseStatus.OK
            };

          case /1UID COPY (.*) "(.*)"/i.test(request):
            return {
              data: [[" "]],
              status: EImapResponseStatus.OK
            };
        }
      });

      const updateCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        StateManager.prototype,
        "updateCurrentFolder"
      );

      updateCurrentFolderSpy.mockImplementation(() => undefined);

      const setFolderIdSpy: jest.SpyInstance = jest.spyOn(StateManager.prototype, "setFolderId");
      setFolderIdSpy.mockImplementation(() => undefined);

      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        StateManager.prototype,
        "getCurrentFolder"
      );

      getCurrentFolderSpy.mockImplementation(() => {
        return {
          latestUid: "1",
          emails: [
            {
              id: 1,
              epoch: 1,
              uid: 1,
              date: "Thu, 01 Apr 2021 00:00:00 -0300",
              from: "Test Display Name <test@emailAddress.com>",
              subject: "Test Subject",
              ref: "testFolder",
              flags: "\\Flagged",
              hasAttachment: false,
              selected: true
            }
          ]
        };
      });

      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(StateManager.prototype, "getFolderId");
      getFolderIdSpy.mockImplementation(() => "folder");

      const actionUids: number[] = [1];
      const destinationFolderId: string = "2";

      const copyEmailToFolderResponse = copyEmailToFolder(actionUids, destinationFolderId);

      expect(copyEmailToFolderResponse).toBeTruthy();
    });
  });

  describe("Test moveEmailToFolder() function", () => {
    it("a successful response", () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        switch (true) {
          case /UID/i.test(request):
            return {
              data: [[""]],
              status: EImapResponseStatus.OK
            };

          case /UID /i.test(request):
            return {
              data: [[" "]],
              status: EImapResponseStatus.OK
            };
        }
      });

      const updateCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        StateManager.prototype,
        "updateCurrentFolder"
      );

      updateCurrentFolderSpy.mockImplementation(() => undefined);

      const setFolderIdSpy: jest.SpyInstance = jest.spyOn(StateManager.prototype, "setFolderId");
      setFolderIdSpy.mockImplementation(() => undefined);

      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        StateManager.prototype,
        "getCurrentFolder"
      );

      getCurrentFolderSpy.mockImplementation(() => {
        return {
          latestUid: "1",
          emails: [
            {
              id: 1,
              epoch: 1,
              uid: 1,
              date: "Thu, 01 Apr 2021 00:00:00 -0300",
              from: "Test Display Name <test@emailAddress.com>",
              subject: "Test Subject",
              ref: "testFolder",
              flags: "\\Flagged",
              hasAttachment: false,
              selected: true
            }
          ]
        };
      });

      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(StateManager.prototype, "getFolderId");
      getFolderIdSpy.mockImplementation(() => "folder");

      const actionUids: number[] = [1];
      const destinationFolderId: string = "2";

      const moveEmailToFolderResponse = moveEmailToFolder(actionUids, destinationFolderId);

      expect(moveEmailToFolderResponse).toBeTruthy();
    });
  });

  describe("Test deleteEmailFromFolder() function", () => {
    it("a successful response", () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        switch (true) {
          case /UID/i.test(request):
            return {
              data: [[""]],
              status: EImapResponseStatus.OK
            };

          case /UID /i.test(request):
            return {
              data: [[" "]],
              status: EImapResponseStatus.OK
            };
        }
      });

      const updateCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        StateManager.prototype,
        "updateCurrentFolder"
      );

      updateCurrentFolderSpy.mockImplementation(() => undefined);

      const setFolderIdSpy: jest.SpyInstance = jest.spyOn(StateManager.prototype, "setFolderId");
      setFolderIdSpy.mockImplementation(() => undefined);

      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        StateManager.prototype,
        "getCurrentFolder"
      );

      getCurrentFolderSpy.mockImplementation(() => {
        return {
          latestUid: "1",
          emails: [
            {
              id: 1,
              epoch: 1,
              uid: 1,
              date: "Thu, 01 Apr 2021 00:00:00 -0300",
              from: "Test Display Name <test@emailAddress.com>",
              subject: "Test Subject",
              ref: "testFolder",
              flags: "\\Flagged",
              hasAttachment: false,
              selected: true
            }
          ]
        };
      });

      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(StateManager.prototype, "getFolderId");
      getFolderIdSpy.mockImplementation(() => "folder");

      const actionUids: number[] = [2];

      const deleteEmailFromFolderResponse = deleteEmailFromFolder(actionUids);

      expect(deleteEmailFromFolderResponse).toBeTruthy();
    });
  });
});
