import React from "react";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faEdit,
  faSlidersH,
  faSuitcase,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { EFolderEntryActionType } from ".";

interface IFoldersEntryOptionsProps {
  folderId: string;
  toggleActionModal: (
    actionType: EFolderEntryActionType,
    actionFolderId?: string
  ) => void;
}

export const FoldersEntryOptions: React.FC<IFoldersEntryOptionsProps> = ({
  folderId,
  toggleActionModal,
}) => {
  return (
    <Dropdown
      className="d-inline-block ms-2"
      onClick={(event: React.SyntheticEvent) => event.stopPropagation()}
    >
      <Dropdown.Toggle size="sm" variant="outline-dark" id="dropdown-folder">
        <FontAwesomeIcon icon={faSlidersH} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() =>
            toggleActionModal(EFolderEntryActionType.COPY, folderId)
          }
        >
          <FontAwesomeIcon icon={faCopy} size="sm" /> Copy
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() =>
            toggleActionModal(EFolderEntryActionType.MOVE, folderId)
          }
        >
          <FontAwesomeIcon icon={faSuitcase} size="sm" /> Move
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() =>
            toggleActionModal(EFolderEntryActionType.RENAME, folderId)
          }
        >
          <FontAwesomeIcon icon={faEdit} size="sm" /> Rename
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() =>
            toggleActionModal(EFolderEntryActionType.DELETE, folderId)
          }
        >
          <FontAwesomeIcon icon={faTrash} size="sm" /> Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
