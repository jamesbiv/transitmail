import React, { ReactNode } from "react";

import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Settings } from "components/settings";
import {
  EImapResponseStatus,
  ESmtpResponseStatus,
  IMessageModalState,
  ISettings
} from "interfaces";

/**
 * @constant mockImapSocketResponses
 */
const mockImapSocketResponses = {
  getReadyState: 1,
  imapConnect: true,
  imapAuthorise: {
    data: "",
    status: EImapResponseStatus.OK
  },
  imapClose: true,
  imapRequest: {
    data: "",
    status: EImapResponseStatus.OK
  }
};

let lastImapRequest: string;

jest.mock("classes/ImapSocket", () => ({
  ImapSocket: class ImapSocket {
    getReadyState() {
      return mockImapSocketResponses.getReadyState;
    }
    imapConnect() {
      return mockImapSocketResponses.imapConnect;
    }
    imapAuthorise() {
      return mockImapSocketResponses.imapAuthorise;
    }
    imapClose() {
      return mockImapSocketResponses.imapClose;
    }
    imapRequest(request: string) {
      lastImapRequest = request;
      return mockImapSocketResponses.imapRequest;
    }
  }
}));

/**
 * @constant mockSmtpSocketResponses
 */
const mockSmtpSocketResponses = {
  getReadyState: 1,
  smtpConnect: true,
  smtpAuthorise: {
    data: "",
    status: ESmtpResponseStatus.Success
  },
  smtpClose: true,
  smtpRequest: {
    data: "",
    status: ESmtpResponseStatus.Success
  }
};

jest.mock("classes/SmtpSocket", () => ({
  SmtpSocket: class SmtpSocket {
    getReadyState() {
      return mockSmtpSocketResponses.getReadyState;
    }
    smtpConnect() {
      return mockSmtpSocketResponses.smtpConnect;
    }
    smtpAuthorise() {
      return mockSmtpSocketResponses.smtpAuthorise;
    }
    smtpClose() {
      return mockSmtpSocketResponses.smtpClose;
    }
    smtpRequest(request: string) {
      return mockSmtpSocketResponses.smtpRequest;
    }
  }
}));

/**
 * @constant mockSecureStorageResponses
 */
const mockSecureStorageResponses = {
  getSettings: {}
};

jest.mock("classes/SecureStorage", () => ({
  SecureStorage: class SecureStorage {
    getSettings() {
      return mockSecureStorageResponses.getSettings;
    }
    setSettings(setting: ISettings) {
      return;
    }
  }
}));

/**
 * @constant mockImapHelperResponses
 */
const mockImapHelperResponses = {
  formatListFoldersResponse: []
};

jest.mock("classes/ImapHelper", () => ({
  ImapHelper: class ImapHelper {
    formatListFoldersResponse() {
      return mockImapHelperResponses.formatListFoldersResponse;
    }
  }
}));

let lastMessageModalState: IMessageModalState;

jest.mock("classes/StateManager", () => ({
  StateManager: class StateManager {
    showMessageModal(messageModalState: IMessageModalState) {
      lastMessageModalState = messageModalState;
    }
  }
}));

const ContainerMain = ({ children }: { children: ReactNode }) => {
  return <div id="container-main">{children}</div>;
};

describe("Settings Component", () => {
  describe("Test saveSettings function", () => {
    const oldEnvironmentVariables: NodeJS.ProcessEnv = process.env;

    beforeAll(() => {
      process.env = { NODE_ENV: "development", PUBLIC_URL: "https://localhost" };
    });

    afterAll(() => {
      process.env = oldEnvironmentVariables;
    });

    it("with validation errors", () => {
      const { container, getByText } = render(<Settings />, {
        wrapper: ContainerMain
      });

      const containerMain: Element = container.querySelector("#container-main")! as Element;
      containerMain.scroll = jest.fn();

      fireEvent.click(getByText(/Save/i));

      const validationResponse: HTMLElement = screen.getByRole("alert");
      expect(validationResponse).toHaveTextContent(/Please check the following errors/i);
    });

    it("with a successful save", () => {
      const { container, getByText } = render(<Settings />, {
        wrapper: ContainerMain
      });

      const containerMain: Element = container.querySelector("#container-main")! as Element;
      containerMain.scroll = jest.fn();

      const formDisplayName = container.querySelector("#formDisplayName")!;
      fireEvent.change(formDisplayName, { target: { value: "Test Display Name" } });

      const formEmailAddress = container.querySelector("#formEmailAddress")!;
      fireEvent.change(formEmailAddress, { target: { value: "test@emailAddress.com" } });

      const formEmailSignature = container.querySelector("#formEmailSignature")!;
      fireEvent.change(formEmailSignature, { target: { value: "Test Signature" } });

      const formIncomingHost = container.querySelector("#formIncomingHost")!;
      fireEvent.change(formIncomingHost, { target: { value: "mail.testIncomingHost.com" } });

      const formIncomingPort = container.querySelector("#formIncomingPort")!;
      fireEvent.change(formIncomingPort, { target: { value: "1234" } });

      const formIncomingUser = container.querySelector("#formIncomingUser")!;
      fireEvent.change(formIncomingUser, { target: { value: "testUsername" } });

      const formIncomingPassword = container.querySelector("#formIncomingPassword")!;
      fireEvent.change(formIncomingPassword, { target: { value: "testPassword" } });

      const formOutgoingHost = container.querySelector("#formOutgoingHost")!;
      fireEvent.change(formOutgoingHost, { target: { value: "mail.testOutgoingHost.com" } });

      const formOutgoingPort = container.querySelector("#formOutgoingPort")!;
      fireEvent.change(formOutgoingPort, { target: { value: "1234" } });

      const formOutgoingUser = container.querySelector("#formOutgoingUser")!;
      fireEvent.change(formOutgoingUser, { target: { value: "testUsername" } });

      const formOutgoingPassword = container.querySelector("#formOutgoingPassword")!;
      fireEvent.change(formOutgoingPassword, { target: { value: "testPassword" } });

      const formFolderArchive = container.querySelector("#formFolderArchive")!;
      fireEvent.change(formFolderArchive, { target: { value: "Archives" } });

      const formFolderTrash = container.querySelector("#formFolderTrash")!;
      fireEvent.change(formFolderTrash, { target: { value: "Recycle Bin" } });

      const formFolderDrafts = container.querySelector("#formFolderDrafts")!;
      fireEvent.change(formFolderDrafts, { target: { value: "Drafts" } });

      const formFolderSentItems = container.querySelector("#formFolderSentItems")!;
      fireEvent.change(formFolderSentItems, { target: { value: "Sent Items" } });

      const formFolderSpam = container.querySelector("#formFolderSpam")!;
      fireEvent.change(formFolderSpam, { target: { value: "Spam" } });

      fireEvent.click(getByText(/Save/i));

      const validationResponse: HTMLElement = screen.getByRole("alert");
      expect(validationResponse).toHaveTextContent(/Settings saved successfully/i);
    });
  });

  describe("Test verifySettings() function", () => {
    it("unable to verify settings", async () => {
      mockImapSocketResponses.imapAuthorise = { data: "", status: EImapResponseStatus.BAD };
      mockSmtpSocketResponses.smtpAuthorise = { data: "", status: ESmtpResponseStatus.Failure };

      const { getByText } = render(<Settings />);

      fireEvent.click(getByText(/Verify/i));

      await waitFor(() =>
        expect(lastMessageModalState).toEqual({
          content:
            "Unable to verifiy your email settings, please check your credientals and try again",
          title: "Unable to verify your settings"
        })
      );

      mockImapSocketResponses.imapAuthorise = { data: "", status: EImapResponseStatus.OK };
      mockSmtpSocketResponses.smtpAuthorise = { data: "", status: ESmtpResponseStatus.Success };
    });

    it("settings verfied successfully", async () => {
      mockImapSocketResponses.imapAuthorise = { data: "", status: EImapResponseStatus.OK };
      mockSmtpSocketResponses.smtpAuthorise = { data: "", status: ESmtpResponseStatus.Success };

      const { getByText } = render(<Settings />);

      fireEvent.click(getByText(/Verify/i));

      await waitFor(() =>
        expect(lastMessageModalState).toEqual({
          content: "Your email settings have been verfied",
          title: "Settings verfieid"
        })
      );

      mockImapSocketResponses.imapAuthorise = { data: "", status: EImapResponseStatus.OK };
      mockSmtpSocketResponses.smtpAuthorise = { data: "", status: ESmtpResponseStatus.Success };
    });
  });

  describe("Test createFolders() function", () => {
    it("test folder creation with successful response", async () => {
      mockSecureStorageResponses.getSettings = {
        name: "Test Display Name",
        email: "test@emailAddress.com",
        signature: "Test Signature",
        imapHost: "mail.testIncomingHost.com",
        imapPort: 1234,
        imapUsername: "testUsername",
        imapPassword: "testPassword",
        smtpHost: "mail.testOutgoingHost.com",
        smtpPort: 1234,
        smtpUsername: "testUsername",
        smtpPassword: "testPassword",
        folderSettings: {
          archiveFolder: "Archives",
          draftsFolder: "Drafts",
          sentItemsFolder: "Sent Items",
          spamFolder: "Spam",
          trashFolder: "Recycle Bin"
        }
      };

      mockImapHelperResponses.formatListFoldersResponse = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: []
        }
      ] as never[];

      mockImapSocketResponses.getReadyState = 0;

      mockImapSocketResponses.imapRequest = { data: "", status: EImapResponseStatus.OK };

      const { container, getByText } = render(<Settings />, {
        wrapper: ContainerMain
      });

      const containerMain: Element = container.querySelector("#container-main")! as Element;
      containerMain.scroll = jest.fn();

      fireEvent.click(getByText(/Save/i));

      mockSecureStorageResponses.getSettings = {};
      mockImapSocketResponses.getReadyState = 1;
      mockImapHelperResponses.formatListFoldersResponse = [];
      mockImapSocketResponses.imapRequest = { data: "", status: EImapResponseStatus.OK };
    });

    it("test folder creation with unsuccessful response", async () => {
      mockSecureStorageResponses.getSettings = {
        name: "Test Display Name",
        email: "test@emailAddress.com",
        signature: "Test Signature",
        imapHost: "mail.testIncomingHost.com",
        imapPort: 1234,
        imapUsername: "testUsername",
        imapPassword: "testPassword",
        smtpHost: "mail.testOutgoingHost.com",
        smtpPort: 1234,
        smtpUsername: "testUsername",
        smtpPassword: "testPassword",
        folderSettings: {
          archiveFolder: "Archives",
          draftsFolder: "Drafts",
          sentItemsFolder: "Sent Items",
          spamFolder: "Spam",
          trashFolder: "Recycle Bin"
        }
      };

      mockImapHelperResponses.formatListFoldersResponse = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: []
        }
      ] as never[];

      mockImapSocketResponses.getReadyState = 0;

      mockImapSocketResponses.imapRequest = { data: "", status: EImapResponseStatus.BAD };

      const { container, getByText } = render(<Settings />, {
        wrapper: ContainerMain
      });

      const containerMain: Element = container.querySelector("#container-main")! as Element;
      containerMain.scroll = jest.fn();

      fireEvent.click(getByText(/Save/i));

      await waitFor(() => expect(lastImapRequest).toEqual('CREATE "Recycle Bin"'));

      mockSecureStorageResponses.getSettings = {};
      mockImapSocketResponses.getReadyState = 1;
      mockImapHelperResponses.formatListFoldersResponse = [];
      mockImapSocketResponses.imapRequest = { data: "", status: EImapResponseStatus.OK };
    });

    it("test folder creation with unsuccessful response", async () => {
      mockSecureStorageResponses.getSettings = {
        name: "Test Display Name",
        email: "test@emailAddress.com",
        signature: "Test Signature",
        imapHost: "mail.testIncomingHost.com",
        imapPort: 1234,
        imapUsername: "testUsername",
        imapPassword: "testPassword",
        smtpHost: "mail.testOutgoingHost.com",
        smtpPort: 1234,
        smtpUsername: "testUsername",
        smtpPassword: "testPassword",
        folderSettings: {
          archiveFolder: "Archives",
          draftsFolder: "Drafts",
          sentItemsFolder: "Sent Items",
          spamFolder: "Spam",
          trashFolder: "Recycle Bin"
        }
      };

      mockImapHelperResponses.formatListFoldersResponse = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: []
        },
        {
          id: 2,
          name: "Archives",
          ref: "Archives",
          folders: []
        }
      ] as never[];

      mockImapSocketResponses.getReadyState = 0;

      mockImapSocketResponses.imapRequest = { data: "", status: EImapResponseStatus.BAD };

      const { container, getByText } = render(<Settings />, {
        wrapper: ContainerMain
      });

      const containerMain: Element = container.querySelector("#container-main")! as Element;
      containerMain.scroll = jest.fn();

      fireEvent.click(getByText(/Save/i));

      await waitFor(() => expect(lastImapRequest).toEqual('CREATE "Recycle Bin"'));

      mockSecureStorageResponses.getSettings = {};
      mockImapSocketResponses.getReadyState = 1;
      mockImapHelperResponses.formatListFoldersResponse = [];
      mockImapSocketResponses.imapRequest = { data: "", status: EImapResponseStatus.OK };
    });
  });
});
