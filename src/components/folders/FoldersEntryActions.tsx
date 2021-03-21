import React, { useEffect, useState } from "react";
import { Alert, Form, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faAsterisk,
} from "@fortawesome/free-solid-svg-icons";

interface IFoldersEntryActionsProps {
  folderId?: string;
  actionType: EFolderEntryActionType;
  showActionModal: boolean;
  onHide: () => void;
}
export enum EFolderEntryActionType {
  ADD = 0,
  COPY = 1,
  MOVE = 2,
  FLAG = 3,
  DELETE = 4,
}

export const FoldersEntryActions: React.FC<IFoldersEntryActionsProps> = ({
  folderId,
  actionType,
  showActionModal,
  onHide,
}) => {
  const [submit, changeSubmit] = useState(false);

  const FolderEntryAction = {
    [EFolderEntryActionType.ADD]: {
      label: "Add folder",
      element: FoldersEntryActionAdd,
    },
    [EFolderEntryActionType.COPY]: {
      label: "Copy folder",
      element: FoldersEntryActionCopy,
    },
    [EFolderEntryActionType.MOVE]: {
      label: "Move folder",
      element: FoldersEntryActionMove,
    },
    [EFolderEntryActionType.FLAG]: {
      label: "Flag folder",
      element: FoldersEntryActionFlag,
    },
    [EFolderEntryActionType.DELETE]: {
      label: "Delete folder",
      element: FoldersEntryActionDelete,
    },
  };

  return (
    <Modal
      show={showActionModal}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={faExclamationTriangle} />{" "}
          {FolderEntryAction[actionType].label}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {React.createElement(FolderEntryAction[actionType].element, {
          folderId,
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
  submit: boolean;
  changeSubmit: any;
}

export const FoldersEntryActionAdd: React.FC<IFoldersEntryActionProps> = ({
  folderId,
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
    alert(1);
  };

  return (
    <Form.Group controlId="formDisplayName">
      <Form.Label>
        Add new folder{" "}
        <FontAwesomeIcon
          icon={faAsterisk}
          size="xs"
          className="text-danger mb-1"
        />
      </Form.Label>
      <Form.Control type="text" placeholder="Enter display name" />
    </Form.Group>
  );
};

export const FoldersEntryActionCopy: React.FC<IFoldersEntryActionProps> = ({
  folderId,
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
    alert(1);
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
      <Form.Control type="text" placeholder="Enter display name" />
    </Form.Group>
  );
};

export const FoldersEntryActionMove: React.FC<IFoldersEntryActionProps> = ({
  folderId,
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
    alert(1);
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
      <Form.Control type="text" placeholder="Enter display name" />
    </Form.Group>
  );
};

export const FoldersEntryActionFlag: React.FC<IFoldersEntryActionProps> = ({
  folderId,
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
    alert(1);
  };

  return (
    <Form.Group controlId="formDisplayName">
      <Form.Label>
        Flag folder as{" "}
        <FontAwesomeIcon
          icon={faAsterisk}
          size="xs"
          className="text-danger mb-1"
        />
      </Form.Label>
      <Form.Control type="text" placeholder="Enter display name" />
    </Form.Group>
  );
};

export const FoldersEntryActionDelete: React.FC<IFoldersEntryActionProps> = ({
  folderId,
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
    alert(1);
  };

  return (
    <Alert variant="danger">Are you sure you want to delete this folder?</Alert>
  );
};
