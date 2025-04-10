import React from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EViewActionType, ViewActions } from "components/view";
import { EImapResponseStatus, IEmail, IEmailFlags } from "interfaces";
import { ImapHelper, ImapSocket } from "classes";
import { contextSpyHelper } from "__tests__/fixtures";

describe("ViewActions Component", () => {
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

  describe("ViewAction Component", () => {
    it("testing hideActionModal on top close icon", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.VIEW;

      const email: IEmail = { contentRaw: "", emailRaw: "emailRaw", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByLabelText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByLabelText(/Close/i));

      expect(hideActionModal).toHaveBeenCalled();
    });

    it("testing hideActionModal on bottom close button", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.VIEW;

      const email: IEmail = { contentRaw: "", emailRaw: "emailRaw", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Close/i));

      expect(hideActionModal).toHaveBeenCalled();
    });
  });

  describe("ViewActionMove Component", () => {
    it("a successful result", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.MOVE;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Move folder to/i)).toBeInTheDocument();
    });

    it("while triggering a submit", async () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.MOVE;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
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
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      await waitFor(() => getByTestId("selectMoveFolderTo"));

      fireEvent.change(getByTestId("selectMoveFolderTo"), { target: { value: "Archives" } });

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).toHaveBeenCalled();
    });

    it("unable to trigger a submit becuase destinationFolder was not set", async () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.MOVE;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
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
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).not.toHaveBeenCalled();
    });
  });

  describe("the ViewActionCopy Component", () => {
    it("a successful result", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.COPY;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Copy folder to/i)).toBeInTheDocument();
    });

    it("while triggering a submit", async () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.COPY;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

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

      const showActionModal: boolean = true;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByTestId, getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      await waitFor(() => getByTestId("selectCopyFolderTo"));

      fireEvent.change(getByTestId("selectCopyFolderTo"), { target: { value: "Archives" } });

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).toHaveBeenCalled();
    });

    it("unable to trigger a submit becuase destinationFolder was not set", async () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.COPY;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

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

      const showActionModal: boolean = true;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).not.toHaveBeenCalled();
    });
  });

  describe("the ViewActionFlag Component", () => {
    it("a successful result", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.FLAG;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      [/Answered/i, /Urgent/i, /Draft/i].forEach((flagType: RegExp) => {
        expect(getByText(flagType)).toBeInTheDocument();
      });
    });

    it("while triggering a submit", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.FLAG;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
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
      const actionUid: undefined = undefined;
      const actionType: EViewActionType = EViewActionType.FLAG;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
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

  describe("ViewActionView Component", () => {
    it("a successful result", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.VIEW;

      const email: IEmail = { contentRaw: "", emailRaw: "emailRaw", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/emailRaw/i)).toBeInTheDocument();
    });
  });

  describe("the ViewActionDelete Component", () => {
    it("a successful result", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.DELETE;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = () => undefined;

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      expect(getByText(/Are you sure you want to delete this email?/i)).toBeInTheDocument();
    });

    it("while triggering a submit", () => {
      const actionUid: number = 1;
      const actionType: EViewActionType = EViewActionType.DELETE;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).toHaveBeenCalled();
    });

    it("unable to trigger a delete becuase actionUid was not set", async () => {
      const actionUid: undefined = undefined;
      const actionType: EViewActionType = EViewActionType.DELETE;

      const email: IEmail = { contentRaw: "", emailRaw: "", headersRaw: "" };

      const emailFlags: IEmailFlags = {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100000
      };

      const showActionModal: boolean = true;
      const hideActionModal = jest.fn().mockImplementation(() => undefined);

      const { getByText } = render(
        <ViewActions
          actionUid={actionUid}
          actionType={actionType}
          email={email}
          emailFlags={emailFlags}
          showActionModal={showActionModal}
          hideActionModal={hideActionModal}
        />
      );

      fireEvent.click(getByText(/Ok/i));

      expect(hideActionModal).toHaveBeenCalled();
    });
  });
});
