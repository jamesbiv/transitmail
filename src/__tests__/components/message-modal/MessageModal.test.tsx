import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { MessageModal } from "components";
import { IMessageModalState } from "interfaces";

jest.mock("components/folder/Folder");

describe("Inbox Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("testing hideMessageModal()", () => {
    const messageModalState = {
      title: "Test title",
      content: "Test content",
      show: true
    };

    const setMessageModalState = jest.fn();
    setMessageModalState.mockImplementation((messageModalState: IMessageModalState) => {});

    const { getByText } = render(
      <MessageModal
        messageModalState={messageModalState}
        setMessageModalState={setMessageModalState}
      />
    );

    fireEvent.click(getByText(/Close/i));

    expect(setMessageModalState).toHaveBeenCalledWith(
      expect.objectContaining({
        content: "Test content",
        show: false,
        title: "Test title"
      })
    );
  });

  it("testing messageModalState action", () => {
    let actionTriggered: boolean = false;

    const messageModalState = {
      title: "Test title",
      content: "Test content",
      action: () => {
        actionTriggered = true;
      },
      show: true
    };

    const setMessageModalState = () => {};

    const { getByText } = render(
      <MessageModal
        messageModalState={messageModalState}
        setMessageModalState={setMessageModalState}
      />
    );

    fireEvent.click(getByText(/Ok/i));

    expect(actionTriggered).toBeTruthy();
  });
});
