import React, { FunctionComponent } from "react";
import { Row, Collapse, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faFlag, faSuitcase, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { EFolderEmailActionType } from ".";

/**
 * @interface FolderTableOptionsProps
 */
interface FolderTableOptionsProps {
  displayTableOptions: boolean;
  toggleSelection: (uid: number, forceToogle?: boolean) => void;
  toggleActionModal: (actionType: EFolderEmailActionType) => void;
}

/**
 * FolderTableOptions
 * @param {FolderTableOptionsProps} properties
 * @returns {ReactNode}
 */
export const FolderTableOptions: FunctionComponent<FolderTableOptionsProps> = ({
  displayTableOptions,
  toggleSelection,
  toggleActionModal
}) => {
  return (
    <Collapse in={displayTableOptions} timeout={100}>
      <Row className="border-bottom g-0 ps-1 pe-1 pt-2 pb-2 folder-sticky-top bg-white">
        <Col className="ps-md-1">
          <span className="d-none d-md-inline-block">
            <em>Selection options</em>
          </span>
          <Button
            size="sm"
            variant="primary"
            type="button"
            className="ms-2"
            onClick={() => toggleActionModal(EFolderEmailActionType.COPY)}
          >
            <FontAwesomeIcon icon={faCopy} /> Copy
          </Button>
          <Button
            size="sm"
            variant="primary"
            type="button"
            className="ms-2"
            onClick={() => toggleActionModal(EFolderEmailActionType.MOVE)}
          >
            <FontAwesomeIcon icon={faSuitcase} /> Move
          </Button>
          <Button
            size="sm"
            variant="secondary"
            type="button"
            className="ms-2"
            onClick={() => toggleActionModal(EFolderEmailActionType.FLAG)}
          >
            <FontAwesomeIcon icon={faFlag} /> <span className="d-none d-md-inline-block">Flag</span>
          </Button>
          <Button
            size="sm"
            variant="danger"
            type="button"
            className="ms-2"
            onClick={() => toggleActionModal(EFolderEmailActionType.DELETE)}
          >
            <FontAwesomeIcon icon={faTrash} />{" "}
            <span className="d-none d-md-inline-block">Delete</span>
          </Button>
          <Button
            size="sm"
            variant="outline-dark"
            type="button"
            className="ms-2"
            onClick={() => toggleSelection(-1, false)}
          >
            <FontAwesomeIcon icon={faTimes} />{" "}
            <span className="d-none d-md-inline-block">Clear</span>
          </Button>
        </Col>
      </Row>
    </Collapse>
  );
};
