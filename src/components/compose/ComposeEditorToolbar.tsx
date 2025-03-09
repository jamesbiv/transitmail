import React, {
  FunctionComponent,
  RefObject,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTrash,
  faBold,
  faItalic,
  faUnderline,
  faIndent,
  faList,
  faListOl,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faLink,
  faPaperclip,
  faUndo,
  faRedo
} from "@fortawesome/free-solid-svg-icons";
import { ComposeEditorLinkOverlay } from ".";
import {
  $getSelection,
  $isBlockElementNode,
  $isRangeSelection,
  BaseSelection,
  ElementNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  PointType,
  RangeSelection,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextNode,
  UNDO_COMMAND
} from "lexical";
import { $isAtNodeEnd } from "@lexical/selection";
import {
  $insertList,
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND
} from "@lexical/list";
import { $isLinkNode } from "@lexical/link";
import { mergeRegister } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

/**
 * getRangeSelectedNode
 * @param {RangeSelection} selection
 * @returns TextNode | ElementNode
 */
const getRangeSelectedNode = (selection: RangeSelection): TextNode | ElementNode => {
  const anchor: PointType = selection.anchor;
  const focus: PointType = selection.focus;

  const anchorNode: TextNode | ElementNode = selection.anchor.getNode();
  const focusNode: TextNode | ElementNode = selection.focus.getNode();

  if (anchorNode === focusNode) {
    return anchorNode;
  }

  const isBackward: boolean = selection.isBackward();

  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  }

  return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
};

/**
 * ComposeEditorToolbar
 * @returns FunctionComponent
 */
export const ComposeEditorToolbar: FunctionComponent = () => {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);

  const [isLeftJustified, setIsLeftJustified] = useState<boolean>(false);
  const [isCenterAligned, setIsCenterAligned] = useState<boolean>(false);
  const [isRightJustified, setIsRightJustified] = useState<boolean>(false);
  const [isIndent, setIsIndent] = useState<boolean>(false);

  const [isUnorderedList, setIsUnorderedList] = useState<boolean>(false);
  const [isOrderedList, setIsOrderedList] = useState<boolean>(false);

  const [linkUrl, setLinkUrl] = useState<string | undefined>(undefined);

  const linkButtonTarget: RefObject<HTMLButtonElement | undefined> = useRef<
    HTMLButtonElement | undefined
  >(undefined);

  const [showLinkOverlay, toggleLinkOverlay] = useState<boolean>(false);

  const updateToolbar = useCallback(() => {
    const selection: BaseSelection | undefined = $getSelection() ?? undefined;

    if (!$isRangeSelection(selection)) {
      return;
    }

    const topLevelNode: ElementNode | undefined =
      getRangeSelectedNode(selection).getTopLevelElement() ?? undefined;

    setIsBold(selection.hasFormat("bold"));
    setIsItalic(selection.hasFormat("italic"));
    setIsUnderline(selection.hasFormat("underline"));

    if ($isBlockElementNode(topLevelNode)) {
      setIsLeftJustified(topLevelNode.getFormatType() === "left");
      setIsCenterAligned(topLevelNode.getFormatType() === "center");
      setIsRightJustified(topLevelNode.getFormatType() === "right");
      setIsIndent(topLevelNode.getIndent() > 0);
    } else {
      setIsLeftJustified(false);
      setIsCenterAligned(false);
      setIsRightJustified(false);
      setIsIndent(false);
    }

    if ($isListNode(topLevelNode)) {
      setIsUnorderedList(topLevelNode.getListType() === "bullet");
      setIsOrderedList(topLevelNode.getListType() === "number");
    } else {
      setIsUnorderedList(false);
      setIsOrderedList(false);
    }

    const getParentNode: ElementNode | undefined =
      getRangeSelectedNode(selection).getParent() ?? undefined;

    if ($isLinkNode(getParentNode)) {
      setLinkUrl(getParentNode.getURL());
    } else {
      setLinkUrl(undefined);
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();

          return false;
        },
        1
      ),
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          $insertList("bullet");

          return true;
        },
        1
      ),
      editor.registerCommand(
        INSERT_ORDERED_LIST_COMMAND,
        () => {
          $insertList("number");

          return true;
        },
        1
      )
    );
  }, [editor, updateToolbar]);

  return (
    <ButtonToolbar aria-label="" className="">
      <ButtonGroup size="sm" className="me-2 mt-2" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
          className={isBold ? "active" : ""}
        >
          <FontAwesomeIcon icon={faBold} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
          className={isItalic ? "active" : ""}
        >
          <FontAwesomeIcon icon={faItalic} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          }}
          className={isUnderline ? "active" : ""}
        >
          <FontAwesomeIcon icon={faUnderline} />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            !isLeftJustified
              ? editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
              : editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "");
          }}
          className={isLeftJustified ? "active" : ""}
        >
          <FontAwesomeIcon icon={faAlignLeft} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            !isCenterAligned
              ? editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
              : editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "");
          }}
          className={isCenterAligned ? "active" : ""}
        >
          <FontAwesomeIcon icon={faAlignCenter} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            !isRightJustified
              ? editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
              : editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "");
          }}
          className={isRightJustified ? "active" : ""}
        >
          <FontAwesomeIcon icon={faAlignRight} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            !isIndent
              ? editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
              : editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
          }}
          className={isIndent ? "active" : ""}
        >
          <FontAwesomeIcon icon={faIndent} />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            !isUnorderedList
              ? editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
              : editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }}
          className={isUnorderedList ? "active" : ""}
        >
          <FontAwesomeIcon icon={faList} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            !isOrderedList
              ? editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
              : editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          }}
          className={isOrderedList ? "active" : ""}
        >
          <FontAwesomeIcon icon={faListOl} />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            (document.getElementById("attachmentInput") as HTMLElement).click();
          }}
        >
          <FontAwesomeIcon icon={faPaperclip} />
        </Button>
        <Button
          ref={linkButtonTarget as RefObject<HTMLButtonElement>}
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            toggleLinkOverlay(showLinkOverlay ? false : true);
          }}
          className={linkUrl ? "active" : ""}
        >
          <FontAwesomeIcon icon={faLink} />
        </Button>
        <ComposeEditorLinkOverlay
          linkUrl={linkUrl}
          showLinkOverlay={showLinkOverlay}
          overlayTarget={linkButtonTarget}
          toggleLinkOverlay={toggleLinkOverlay}
        />
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
        >
          <FontAwesomeIcon icon={faUndo} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
        >
          <FontAwesomeIcon icon={faRedo} />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2 d-block d-sm-none" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            // saveEmail();
          }}
        >
          <FontAwesomeIcon icon={faSave} />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2 d-block d-sm-none" aria-label="">
        <Button
          variant="danger"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            // deleteEmail();
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
};
