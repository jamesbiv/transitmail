import React, { FunctionComponent, RefObject, SyntheticEvent, useRef, useState } from "react";
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

interface IComposeEditorToolbarProps {}

export const ComposeEditorToolbar: FunctionComponent<IComposeEditorToolbarProps> = () => {
  const linkButtonTarget: RefObject<HTMLButtonElement | undefined> = useRef<
    HTMLButtonElement | undefined
  >(undefined);

  const [showLinkOverlay, toggleLinkOverlay] = useState<boolean>(false);

  const toggleInlineStyle: (inlineStyle: string) => void = (inlineStyle) => {};

  const toggleBlockType: (blockType: string) => void = (blockType) => {};

  const checkBlockType: (blockType: string) => boolean = (blockType) => {
    return false;
  };

  const checkInlineStyle: (inlineStyle: string) => boolean = (inlineStyle) => {
    return false;
  };

  const undoClick: () => void = () => {};

  const redoClick: () => void = () => {};

  return (
    <ButtonToolbar aria-label="" className="ps-2">
      <ButtonGroup size="sm" className="me-2 mt-2" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
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
          onMouseDown={(event: SyntheticEvent) => {
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
          onMouseDown={(event: SyntheticEvent) => {
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
          onMouseDown={(event: SyntheticEvent) => {
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
          onMouseDown={(event: SyntheticEvent) => {
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
          onMouseDown={(event: SyntheticEvent) => {
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
          onMouseDown={(event: SyntheticEvent) => {
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
          onMouseDown={(event: SyntheticEvent) => {
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
          onMouseDown={(event: SyntheticEvent) => {
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
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            (document.getElementById("attachmentInput") as HTMLElement).click();
          }}
        >
          <FontAwesomeIcon icon={faPaperclip} />
        </Button>
        <Button
          // ref={linkButtonTarget}
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            toggleLinkOverlay(showLinkOverlay ? false : true);
          }}
        >
          <FontAwesomeIcon icon={faLink} />
        </Button>
        <ComposeEditorLinkOverlay
          showLinkOverlay={showLinkOverlay}
          overlayTarget={linkButtonTarget}
          // toggleLinkOverlay={toggleLinkOverlay}
          // setEditorState={setEditorState}
          // editorState={editorState}
        />
      </ButtonGroup>
      <ButtonGroup size="sm" className="me-2 mt-2" aria-label="">
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
            event.preventDefault();

            undoClick();
          }}
        >
          <FontAwesomeIcon icon={faUndo} />
        </Button>
        <Button
          variant="outline-dark"
          type="button"
          onMouseDown={(event: SyntheticEvent) => {
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
