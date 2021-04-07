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
import {
  EImapResponseStatus,
  IEmail,
  IEmailFlags,
  IEmailFlagType,
  IFoldersEntry,
  IFoldersSubEntry,
  IImapResponse,
} from "interfaces";
import { setFlagsFromString } from "node:v8";

interface IViewActionsProps {
  actionUid?: number;
  actionType: EViewActionType;
  email: IEmail;
  emailFlags: IEmailFlags;
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
  hideSubmit?: boolean;
}

export const ViewActions: React.FC<IViewActionsProps> = ({
  actionUid,
  actionType,
  email,
  emailFlags,
  showActionModal,
  imapHelper,
  imapSocket,
  onHide,
}) => {
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
          emailFlags,
          imapSocket,
          submit,
          changeSubmit,
          successfulSubmit,
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className={`${ViewAction[actionType].hideSubmit && "d-none"}`}
          onClick={() => {
            changeSubmit(true);
          }}
        >
          Ok
        </Button>
        <Button
          className={`${ViewAction[actionType].hideSubmit && "btn-block"}`}
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
  emailFlags: IEmailFlags;
  imapSocket: ImapSocket;
  submit: boolean;
  changeSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  successfulSubmit: () => void;
}

export const ViewActionMove: React.FC<IViewActionProps> = ({
  actionUid,
  folders,
  imapSocket,
  submit,
  changeSubmit,
  successfulSubmit,
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
    const moveResponse: IImapResponse = await imapSocket.imapRequest(
      `UID MOVE ${actionUid} "${destinationFolder}"`
    );

    if (moveResponse.status !== EImapResponseStatus.OK) {
      return;
    }

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
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setDestinationFolder(event.target.value);
        }}
      >
        <option>(root)</option>
        {folders?.map((folder: IFoldersEntry) => (
          <React.Fragment key={folder.id}>
            <option key={folder.id}>{folder.name}</option>
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
  imapSocket,
  submit,
  changeSubmit,
  successfulSubmit,
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
    const moveResponse: IImapResponse = await imapSocket.imapRequest(
      `UID COPY ${actionUid} "${destinationFolder}"`
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
      <Form.Control
        as="select"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setDestinationFolder(event.target.value);
        }}
      >
        {folders?.map((folder: IFoldersEntry) => (
          <React.Fragment key={folder.id}>
            <option key={folder.id}>{folder.name}</option>
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
  imapSocket,
  submit,
  changeSubmit,
  successfulSubmit,
}) => {
  const [flags, setFlags] = useState<IEmailFlagType[]>([
    {
      name: "Answered",
      id: "\\Answered",
      enabled: emailFlags.flags.includes("\\Answered"),
      flagChanged: false,
    },
    {
      name: "Urgent",
      id: "\\Flagged",
      enabled: emailFlags.flags.includes("\\Flagged"),
      flagChanged: false,
    },
    {
      name: "Draft",
      id: "\\Draft",
      enabled: emailFlags.flags.includes("\\Draft"),
      flagChanged: false,
    },
  ]);

  useEffect(() => {
    if (submit) {
      submitAction();
      changeSubmit(false);
    }
  });

  const submitAction = async (): Promise<void> => {
    const enabledFlags: string = flags
      .reduce((flagResult: string[], flag: IEmailFlagType) => {
        if (flag.enabled && flag.flagChanged) {
          flagResult.push(flag.id);
        }

        return flagResult;
      }, [])
      .join(" ");

    if (enabledFlags) {
      const enabledFlagsResponse: IImapResponse = await imapSocket.imapRequest(
        `UID STORE ${actionUid} +FLAGS (${enabledFlags})`
      );

      if (enabledFlagsResponse.status !== EImapResponseStatus.OK) {
        return;
      }
    }

    const disabledFlags: string = flags
      .reduce((flagResult: string[], flag: IEmailFlagType) => {
        if (!flag.enabled && flag.flagChanged) {
          flagResult.push(flag.id);
        }

        return flagResult;
      }, [])
      .join(" ");

    if (disabledFlags) {
      const disabledFlagsResponse: IImapResponse = await imapSocket.imapRequest(
        `UID STORE ${actionUid} -FLAGS (${disabledFlags})`
      );

      if (disabledFlagsResponse.status !== EImapResponseStatus.OK) {
        return;
      }
    }

    successfulSubmit();
  };

  const updateFlagProps = (): void => {
    emailFlags.flags = flags
      .reduce((flagResult: string[], flag: IEmailFlagType) => {
        if (flag.enabled) {
          flagResult.push(flag.id);
        }

        return flagResult;
      }, [])
      .filter((flagStatus: string | undefined) => flagStatus)
      .join(" ");
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
                flags[flagIndex].enabled = flags[flagIndex].enabled
                  ? false
                  : true;

                flags[flagIndex].flagChanged = true;

                updateFlagProps();

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
  imapSocket,
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
    const deleteResponse: IImapResponse = await imapSocket.imapRequest(
      `UID STORE ${actionUid} +FLAGS (\\Deleted)`
    );

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
