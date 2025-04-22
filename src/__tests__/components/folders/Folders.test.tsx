import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { contextSpyHelper } from "__tests__/fixtures";

import { Folders } from "components";
import { ImapHelper, ImapSocket } from "classes";
import { EImapResponseStatus } from "interfaces";

// jest.mock("contexts/DependenciesContext");

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

  describe("", () => {
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

      render(<Folders />);
    });
  });
});
