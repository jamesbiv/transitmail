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

    it("while triggering submit but failed because CREATE failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapRequest"
      );

      imapRequestSpy.mockImplementation(async () => {
        return { data: [[]], status: EImapResponseStatus.BAD };
      });

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

      const { getByText, getByTestId } = render(
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

      await waitFor(() => getByTestId("selectAddFolderTo"));
      fireEvent.change(getByTestId("selectAddFolderTo"), { target: { value: "Test Folder" } });

      fireEvent.click(getByText(/Ok/i));

      await waitFor(() => expect(hideActionModal).not.toHaveBeenCalled());
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

      const { getByText, getByTestId, getByPlaceholderText } = render(
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

      await waitFor(() => getByTestId("selectAddFolderTo"));
      fireEvent.change(getByTestId("selectAddFolderTo"), { target: { value: "New folder name" } });

      const formRenameFolderTo = getByPlaceholderText("Enter new folder name");
      fireEvent.change(formRenameFolderTo, { target: { value: "New folder name" } });

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

    it("while triggering submit but failed because CREATE failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapRequest"
      );

      imapRequestSpy.mockImplementationOnce(async () => {
        return { data: [[]], status: EImapResponseStatus.BAD };
      });

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

      await waitFor(() => expect(hideActionModal).not.toHaveBeenCalled());
    });

    it("while triggering submit but failed because SELECT failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapRequest"
      );

      imapRequestSpy
        .mockImplementationOnce(async () => {
          return { data: [[]], status: EImapResponseStatus.OK };
        })
        .mockImplementationOnce(async () => {
          return { data: [[]], status: EImapResponseStatus.BAD };
        });

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

      const { getByText, getByTestId } = render(
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

      await waitFor(() => getByTestId("selectCopyFolderTo"));
      fireEvent.change(getByTestId("selectCopyFolderTo"), { target: { value: "Test Folder" } });

      fireEvent.click(getByText(/Ok/i));

      await waitFor(() => expect(hideActionModal).not.toHaveBeenCalled());
    });

    it("while triggering submit but failed because UID failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapRequest"
      );

      imapRequestSpy
        .mockImplementationOnce(async () => {
          return { data: [[]], status: EImapResponseStatus.OK };
        })
        .mockImplementationOnce(async () => {
          return { data: [[]], status: EImapResponseStatus.OK };
        })
        .mockImplementationOnce(async () => {
          return { data: [[]], status: EImapResponseStatus.BAD };
        });

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

      await waitFor(() => expect(hideActionModal).not.toHaveBeenCalled());
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

      const { getByText, getByTestId, getByPlaceholderText } = render(
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

      await waitFor(() => getByTestId("selectCopyFolderTo"));
      fireEvent.change(getByTestId("selectCopyFolderTo"), { target: { value: "New folder name" } });

      const formRenameFolderTo = getByPlaceholderText("Enter new folder name");
      fireEvent.change(formRenameFolderTo, { target: { value: "New folder name" } });

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

    it("while triggering submit but failed because RENAME failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapRequest"
      );

      imapRequestSpy.mockImplementation(async () => {
        return { data: [[]], status: EImapResponseStatus.BAD };
      });

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

      const { getByText, getByTestId } = render(
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

      await waitFor(() => getByTestId("selectMoveFolderTo"));
      fireEvent.change(getByTestId("selectMoveFolderTo"), { target: { value: "Test Folder" } });

      fireEvent.click(getByText(/Ok/i));

      await waitFor(() => expect(hideActionModal).not.toHaveBeenCalled());
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

      const { getByText, getByTestId } = render(
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

      await waitFor(() => getByTestId("selectMoveFolderTo"));
      fireEvent.change(getByTestId("selectMoveFolderTo"), { target: { value: "New folder name" } });

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

    it("while triggering submit but failed because RENAME failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapRequest"
      );

      imapRequestSpy.mockImplementation(async () => {
        return { data: [[]], status: EImapResponseStatus.BAD };
      });

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

      await waitFor(() => expect(hideActionModal).not.toHaveBeenCalled());
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

      const { getByText, getByPlaceholderText } = render(
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

      const formRenameFolderTo = getByPlaceholderText("Enter new folder name");
      fireEvent.change(formRenameFolderTo, { target: { value: "New folder name" } });

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

    it("while triggering submit but failed because DELETE failed", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapRequest"
      );

      imapRequestSpy.mockImplementation(async () => {
        return { data: [[]], status: EImapResponseStatus.BAD };
      });

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

      await waitFor(() => expect(hideActionModal).not.toHaveBeenCalled());
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
