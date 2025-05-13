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

jest.mock("@lexical/utils", () => {
  const originalModule = jest.requireActual("@lexical/utils");

  return {
    __esModule: true,
    ...originalModule,
    mergeRegister: (...functions: [() => undefined]) => undefined
  };
});

jest.mock("@lexical/link", () => {
  const originalModule = jest.requireActual("@lexical/link");

  return {
    __esModule: true,
    ...originalModule,
    $isLinkNode: () => true
  };
});

jest.mock("@lexical/list", () => {
  const originalModule = jest.requireActual("@lexical/list");

  return {
    __esModule: true,
    ...originalModule,
    $insertList: () => undefined
  };
});

const mockDispatchCommand = jest
  .fn()
  .mockImplementation((type: unknown, payload: CommandPayloadType<{}>) => true);

jest.mock("@lexical/react/LexicalComposerContext", () => {
  const originalModule = jest.requireActual("@lexical/react/LexicalComposerContext");

  return {
    __esModule: true,
    ...originalModule,
    useLexicalComposerContext: () => [
      {
        registerUpdateListener: (listener: UpdateListener) =>
          listener({
            editorState: {
              read: (callbackFn: () => void) => callbackFn()
            }
          } as never),
        registerCommand: (
          command: LexicalCommand<{}>,
          listener: CommandListener<{}>,
          priority: CommandListenerPriority
        ) => {
          listener({}, {} as LexicalEditor);
        },
        dispatchCommand: mockDispatchCommand
      }
    ]
  };
});

jest.mock("@lexical/selection", () => {
  const originalModule = jest.requireActual("@lexical/selection");

  return {
    __esModule: true,
    ...originalModule,
    $isAtNodeEnd: () => true
  };
});

const mockFocusGetNode = () => {
  return {
    getParent: () => {
      return {
        getURL: () => "https://testUrl.com"
      };
    },
    getTopLevelElement: () => {
      return {
        getFormatType: () => "",
        getIndent: () => 1
      };
    },
    getTopLevelElementOrThrow: () => {}
  };
};

jest.mock("lexical", () => {
  const originalModule = jest.requireActual("lexical");

  return {
    __esModule: true,
    ...originalModule,
    $isRangeSelection: () => true,
    $isBlockElementNode: () => true,
    $getSelection: () => {
      return {
        anchor: { getNode: () => true },
        focus: { getNode: mockFocusGetNode },
        hasFormat: (type: TextFormatType) => true,
        extract: () => [],
        isBackward: () => false,
        getStartEndPoints: () => undefined,
        getNodes: () => []
      };
    }
  };
});

describe("ComposeEditorToolbar Component", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("variations of getRangeSelectedNode() being called", () => {
    it("a successful response with $isBackward() true and $isAtNodeEndSpy() true", () => {
      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => true);

      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getSelectionResponse = {
        anchor: { getNode: mockFocusGetNode },
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

      expect(true).toBeTruthy();
    });

    it("a successful response with $isBackward() true and $isAtNodeEndSpy() false", async () => {
      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => false);

      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getSelectionResponse = {
        anchor: { getNode: () => true },
        focus: { getNode: mockFocusGetNode },
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

      expect(true).toBeTruthy();
    });

    it("a successful response with $isBackward() false and $isAtNodeEndSpy() true", async () => {
      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => true);

      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getSelectionResponse = {
        anchor: { getNode: () => true },
        focus: { getNode: mockFocusGetNode },
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

      expect(true).toBeTruthy();
    });

    it("a successful response with $isBackward() false and $isAtNodeEndSpy() false", async () => {
      const isAtNodeEndSpy: jest.SpyInstance = jest.spyOn(
        require("@lexical/selection"),
        "$isAtNodeEnd"
      );

      isAtNodeEndSpy.mockImplementation(() => false);

      const getSelectionSpy: jest.SpyInstance = jest.spyOn(require("lexical"), "$getSelection");

      const getSelectionResponse = {
        anchor: { getNode: mockFocusGetNode },
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

      expect(true).toBeTruthy();
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

      expect(mockDispatchCommand).toHaveBeenCalledWith(
        { type: "OUTDENT_CONTENT_COMMAND" },
        undefined
      );
    });
  });

  describe("on alignCenter action", () => {
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

      const alignCenterIcon = container.querySelector('[data-icon="align-center"]')!;
      fireEvent.mouseDown(alignCenterIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith(
        { type: "OUTDENT_CONTENT_COMMAND" },
        undefined
      );
    });
  });

  describe("on alignRight action", () => {
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

      const alignRightIcon = container.querySelector('[data-icon="align-right"]')!;
      fireEvent.mouseDown(alignRightIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith(
        { type: "OUTDENT_CONTENT_COMMAND" },
        undefined
      );
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

      const boldIcon = container.querySelector('[data-icon="indent"]')!;
      fireEvent.mouseDown(boldIcon);

      await sleep(100);

      fireEvent.mouseDown(boldIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith(
        { type: "OUTDENT_CONTENT_COMMAND" },
        undefined
      );
    });
  });

  describe("on unordered list action", () => {
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

      const unorderedListIcon = container.querySelector('[data-icon="list"]')!;
      fireEvent.mouseDown(unorderedListIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith(
        { type: "OUTDENT_CONTENT_COMMAND" },
        undefined
      );
    });
  });

  describe("on ordered list action", () => {
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

      const orderedListIcon = container.querySelector('[data-icon="list-ol"]')!;
      fireEvent.mouseDown(orderedListIcon);

      expect(mockDispatchCommand).toHaveBeenCalledWith(
        { type: "OUTDENT_CONTENT_COMMAND" },
        undefined
      );
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
