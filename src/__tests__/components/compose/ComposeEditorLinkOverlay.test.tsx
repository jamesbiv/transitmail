import React, { RefObject } from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComposeEditorLinkOverlay } from "components/compose";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalNode } from "lexical";

jest.mock("lexical", () => {
  const originalModule = jest.requireActual("lexical");

  return {
    __esModule: true,
    ...originalModule,
    $isRangeSelection: () => true,
    $isBlockElementNode: () => true,
    $getSelection: () => {
      return {
        extract: () => [{ node: undefined }]
      };
    }
  };
});

jest.mock("@lexical/utils", () => {
  const originalModule = jest.requireActual("@lexical/utils");

  return {
    __esModule: true,
    ...originalModule,
    $findMatchingParent: (startingNode: LexicalNode, findFn: (node: LexicalNode) => boolean) => {
      findFn({} as LexicalNode);

      return {
        getChildren: () => [{ childNode: undefined }],
        insertBefore: () => undefined,
        remove: () => undefined
      };
    }
  };
});

describe("ComposeEditorLinkOverlay Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("testing updateLink()", () => {
    it("a successful response", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const linkUrl: string = "https://www.originalTestUrl.com";
      const showLinkOverlay: boolean = true;

      const overlayTarget = { current: undefined } as RefObject<undefined>;

      const setShowLinkOverlay = jest.fn().mockImplementationOnce((value: boolean) => true);

      const { getByTestId, getByPlaceholderText } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorLinkOverlay
            linkUrl={linkUrl}
            showLinkOverlay={showLinkOverlay}
            overlayTarget={overlayTarget}
            setShowLinkOverlay={setShowLinkOverlay}
          />
        </LexicalComposer>
      );

      fireEvent.change(getByPlaceholderText(/Link address/i), {
        target: { value: "https://www.newTestUrl.com" }
      });

      fireEvent.mouseDown(getByTestId("updateLink"));

      expect(setShowLinkOverlay).toHaveBeenCalledWith(false);
    });

    it("an unsuccessful response because the selection was invalid", async () => {
      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");
      getSelectionSpy.mockImplementation(() => undefined);

      const rangeSelectSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$isRangeSelection");
      rangeSelectSpy.mockImplementationOnce(() => undefined);

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const linkUrl: string = "https://www.originalTestUrl.com";
      const showLinkOverlay: boolean = true;

      const overlayTarget = { current: undefined } as RefObject<undefined>;

      const setShowLinkOverlay = jest.fn().mockImplementationOnce((value: boolean) => true);

      const { getByTestId, getByPlaceholderText } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorLinkOverlay
            linkUrl={linkUrl}
            showLinkOverlay={showLinkOverlay}
            overlayTarget={overlayTarget}
            setShowLinkOverlay={setShowLinkOverlay}
          />
        </LexicalComposer>
      );

      fireEvent.change(getByPlaceholderText(/Link address/i), {
        target: { value: "https://www.newTestUrl.com" }
      });

      fireEvent.mouseDown(getByTestId("updateLink"));

      expect(setShowLinkOverlay).toHaveBeenCalledWith(false);
    });
  });

  describe("testing removeLink()", () => {
    it("a successful response", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const linkUrl: string = "https://www.originalTestUrl.com";
      const showLinkOverlay: boolean = true;

      const overlayTarget = { current: undefined } as RefObject<undefined>;

      const setShowLinkOverlay = jest.fn().mockImplementationOnce((value: boolean) => true);

      const { getByTestId } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorLinkOverlay
            linkUrl={linkUrl}
            showLinkOverlay={showLinkOverlay}
            overlayTarget={overlayTarget}
            setShowLinkOverlay={setShowLinkOverlay}
          />
        </LexicalComposer>
      );

      fireEvent.mouseDown(getByTestId("removeLink"));

      expect(setShowLinkOverlay).toHaveBeenCalledWith(false);
    });

    it("an unsuccessful response because the selection was invalid", async () => {
      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");
      getSelectionSpy.mockImplementation(() => undefined);

      const rangeSelectSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$isRangeSelection");
      rangeSelectSpy.mockImplementationOnce(() => undefined);

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const linkUrl: string = "https://www.originalTestUrl.com";
      const showLinkOverlay: boolean = true;

      const overlayTarget = { current: undefined } as RefObject<undefined>;

      const setShowLinkOverlay = jest.fn().mockImplementationOnce((value: boolean) => true);

      const { getByTestId } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorLinkOverlay
            linkUrl={linkUrl}
            showLinkOverlay={showLinkOverlay}
            overlayTarget={overlayTarget}
            setShowLinkOverlay={setShowLinkOverlay}
          />
        </LexicalComposer>
      );

      fireEvent.mouseDown(getByTestId("removeLink"));

      expect(setShowLinkOverlay).toHaveBeenCalledWith(false);
    });

    it("an unsuccessful response because node links were invalid", async () => {
      const findMatchingParentSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/utils"),
        "$findMatchingParent"
      );

      findMatchingParentSpy.mockImplementationOnce(() => undefined);

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const linkUrl: string = "https://www.originalTestUrl.com";
      const showLinkOverlay: boolean = true;

      const overlayTarget = { current: undefined } as RefObject<undefined>;

      const setShowLinkOverlay = jest.fn().mockImplementationOnce((value: boolean) => true);

      const { getByTestId } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorLinkOverlay
            linkUrl={linkUrl}
            showLinkOverlay={showLinkOverlay}
            overlayTarget={overlayTarget}
            setShowLinkOverlay={setShowLinkOverlay}
          />
        </LexicalComposer>
      );

      fireEvent.mouseDown(getByTestId("removeLink"));

      expect(setShowLinkOverlay).toHaveBeenCalledWith(false);
    });
  });
});
