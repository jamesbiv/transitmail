import React from "react";

import { contextSpyHelper } from "__tests__/fixtures";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { Menu } from "components/menu";
import { StateManager } from "classes";

describe("Menu Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("testing updateActiveKey() StateManager actions", () => {
    const updateActiveKeySpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<StateManager>("stateManager"),
      "updateActiveKey"
    );

    updateActiveKeySpy.mockImplementation(() => undefined);

    const { getByText } = render(<Menu />);

    [
      { name: "Inbox", eventKey: "inbox" },
      { name: "Compose", eventKey: "compose" },
      { name: "Folders", eventKey: "folders" },
      { name: "Settings", eventKey: "settings" },
      { name: "Logout", eventKey: "logout" }
    ].forEach((menuItem) => {
      const { name, eventKey } = menuItem;

      fireEvent.click(getByText(name));

      expect(updateActiveKeySpy).toHaveBeenCalledWith(eventKey);
    });
  });
});
