import React, { ChangeEvent, Dispatch, FunctionComponent, RefObject, SyntheticEvent } from "react";
import {
  Button,
  Overlay,
  Popover,
  Row,
  Col,
  PopoverBody,
  PopoverHeader,
  FormControl
} from "react-bootstrap/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isLinkNode, $toggleLink } from "@lexical/link";
import { $getSelection, $isRangeSelection, BaseSelection, LexicalNode } from "lexical";
import { $findMatchingParent } from "@lexical/utils";

/**
 * @interface IComposeEditorLinkOverlayProps
 */
interface IComposeEditorLinkOverlayProps {
  linkUrl: string | undefined;
  showLinkOverlay: boolean;
  overlayTarget: RefObject<HTMLButtonElement | undefined>;
  setShowLinkOverlay: Dispatch<boolean>;
}

/**
 * ComposeEditorLinkOverlay
 * @param {IComposeEditorLinkOverlayProps} properties
 * @returns {ReactNode}
 */
export const ComposeEditorLinkOverlay: FunctionComponent<IComposeEditorLinkOverlayProps> = ({
  linkUrl,
  showLinkOverlay,
  overlayTarget,
  setShowLinkOverlay
}) => {
  const [editor] = useLexicalComposerContext();

  const updateLink: (url: string) => void = (url) => {
    editor.update(() => {
      const selection: BaseSelection | undefined = $getSelection() ?? undefined;

      if (!$isRangeSelection(selection)) {
        return;
      }

      $toggleLink(url);
    });
  };

  const removeLink: () => void = () => {
    editor.update(() => {
      const selection: BaseSelection | undefined = $getSelection() ?? undefined;

      if (!$isRangeSelection(selection)) {
        return;
      }

      const nodesWithSelection: LexicalNode[] = selection.extract();

      flushNodeDataFromSelection(nodesWithSelection);
    });
  };

  const flushNodeDataFromSelection = (nodesWithSelection: LexicalNode[]) =>
    nodesWithSelection.forEach((selectedNode: LexicalNode) => {
      const parentLink = $findMatchingParent(selectedNode, (parentNode) => $isLinkNode(parentNode));

      if (!parentLink) {
        return;
      }

      const childrenNodes: LexicalNode[] = parentLink.getChildren();
      childrenNodes.forEach((childNode) => parentLink.insertBefore(childNode));

      parentLink.remove();
    });

  return (
    <Overlay
      target={overlayTarget.current!}
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
                defaultValue={linkUrl}
                onChange={(event: ChangeEvent<HTMLInputElement>) => event.preventDefault()}
              />
            </Col>
            <Col xs={4} className="text-nowrap">
              <Button
                data-testid="updateLink"
                size="sm"
                className="me-1"
                variant="outline-dark"
                type="button"
                onMouseDown={(event: SyntheticEvent) => {
                  event.preventDefault();

                  const linkUrlFromElement: string = (
                    document.getElementById("linkUrl") as HTMLInputElement
                  ).value;

                  updateLink(linkUrlFromElement);

                  setShowLinkOverlay(false);
                }}
              >
                <FontAwesomeIcon icon={faPen} />
              </Button>
              <Button
                data-testid="removeLink"
                size="sm"
                variant="danger"
                type="button"
                onMouseDown={(event: SyntheticEvent) => {
                  event.preventDefault();

                  removeLink();

                  setShowLinkOverlay(false);
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
