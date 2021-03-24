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

interface IViewActionsProps {
  actionUid?: string;
  actionType: EViewActionType;
  showActionModal: boolean;
  onHide: () => void;
}

export enum EViewActionType {
  ADD = 0,
  COPY = 1,
  MOVE = 2,
  RENAME = 3,
  DELETE = 4,
}

interface IViewActionComponents {
  [key: number]: IViewActionComponent;
}

interface IViewActionComponent {
  label: string;
  icon: IconDefinition;
  element: React.FC<IViewActionProps>;
}

export const ViewActions: React.FC<IViewActionsProps> = ({
  actionUid,
  actionType,
  showActionModal,
  onHide,
}) => {
  const [submit, changeSubmit] = useState(false);

  const ViewAction: IViewActionComponents = {
    [EViewActionType.ADD]: {
      label: "Add folder",
      icon: faPlus,
      element: ViewActionAdd,
    },
    [EViewActionType.COPY]: {
      label: "Copy folder",
      icon: faCopy,
      element: ViewActionCopy,
    },
    [EViewActionType.MOVE]: {
      label: "Move folder",
      icon: faSuitcase,
      element: ViewActionMove,
    },
    [EViewActionType.RENAME]: {
      label: "Rename folder",
      icon: faEdit,
      element: ViewActionRename,
    },
    [EViewActionType.DELETE]: {
      label: "Delete folder",
      icon: faTrash,
      element: ViewActionDelete,
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
          <FontAwesomeIcon icon={ViewAction[actionType].icon} />{" "}
          {ViewAction[actionType].label}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {React.createElement(ViewAction[actionType].element, {
          actionUid,
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

interface IViewActionProps {
  actionUid?: string;
  submit: boolean;
  changeSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ViewActionAdd: React.FC<IViewActionProps> = ({
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
        </Form.Control>
      </Form.Group>
    </React.Fragment>
  );
};

export const ViewActionCopy: React.FC<IViewActionProps> = ({
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

export const ViewActionMove: React.FC<IViewActionProps> = ({
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

export const ViewActionRename: React.FC<IViewActionProps> = ({
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

export const ViewActionDelete: React.FC<IViewActionProps> = ({
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
    <Alert variant="danger">
      <FontAwesomeIcon icon={faExclamationTriangle} /> Are you sure you want to
      delete this folder?
    </Alert>
  );
};
