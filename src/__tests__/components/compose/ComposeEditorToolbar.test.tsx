import React from "react";

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ComposeEditorToolbar } from "components/compose";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import {
  CommandListener,
  CommandListenerPriority,
  CommandPayloadType,
  LexicalCommand,
  LexicalEditor,
  TextFormatType,
  UpdateListener
} from "lexical";
import { sleep } from "__tests__/fixtures";

describe("ComposeEditorToolbar Component", () => {
  const mockDispatchCommand = jest
    .fn()
    .mockImplementation((type: unknown, payload: CommandPayloadType<{}>) => true);

  beforeEach(() => {
    const mergeRegister: jest.SpyInstance = jest.spyOn(require("@lexical/utils"), "mergeRegister");
    mergeRegister.mockImplementation((...functions: [() => undefined]) => undefined);

    const isLinkNodeSpy: jest.SpyInstance = jest.spyOn(require("@lexical/link"), "$isLinkNode");
    isLinkNodeSpy.mockImplementation(() => true);

    const isListNodeSpy: jest.SpyInstance = jest.spyOn(require("@lexical/list"), "$isListNode");
    isListNodeSpy.mockImplementation(() => true);

    const insertListSpy: jest.SpyInstance = jest.spyOn(require("@lexical/list"), "$insertList");
    insertListSpy.mockImplementation(() => undefined);

    const useLexicalComposerContextSpy: jest.SpyInstance = jest.spyOn(
      require("@lexical/react/LexicalComposerContext"),
      "useLexicalComposerContext"
    );

    const mockDditorState = {
      editorState: {
        read: (callbackFn: () => void) => callbackFn()
      }
    } as never;

    useLexicalComposerContextSpy.mockImplementation(() => [
      {
        registerUpdateListener: (listener: UpdateListener) => listener(mockDditorState),
        registerCommand: (
          command: LexicalCommand<{}>,
          listener: CommandListener<{}>,
          priority: CommandListenerPriority
        ) => {
          listener({}, {} as LexicalEditor);
        },
        dispatchCommand: mockDispatchCommand
      }
    ]);

    const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
      require("@lexical/selection"),
      "$isAtNodeEnd"
    );

    isAtNodeEndSpy.mockImplementation(() => true);

    const isRangeSelectionSpy: jest.SpyInstance = jest.spyOn(
      require("lexical"),
      "$isRangeSelection"
    );

    isRangeSelectionSpy.mockImplementation(() => true);

    const isBlockElementNode: jest.SpyInstance = jest.spyOn(
      require("lexical"),
      "$isBlockElementNode"
    );

    isBlockElementNode.mockImplementation(() => true);

    const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

    const getParent = {
      getURL: () => "https://testUrl.com"
    };

    const getTopLevelElement = {
      getListType: () => "",
      getFormatType: () => "",
      getIndent: () => 0
    };

    const getTopLevelElementOrThrow = () => {};

    const mockFocusGetNode = {
      getParent: () => getParent,
      getTopLevelElement: () => getTopLevelElement,
      getTopLevelElementOrThrow: () => getTopLevelElementOrThrow
    };

    getSelectionSpy.mockImplementation(() => {
      return {
        anchor: { getNode: () => true },
        focus: { getNode: () => mockFocusGetNode },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => false,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("variations of getRangeSelectedNode() being called", () => {
    it("an unsuccesful response because topLevelNode was not found", () => {
      const isBlockElementNodeSpy: jest.SpyInstance = jest.spyOn(
        require("lexical"),
        "$isBlockElementNode"
      );

      isBlockElementNodeSpy.mockImplementation(() => false);

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => true);

      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getSelectionResponse = {
        anchor: { getNode: () => undefined },
        focus: { getNode: () => undefined },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => true,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };

      getSelectionSpy.mockImplementation(() => {
        return getSelectionResponse;
      });

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      expect(isBlockElementNodeSpy).toHaveBeenCalled();
    });

    it("an unsuccesful response because getParentNode was not found", () => {
      const isBlockElementNodeSpy: jest.SpyInstance = jest.spyOn(
        require("lexical"),
        "$isBlockElementNode"
      );

      isBlockElementNodeSpy.mockImplementation(() => true);

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => true);

      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getParent = undefined;

      const getTopLevelElement = {
        getListType: () => "",
        getFormatType: () => "",
        getIndent: () => 0
      };

      const getTopLevelElementOrThrow = () => {};

      const mockFocusGetNodeWithoutGetParent = {
        getParent: () => getParent,
        getTopLevelElement: () => getTopLevelElement,
        getTopLevelElementOrThrow: () => getTopLevelElementOrThrow
      };

      const getSelectionResponse = {
        anchor: { getNode: () => mockFocusGetNodeWithoutGetParent },
        focus: { getNode: () => undefined },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => true,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };

      getSelectionSpy.mockImplementation(() => getSelectionResponse);

      const isLinkNodeSpy: jest.SpyInstance = jest.spyOn(require("@lexical/link"), "$isLinkNode");
      isLinkNodeSpy.mockImplementation(() => false);

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      expect(isBlockElementNodeSpy).toHaveBeenCalled();
    });

    it("an unsuccessful response because $getSelection() failed", () => {
      const isRangeSelectionSpy: jest.SpyInstance = jest.spyOn(
        require("lexical"),
        "$isRangeSelection"
      );

      isRangeSelectionSpy.mockImplementation(() => false);

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => true);

      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      getSelectionSpy.mockImplementation(() => undefined);

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      expect(isRangeSelectionSpy).toHaveBeenCalled();
    });

    it("a successful response with $isBackward() true and $isAtNodeEndSpy() true", () => {
      const isBlockElementNodeSpy: jest.SpyInstance = jest.spyOn(
        require("lexical"),
        "$isBlockElementNode"
      );

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => true);

      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getParent = {
        getURL: () => "https://testUrl.com"
      };

      const getTopLevelElement = {
        getListType: () => "bullet",
        getFormatType: () => "left",
        getIndent: () => 0
      };

      const getTopLevelElementOrThrow = () => {};

      const mockFocusGetNode = {
        getParent: () => getParent,
        getTopLevelElement: () => getTopLevelElement,
        getTopLevelElementOrThrow: () => getTopLevelElementOrThrow
      };

      const getSelectionResponse = {
        anchor: { getNode: () => mockFocusGetNode },
        focus: { getNode: () => true },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => true,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };

      getSelectionSpy.mockImplementation(() => {
        return getSelectionResponse;
      });

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      expect(isBlockElementNodeSpy).toHaveBeenCalled();
    });

    it("a successful response with $isBackward() true and $isAtNodeEndSpy() false", async () => {
      const isBlockElementNodeSpy: jest.SpyInstance = jest.spyOn(
        require("lexical"),
        "$isBlockElementNode"
      );

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => false);

      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getParent = {
        getURL: () => "https://testUrl.com"
      };

      const getTopLevelElement = {
        getListType: () => "bullet",
        getFormatType: () => "left",
        getIndent: () => 0
      };

      const getTopLevelElementOrThrow = () => {};

      const mockFocusGetNode = {
        getParent: () => getParent,
        getTopLevelElement: () => getTopLevelElement,
        getTopLevelElementOrThrow: () => getTopLevelElementOrThrow
      };

      const getSelectionResponse = {
        anchor: { getNode: () => true },
        focus: { getNode: () => mockFocusGetNode },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => true,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };

      getSelectionSpy.mockImplementation(() => {
        return getSelectionResponse;
      });

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      expect(isBlockElementNodeSpy).toHaveBeenCalled();
    });

    it("a successful response with $isBackward() false and $isAtNodeEndSpy() true", async () => {
      const isBlockElementNodeSpy: jest.SpyInstance = jest.spyOn(
        require("lexical"),
        "$isBlockElementNode"
      );

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => true);

      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getParent = {
        getURL: () => "https://testUrl.com"
      };

      const getTopLevelElement = {
        getListType: () => "bullet",
        getFormatType: () => "left",
        getIndent: () => 0
      };

      const getTopLevelElementOrThrow = () => {};

      const mockFocusGetNode = {
        getParent: () => getParent,
        getTopLevelElement: () => getTopLevelElement,
        getTopLevelElementOrThrow: () => getTopLevelElementOrThrow
      };

      const getSelectionResponse = {
        anchor: { getNode: () => true },
        focus: { getNode: () => mockFocusGetNode },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => false,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };

      getSelectionSpy.mockImplementation(() => {
        return getSelectionResponse;
      });

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      expect(isBlockElementNodeSpy).toHaveBeenCalled();
    });

    it("a successful response with $isBackward() false and $isAtNodeEndSpy() false", async () => {
      const isBlockElementNodeSpy: jest.SpyInstance = jest.spyOn(
        require("lexical"),
        "$isBlockElementNode"
      );

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => false);

      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getParent = {
        getURL: () => "https://testUrl.com"
      };

      const getTopLevelElement = {
        getListType: () => "bullet",
        getFormatType: () => "left",
        getIndent: () => 0
      };

      const getTopLevelElementOrThrow = () => {};

      const mockFocusGetNode = {
        getParent: () => getParent,
        getTopLevelElement: () => getTopLevelElement,
        getTopLevelElementOrThrow: () => getTopLevelElementOrThrow
      };

      const getSelectionResponse = {
        anchor: { getNode: () => mockFocusGetNode },
        focus: { getNode: () => true },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => false,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };

      getSelectionSpy.mockImplementation(() => {
        return getSelectionResponse;
      });

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      expect(isBlockElementNodeSpy).toHaveBeenCalled();
    });
  });

  describe("on bold action", () => {
    it("a successful response", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const boldIcon = container.querySelector('[data-icon="bold"]')!;
      fireEvent.mouseDown(boldIcon);

      await sleep(100);

      fireEvent.mouseDown(boldIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith({ type: "FORMAT_TEXT_COMMAND" }, "bold");
    });
  });

  describe("on italic action", () => {
    it("a successful response", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const boldIcon = container.querySelector('[data-icon="italic"]')!;
      fireEvent.mouseDown(boldIcon);

      await sleep(100);

      fireEvent.mouseDown(boldIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith({ type: "FORMAT_TEXT_COMMAND" }, "italic");
    });
  });

  describe("on underline action", () => {
    it("a successful response", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const boldIcon = container.querySelector('[data-icon="underline"]')!;
      fireEvent.mouseDown(boldIcon);

      await sleep(100);

      fireEvent.mouseDown(boldIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith(
        { type: "FORMAT_TEXT_COMMAND" },
        "underline"
      );
    });
  });

  describe("on alignLeft action", () => {
    it("a successful response", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const alignLeftIcon = container.querySelector('[data-icon="align-left"]')!;
      fireEvent.mouseDown(alignLeftIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith({ type: "FORMAT_ELEMENT_COMMAND" }, "left");
    });

    it("a successful response disabling action", async () => {
      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getParent = {
        getURL: () => "https://testUrl.com"
      };

      const getTopLevelElement = {
        getListType: () => "bullet",
        getFormatType: () => "left",
        getIndent: () => 1
      };

      const getTopLevelElementOrThrow = () => {};

      const mockFocusGetNodeWithGetIndent = {
        getParent: () => getParent,
        getTopLevelElement: () => getTopLevelElement,
        getTopLevelElementOrThrow: () => getTopLevelElementOrThrow
      };

      const getSelectionResponse = {
        anchor: { getNode: () => mockFocusGetNodeWithGetIndent },
        focus: { getNode: () => true },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => false,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };

      getSelectionSpy.mockImplementation(() => {
        return getSelectionResponse;
      });

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => false);

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const alignCenterIcon = container.querySelector('[data-icon="align-left"]')!;
      fireEvent.mouseDown(alignCenterIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith({ type: "FORMAT_ELEMENT_COMMAND" }, "");
    });
  });

  describe("on alignCenter action", () => {
    it("a successful response disabling action", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const alignCenterIcon = container.querySelector('[data-icon="align-center"]')!;
      fireEvent.mouseDown(alignCenterIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith(
        { type: "FORMAT_ELEMENT_COMMAND" },
        "center"
      );
    });

    it("a successful response disabling action", async () => {
      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getParent = {
        getURL: () => "https://testUrl.com"
      };

      const getTopLevelElement = {
        getListType: () => "bullet",
        getFormatType: () => "center",
        getIndent: () => 1
      };

      const getTopLevelElementOrThrow = () => {};

      const mockFocusGetNodeWithGetIndent = {
        getParent: () => getParent,
        getTopLevelElement: () => getTopLevelElement,
        getTopLevelElementOrThrow: () => getTopLevelElementOrThrow
      };

      const getSelectionResponse = {
        anchor: { getNode: () => mockFocusGetNodeWithGetIndent },
        focus: { getNode: () => true },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => false,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };

      getSelectionSpy.mockImplementation(() => {
        return getSelectionResponse;
      });

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => false);

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const alignCenterIcon = container.querySelector('[data-icon="align-center"]')!;
      fireEvent.mouseDown(alignCenterIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith({ type: "FORMAT_ELEMENT_COMMAND" }, "");
    });
  });

  describe("on alignRight action", () => {
    it("a successful response enabling action", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const alignRightIcon = container.querySelector('[data-icon="align-right"]')!;
      fireEvent.mouseDown(alignRightIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith({ type: "FORMAT_ELEMENT_COMMAND" }, "right");
    });

    it("a successful response disabling action", async () => {
      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getParent = {
        getURL: () => "https://testUrl.com"
      };

      const getTopLevelElement = {
        getListType: () => "bullet",
        getFormatType: () => "right",
        getIndent: () => 1
      };

      const getTopLevelElementOrThrow = () => {};

      const mockFocusGetNodeWithGetIndent = {
        getParent: () => getParent,
        getTopLevelElement: () => getTopLevelElement,
        getTopLevelElementOrThrow: () => getTopLevelElementOrThrow
      };

      const getSelectionResponse = {
        anchor: { getNode: () => mockFocusGetNodeWithGetIndent },
        focus: { getNode: () => true },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => false,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };

      getSelectionSpy.mockImplementation(() => {
        return getSelectionResponse;
      });

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => false);

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const alignRightIcon = container.querySelector('[data-icon="align-right"]')!;
      fireEvent.mouseDown(alignRightIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith({ type: "FORMAT_ELEMENT_COMMAND" }, "");
    });
  });

  describe("on indent action", () => {
    it("a successful response", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const indentIcon = container.querySelector('[data-icon="indent"]')!;
      fireEvent.mouseDown(indentIcon);

      await sleep(100);

      fireEvent.mouseDown(indentIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith(
        { type: "INDENT_CONTENT_COMMAND" },
        undefined
      );
    });

    it("a successful response disabling action", async () => {
      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getParent = {
        getURL: () => "https://testUrl.com"
      };

      const getTopLevelElement = {
        getListType: () => "bullet",
        getFormatType: () => "left",
        getIndent: () => 1
      };

      const getTopLevelElementOrThrow = () => {};

      const mockFocusGetNodeWithGetIndent = {
        getParent: () => getParent,
        getTopLevelElement: () => getTopLevelElement,
        getTopLevelElementOrThrow: () => getTopLevelElementOrThrow
      };

      const getSelectionResponse = {
        anchor: { getNode: () => mockFocusGetNodeWithGetIndent },
        focus: { getNode: () => true },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => false,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };

      getSelectionSpy.mockImplementation(() => {
        return getSelectionResponse;
      });

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => false);

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const indentIcon = container.querySelector('[data-icon="indent"]')!;
      fireEvent.mouseDown(indentIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith({ type: "REMOVE_LIST_COMMAND" }, undefined);
    });
  });

  describe("on unordered list action", () => {
    it("a successful response enabling action", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const unorderedListIcon = container.querySelector('[data-icon="list"]')!;
      fireEvent.mouseDown(unorderedListIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith(
        { type: "INSERT_UNORDERED_LIST_COMMAND" },
        undefined
      );
    });

    it("a successful response disabling action", async () => {
      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getParent = {
        getURL: () => "https://testUrl.com"
      };

      const getTopLevelElement = {
        getListType: () => "bullet",
        getFormatType: () => "left",
        getIndent: () => 1
      };

      const getTopLevelElementOrThrow = () => {};

      const mockFocusGetNodeWithGetIndent = {
        getParent: () => getParent,
        getTopLevelElement: () => getTopLevelElement,
        getTopLevelElementOrThrow: () => getTopLevelElementOrThrow
      };

      const getSelectionResponse = {
        anchor: { getNode: () => mockFocusGetNodeWithGetIndent },
        focus: { getNode: () => true },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => false,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };

      getSelectionSpy.mockImplementation(() => {
        return getSelectionResponse;
      });

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => false);

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const unorderedListIcon = container.querySelector('[data-icon="list"]')!;
      fireEvent.mouseDown(unorderedListIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith({ type: "REMOVE_LIST_COMMAND" }, undefined);
    });
  });

  describe("on ordered list action", () => {
    it("a successful response enabling action", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const orderedListIcon = container.querySelector('[data-icon="list-ol"]')!;
      fireEvent.mouseDown(orderedListIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith(
        { type: "INSERT_ORDERED_LIST_COMMAND" },
        undefined
      );
    });

    it("a successful response disabling action", async () => {
      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getParent = {
        getURL: () => "https://testUrl.com"
      };

      const getTopLevelElement = {
        getListType: () => "number",
        getFormatType: () => "left",
        getIndent: () => 1
      };

      const getTopLevelElementOrThrow = () => {};

      const mockFocusGetNodeWithGetIndent = {
        getParent: () => getParent,
        getTopLevelElement: () => getTopLevelElement,
        getTopLevelElementOrThrow: () => getTopLevelElementOrThrow
      };

      const getSelectionResponse = {
        anchor: { getNode: () => mockFocusGetNodeWithGetIndent },
        focus: { getNode: () => true },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => false,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };

      getSelectionSpy.mockImplementation(() => {
        return getSelectionResponse;
      });

      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => false);

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const orderedListIcon = container.querySelector('[data-icon="list-ol"]')!;
      fireEvent.mouseDown(orderedListIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith({ type: "REMOVE_LIST_COMMAND" }, undefined);
    });
  });

  describe("on attachment action", () => {
    it("a successful response", async () => {
      const mockOnclickCallback = jest.fn().mockImplementation(() => undefined);
      const attachmentInput = document.createElement("div");

      attachmentInput.setAttribute("id", "attachmentInput");
      attachmentInput.addEventListener("click", mockOnclickCallback);

      document.body.appendChild(attachmentInput);

      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const boldIcon = container.querySelector('[data-icon="paperclip"]')!;
      fireEvent.mouseDown(boldIcon);

      expect(mockOnclickCallback).toHaveBeenCalled();
    });
  });

  describe("on link action", () => {
    it("a successful response", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const linkIcon = container.querySelector('[data-icon="link"]')!;
      fireEvent.mouseDown(linkIcon);

      const linkIconButton = linkIcon.parentElement;

      expect(linkIconButton).toHaveClass("active");
    });
  });

  describe("on undo action", () => {
    it("a successful response", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const arrowRotateLeftIcon = container.querySelector('[data-icon="arrow-rotate-left"]')!;
      fireEvent.mouseDown(arrowRotateLeftIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith({ type: "UNDO_COMMAND" }, undefined);
    });
  });

  describe("on redo action", () => {
    it("a successful response", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const arrowRotateRightIcon = container.querySelector('[data-icon="arrow-rotate-right"]')!;
      fireEvent.mouseDown(arrowRotateRightIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith({ type: "REDO_COMMAND" }, undefined);
    });
  });

  describe("on save action", () => {
    it("a successful response", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = jest.fn().mockImplementation(() => undefined);
      const clearComposer = () => undefined;

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const floppyDiskIcon = container.querySelector('[data-icon="floppy-disk"]')!;
      fireEvent.mouseDown(floppyDiskIcon);

      expect(saveEmail).toHaveBeenCalled();
    });
  });

  describe("on delete action", () => {
    it("a successful response", async () => {
      const initialConfig: InitialConfigType = {
        theme: {},
        namespace: "ComposeEditor",
        onError: (error: Error) => undefined
      };

      const saveEmail = () => undefined;
      const clearComposer = jest.fn().mockImplementation(() => undefined);

      const { container } = render(
        <LexicalComposer initialConfig={initialConfig}>
          <ComposeEditorToolbar saveEmail={saveEmail} clearComposer={clearComposer} />
        </LexicalComposer>
      );

      const trashIcon = container.querySelector('[data-icon="trash"]')!;
      fireEvent.mouseDown(trashIcon);

      expect(clearComposer).toHaveBeenCalled();
    });
  });
});
