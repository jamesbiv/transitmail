import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { contextSpyHelper } from "__tests__/fixtures";

import { Folder } from "components/folder";
import { ImapSocket } from "classes";
import { EImapResponseStatus } from "interfaces";

describe("Folder Component", () => {
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

  it("with validation errors", () => {
    render(<Folder />);
  });
});
