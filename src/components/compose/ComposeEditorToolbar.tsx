import React, { useState } from "react";
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap/";
import { EditorState, RichUtils } from "draft-js";
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

interface IComposeEditorToolbarProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<EditorState>;
  saveEmail: () => void;
  deleteEmail: () => void;
}

export const ComposeEditorToolbar: React.FC<IComposeEditorToolbarProps> = ({
  editorState,
  setEditorState,
  saveEmail,
  deleteEmail
}) => {
  const linkButtonTarget: React.RefObject<HTMLButtonElement | null> =
    React.useRef<HTMLButtonElement>(null);

  const [showLinkOverlay, toggleLinkOverlay] = useState<boolean>(false);

  const toggleInlineStyle: (inlineStyle: string) => void = (inlineStyle) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  const toggleBlockType: (blockType: string) => void = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const checkBlockType: (blockType: string) => boolean = (blockType) => {
    if (
      editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getType() === blockType
    ) {
      return true;
    }

    return false;
  };

  const checkInlineStyle: (inlineStyle: string) => boolean = (inlineStyle) => {
    return editorState.getCurrentInlineStyle().has(inlineStyle);
  };

  const undoClick: () => void = () => {
    setEditorState(EditorState.undo(editorState));
  };

  const redoClick: () => void = () => {
    setEditorState(EditorState.redo(editorState));
  };

  return (
    <ButtonToolbar aria-label="" className="ps-2">
      <ButtonGroup size="sm" className="me-2 mt-2" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            toggleInlineStyle("BOLD");
          }}
          className={checkInlineStyle("BOLD") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faBold} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            toggleInlineStyle("ITALIC");
          }}
          className={checkInlineStyle("ITALIC") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faItalic} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            toggleInlineStyle("UNDERLINE");
          }}
          className={checkInlineStyle("UNDERLINE") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faUnderline} />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            toggleBlockType("text-start");
          }}
          className={checkBlockType("text-start") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faAlignLeft} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            toggleBlockType("text-center");
          }}
          className={checkBlockType("text-center") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faAlignCenter} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            toggleBlockType("text-end");
          }}
          className={checkBlockType("text-end") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faAlignRight} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            toggleBlockType("text-indent");
          }}
          className={checkBlockType("text-indent") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faIndent} />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            toggleBlockType("unordered-list-item");
          }}
          className={checkBlockType("unordered-list-item") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faList} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            toggleBlockType("ordered-list-item");
          }}
          className={checkBlockType("ordered-list-item") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faListOl} />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            (document.getElementById("attachmentInput") as HTMLElement).click();
          }}
        >
          <FontAwesomeIcon icon={faPaperclip} />
        </Button>
        <Button
          ref={linkButtonTarget}
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            toggleLinkOverlay(showLinkOverlay ? false : true);
          }}
        >
          <FontAwesomeIcon icon={faLink} />
        </Button>
        <ComposeEditorLinkOverlay
          showLinkOverlay={showLinkOverlay}
          toggleLinkOverlay={toggleLinkOverlay}
          overlayTarget={linkButtonTarget}
          setEditorState={setEditorState}
          editorState={editorState}
        />
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            undoClick();
          }}
        >
          <FontAwesomeIcon icon={faUndo} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            redoClick();
          }}
        >
          <FontAwesomeIcon icon={faRedo} />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2 d-block d-sm-none" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            saveEmail();
          }}
        >
          <FontAwesomeIcon icon={faSave} />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2 d-block d-sm-none" aria-label="">
        <Button
          variant="danger"
          type="button"
          onMouseDown={(event: React.SyntheticEvent) => {
            event.preventDefault();

            deleteEmail();
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
};
