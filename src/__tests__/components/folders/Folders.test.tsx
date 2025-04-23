import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { contextSpyHelper } from "__tests__/fixtures";

import { Folders } from "components";
import { ImapHelper, ImapSocket, StateManager } from "classes";
import { EImapResponseStatus } from "interfaces";

describe("Folders Component", () => {
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

  describe("Testing formatListFoldersResponse() response", () => {
    it("a successful response", async () => {
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
        }
      ]);

      const { getByText } = render(<Folders />);

      await waitFor(() => expect(getByText(/Test Folder/i)).toBeInTheDocument());
    });
  });

  describe("Testing toggleActionModal() response", () => {
    it("a successful response", async () => {
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
        }
      ]);

      const { container, getByText } = render(<Folders />);

      const selectedIcon = container.querySelector(`[data-icon="plus"]`)!;
      fireEvent.click(selectedIcon);

      expect(getByText(/Add new folder/i)).toBeInTheDocument();
    });
  });

  describe("Testing updateActiveKeyFolderId() response", () => {
    it("a successful response", async () => {
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
        }
      ]);

      const updateActiveKeySpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "updateActiveKey"
      );

      const { getByText, getAllByText } = render(<Folders />);

      await waitFor(() => expect(getByText(/Test Folder/i)).toBeInTheDocument());

      const openClickables = getAllByText(/Open/i);
      openClickables.forEach((openClickable) => fireEvent.click(openClickable));

      expect(updateActiveKeySpy).toHaveBeenCalledWith("folder");
    });
  });
});
