import React from "react";
import { Row, Collapse, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faFlag,
  faSuitcase,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { EFolderEmailActionType } from ".";

interface FolderTableOptionsProps {
  displayTableOptions: boolean;
  toggleActionModal: (actionType: EFolderEmailActionType) => void;
}

export const FolderTableOptions: React.FC<FolderTableOptionsProps> = ({
  displayTableOptions,
  toggleActionModal,
}) => {
  return (
    <Collapse in={displayTableOptions}>
      <Row className="border-bottom pt-2 pb-2 folder-sticky-top bg-white">
        <Col className="pl-1 pl-md-3 pr-0">
          <span className="d-none d-md-inline-block">
            <em>Selection options</em>
          </span>
          <Button
            size="sm"
            variant="primary"
            type="button"
            className="ml-2"
            onClick={() => toggleActionModal(EFolderEmailActionType.COPY)}
          >
            <FontAwesomeIcon icon={faCopy} /> Copy
          </Button>
          <Button
            size="sm"
            variant="primary"
            type="button"
            className="ml-2"
            onClick={() => toggleActionModal(EFolderEmailActionType.MOVE)}
          >
            <FontAwesomeIcon icon={faSuitcase} /> Move
          </Button>
          <Button
            size="sm"
            variant="secondary"
            type="button"
            className="ml-2"
            onClick={() => toggleActionModal(EFolderEmailActionType.FLAG)}
          >
            <FontAwesomeIcon icon={faFlag} />{" "}
            <span className="d-none d-md-inline-block">Flag</span>
          </Button>
          <Button
            size="sm"
            variant="danger"
            type="button"
            className="ml-2"
            onClick={() => toggleActionModal(EFolderEmailActionType.DELETE)}
          >
            <FontAwesomeIcon icon={faTrash} />{" "}
            <span className="d-none d-md-inline-block">Delete</span>
          </Button>
        </Col>
      </Row>
    </Collapse>
  );
};
