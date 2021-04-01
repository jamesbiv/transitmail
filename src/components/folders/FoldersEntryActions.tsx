import React, { ChangeEvent, useEffect, useState } from "react";
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
import {
  IFoldersEntry,
  IFoldersSubEntry,
  EImapResponseStatus,
} from "interfaces";
import { ImapSocket } from "classes";

interface IFoldersEntryActionsProps {
  folderId?: string;
  folders?: IFoldersEntry[];
  actionType: EFolderEntryActionType;
  showActionModal: boolean;
  imapSocket: ImapSocket;
  getFolders: () => Promise<void>;
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
  imapSocket,
  getFolders,
  onHide,
}) => {
  const [submit, changeSubmit] = useState(false);

  const folderEntryAction: IFolderEntryActionComponents = {
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

  const successfulSubmit: () => void = (): void => {
    getFolders();
    onHide();
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
          <FontAwesomeIcon icon={folderEntryAction[actionType].icon} />{" "}
          {folderEntryAction[actionType].label}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {React.createElement(folderEntryAction[actionType].element, {
          folderId,
          folders,
          submit,
          imapSocket,
          changeSubmit,
          successfulSubmit,
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
  imapSocket: ImapSocket;
  successfulSubmit: () => void;
}

export const FoldersEntryActionAdd: React.FC<IFoldersEntryActionProps> = ({
  folderId,
  folders,
  submit,
  changeSubmit,
  imapSocket,
  successfulSubmit,
}) => {
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    const createResponse = await imapSocket.imapRequest(
      `CREATE "${folderName}"`
    );

    if (createResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    successfulSubmit();
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
        <Form.Control
          type="text"
          placeholder="Enter new folder name"
          defaultValue={folderName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFolderName(event.target.value);
          }}
        />
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
            <React.Fragment key={folder.id}>
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
  imapSocket,
  successfulSubmit,
}) => {
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = () => {
    alert(folderId);

    successfulSubmit();
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
          <React.Fragment key={folder.id}>
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
  imapSocket,
  successfulSubmit,
}) => {
  const [destinationFolder, setDestinationFolder] = useState("");

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    const destinationFolderPath: string | undefined = destinationFolder
      ? `${folderId}/${destinationFolder}`
      : folderId;

    const moveResponse = await imapSocket.imapRequest(
      `RENAME "${folderId}" "${destinationFolderPath}"`
    );

    if (moveResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    successfulSubmit();
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
          <React.Fragment key={folder.id}>
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
  submit,
  changeSubmit,
  imapSocket,
  successfulSubmit,
}) => {
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    const renameResponse = await imapSocket.imapRequest(
      `RENAME "${folderId}" "${newFolderName}"`
    );

    if (renameResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    successfulSubmit();
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
      <Form.Control
        type="text"
        placeholder="Enter new folder name"
        defaultValue={newFolderName}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setNewFolderName(event.target.value);
        }}
      />
    </Form.Group>
  );
};

export const FoldersEntryActionDelete: React.FC<IFoldersEntryActionProps> = ({
  folderId,
  submit,
  changeSubmit,
  imapSocket,
  successfulSubmit,
}) => {
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    const deleteResponse = await imapSocket.imapRequest(`DELETE "${folderId}"`);

    if (deleteResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    successfulSubmit();
  };

  return (
    <Alert variant="danger">
      <FontAwesomeIcon icon={faExclamationTriangle} /> Are you sure you want to
      delete this folder?
    </Alert>
  );
};
