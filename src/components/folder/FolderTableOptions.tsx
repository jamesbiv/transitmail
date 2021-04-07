import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faFlag,
  faSuitcase,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { EFolderEmailActionType } from ".";

interface FolderTableOptionsProps {
  toggleActionModal: (actionType: EFolderEmailActionType) => void;
}

export const FolderTableOptions: React.FC<FolderTableOptionsProps> = ({
  toggleActionModal,
}) => {
  return (
    <Row className="border-bottom pt-2 pb-2 folder-sticky-top bg-white">
      <Col className="pl-3 pr-0">
        <span>
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
          <FontAwesomeIcon icon={faFlag} /> Flag
        </Button>
        <Button
          size="sm"
          variant="danger"
          type="button"
          className="ml-2"
          onClick={() => toggleActionModal(EFolderEmailActionType.DELETE)}
        >
          <FontAwesomeIcon icon={faTrash} /> Delete
        </Button>
      </Col>
    </Row>
  );
};
