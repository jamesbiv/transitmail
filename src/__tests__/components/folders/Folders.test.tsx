import React, { StrictMode } from "react";

import { act, fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { contextSpyHelper } from "__tests__/fixtures";

import { Folders } from "components";
import { ImapHelper, ImapSocket, StateManager } from "classes";
import { EImapResponseStatus } from "interfaces";

describe("Folders Component", () => {
  beforeEach(() => {
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

  describe("testing useEffect()", () => {
    it("when initalizeFoldersRun is true by using StrictMode to trigger 2nd render", async () => {
      const imapCheckOrConnectSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapCheckOrConnect"
      );

      imapCheckOrConnectSpy.mockImplementationOnce(() => true);

      const { getByText } = await act(() =>
        render(
          <StrictMode>
            <Folders />
          </StrictMode>
        )
      );

      expect(getByText(/Add Folder/i)).toBeInTheDocument;
    });

    it("testing try and catch on imapCheckOrConnect()", async () => {
      const imapCheckOrConnectSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapCheckOrConnect"
      );

      imapCheckOrConnectSpy.mockImplementationOnce(() => {
        throw new Error("network level error");
      });

      try {
        await act(() => render(<Folders />));
      } catch (error: unknown) {
        const _ = error;
      }

      await waitFor(() => expect(imapCheckOrConnectSpy).toHaveBeenCalled());
    });
  });

  describe("testing updateFolders() button", () => {
    it("testing try and catch on imapCheckOrConnect()", async () => {
      const imapCheckOrConnectSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapCheckOrConnect"
      );

      imapCheckOrConnectSpy.mockImplementationOnce(() => true);

      const formatListFoldersResponseSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapHelper>("imapHelper"),
        "formatListFoldersResponse"
      );

      formatListFoldersResponseSpy
        .mockImplementationOnce(() => [
          {
            id: 1,
            name: "Test Folder",
            ref: "Test Folder",
            folders: [{ id: 3, name: "subfolder", ref: "subfolder" }]
          }
        ])
        .mockImplementationOnce(() => [
          {
            id: 1,
            name: "Test Folder2",
            ref: "Test Folder2",
            folders: [{ id: 3, name: "subfolder", ref: "subfolder" }]
          }
        ]);

      const { container, getByText } = await act(() => render(<Folders />));

      const checkEmailIcon = container.querySelector('[data-icon="arrows-rotate"]')!;
      fireEvent.click(checkEmailIcon);

      await waitFor(() => expect(getByText(/Test Folder2/i)).toBeInTheDocument());
    });
  });

  describe("Testing formatListFoldersResponse() response", () => {
    it("a successful response", async () => {
      const imapCheckOrConnectSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapCheckOrConnect"
      );

      imapCheckOrConnectSpy.mockImplementationOnce(() => true);

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

      const { getByText } = await act(async () => render(<Folders />));

      await waitFor(() => expect(getByText(/Test Folder/i)).toBeInTheDocument());
    });
  });

  describe("Testing toggleActionModal() response", () => {
    it("a successful response", async () => {
      const imapCheckOrConnectSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapCheckOrConnect"
      );

      imapCheckOrConnectSpy.mockImplementationOnce(() => true);

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

      const { container, getByText } = await act(async () => render(<Folders />));

      const selectedIcon = container.querySelector(`[data-icon="plus"]`)!;
      fireEvent.click(selectedIcon);

      expect(getByText(/Add new folder/i)).toBeInTheDocument();
    });
  });

  describe("Testing updateActiveKeyFolderId() response", () => {
    it("a successful response", async () => {
      const imapCheckOrConnectSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapCheckOrConnect"
      );

      imapCheckOrConnectSpy.mockImplementationOnce(() => true);

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

      const { getByText, getAllByText } = await act(async () => render(<Folders />));

      await waitFor(() => expect(getByText(/Test Folder/i)).toBeInTheDocument());

      const openClickables = getAllByText(/Open/i);
      openClickables.forEach((openClickable) => fireEvent.click(openClickable));

      expect(updateActiveKeySpy).toHaveBeenCalledWith("folder");
    });
  });

  describe("testing toggleActionModal() and setShowActionModal()", () => {
    it("a successful response", async () => {
      const imapCheckOrConnectSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<ImapSocket>("imapSocket"),
        "imapCheckOrConnect"
      );

      imapCheckOrConnectSpy.mockImplementationOnce(() => true);

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

      const { getByText, container } = await act(async () => render(<Folders />));

      await waitFor(() => expect(formatListFoldersResponseSpy).toHaveBeenCalled());

      const slidersIcon = container.querySelector(`[data-icon="sliders"]`)!;
      fireEvent.click(slidersIcon);

      const moveIcon = container.querySelector(`[data-icon="suitcase"]`)!;
      fireEvent.click(moveIcon);

      // insert a watching a redering change to validate here

      fireEvent.click(getByText(/Close/i));

      // insert a watching a redering change to validate here
    });
  });
});
