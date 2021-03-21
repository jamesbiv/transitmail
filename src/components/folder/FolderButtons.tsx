import React from "react";
import { Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faFlag,
  faSuitcase,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export const FolderButtons: React.FC<{}> = () => {
  return (
    <div className="folder-sticky-top d-block d-sm-none">
      <Container fluid className="pt-2 pb-2 bg-white border-bottom">
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
          <FontAwesomeIcon icon={faFlag} />
        </Button>
        <Button
          onClick={undefined}
          size="sm"
          variant="danger"
          type="button"
          className="ml-2"
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </Container>
    </div>
  );
};
