import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SecureStorage } from "classes";
import { contextSpyHelper } from "./fixtures";

jest.mock("components", () => {
  const originalModule = jest.requireActual("components");

  return {
    __esModule: true,
    ...originalModule,
    Folder: jest.fn(),
    Folders: jest.fn(),
    Compose: jest.fn(),
    Menu: jest.fn(),
    Inbox: jest.fn(),
    Settings: jest.fn(),
    View: jest.fn(),
    ErrorBoundary: jest.fn(),
    MessageModal: jest.fn(),
    Logout: jest.fn()
  };
});

describe("Index Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Ensure a successful render", async () => {
    const getImapSettingsSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<SecureStorage>("secureStorage"),
      "getImapSettings"
    );

    getImapSettingsSpy.mockImplementationOnce(() => {});

    const getSmtpSettingsSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<SecureStorage>("secureStorage"),
      "getSmtpSettings"
    );

    getSmtpSettingsSpy.mockImplementationOnce(() => {});

    const containerMain = document.createElement("div");
    containerMain.setAttribute("id", "root");

    document.body.appendChild(containerMain);

    const { Index } = require("index");

    const { getAllByText } = render(<Index />);

    expect(getAllByText(/transit/i)[0]).toBeInTheDocument();
  });

  it("Simulate popstate", async () => {
    const getImapSettingsSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<SecureStorage>("secureStorage"),
      "getImapSettings"
    );

    getImapSettingsSpy.mockImplementationOnce(() => {});

    const getSmtpSettingsSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<SecureStorage>("secureStorage"),
      "getSmtpSettings"
    );

    getSmtpSettingsSpy.mockImplementationOnce(() => {});

    const containerMain = document.createElement("div");
    containerMain.setAttribute("id", "root");

    document.body.appendChild(containerMain);

    const { Index } = require("index");

    render(<Index />);

    history.pushState({ state: true }, "", "#testHash");

    window.dispatchEvent(new PopStateEvent("popstate", { state: true }));
    expect(window.location.hash).toEqual("#testHash");

    history.pushState({ state: true }, "", "");

    window.dispatchEvent(new PopStateEvent("popstate", { state: true }));
    expect(window.location.hash).toEqual("");
  });

  it("Testing slider sliding in from top right menu header button", async () => {
    const getImapSettingsSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<SecureStorage>("secureStorage"),
      "getImapSettings"
    );

    getImapSettingsSpy.mockImplementationOnce(() => {});

    const getSmtpSettingsSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<SecureStorage>("secureStorage"),
      "getSmtpSettings"
    );

    getSmtpSettingsSpy.mockImplementationOnce(() => {});

    const containerMain = document.createElement("div");
    containerMain.setAttribute("id", "root");

    document.body.appendChild(containerMain);

    const { Index } = require("index");

    const { container } = render(<Index />);

    const barsIcon = container.querySelector('[data-icon="bars"]')!;
    fireEvent.click(barsIcon);

    const slideInStyle = container.querySelector(".slide-in")!;
    expect(slideInStyle).toBeInTheDocument();
  });

  it("Testing slider sliding in from finger swipe action", async () => {
    const getImapSettingsSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<SecureStorage>("secureStorage"),
      "getImapSettings"
    );

    getImapSettingsSpy.mockImplementationOnce(() => {});

    const getSmtpSettingsSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<SecureStorage>("secureStorage"),
      "getSmtpSettings"
    );

    getSmtpSettingsSpy.mockImplementationOnce(() => {});

    const rootContainer = document.createElement("div");
    rootContainer.setAttribute("id", "root");

    document.body.appendChild(rootContainer);

    const { Index } = require("index");

    const { container } = render(<Index />);

    const swipeableElement = container.querySelector("#container-main")!;

    fireEvent.touchStart(swipeableElement, { targetTouches: [{ screenX: 1, screenY: 0 }] });
    fireEvent.touchMove(swipeableElement, { targetTouches: [{ screenX: 200, screenY: 0 }] });
    fireEvent.touchEnd(swipeableElement, { targetTouches: [{ screenX: 200, screenY: 0 }] });

    const slideInStyle = container.querySelector(".slide-in")!;
    expect(slideInStyle).toBeInTheDocument();
  });

  it("Testing slider sliding out from finger swipe action", async () => {
    const getImapSettingsSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<SecureStorage>("secureStorage"),
      "getImapSettings"
    );

    getImapSettingsSpy.mockImplementationOnce(() => {});

    const getSmtpSettingsSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<SecureStorage>("secureStorage"),
      "getSmtpSettings"
    );

    getSmtpSettingsSpy.mockImplementationOnce(() => {});

    const rootContainer = document.createElement("div");
    rootContainer.setAttribute("id", "root");

    document.body.appendChild(rootContainer);

    const { Index } = require("index");

    const { container } = render(<Index />);

    const swipeableElement = container.querySelector("#container-main")!;

    fireEvent.touchStart(swipeableElement, { targetTouches: [{ screenX: 1, screenY: 0 }] });
    fireEvent.touchMove(swipeableElement, { targetTouches: [{ screenX: 200, screenY: 0 }] });
    fireEvent.touchEnd(swipeableElement, { targetTouches: [{ screenX: 200, screenY: 0 }] });

    const slideInStyle = container.querySelector(".slide-in")!;
    expect(slideInStyle).toBeInTheDocument();

    fireEvent.touchStart(swipeableElement, { targetTouches: [{ screenX: 200, screenY: 0 }] });
    fireEvent.touchMove(swipeableElement, { targetTouches: [{ screenX: 1, screenY: 0 }] });
    fireEvent.touchEnd(swipeableElement, { targetTouches: [{ screenX: 1, screenY: 0 }] });

    const slideOutStyle = container.querySelector(".slide-out")!;
    expect(slideOutStyle).toBeInTheDocument();
  });

  it("Testing slider failing because touchStart or touchEnd didnt register", async () => {
    const getImapSettingsSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<SecureStorage>("secureStorage"),
      "getImapSettings"
    );

    getImapSettingsSpy.mockImplementationOnce(() => {});

    const getSmtpSettingsSpy: jest.SpyInstance = jest.spyOn(
      contextSpyHelper<SecureStorage>("secureStorage"),
      "getSmtpSettings"
    );

    getSmtpSettingsSpy.mockImplementationOnce(() => {});

    const rootContainer = document.createElement("div");
    rootContainer.setAttribute("id", "root");

    document.body.appendChild(rootContainer);

    const { Index } = require("index");

    const { container } = render(<Index />);

    const swipeableElement = container.querySelector("#container-main")!;

    fireEvent.touchStart(swipeableElement, { targetTouches: [{ screenX: undefined, screenY: 0 }] });
    fireEvent.touchEnd(swipeableElement, { targetTouches: [{ screenX: undefined, screenY: 0 }] });

    const slideInStyle = container.querySelector(".slide-out")!;
    expect(slideInStyle).toBeInTheDocument();
  });
});
