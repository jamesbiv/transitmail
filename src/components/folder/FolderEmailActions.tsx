import React, { useContext, useEffect, useState } from "react";
import { Alert, Form, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ImapSocket } from "classes";
import {
  faExclamationTriangle,
  faAsterisk,
  faFlag,
  faCopy,
  faEdit,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { IEmailFlagType, IFoldersEntry, IFoldersSubEntry, IImapResponse } from "interfaces";
import { DependenciesContext } from "contexts";
import {
  copyEmailToFolder,
  deleteEmailFromFolder,
  moveEmailToFolder,
  setFlagDefaults,
  updateFlags
} from "lib";

interface IFolderEmailActionsProps {
  folderEmailActionState: {
    actionUids?: number[];
    actionType: EFolderEmailActionType;
    showActionModal: boolean;
  };
  onHide: () => void;
}

export enum EFolderEmailActionType {
  MOVE = 0,
  COPY = 1,
  FLAG = 2,
  DELETE = 4
}

interface IFolderEmailActionComponents {
  [key: number]: IFolderEmailActionComponent;
}

interface IFolderEmailActionComponent {
  label: string;
  icon: IconDefinition;
  element: React.FC<TFolderEmailActionProps>;
}

export const FolderEmailActions: React.FC<IFolderEmailActionsProps> = ({
  folderEmailActionState,
  onHide
}) => {
  const { imapHelper, imapSocket } = useContext(DependenciesContext);

  const { actionUids, actionType, showActionModal } = folderEmailActionState;

  const [submit, changeSubmit] = useState<boolean>(false);
  const [folders, updateFolders] = useState<IFoldersEntry[]>([]);

  useEffect(() => {
    if (showActionModal && folders.length == 0) {
      (async () => {
        const listResponse: IImapResponse = await imapSocket.imapRequest(`LIST "" "*"`);

        const folders: IFoldersEntry[] = imapHelper.formatListFoldersResponse(listResponse.data);

        updateFolders(folders);
      })();
    }
  }, [showActionModal]);

  const successfulSubmit = onHide;

  const FolderEmailAction: IFolderEmailActionComponents = {
    [EFolderEmailActionType.MOVE]: {
      label: "Move email(s)",
      icon: faEdit,
      element: FolderEmailActionMove
    },
    [EFolderEmailActionType.COPY]: {
      label: "Copy email(s)",
      icon: faCopy,
      element: FolderEmailActionCopy
    },
    [EFolderEmailActionType.FLAG]: {
      label: "Flag email(s)",
      icon: faFlag,
      element: FolderEmailActionFlag
    },
    [EFolderEmailActionType.DELETE]: {
      label: "Delete email(s)",
      icon: faEdit,
      element: FolderEmailActionDelete
    }
  };

  return (
    <Modal show={showActionModal} centered={true} aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton onClick={() => onHide()}>
        <Modal.Title id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={FolderEmailAction[actionType].icon} />{" "}
          {FolderEmailAction[actionType].label}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {React.createElement(FolderEmailAction[actionType].element, {
          actionUids,
          folders,
          imapSocket,
          submit,
          changeSubmit,
          successfulSubmit
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => changeSubmit(true)}>Ok</Button>
        <Button onClick={() => onHide()}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

/**
 * @type TFolderEmailActionProps
 */
type TFolderEmailActionProps = IFolderEmailActionMoveProps &
  IFolderEmailActionCopyProps &
  IFolderEmailActionDeleteProps &
  IFolderEmailActionFlagProps;

/**
 * @interface IFolderEmailActionMoveProps
 */
interface IFolderEmailActionMoveProps {
  actionUids?: number[];
  folders: IFoldersEntry[];
  submit: boolean;
  changeSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  successfulSubmit: () => void;
}

export const FolderEmailActionMove: React.FC<IFolderEmailActionMoveProps> = ({
  actionUids,
  folders,
  submit,
  changeSubmit,
  successfulSubmit
}) => {
  const [destinationFolder, setDestinationFolder] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    if (!actionUids || !destinationFolder) {
      return;
    }

    moveEmailToFolder(actionUids, destinationFolder);

    successfulSubmit();
  };

  return (
    <Form.Group controlId="formDisplayName">
      <Form.Label>
        Move email(s) to{" "}
        <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
      </Form.Label>
      <Form.Control
        as="select"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setDestinationFolder(event.target.value)
        }
      >
        {folders?.map((folder: IFoldersEntry) => (
          <React.Fragment key={folder.id}>
            <option key={folder.id}>{folder.name}</option>
            {folder.folders?.map((subFolder: IFoldersSubEntry) => (
              <option key={subFolder.id} value={`${folder.name}/${subFolder.name}`}>
                &nbsp;{subFolder.name}
              </option>
            ))}
          </React.Fragment>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

/**
 * @interface IFolderEmailActionCopyProps
 */
interface IFolderEmailActionCopyProps {
  actionUids?: number[];
  folders: IFoldersEntry[];
  imapSocket: ImapSocket;
  submit: boolean;
  changeSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  successfulSubmit: () => void;
}

export const FolderEmailActionCopy: React.FC<IFolderEmailActionCopyProps> = ({
  actionUids,
  folders,
  submit,
  imapSocket,
  changeSubmit,
  successfulSubmit
}) => {
  const [destinationFolder, setDestinationFolder] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = () => {
    if (!actionUids || !destinationFolder) {
      return;
    }

    actionUids.forEach(async (actionUid: number) => {
      await imapSocket.imapRequest(`UID COPY ${actionUid} "${destinationFolder}"`);
    });

    copyEmailToFolder(actionUids, destinationFolder);

    successfulSubmit();
  };

  return (
    <Form.Group controlId="formDisplayName">
      <Form.Label>
        Move email(s) to{" "}
        <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
      </Form.Label>
      <Form.Control
        as="select"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setDestinationFolder(event.target.value)
        }
      >
        {folders?.map((folder: IFoldersEntry) => (
          <React.Fragment key={folder.id}>
            <option key={folder.id}>{folder.name}</option>
            {folder.folders?.map((subFolder: IFoldersSubEntry) => (
              <option key={subFolder.id} value={`${folder.name}/${subFolder.name}`}>
                &nbsp;{subFolder.name}
              </option>
            ))}
          </React.Fragment>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

/**
 * @interface IFolderEmailActionFlagProps
 */
interface IFolderEmailActionFlagProps {
  actionUids?: number[];
  submit: boolean;
  changeSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  successfulSubmit: () => void;
}

export const FolderEmailActionFlag: React.FC<IFolderEmailActionFlagProps> = ({
  actionUids,
  submit,
  changeSubmit,
  successfulSubmit
}) => {
  const [flags, setFlags] = useState<IEmailFlagType[]>(setFlagDefaults(""));

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = () => {
    if (!actionUids) {
      return;
    }

    updateFlags(actionUids, flags);

    successfulSubmit();
  };

  return (
    <Form.Group controlId="formEmailAutoLogin">
      <ul>
        {flags.map((flag: IEmailFlagType, flagIndex: number) => (
          <li key={flagIndex}>
            <Form.Check
              type="switch"
              id={flags[flagIndex].name}
              label={flags[flagIndex].name}
              defaultChecked={flags[flagIndex].enabled}
              onChange={() => {
                flags[flagIndex].enabled = !flags[flagIndex].enabled;
                flags[flagIndex].flagChanged = true;

                setFlags(flags);
              }}
            />
          </li>
        ))}
      </ul>
    </Form.Group>
  );
};

/**
 * @interface IFolderEmailActionDeleteProps
 */
interface IFolderEmailActionDeleteProps {
  actionUids?: number[];
  submit: boolean;
  changeSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  successfulSubmit: () => void;
}

export const FolderEmailActionDelete: React.FC<IFolderEmailActionDeleteProps> = ({
  actionUids,
  submit,
  changeSubmit,
  successfulSubmit
}) => {
  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    if (!actionUids) {
      return;
    }

    deleteEmailFromFolder(actionUids);

    successfulSubmit();
  };

  return (
    <Alert variant="danger">
      <FontAwesomeIcon icon={faExclamationTriangle} />{" "}
      {actionUids && actionUids.length > 1
        ? "Are you sure you want to delete these emails?"
        : "Are you sure you want to delete this email?"}
    </Alert>
  );
};
