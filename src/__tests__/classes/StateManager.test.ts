import { StateManager } from "classes";
import {
  EComposePresetType,
  IComposePresets,
  IEmail,
  IFolderEmail,
  IFolderEmails,
  IMessageModalState
} from "interfaces";

jest.mock("contexts/DependenciesContext");

describe("Testing the StateManager class", () => {
  describe("test updateActiveKey() method", () => {
    it("testing indexState.setActiveKey() returns with active key", () => {
      const stateManager = new StateManager();

      const activeKey: string = "testActiveKey";

      stateManager.updateActiveKey(activeKey);

      expect(stateManager.indexState).toEqual({});
    });

    it("testing indexState.setActiveKey() returns with active key", () => {
      const stateManager = new StateManager();

      stateManager.indexState = {
        sliderState: {
          sliderAction: false,
          sliderInitalDisplay: false
        },
        setSliderState: jest.fn(),
        setActiveKey: jest.fn(),
        setMessageModalState: jest.fn()
      };

      const activeKey: string = "testActiveKey";

      stateManager.updateActiveKey(activeKey);

      expect(stateManager.indexState.setActiveKey).toHaveBeenCalledWith("testActiveKey");
    });
  });

  describe("test setActiveUid() and getActiveUid() methods", () => {
    it("successful getting and setting", () => {
      const uid: number = 1;

      const stateManager = new StateManager();

      stateManager.setActiveUid(uid);

      const getActiveUidResponse: number | undefined = stateManager.getActiveUid();

      expect(getActiveUidResponse).toEqual(uid);
    });
  });

  describe("test setFolderId() and getFolderId() methods", () => {
    it("successful getting and setting", () => {
      const folderId: string = "folder";

      const stateManager = new StateManager();

      stateManager.setFolderId(folderId);

      const getFolderIdResponse: string | undefined = stateManager.getFolderId();

      expect(getFolderIdResponse).toEqual(folderId);
    });
  });

  describe("test updateCurrentFolder() and getCurrentFolder() methods", () => {
    it("getCurrentFolder() returns undefined because folderId is empty", () => {
      const stateManager = new StateManager();

      const updateCurrentFolderResponse: IFolderEmails | undefined =
        stateManager.getCurrentFolder();

      expect(updateCurrentFolderResponse).toBe(undefined);
    });

    it("getCurrentFolder() returns undefined because folderId is invalid", () => {
      const folderId: string = "invalidFolder";

      const stateManager = new StateManager();

      stateManager.setFolderId(folderId);

      const getCurrentFolderResponse: IFolderEmails | undefined = stateManager.getCurrentFolder();

      expect(getCurrentFolderResponse).toBe(undefined);
    });

    it("updateCurrentFolder() doesn't update folderEmails because folderId is empty", () => {
      const stateManager = new StateManager();

      stateManager.updateCurrentFolder();

      /**
       * needs a better test case
       */
    });

    it("successful getting and setting", () => {
      const folderId: string = "folder";

      const folderEmails: IFolderEmail[] = [
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
          selected: true
        }
      ];

      const stateManager = new StateManager();

      stateManager.setFolderId(folderId);

      stateManager.updateCurrentFolder(folderEmails, "1");

      const updateCurrentFolderResponse: IFolderEmails | undefined =
        stateManager.getCurrentFolder();

      expect(updateCurrentFolderResponse).toEqual({
        emails: folderEmails,
        latestUid: "1"
      });
    });
  });

  describe("test showMessageModal()", () => {
    it("indexState.setMessageModalState() triggers modal", () => {
      const stateManager = new StateManager();

      stateManager.indexState = {
        sliderState: {
          sliderAction: false,
          sliderInitalDisplay: false
        },
        setSliderState: jest.fn(),
        setActiveKey: jest.fn(),
        setMessageModalState: jest.fn()
      };

      const messageModalState: IMessageModalState = {
        title: "Test modal name",
        content: "Test modal content"
      };

      stateManager.showMessageModal(messageModalState);

      expect(stateManager.indexState.setMessageModalState).toHaveBeenCalledWith({
        ...messageModalState,
        show: true
      });
    });
  });

  describe("test setComposePresets() and setComposePresets() methods", () => {
    it("successful getting and setting", () => {
      const composePresets: IComposePresets = {
        email: {} as IEmail,
        type: EComposePresetType.Reply,
        uid: 1
      };

      const stateManager = new StateManager();

      stateManager.setComposePresets(composePresets);

      const getComposePresetsResponse: IComposePresets | undefined =
        stateManager.getComposePresets();

      expect(getComposePresetsResponse).toEqual(composePresets);
    });
  });
});
