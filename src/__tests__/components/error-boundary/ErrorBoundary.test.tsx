import React, { Fragment, FunctionComponent, PropsWithChildren, useContext, useState } from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { contextSpyHelper } from "__tests__/fixtures";

import { ErrorBoundary, MessageModal } from "components";
import { IMessageModalState } from "interfaces";
import { DependenciesContext, IDependencies } from "contexts";
import { StateManager } from "classes";

/**
 * MockError
 * @returns {void}
 */
const MockError: FunctionComponent = () => {
  throw new Error("This is an Error");
};

/**
 * MockWebsocketError
 * @returns {void}
 */
const MockWebsocketError: FunctionComponent = () => {
  throw new Error("This is an Websockets based error");
};

/**
 * @interface IMockContainer
 */
interface IMockContainer {
  setActiveKey: (activeKey: string) => void;
}

/**
 * MockContainer
 * @returns {ReactNode}
 */
const MockContainer: FunctionComponent<PropsWithChildren<IMockContainer>> = ({
  setActiveKey,
  children
}) => {
  const { stateManager } = useContext<IDependencies>(DependenciesContext);

  const [messageModalState, setMessageModalState] = useState<IMessageModalState>({
    title: "",
    content: "",
    action: () => {},
    show: false
  });

  stateManager.indexState = {
    sliderState: {
      sliderAction: false,
      sliderInitalDisplay: false
    },
    setSliderState: jest.fn(),
    setActiveKey,
    setMessageModalState
  };

  return (
    <Fragment>
      {children}
      <MessageModal
        messageModalState={messageModalState}
        setMessageModalState={setMessageModalState}
      />
    </Fragment>
  );
};

describe("ErrorBoundary Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("test error boundary with a generic error", () => {
    const { container } = render(
      <ErrorBoundary>
        <MockError />
      </ErrorBoundary>
    );

    const hasSpinner = Boolean(
      container.querySelector('[class="mt-5 ms-auto me-auto spinner-grow text-dark"]')
    );

    expect(hasSpinner).toBeTruthy();
  });

  it("test error boundary with a websocket based error", async () => {
    const updateActiveKeySpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<StateManager>("stateManager"),
      "updateActiveKey"
    );

    let lastActiveKey: string | undefined = undefined;
    const setActiveKey = (activeKey: string) => {
      lastActiveKey = activeKey;
    };

    const { getByText, rerender } = render(
      <MockContainer setActiveKey={setActiveKey}>
        <ErrorBoundary>
          <MockWebsocketError />
        </ErrorBoundary>
      </MockContainer>
    );

    await waitFor(() => {
      expect(getByText(/Invalid connection settings/i)).toBeInTheDocument();
    });

    fireEvent.click(getByText(/Ok/i));

    expect(updateActiveKeySpy).toHaveBeenCalledWith("settings");

    rerender(
      <MockContainer setActiveKey={setActiveKey}>
        <ErrorBoundary>
          <MockWebsocketError />
        </ErrorBoundary>
      </MockContainer>
    );

    expect(lastActiveKey).toEqual("settings");
  });
});
