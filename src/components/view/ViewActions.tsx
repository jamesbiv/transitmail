import React, { useContext, useEffect, useState } from "react";
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
import {
  IEmail,
  IEmailFlags,
  IEmailFlagType,
  IFoldersEntry,
  IFoldersSubEntry,
  IImapResponse,
} from "interfaces";
import { DependenciesContext } from "contexts";
import {
  copyEmailToFolder,
  moveEmailToFolder,
  deleteEmailFromFolder,
  getFlagString,
  updateFlags,
  setFlagDefaults,
} from "lib";

interface IViewActionsProps {
  actionUid?: number;
  actionType: EViewActionType;
  showActionModal: boolean;
  email: IEmail;
  emailFlags: IEmailFlags;
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
  hideSubmit?: boolean;
}

export const ViewActions: React.FC<IViewActionsProps> = ({
  actionUid,
  actionType,
  email,
  emailFlags,
  showActionModal,
  onHide,
}) => {
  const { imapHelper, imapSocket } = useContext(DependenciesContext);

  const [submit, changeSubmit] = useState(false);
  const [folders, updateFolders] = useState<IFoldersEntry[]>([]);

  useEffect(() => {
    if (showActionModal && folders.length == 0) {
      (async () => {
        const listResponse: IImapResponse = await imapSocket.imapRequest(
          `LIST "" "*"`
        );

        const folders: IFoldersEntry[] = imapHelper.formatListFoldersResponse(
          listResponse.data
        );

        updateFolders(folders);
      })();
    }
  }, [showActionModal]);

  const successfulSubmit = onHide;

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
      hideSubmit: true,
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
      <Modal.Header closeButton onClick={() => onHide()}>
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
          emailFlags,
          submit,
          changeSubmit,
          successfulSubmit,
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className={`${ViewAction[actionType].hideSubmit && "d-none"}`}
          onClick={() => changeSubmit(true)}
        >
          Ok
        </Button>
        <Button
          className={`${ViewAction[actionType].hideSubmit && "btn-block"}`}
          onClick={() => onHide()}
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
  emailFlags: IEmailFlags;
  submit: boolean;
  changeSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  successfulSubmit: () => void;
}

export const ViewActionMove: React.FC<IViewActionProps> = ({
  actionUid,
  folders,
  submit,
  changeSubmit,
  successfulSubmit,
}) => {
  const [destinationFolder, setDestinationFolder] =
    useState<string | undefined>(undefined);

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    if (!actionUid || !destinationFolder) {
      return;
    }

    moveEmailToFolder([actionUid], destinationFolder);

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
      <Form.Control
        as="select"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setDestinationFolder(event.target.value)
        }
      >
        {folders?.map((folder: IFoldersEntry) => (
          <React.Fragment key={folder.id}>
            <option key={folder.id} value={folder.name}>
              {folder.name}
            </option>
            {folder.folders?.map((subFolder: IFoldersSubEntry) => (
              <option
                key={subFolder.id}
                value={`${folder.name}/${subFolder.name}`}
              >
                &nbsp;{subFolder.name}
              </option>
            ))}
          </React.Fragment>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export const ViewActionCopy: React.FC<IViewActionProps> = ({
  actionUid,
  folders,
  submit,
  changeSubmit,
  successfulSubmit,
}) => {
  const [destinationFolder, setDestinationFolder] =
    useState<string | undefined>(undefined);

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    if (!actionUid || !destinationFolder) {
      return;
    }

    copyEmailToFolder([actionUid], destinationFolder);

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
      <Form.Control
        as="select"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setDestinationFolder(event.target.value)
        }
      >
        {folders?.map((folder: IFoldersEntry) => (
          <React.Fragment key={folder.id}>
            <option key={folder.id} value={folder.name}>
              {folder.name}
            </option>
            {folder.folders?.map((subFolder: IFoldersSubEntry) => (
              <option
                key={subFolder.id}
                value={`${folder.name}/${subFolder.name}`}
              >
                &nbsp;{subFolder.name}
              </option>
            ))}
          </React.Fragment>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export const ViewActionFlag: React.FC<IViewActionProps> = ({
  actionUid,
  emailFlags,
  submit,
  changeSubmit,
  successfulSubmit,
}) => {
  const [flags, setFlags] = useState<IEmailFlagType[]>(
    setFlagDefaults(emailFlags.flags)
  );

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async (): Promise<void> => {
    if (!actionUid || !flags) {
      return;
    }

    updateFlags([actionUid], flags);

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

                emailFlags.flags = getFlagString(flags);

                setFlags(flags);
              }}
            />
          </li>
        ))}
      </ul>
    </Form.Group>
  );
};

export const ViewActionView: React.FC<IViewActionProps> = ({ email }) => {
  return (
    <div className="overflow-auto" style={{ height: 300 }}>
      <pre>{email.emailRaw}</pre>
    </div>
  );
};

export const ViewActionDelete: React.FC<IViewActionProps> = ({
  actionUid,
  submit,
  changeSubmit,
  successfulSubmit,
}) => {
  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async () => {
    if (actionUid) {
      deleteEmailFromFolder([actionUid]);
    }

    successfulSubmit();
  };

  return (
    <Alert variant="danger">
      <FontAwesomeIcon icon={faExclamationTriangle} /> Are you sure you want to
      delete this email?
    </Alert>
  );
};
