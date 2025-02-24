import React, { ChangeEvent, FunctionComponent, RefObject, SyntheticEvent } from "react";
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

interface IComposeEditorLinkOverlayProps {
  showLinkOverlay?: boolean;
  overlayTarget: RefObject<HTMLButtonElement | undefined>;
}

export const ComposeEditorLinkOverlay: FunctionComponent<IComposeEditorLinkOverlayProps> = ({
  showLinkOverlay,
  overlayTarget
}) => {
  const updateLink: (url: string) => void = (url) => {};

  const removeLink: () => void = () => {};

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
                defaultValue=""
                onChange={(event: ChangeEvent<HTMLInputElement>) => event.preventDefault()}
              />
            </Col>
            <Col xs={4} className="text-nowrap">
              <Button
                size="sm"
                className="me-1"
                variant="outline-dark"
                type="button"
                onMouseDown={(event: SyntheticEvent) => {
                  event.preventDefault();

                  updateLink((document.getElementById("linkUrl") as HTMLInputElement).value);

                  //toggleLinkOverlay(false);
                }}
              >
                <FontAwesomeIcon icon={faPen} />
              </Button>
              <Button
                size="sm"
                variant="danger"
                type="button"
                onMouseDown={(event: SyntheticEvent) => {
                  event.preventDefault();

                  removeLink();
                  //toggleLinkOverlay(false);
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
