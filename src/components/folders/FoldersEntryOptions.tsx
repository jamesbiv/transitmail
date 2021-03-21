import React from "react";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faSlidersH,
  faSuitcase,
  faTrash,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { EFolderEntryActionType } from ".";

interface IFoldersEntryOptionsProps {
  toggleActionModal: any;
}

export const FoldersEntryOptions: React.FC<IFoldersEntryOptionsProps> = ({
  toggleActionModal,
}) => {
  return (
    <Dropdown
      className="d-inline-block ml-2"
      onClick={(event: React.SyntheticEvent) => event.stopPropagation()}
    >
      <Dropdown.Toggle size="sm" variant="outline-dark" id="dropdown-folder">
        <FontAwesomeIcon icon={faSlidersH} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => toggleActionModal(EFolderEntryActionType.COPY)}>
          <FontAwesomeIcon icon={faCopy} size="sm" /> Copy
        </Dropdown.Item>
        <Dropdown.Item onClick={() => toggleActionModal(EFolderEntryActionType.MOVE)}>
          <FontAwesomeIcon icon={faSuitcase} size="sm" /> Move
        </Dropdown.Item>
        <Dropdown.Item onClick={() => toggleActionModal(EFolderEntryActionType.FLAG)}>
          <FontAwesomeIcon icon={faFlag} size="sm" /> Flag
        </Dropdown.Item>
        <Dropdown.Item onClick={() => toggleActionModal(EFolderEntryActionType.DELETE)}>
          <FontAwesomeIcon icon={faTrash} size="sm" /> Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
