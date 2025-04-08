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
        return { data: [[""]], status: EImapResponseStatus.OK };
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

    it("an unsuccessful response because actionUids are empty", () => {
      const actionUids: number[] = [];
      const destinationFolderId: string = "";

      const copyEmailToFolderResponse = copyEmailToFolder(actionUids, destinationFolderId);

      expect(copyEmailToFolderResponse).toBeFalsy();
    });

    it("an unsuccessful response because getCurrentFolder() was invalid or didnt exsist", () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        return { data: [[""]], status: EImapResponseStatus.OK };
      });

      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        StateManager.prototype,
        "getCurrentFolder"
      );

      getCurrentFolderSpy.mockImplementation(() => undefined);

      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(StateManager.prototype, "getFolderId");
      getFolderIdSpy.mockImplementation(() => "folder");

      const actionUids: number[] = [1];
      const destinationFolderId: string = "2";

      const copyEmailToFolderResponse = copyEmailToFolder(actionUids, destinationFolderId);

      expect(copyEmailToFolderResponse).toBeFalsy();
    });

    it("an unsuccessful response because destinationFolderId was invalid or didnt exsist", () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        return { data: [[""]], status: EImapResponseStatus.OK };
      });

      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        StateManager.prototype,
        "getCurrentFolder"
      );

      getCurrentFolderSpy.mockImplementationOnce(() => {
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

      getCurrentFolderSpy.mockImplementationOnce(() => undefined);

      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(StateManager.prototype, "getFolderId");
      getFolderIdSpy.mockImplementation(() => "folder");

      const actionUids: number[] = [1];
      const destinationFolderId: string = "2";

      const copyEmailToFolderResponse = copyEmailToFolder(actionUids, destinationFolderId);

      expect(copyEmailToFolderResponse).toBeFalsy();
    });
  });

  describe("Test moveEmailToFolder() function", () => {
    it("a successful response", () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        return { data: [[""]], status: EImapResponseStatus.OK };
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

    it("a successful response but creating the destinationFolder in the case it doesnt exist", () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        switch (true) {
          case /UID MOVE (.*)/i.test(request):
            return {
              data: [[""]],
              status: EImapResponseStatus.BAD
            };

          case /UID COPY (.*)/i.test(request):
          case /UID STORE (.*)/i.test(request):
          case /UID EXPUNGE (.*)/i.test(request):
            return {
              data: [[""]],
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

    it("an unsuccessful response because actionUids are empty", () => {
      const actionUids: number[] = [];
      const destinationFolderId: string = "";

      const moveEmailToFolderResponse = moveEmailToFolder(actionUids, destinationFolderId);

      expect(moveEmailToFolderResponse).toBeFalsy();
    });

    it("an unsuccessful response because getCurrentFolder() was invalid or didnt exsist", () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        return { data: [[""]], status: EImapResponseStatus.OK };
      });

      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        StateManager.prototype,
        "getCurrentFolder"
      );

      getCurrentFolderSpy.mockImplementation(() => undefined);

      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(StateManager.prototype, "getFolderId");
      getFolderIdSpy.mockImplementation(() => "folder");

      const actionUids: number[] = [1];
      const destinationFolderId: string = "2";

      const moveEmailToFolderResponse = moveEmailToFolder(actionUids, destinationFolderId);

      expect(moveEmailToFolderResponse).toBeFalsy();
    });

    it("an unsuccessful response because destinationFolderId was invalid or didnt exsist", () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        return { data: [[""]], status: EImapResponseStatus.OK };
      });

      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        StateManager.prototype,
        "getCurrentFolder"
      );

      getCurrentFolderSpy.mockImplementationOnce(() => {
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

      getCurrentFolderSpy.mockImplementationOnce(() => undefined);

      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(StateManager.prototype, "getFolderId");
      getFolderIdSpy.mockImplementation(() => "folder");

      const actionUids: number[] = [1];
      const destinationFolderId: string = "2";

      const moveEmailToFolderResponse = moveEmailToFolder(actionUids, destinationFolderId);

      expect(moveEmailToFolderResponse).toBeFalsy();
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

    it("an unsuccessful response because actionUids are empty", () => {
      const actionUids: number[] = [];

      const deleteEmailFromFolderResponse = deleteEmailFromFolder(actionUids);

      expect(deleteEmailFromFolderResponse).toBeFalsy();
    });

    it("an unsuccessful response because getCurrentFolder() was invalid or didnt exsist", () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        return { data: [[""]], status: EImapResponseStatus.OK };
      });

      const getCurrentFolderSpy: jest.SpyInstance = jest.spyOn(
        StateManager.prototype,
        "getCurrentFolder"
      );

      getCurrentFolderSpy.mockImplementation(() => undefined);

      const getFolderIdSpy: jest.SpyInstance = jest.spyOn(StateManager.prototype, "getFolderId");
      getFolderIdSpy.mockImplementation(() => "folder");

      const actionUids: number[] = [1];

      const deleteEmailFromFolderResponse = deleteEmailFromFolder(actionUids);

      expect(deleteEmailFromFolderResponse).toBeFalsy();
    });

    it("an unsuccessful response because currentEmailFolder was empty", () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        return { data: [[""]], status: EImapResponseStatus.OK };
      });

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

      const deleteEmailFromFolderResponse = deleteEmailFromFolder(actionUids);

      expect(deleteEmailFromFolderResponse).toBeFalsy();
    });
  });
});
