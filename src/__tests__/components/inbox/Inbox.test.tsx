import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { contextSpyHelper } from "__tests__/fixtures";

import { StateManager } from "classes";
import { Inbox } from "components";

jest.mock("components/folder/Folder");

describe("Inbox Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("testing setFolderId() StateManager action", () => {
    const setFolderIdSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<StateManager>("stateManager"),
      "setFolderId"
    );

    render(<Inbox />);

    expect(setFolderIdSpy).toHaveBeenCalledWith("INBOX");
  });
});
