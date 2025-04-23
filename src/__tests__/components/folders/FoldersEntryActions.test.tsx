import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EImapResponseStatus, IFoldersEntry } from "interfaces";
import { EFolderEntryActionType, FoldersEntryActions } from "components/folders";
import { ImapSocket } from "classes";
import { contextSpyHelper } from "__tests__/fixtures";

describe("FoldersEntryActions Component", () => {
  beforeEach(() => {
    const imapCheckOrConnectSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<ImapSocket>("imapSocket"),
      "imapCheckOrConnect"
    );

    imapCheckOrConnectSpy.mockImplementationOnce(() => true);

    const getStreamAmountSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<ImapSocket>("imapSocket"),
      "getStreamAmount"
    );

    getStreamAmountSpy.mockImplementationOnce(() => 100);

    const imapRequestSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<ImapSocket>("imapSocket"),
      "imapRequest"
    );

    imapRequestSpy.mockImplementation(async () => {
      return { data: [[]], status: EImapResponseStatus.OK };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("FoldersEntryAction Component", () => {
    it("testing hideActionModal() on top close icon", () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 2, name: "subfolder", ref: "subfolder" }]
        }
      ];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.ADD;
      const showActionModal: boolean = true;
      const imapSocket = contextSpyHelper<ImapSocket>("imapSocket");

      const getFolders = async () => undefined;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByLabelText } = render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );
      fireEvent.click(getByLabelText(/Close/i));

      expect(hideActionModal).toHaveBeenCalled();
    });

    it("testing hideActionModal() on bottom close button", () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 2, name: "subfolder", ref: "subfolder" }]
        }
      ];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.ADD;
      const showActionModal: boolean = true;
      const imapSocket = contextSpyHelper<ImapSocket>("imapSocket");

      const getFolders = async () => undefined;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );
      fireEvent.click(getByText(/Close/i));

      expect(hideActionModal).toHaveBeenCalled();
    });
  });

  describe("FoldersEntryActionAdd", () => {
    it("while triggering submit", async () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 2, name: "subfolder", ref: "subfolder" }]
        }
      ];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.ADD;
      const showActionModal: boolean = true;
      const imapSocket = contextSpyHelper<ImapSocket>("imapSocket");

      const getFolders = async () => undefined;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      await waitFor(() => expect(hideActionModal).toHaveBeenCalled());
    });

    it("a successful response", async () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 2, name: "subfolder", ref: "subfolder" }]
        }
      ];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.ADD;
      const showActionModal: boolean = true;
      const imapSocket = new ImapSocket();

      const getFolders = async () => undefined;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Add new folder/i)).toBeInTheDocument();
    });
  });

  describe("FoldersEntryActionCopy", () => {
    it("while triggering submit", async () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 2, name: "subfolder", ref: "subfolder" }]
        }
      ];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.COPY;
      const showActionModal: boolean = true;
      const imapSocket = contextSpyHelper<ImapSocket>("imapSocket");

      const getFolders = async () => undefined;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      await waitFor(() => expect(hideActionModal).toHaveBeenCalled());
    });

    it("a successful response", async () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 2, name: "subfolder", ref: "subfolder" }]
        }
      ];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.COPY;
      const showActionModal: boolean = true;
      const imapSocket = new ImapSocket();

      const getFolders = async () => undefined;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Copy folder as/i)).toBeInTheDocument();
    });
  });

  describe("FoldersEntryActionMove", () => {
    it("while triggering submit", async () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 2, name: "subfolder", ref: "subfolder" }]
        }
      ];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.MOVE;
      const showActionModal: boolean = true;
      const imapSocket = contextSpyHelper<ImapSocket>("imapSocket");

      const getFolders = async () => undefined;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      await waitFor(() => expect(hideActionModal).toHaveBeenCalled());
    });

    it("a successful response", async () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 2, name: "subfolder", ref: "subfolder" }]
        }
      ];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.MOVE;
      const showActionModal: boolean = true;
      const imapSocket = new ImapSocket();

      const getFolders = async () => undefined;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Move folder to/i)).toBeInTheDocument();
    });
  });

  describe("FoldersEntryActionRename", () => {
    it("while triggering submit", async () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 2, name: "subfolder", ref: "subfolder" }]
        }
      ];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.RENAME;
      const showActionModal: boolean = true;
      const imapSocket = contextSpyHelper<ImapSocket>("imapSocket");

      const getFolders = async () => undefined;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      await waitFor(() => expect(hideActionModal).toHaveBeenCalled());
    });

    it("a successful response", async () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 2, name: "subfolder", ref: "subfolder" }]
        }
      ];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.RENAME;
      const showActionModal: boolean = true;
      const imapSocket = new ImapSocket();

      const getFolders = async () => undefined;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Rename folder as/i)).toBeInTheDocument();
    });
  });

  describe("FoldersEntryActionDelete", () => {
    it("while triggering submit", async () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 2, name: "subfolder", ref: "subfolder" }]
        }
      ];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.DELETE;
      const showActionModal: boolean = true;
      const imapSocket = contextSpyHelper<ImapSocket>("imapSocket");

      const getFolders = async () => undefined;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      await waitFor(() => expect(hideActionModal).toHaveBeenCalled());
    });

    it("a successful response", async () => {
      const folderId: string = "1";
      const folders: IFoldersEntry[] = [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 2, name: "subfolder", ref: "subfolder" }]
        }
      ];

      const actionType: EFolderEntryActionType = EFolderEntryActionType.DELETE;
      const showActionModal: boolean = true;
      const imapSocket = new ImapSocket();

      const getFolders = async () => undefined;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <FoldersEntryActions
          folderId={folderId}
          folders={folders}
          actionType={actionType}
          showActionModal={showActionModal}
          imapSocket={imapSocket}
          getFolders={getFolders}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Are you sure you want to delete this folder?/i)).toBeInTheDocument();
    });
  });
});
