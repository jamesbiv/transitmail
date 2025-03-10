import React from "react";
import { ContentState, EditorState, RichUtils, SelectionState } from "draft-js";
import {
  Button,
  Overlay,
  Popover,
  Form,
  Row,
  Col,
  PopoverBody,
  PopoverHeader,
  FormControl
} from "react-bootstrap/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

interface IComposeEditorLinkOverlayProps {
  editorState: EditorState;
  showLinkOverlay: boolean;
  overlayTarget: React.RefObject<HTMLButtonElement | null>;
  toggleLinkOverlay: React.Dispatch<boolean>;
  setEditorState: React.Dispatch<EditorState>;
}

export const ComposeEditorLinkOverlay: React.FC<IComposeEditorLinkOverlayProps> = ({
  editorState,
  showLinkOverlay,
  overlayTarget,
  toggleLinkOverlay,
  setEditorState
}) => {
  const updateLink: (url: string) => void = (url) => {
    const contentState: ContentState = editorState.getCurrentContent();
    const contentStateWithEntity: ContentState = contentState.createEntity("LINK", "MUTABLE", {
      url
    });
    const entityKey: string = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState: EditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    setEditorState(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey));
  };

  const removeLink: () => void = () => {
    const selection: SelectionState = editorState.getSelection();

    if (!selection.isCollapsed()) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
    }
  };

  return (
    <Overlay
      target={overlayTarget.current}
      show={showLinkOverlay}
      placement="bottom"
      transition={false}
    >
      <Popover id="addHyperlink" className="w-auto">
        <PopoverHeader as="h4">Add Hyperlink</PopoverHeader>
        <PopoverBody>
          <Row>
            <Col xs={8} className="pe-0">
              <FormControl
                id="linkUrl"
                size="sm"
                type="text"
                placeholder="Link address"
                defaultValue=""
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => event.preventDefault()}
              />
            </Col>
            <Col xs={4} className="text-nowrap">
              <Button
                size="sm"
                className="me-1"
                variant="outline-dark"
                type="button"
                onMouseDown={(event: React.SyntheticEvent) => {
                  event.preventDefault();

                  updateLink((document.getElementById("linkUrl") as HTMLInputElement).value);

                  toggleLinkOverlay(false);
                }}
              >
                <FontAwesomeIcon icon={faPen} />
              </Button>
              <Button
                size="sm"
                variant="danger"
                type="button"
                onMouseDown={(event: React.SyntheticEvent) => {
                  event.preventDefault();

                  removeLink();
                  toggleLinkOverlay(false);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Col>
          </Row>
        </PopoverBody>
      </Popover>
    </Overlay>
  );
};
