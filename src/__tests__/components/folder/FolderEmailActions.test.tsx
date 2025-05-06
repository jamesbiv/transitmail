import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EFolderEmailActionType, FolderEmailActions } from "components/folder";
import { EImapResponseStatus } from "interfaces";
import { contextSpyHelper } from "__tests__/fixtures";
import { ImapHelper, ImapSocket } from "classes";

describe("FolderEmailActions Component", () => {
  beforeEach(() => {
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

  describe("FolderEmailAction Component", () => {
    it("testing hideActionModal on top close icon", () => {
      const folderEmailActionState = {
        actionUids: [1],
        actionType: EFolderEmailActionType.MOVE,
        showActionModal: true
      };

      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByLabelText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByLabelText(/Close/i));

      expect(hideActionModal).toHaveBeenCalled();
    });

    it("testing hideActionModal on bottom close button", () => {
      const folderEmailActionState = {
        actionUids: [1],
        actionType: EFolderEmailActionType.MOVE,
        showActionModal: true
      };

      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Close/i));

      expect(hideActionModal).toHaveBeenCalled();
    });
  });

  describe("testing FolderEmailActionMove component", () => {
    it("with a successful response", () => {
      const folderEmailActionState = {
        actionUids: [1],
        actionType: EFolderEmailActionType.MOVE,
        showActionModal: true
      };

      const hideActionModal = () => undefined;

      const { getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Move email\(s\) to/i)).toBeInTheDocument();
    });

    it("while triggering a submit", async () => {
      const folderEmailActionState = {
        actionUids: [1],
        actionType: EFolderEmailActionType.MOVE,
        showActionModal: true
      };

      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const formatListFoldersResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatListFoldersResponse"
      );

      formatListFoldersResponseSpy.mockImplementationOnce(() => [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 3, name: "subfolder", ref: "subfolder" }]
        },
        {
          id: 2,
          name: "Archives",
          ref: "Archives",
          folders: []
        }
      ]);

      const { getByTestId, getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      await waitFor(() => getByTestId("selectMoveFolderTo"));

      fireEvent.change(getByTestId("selectMoveFolderTo"), { target: { value: "Archives" } });

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).toHaveBeenCalled();
    });

    it("unable to trigger a submit becuase destinationFolder was not set", async () => {
      const folderEmailActionState = {
        actionUids: [1],
        actionType: EFolderEmailActionType.MOVE,
        showActionModal: true
      };

      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const formatListFoldersResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatListFoldersResponse"
      );

      formatListFoldersResponseSpy.mockImplementationOnce(() => [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 3, name: "subfolder", ref: "subfolder" }]
        },
        {
          id: 2,
          name: "Archives",
          ref: "Archives",
          folders: []
        }
      ]);

      const { getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).not.toHaveBeenCalled();
    });
  });

  describe("testing FolderEmailActionCopy component", () => {
    it("with a successful response", () => {
      const folderEmailActionState = {
        actionUids: [1],
        actionType: EFolderEmailActionType.COPY,
        showActionModal: true
      };

      const hideActionModal = () => undefined;

      const { getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Copy email\(s\) to/i)).toBeInTheDocument();
    });

    it("while triggering a submit", async () => {
      const folderEmailActionState = {
        actionUids: [1],
        actionType: EFolderEmailActionType.COPY,
        showActionModal: true
      };

      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const formatListFoldersResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatListFoldersResponse"
      );

      formatListFoldersResponseSpy.mockImplementationOnce(() => [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 3, name: "subfolder", ref: "subfolder" }]
        },
        {
          id: 2,
          name: "Archives",
          ref: "Archives",
          folders: []
        }
      ]);

      const { getByTestId, getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      await waitFor(() => getByTestId("selectCopyFolderTo"));

      fireEvent.change(getByTestId("selectCopyFolderTo"), { target: { value: "Archives" } });

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).toHaveBeenCalled();
    });

    it("unable to trigger a submit becuase destinationFolder was not set", async () => {
      const folderEmailActionState = {
        actionUids: [1],
        actionType: EFolderEmailActionType.COPY,
        showActionModal: true
      };

      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const formatListFoldersResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatListFoldersResponse"
      );

      formatListFoldersResponseSpy.mockImplementationOnce(() => [
        {
          id: 1,
          name: "Test Folder",
          ref: "Test Folder",
          folders: [{ id: 3, name: "subfolder", ref: "subfolder" }]
        },
        {
          id: 2,
          name: "Archives",
          ref: "Archives",
          folders: []
        }
      ]);

      const { getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).not.toHaveBeenCalled();
    });
  });

  describe("testing FolderEmailActionFlag component", () => {
    it("with a successful response", () => {
      const folderEmailActionState = {
        actionUids: [1],
        actionType: EFolderEmailActionType.FLAG,
        showActionModal: true
      };

      const hideActionModal = () => undefined;

      const { getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      [/Answered/i, /Urgent/i, /Draft/i].forEach((flagType: RegExp) => {
        expect(getByText(flagType)).toBeInTheDocument();
      });
    });

    it("while triggering a submit", () => {
      const folderEmailActionState = {
        actionUids: [1],
        actionType: EFolderEmailActionType.FLAG,
        showActionModal: true
      };

      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      [/Answered/i, /Urgent/i, /Draft/i].forEach((flagType: RegExp) => {
        expect(getByText(flagType)).toBeInTheDocument();
      });

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).toHaveBeenCalled();
    });

    it("unable to trigger a submit because actionUid was undefined", () => {
      const folderEmailActionState = {
        actionUids: undefined,
        actionType: EFolderEmailActionType.FLAG,
        showActionModal: true
      };

      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      [/Answered/i, /Urgent/i, /Draft/i].forEach((flagType: RegExp) => {
        expect(getByText(flagType)).toBeInTheDocument();
      });

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).not.toHaveBeenCalled();
    });
  });

  describe("testing FolderEmailActionDelete component", () => {
    it("while triggering a submit and succeeding because it contains valid uids", () => {
      const folderEmailActionState = {
        actionUids: [1],
        actionType: EFolderEmailActionType.DELETE,
        showActionModal: true
      };

      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).toHaveBeenCalled();
    });

    it("while triggering a submit and failing because no uids were specified", () => {
      const folderEmailActionState = {
        actionUids: undefined,
        actionType: EFolderEmailActionType.DELETE,
        showActionModal: true
      };

      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).not.toHaveBeenCalled();
    });

    it("with a successful response with a single uid", () => {
      const folderEmailActionState = {
        actionUids: [1],
        actionType: EFolderEmailActionType.DELETE,
        showActionModal: true
      };

      const hideActionModal = () => undefined;

      const { getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Are you sure you want to delete this email?/i)).toBeInTheDocument();
    });

    it("with a successful response with multiple uids", () => {
      const folderEmailActionState = {
        actionUids: [1, 2, 3],
        actionType: EFolderEmailActionType.DELETE,
        showActionModal: true
      };

      const hideActionModal = () => undefined;

      const { getByText } = render(
        <FolderEmailActions
          folderEmailActionState={folderEmailActionState}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Are you sure you want to delete these emails?/i)).toBeInTheDocument();
    });
  });
});
