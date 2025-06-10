import React, { FunctionComponent, SyntheticEvent } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEdit, faSlidersH, faSuitcase, faTrash } from "@fortawesome/free-solid-svg-icons";
import { EFolderEntryActionType } from ".";

/**
 * @interface IFoldersEntryOptionsProps
 */
interface IFoldersEntryOptionsProps {
  folderId: string;
  toggleActionModal: (actionType: EFolderEntryActionType, actionFolderId?: string) => void;
}

/**
 * FoldersEntryOptions
 * @param {IFoldersEntryOptionsProps} properties
 * @returns {ReactNode}
 */
export const FoldersEntryOptions: FunctionComponent<IFoldersEntryOptionsProps> = ({
  folderId,
  toggleActionModal
}) => {
  return (
    <Dropdown
      className="d-inline-block ms-2"
      onClick={(event: SyntheticEvent) => event.stopPropagation()}
    >
      <DropdownToggle size="sm" variant="outline-dark" id="dropdown-folder">
        <FontAwesomeIcon icon={faSlidersH} />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => toggleActionModal(EFolderEntryActionType.COPY, folderId)}>
          <FontAwesomeIcon icon={faCopy} size="sm" /> Copy
        </DropdownItem>
        <DropdownItem onClick={() => toggleActionModal(EFolderEntryActionType.MOVE, folderId)}>
          <FontAwesomeIcon icon={faSuitcase} size="sm" /> Move
        </DropdownItem>
        <DropdownItem onClick={() => toggleActionModal(EFolderEntryActionType.RENAME, folderId)}>
          <FontAwesomeIcon icon={faEdit} size="sm" /> Rename
        </DropdownItem>
        <DropdownItem onClick={() => toggleActionModal(EFolderEntryActionType.DELETE, folderId)}>
          <FontAwesomeIcon icon={faTrash} size="sm" /> Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
