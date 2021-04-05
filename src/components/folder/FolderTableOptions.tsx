import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faFlag,
  faSuitcase,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export const FolderTableOptions: React.FC<{}> = () => {
  return (
    <Row className="border-bottom pt-2 pb-2 folder-sticky-top bg-white">
      <Col className="pl-3 pr-0">
        <span><em>Selection options</em></span>
        <Button
          onClick={undefined}
          size="sm"
          variant="primary"
          type="button"
          className="ml-2"
        >
          <FontAwesomeIcon icon={faCopy} /> Copy
        </Button>
        <Button
          onClick={undefined}
          size="sm"
          variant="primary"
          type="button"
          className="ml-2"
        >
          <FontAwesomeIcon icon={faSuitcase} /> Move
        </Button>
        <Button
          onClick={undefined}
          size="sm"
          variant="secondary"
          type="button"
          className="ml-2"
        >
          <FontAwesomeIcon icon={faFlag} /> Flag
        </Button>
        <Button
          onClick={undefined}
          size="sm"
          variant="danger"
          type="button"
          className="ml-2"
        >
          <FontAwesomeIcon icon={faTrash} /> Delete
        </Button>
      </Col>
    </Row>
  );
};
