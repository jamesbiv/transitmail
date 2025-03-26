import React, { JSX, ReactNode } from "react";

import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Settings } from "components/settings";
import { EImapResponseStatus, ESmtpResponseStatus } from "interfaces";
import { DependenciesContext, IDependencies } from "contexts";
import { ImapHelper, ImapSocket, SecureStorage, SmtpSocket, StateManager } from "classes";

/**
 * contextSpyHelper<T>
 * @param {string} dependencyKey
 * @returns T
 */
function contextSpyHelper<T>(dependencyKey: string) {
  const dependenciesContext = DependenciesContext as unknown as { _currentValue: IDependencies };
  const currentValue: IDependencies = dependenciesContext._currentValue;

  return currentValue[dependencyKey as keyof IDependencies] as T;
}

/**
 * ContainerMain
 * @param { children: ReactNode } properties
 * @returns JSX.Element
 */
const ContainerMain = ({ children }: { children: ReactNode }): JSX.Element => {
  return <div id="container-main">{children}</div>;
};

describe("Settings Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Test saveSettings() function", () => {
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
      const getReadyStateSpy = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "getReadyState"
      );

      getReadyStateSpy.mockImplementationOnce(() => 0);

      const imapConnectSpy = jest.spyOn(contextSpyHelper<ImapSocket>("imapSocket"), "imapConnect");
      imapConnectSpy.mockImplementationOnce(() => true);

      const imapAuthoriseSpy = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapAuthorise"
      );

      imapAuthoriseSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: EImapResponseStatus.OK };
      });

      const imapRequestSpy = jest.spyOn(contextSpyHelper<ImapSocket>("imapSocket"), "imapRequest");
      imapRequestSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: EImapResponseStatus.OK };
      });

      const formatListFoldersResponseSpy = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatListFoldersResponse"
      );

      formatListFoldersResponseSpy.mockImplementationOnce(() => []);

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
    beforeEach(() => {
      const imapConnectSpy = jest.spyOn(contextSpyHelper<ImapSocket>("imapSocket"), "imapConnect");
      imapConnectSpy.mockImplementationOnce(() => true);

      const imapCloseSpy = jest.spyOn(contextSpyHelper<ImapSocket>("imapSocket"), "imapClose");
      imapCloseSpy.mockImplementationOnce(() => true);
      imapCloseSpy.mockImplementationOnce(() => true);

      const smtpConnectSpy = jest.spyOn(contextSpyHelper<SmtpSocket>("smtpSocket"), "smtpConnect");
      smtpConnectSpy.mockImplementationOnce(() => true);

      const smtpCloseSpy = jest.spyOn(contextSpyHelper<SmtpSocket>("smtpSocket"), "smtpClose");
      smtpCloseSpy.mockImplementationOnce(() => true);
      smtpCloseSpy.mockImplementationOnce(() => true);
    });

    it("unable to verify settings", async () => {
      const imapAuthoriseSpy = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapAuthorise"
      );

      imapAuthoriseSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: EImapResponseStatus.BAD };
      });

      const smtpAuthoriseSpy = jest.spyOn(
        contextSpyHelper<SmtpSocket>("smtpSocket"),
        "smtpAuthorise"
      );

      smtpAuthoriseSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: ESmtpResponseStatus.Failure };
      });

      const showMessageModalSpy = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "showMessageModal"
      );

      showMessageModalSpy.mockImplementationOnce(() => undefined);

      const { getByText } = render(<Settings />);

      fireEvent.click(getByText(/Verify/i));

      await waitFor(() =>
        expect(showMessageModalSpy).toHaveBeenCalledWith({
          content:
            "Unable to verifiy your email settings, please check your credientals and try again",
          title: "Unable to verify your settings"
        })
      );
    });

    it("settings verfied successfully", async () => {
      const imapAuthoriseSpy = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapAuthorise"
      );

      imapAuthoriseSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: EImapResponseStatus.OK };
      });

      const smtpAuthoriseSpy = jest.spyOn(
        contextSpyHelper<SmtpSocket>("smtpSocket"),
        "smtpAuthorise"
      );

      smtpAuthoriseSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: ESmtpResponseStatus.Success };
      });

      const showMessageModalSpy = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "showMessageModal"
      );

      showMessageModalSpy.mockImplementationOnce(() => undefined);

      const { getByText } = render(<Settings />);

      fireEvent.click(getByText(/Verify/i));

      await waitFor(() =>
        expect(showMessageModalSpy).toHaveBeenCalledWith({
          content: "Your email settings have been verfied",
          title: "Settings verfieid"
        })
      );
    });
  });

  describe("Test createFolders() function", () => {
    beforeEach(() => {
      const getSettingsSpy = jest.spyOn(
        contextSpyHelper<SecureStorage>("secureStorage"),
        "getSettings"
      );

      getSettingsSpy.mockImplementationOnce(() => {
        return {
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
          },
          autoLogin: undefined,
          secondaryEmails: undefined
        };
      });
    });

    it("test folder creation with successful response", async () => {
      const formatListFoldersResponseSpy = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatListFoldersResponse"
      );

      formatListFoldersResponseSpy.mockImplementationOnce(() => [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: []
        }
      ]);

      const getReadyStateSpy = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "getReadyState"
      );

      getReadyStateSpy.mockImplementationOnce(() => 1);

      const imapRequestSpy = jest.spyOn(contextSpyHelper<ImapSocket>("imapSocket"), "imapRequest");

      imapRequestSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: EImapResponseStatus.OK };
      });

      imapRequestSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: EImapResponseStatus.OK };
      });

      const { container, getByText } = render(<Settings />, {
        wrapper: ContainerMain
      });

      const containerMain: Element = container.querySelector("#container-main")! as Element;
      containerMain.scroll = jest.fn();

      fireEvent.click(getByText(/Save/i));
    });

    it("test folder creation with unsuccessful response", async () => {
      const formatListFoldersResponseSpy = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatListFoldersResponse"
      );

      formatListFoldersResponseSpy.mockImplementationOnce(() => [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: []
        }
      ]);

      const getReadyStateSpy = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "getReadyState"
      );

      getReadyStateSpy.mockImplementationOnce(() => 1);

      const imapSocketImapRequestSpy = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapRequest"
      );

      imapSocketImapRequestSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: EImapResponseStatus.OK };
      });

      imapSocketImapRequestSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: EImapResponseStatus.BAD };
      });

      const { container, getByText } = render(<Settings />, {
        wrapper: ContainerMain
      });

      const containerMain: Element = container.querySelector("#container-main")! as Element;
      containerMain.scroll = jest.fn();

      fireEvent.click(getByText(/Save/i));

      await waitFor(() =>
        expect(imapSocketImapRequestSpy).toHaveBeenCalledWith('CREATE "Recycle Bin"')
      );
    });

    it("test folder creation with unsuccessful response", async () => {
      const formatListFoldersResponseSpy = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatListFoldersResponse"
      );

      formatListFoldersResponseSpy.mockImplementationOnce(() => [
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
      ]);

      const getReadyStateSpy = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "getReadyState"
      );

      getReadyStateSpy.mockImplementationOnce(() => 1);

      const imapRequestSpy = jest.spyOn(contextSpyHelper<ImapSocket>("imapSocket"), "imapRequest");

      imapRequestSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: EImapResponseStatus.OK };
      });

      imapRequestSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: EImapResponseStatus.BAD };
      });

      const { container, getByText } = render(<Settings />, {
        wrapper: ContainerMain
      });

      const containerMain: Element = container.querySelector("#container-main")! as Element;
      containerMain.scroll = jest.fn();

      fireEvent.click(getByText(/Save/i));

      await waitFor(() => expect(imapRequestSpy).toHaveBeenCalledWith('CREATE "Recycle Bin"'));
    });
  });
});
