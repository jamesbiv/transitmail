import React, { useEffect, useState } from "react";
import { Alert, Form, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faAsterisk,
  faFlag,
  faCopy,
  faEdit,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { ImapSocket } from "classes";

interface IFolderEmailActionsProps {
  actionUid?: number;
  actionType: EFolderEmailActionType;
  showActionModal: boolean;
  imapSocket: ImapSocket;
  onHide: () => void;
}

export enum EFolderEmailActionType {
  MOVE = 0,
  COPY = 1,
  FLAG = 2,
  DELETE = 4,
}

interface IFolderEmailActionComponents {
  [key: number]: IFolderEmailActionComponent;
}

interface IFolderEmailActionComponent {
  label: string;
  icon: IconDefinition;
  element: React.FC<IFolderEmailActionProps>;
}

export const FolderEmailActions: React.FC<IFolderEmailActionsProps> = ({
  actionUid,
  actionType,
  showActionModal,
  imapSocket,
  onHide,
}) => {
  const [submit, changeSubmit] = useState(false);

  const FolderEmailAction: IFolderEmailActionComponents = {
    [EFolderEmailActionType.MOVE]: {
      label: "Move email(s)",
      icon: faEdit,
      element: FolderEmailActionMove,
    },
    [EFolderEmailActionType.COPY]: {
      label: "Copy email(s)",
      icon: faCopy,
      element: FolderEmailActionCopy,
    },
    [EFolderEmailActionType.FLAG]: {
      label: "Flag email(s)",
      icon: faFlag,
      element: FolderEmailActionFlag,
    },
    [EFolderEmailActionType.DELETE]: {
      label: "Delete email(s)",
      icon: faEdit,
      element: FolderEmailActionDelete,
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
          <FontAwesomeIcon icon={FolderEmailAction[actionType].icon} />{" "}
          {FolderEmailAction[actionType].label}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {React.createElement(FolderEmailAction[actionType].element, {
          actionUid,
          imapSocket,
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

interface IFolderEmailActionProps {
  actionUid?: number;
  imapSocket: ImapSocket;
  submit: boolean;
  changeSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FolderEmailActionMove: React.FC<IFolderEmailActionProps> = ({
  actionUid,
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
    alert(actionUid);
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
    </Form.Group>
  );
};

export const FolderEmailActionCopy: React.FC<IFolderEmailActionProps> = ({
  actionUid,
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
    alert(actionUid);
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
    </Form.Group>
  );
};

export const FolderEmailActionFlag: React.FC<IFolderEmailActionProps> = ({
  actionUid,
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
    alert(actionUid);
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

export const FolderEmailActionDelete: React.FC<IFolderEmailActionProps> = ({
  actionUid,
  imapSocket,
  submit,
  changeSubmit,
}) => {
  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    await imapSocket.imapRequest(`UID STORE ${actionUid} +FLAGS (\\Deleted)`);
  };

  return (
    <Alert variant="danger">
      <FontAwesomeIcon icon={faExclamationTriangle} /> Are you sure you want to
      delete this folder?
    </Alert>
  );
};
