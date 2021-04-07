import React, { ChangeEvent } from "react";
import { ContentState, EditorState, RichUtils, SelectionState } from "draft-js";
import { Button, Overlay, Popover, Form, Row, Col } from "react-bootstrap/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

interface IComposeEditorLinkOverlayProps {
  editorState: EditorState;
  showLinkOverlay: boolean;
  overlayTarget: React.RefObject<HTMLButtonElement>;
  toggleLinkOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  updateEditorState: (arg0: EditorState) => void;
}

export const ComposeEditorLinkOverlay: React.FC<IComposeEditorLinkOverlayProps> = ({
  editorState,
  showLinkOverlay,
  overlayTarget,
  toggleLinkOverlay,
  updateEditorState,
}) => {
  const updateLink: (url: string) => void = (url) => {
    const contentState: ContentState = editorState.getCurrentContent();
    const contentStateWithEntity: ContentState = contentState.createEntity(
      "LINK",
      "MUTABLE",
      { url }
    );
    const entityKey: string = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState: EditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    updateEditorState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
  };

  const removeLink: () => void = () => {
    const selection: SelectionState = editorState.getSelection();

    if (!selection.isCollapsed()) {
      updateEditorState(RichUtils.toggleLink(editorState, selection, null));
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
        <Popover.Title as="h4">Add Hyperlink</Popover.Title>
        <Popover.Content>
          <Row>
            <Col xs={8} className="pr-0">
              <Form.Control
                id="linkUrl"
                size="sm"
                type="text"
                placeholder="Link address"
                defaultValue=""
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  event.preventDefault()
                }
              />
            </Col>
            <Col xs={4} className="text-nowrap">
              <Button
                size="sm"
                className="mr-1"
                variant="outline-dark"
                type="button"
                onMouseDown={(event: React.SyntheticEvent) => {
                  event.preventDefault();

                  updateLink(
                    (document.getElementById("linkUrl") as HTMLInputElement)
                      .value
                  );

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
        </Popover.Content>
      </Popover>
    </Overlay>
  );
};
