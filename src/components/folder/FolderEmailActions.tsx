import React, {
  ChangeEvent,
  createElement,
  Dispatch,
  Fragment,
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
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

/**
 * @interface IFolderEmailActionsProps
 */
interface IFolderEmailActionsProps {
  folderEmailActionState: {
    actionUids?: number[];
    actionType: EFolderEmailActionType;
    showActionModal: boolean;
  };
  onHide: () => void;
}

/**
 * @enum EFolderEmailActionType
 */
export enum EFolderEmailActionType {
  MOVE = 0,
  COPY = 1,
  FLAG = 2,
  DELETE = 4
}

/**
 * @interface IFolderEmailActionComponents
 */
interface IFolderEmailActionComponents {
  [key: number]: IFolderEmailActionComponent;
}

/**
 * @interface IFolderEmailActionComponent
 */
interface IFolderEmailActionComponent {
  label: string;
  icon: IconDefinition;
  element: FunctionComponent<TFolderEmailActionProps>;
}

/**
 * FolderEmailActions
 * @param {IFolderEmailActionsProps} properties
 * @returns FunctionComponent
 */
export const FolderEmailActions: FunctionComponent<IFolderEmailActionsProps> = ({
  folderEmailActionState,
  onHide
}) => {
  const { imapHelper, imapSocket } = useContext(DependenciesContext);

  const { actionUids, actionType, showActionModal } = folderEmailActionState;

  const [submit, setSubmit] = useState<boolean>(false);
  const [folders, setFolders] = useState<IFoldersEntry[]>([]);

  useEffect(() => {
    if (showActionModal && folders.length == 0) {
      (async () => {
        const listResponse: IImapResponse = await imapSocket.imapRequest(`LIST "" "*"`);

        const folders: IFoldersEntry[] = imapHelper.formatListFoldersResponse(listResponse.data);

        setFolders(folders);
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
        {createElement(FolderEmailAction[actionType].element, {
          actionUids,
          folders,
          imapSocket,
          submit,
          setSubmit,
          successfulSubmit
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setSubmit(true)}>Ok</Button>
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
  setSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * FolderEmailActionMove
 * @param {IFolderEmailActionMoveProps} properties
 * @returns FunctionComponent
 */
export const FolderEmailActionMove: FunctionComponent<IFolderEmailActionMoveProps> = ({
  actionUids,
  folders,
  submit,
  setSubmit,
  successfulSubmit
}) => {
  const [destinationFolder, setDestinationFolder] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (submit) {
      submitAction();
      setSubmit(false);
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
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setDestinationFolder(event.target.value)
        }
      >
        {folders?.map((folder: IFoldersEntry) => (
          <Fragment key={folder.id}>
            <option key={folder.id}>{folder.name}</option>
            {folder.folders?.map((subFolder: IFoldersSubEntry) => (
              <option key={subFolder.id} value={`${folder.name}/${subFolder.name}`}>
                &nbsp;{subFolder.name}
              </option>
            ))}
          </Fragment>
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
  setSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * FolderEmailActionCopy
 * @param {IFolderEmailActionCopyProps} properties
 * @returns FunctionComponent
 */
export const FolderEmailActionCopy: FunctionComponent<IFolderEmailActionCopyProps> = ({
  actionUids,
  folders,
  submit,
  imapSocket,
  setSubmit,
  successfulSubmit
}) => {
  const [destinationFolder, setDestinationFolder] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (submit) {
      submitAction();
      setSubmit(false);
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
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setDestinationFolder(event.target.value)
        }
      >
        {folders?.map((folder: IFoldersEntry) => (
          <Fragment key={folder.id}>
            <option key={folder.id}>{folder.name}</option>
            {folder.folders?.map((subFolder: IFoldersSubEntry) => (
              <option key={subFolder.id} value={`${folder.name}/${subFolder.name}`}>
                &nbsp;{subFolder.name}
              </option>
            ))}
          </Fragment>
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
  setSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * FolderEmailActionFlag
 * @param {IFolderEmailActionFlagProps} properties
 * @returns FunctionComponent
 */
export const FolderEmailActionFlag: FunctionComponent<IFolderEmailActionFlagProps> = ({
  actionUids,
  submit,
  setSubmit,
  successfulSubmit
}) => {
  const [flags, setFlags] = useState<IEmailFlagType[]>(setFlagDefaults(""));

  useEffect(() => {
    if (submit) {
      submitAction();
      setSubmit(false);
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
          <li key={flag.name}>
            <Form.Check
              type="switch"
              id={flags[flagIndex].name}
              label={flags[flagIndex].name}
              defaultChecked={flags[flagIndex].enabled}
              onChange={() => {
                flags[flagIndex].enabled = !flags[flagIndex].enabled;
                flags[flagIndex].flagChanged = true;

                setFlags({ ...flags });
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
  setSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * FolderEmailActionDelete
 * @param {IFolderEmailActionDeleteProps} properties
 * @returns FunctionComponent
 */
export const FolderEmailActionDelete: FunctionComponent<IFolderEmailActionDeleteProps> = ({
  actionUids,
  submit,
  setSubmit,
  successfulSubmit
}) => {
  useEffect(() => {
    if (submit) {
      submitAction();
      setSubmit(false);
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
