import React, { ChangeEvent, useEffect, useState } from "react";
import { Alert, Form, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faAsterisk,
  faFlag,
  faCopy,
  faEdit,
  faCode,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { ImapSocket, ImapHelper } from "classes";
import { EImapResponseStatus, IEmail, IFoldersEntry } from "interfaces";

interface IViewActionsProps {
  actionUid?: number;
  actionType: EViewActionType;
  email: IEmail;
  showActionModal: boolean;
  imapHelper: ImapHelper;
  imapSocket: ImapSocket;
  onHide: () => void;
}

export enum EViewActionType {
  MOVE = 0,
  COPY = 1,
  FLAG = 2,
  VIEW = 3,
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
  email,
  showActionModal,
  imapHelper,
  imapSocket,
  onHide,
}) => {
  const [submit, changeSubmit] = useState(false);
  const [folders, updateFolders] = useState<IFoldersEntry[]>([]);

  useEffect(() => {
    (async () => {
      const listResponse = await imapSocket.imapRequest(`LIST "" "*"`);

      const folders: IFoldersEntry[] = imapHelper.formatListFoldersResponse(
        listResponse.data
      );

      updateFolders(folders);
    })();
  }, []);

  const ViewAction: IViewActionComponents = {
    [EViewActionType.MOVE]: {
      label: "Move email",
      icon: faEdit,
      element: ViewActionMove,
    },
    [EViewActionType.COPY]: {
      label: "Copy email",
      icon: faCopy,
      element: ViewActionCopy,
    },
    [EViewActionType.FLAG]: {
      label: "Flag email",
      icon: faFlag,
      element: ViewActionFlag,
    },
    [EViewActionType.VIEW]: {
      label: "View source",
      icon: faCode,
      element: ViewActionView,
    },
    [EViewActionType.DELETE]: {
      label: "Delete email",
      icon: faEdit,
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
          folders,
          email,
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

interface IViewActionProps {
  actionUid?: number;
  folders: IFoldersEntry[];
  email: IEmail;
  imapSocket: ImapSocket;
  submit: boolean;
  changeSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ViewActionMove: React.FC<IViewActionProps> = ({
  actionUid,
  folders,
  imapSocket,
  submit,
  changeSubmit,
}) => {
  const [destinationFolder, setDestinationFolder] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    const moveResponse = await imapSocket.imapRequest(
      `MOVE ${actionUid} "${destinationFolder}"`
    );

    if (moveResponse.status !== EImapResponseStatus.OK) {
      return;
    }
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
      <Form.Control
        as="select"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setDestinationFolder(event.target.value);
        }}
      >
        <option>(root)</option>
        {folders?.map((folder: IFoldersEntry) => (
          <React.Fragment key={folder.id}>
            <option key={folder.id}>{folder.name}</option>
          </React.Fragment>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export const ViewActionCopy: React.FC<IViewActionProps> = ({
  actionUid,
  folders,
  imapSocket,
  submit,
  changeSubmit,
}) => {
  const [destinationFolder, setDestinationFolder] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    const moveResponse = await imapSocket.imapRequest(
      `COPY ${actionUid} "${destinationFolder}"`
    );

    if (moveResponse.status !== EImapResponseStatus.OK) {
      return;
    }
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
      <Form.Control
        as="select"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setDestinationFolder(event.target.value);
        }}
      >
        <option>(root)</option>
        {folders?.map((folder: IFoldersEntry) => (
          <React.Fragment key={folder.id}>
            <option key={folder.id}>{folder.name}</option>
          </React.Fragment>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export const ViewActionFlag: React.FC<IViewActionProps> = ({
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

export const ViewActionView: React.FC<IViewActionProps> = ({
  email,
  submit,
  changeSubmit,
}) => {
  useEffect(() => {
    if (submit) {
      changeSubmit(false);
    }
  });

  return (
    <div className="overflow-auto" style={{ height: 300 }}>
      <pre>{email.emailRaw}</pre>
    </div>
  );
};

export const ViewActionDelete: React.FC<IViewActionProps> = ({
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

    // this.setState({
    //  deleted: true,
    //  message: "This email has been marked for deletion.",
    //  messageType: "danger",
    // });
  };

  return (
    <Alert variant="danger">
      <FontAwesomeIcon icon={faExclamationTriangle} /> Are you sure you want to
      delete this folder?
    </Alert>
  );
};
