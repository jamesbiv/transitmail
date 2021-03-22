import React, { useEffect, useState } from "react";
import { Alert, Form, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faAsterisk,
  faPlus,
  faCopy,
  faTrash,
  faEdit,
  faSuitcase,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { IFoldersEntry, IFoldersSubEntry } from "interfaces";

interface IFoldersEntryActionsProps {
  folderId?: string;
  folders?: IFoldersEntry[];
  actionType: EFolderEntryActionType;
  showActionModal: boolean;
  onHide: () => void;
}

export enum EFolderEntryActionType {
  ADD = 0,
  COPY = 1,
  MOVE = 2,
  RENAME = 3,
  DELETE = 4,
}

interface IFolderEntryActionComponents {
  [key: number]: IFolderEntryActionComponent;
}

interface IFolderEntryActionComponent {
  label: string;
  icon: IconDefinition;
  element: React.FC<IFoldersEntryActionProps>;
}

export const FoldersEntryActions: React.FC<IFoldersEntryActionsProps> = ({
  folderId,
  folders,
  actionType,
  showActionModal,
  onHide,
}) => {
  const [submit, changeSubmit] = useState(false);

  const FolderEntryAction: IFolderEntryActionComponents = {
    [EFolderEntryActionType.ADD]: {
      label: "Add folder",
      icon: faPlus,
      element: FoldersEntryActionAdd,
    },
    [EFolderEntryActionType.COPY]: {
      label: "Copy folder",
      icon: faCopy,
      element: FoldersEntryActionCopy,
    },
    [EFolderEntryActionType.MOVE]: {
      label: "Move folder",
      icon: faSuitcase,
      element: FoldersEntryActionMove,
    },
    [EFolderEntryActionType.RENAME]: {
      label: "Rename folder",
      icon: faEdit,
      element: FoldersEntryActionRename,
    },
    [EFolderEntryActionType.DELETE]: {
      label: "Delete folder",
      icon: faTrash,
      element: FoldersEntryActionDelete,
    },
  };

  return (
    <Modal
      show={showActionModal}
      centered={true}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header
        closeButton
        onClick={() => {
          onHide();
        }}
      >
        <Modal.Title id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={FolderEntryAction[actionType].icon} />{" "}
          {FolderEntryAction[actionType].label}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {React.createElement(FolderEntryAction[actionType].element, {
          folderId,
          folders,
          submit,
          changeSubmit,
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            changeSubmit(true);
          }}
        >
          Ok
        </Button>
        <Button
          onClick={() => {
            onHide();
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

interface IFoldersEntryActionProps {
  folderId?: string;
  folders?: IFoldersEntry[];
  submit: boolean;
  changeSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FoldersEntryActionAdd: React.FC<IFoldersEntryActionProps> = ({
  folderId,
  folders,
  submit,
  changeSubmit,
}) => {
  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = () => {
    alert(folderId);
  };

  return (
    <React.Fragment>
      <Form.Group controlId="formDisplayName">
        <Form.Label>
          Add new folder{" "}
          <FontAwesomeIcon
            icon={faAsterisk}
            size="xs"
            className="text-danger mb-1"
          />
        </Form.Label>
        <Form.Control type="text" placeholder="Enter new folder name" />
      </Form.Group>
      <Form.Group controlId="formDisplayName">
        <Form.Label>
          Add to a sub folder{" "}
          <FontAwesomeIcon
            icon={faAsterisk}
            size="xs"
            className="text-danger mb-1"
          />
        </Form.Label>
        <Form.Control as="select">
          <option>(root)</option>
          {folders?.map((folder: IFoldersEntry) => (
            <React.Fragment>
              <option key={folder.id}>{folder.name}</option>
              {folder.folders?.map((subFolder: IFoldersSubEntry) => (
                <option key={subFolder.id}>{subFolder.name}</option>
              ))}
            </React.Fragment>
          ))}
        </Form.Control>
      </Form.Group>
    </React.Fragment>
  );
};

export const FoldersEntryActionCopy: React.FC<IFoldersEntryActionProps> = ({
  folderId,
  folders,
  submit,
  changeSubmit,
}) => {
  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = () => {
    alert(folderId);
  };

  return (
    <Form.Group controlId="formDisplayName">
      <Form.Label>
        Copy folder to{" "}
        <FontAwesomeIcon
          icon={faAsterisk}
          size="xs"
          className="text-danger mb-1"
        />
      </Form.Label>
      <Form.Control as="select">
        <option>(root)</option>
        {folders?.map((folder: IFoldersEntry) => (
          <React.Fragment>
            <option key={folder.id}>{folder.name}</option>
            {folder.folders?.map((subFolder: IFoldersSubEntry) => (
              <option key={subFolder.id}>{subFolder.name}</option>
            ))}
          </React.Fragment>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export const FoldersEntryActionMove: React.FC<IFoldersEntryActionProps> = ({
  folderId,
  folders,
  submit,
  changeSubmit,
}) => {
  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = () => {
    alert(folderId);
  };

  return (
    <Form.Group controlId="formDisplayName">
      <Form.Label>
        Move folder to{" "}
        <FontAwesomeIcon
          icon={faAsterisk}
          size="xs"
          className="text-danger mb-1"
        />
      </Form.Label>
      <Form.Control as="select">
        <option>(root)</option>
        {folders?.map((folder: IFoldersEntry) => (
          <React.Fragment>
            <option key={folder.id}>{folder.name}</option>
            {folder.folders?.map((subFolder: IFoldersSubEntry) => (
              <option key={subFolder.id}>{subFolder.name}</option>
            ))}
          </React.Fragment>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export const FoldersEntryActionRename: React.FC<IFoldersEntryActionProps> = ({
  folderId,
  folders,
  submit,
  changeSubmit,
}) => {
  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = () => {
    alert(folderId);
  };

  return (
    <Form.Group controlId="formDisplayName">
      <Form.Label>
        Rename folder as{" "}
        <FontAwesomeIcon
          icon={faAsterisk}
          size="xs"
          className="text-danger mb-1"
        />
      </Form.Label>
      <Form.Control type="text" placeholder="Enter new folder name" />
    </Form.Group>
  );
};

export const FoldersEntryActionDelete: React.FC<IFoldersEntryActionProps> = ({
  folderId,
  folders,
  submit,
  changeSubmit,
}) => {
  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = () => {
    alert(folderId);
  };

  return (
    <Alert variant="danger">
      <FontAwesomeIcon icon={faExclamationTriangle} /> Are you sure you want to
      delete this folder?
    </Alert>
  );
};
