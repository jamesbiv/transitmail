import React from "react";

import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { contextSpyHelper, sleep } from "__tests__/fixtures";
import { ImapHelper, ImapSocket, StateManager } from "classes";
import { EImapResponseStatus } from "interfaces";

import { View } from "components";

describe("View Component", () => {
  it("showing an incoming email", async () => {
    const imapConnectSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<ImapSocket>("imapSocket"),
      "imapConnect"
    );

    imapConnectSpy.mockImplementationOnce(() => true);

    const getReadyStateSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<ImapSocket>("imapSocket"),
      "getReadyState"
    );

    getReadyStateSpy.mockImplementationOnce(() => 1);

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

    const getFolderIdSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<StateManager>("stateManager"),
      "getFolderId"
    );

    getFolderIdSpy.mockImplementationOnce(() => "1");

    const updateActiveKeySpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<StateManager>("stateManager"),
      "updateActiveKey"
    );

    updateActiveKeySpy.mockImplementationOnce(() => undefined);

    const formatFetchEmailFlagsResponseSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<ImapHelper>("imapHelper"),
      "formatFetchEmailFlagsResponse"
    );

    formatFetchEmailFlagsResponseSpy.mockImplementation(() => {
      return {
        deleted: false,
        flags: "\\Seen",
        seen: true,
        size: 100
      };
    });

    const formatFetchEmailResponseSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<ImapHelper>("imapHelper"),
      "formatFetchEmailResponse"
    );

    formatFetchEmailResponseSpy.mockImplementation(() => {
      return {
        emailRaw: "Test email header\r\n\r\nTest email body\r\n\r\n",
        headersRaw: "Test email header",
        contentRaw: "Test email body\r\n\r\n",
        headers: undefined,
        boundaries: [],
        bodyText: "Test email body\r\n\r\n"
      };
    });

    const { getByText } = render(<View />);

    await sleep(100);

    await waitFor(() => {
      expect(getByText(/Test email body/i)).toBeInTheDocument();
    });
  });
});
