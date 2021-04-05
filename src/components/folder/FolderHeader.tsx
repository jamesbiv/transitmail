import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faFlag,
  faSuitcase,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export const FolderHeader: React.FC<{}> = () => {
  const selectedStub = [];

  return (
    <div
      className={`d-none ${selectedStub.length > 0 ? "d-sm-inline-block" : ""}`}
    >
      <Button
        onClick={undefined}
        size="sm"
        variant="primary"
        type="button"
        className="ml-2"
      >
        <FontAwesomeIcon icon={faCopy} />
      </Button>
      <Button
        onClick={undefined}
        size="sm"
        variant="primary"
        type="button"
        className="ml-2"
      >
        <FontAwesomeIcon icon={faSuitcase} />
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
    </div>
  );
};
