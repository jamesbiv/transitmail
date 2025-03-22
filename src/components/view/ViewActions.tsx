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
import {
  Alert,
  Modal,
  Button,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalTitle,
  FormCheck,
  FormGroup,
  FormControl,
  FormLabel
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faAsterisk,
  faFlag,
  faCopy,
  faEdit,
  faCode,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import {
  IEmail,
  IEmailFlags,
  IEmailFlagType,
  IFoldersEntry,
  IFoldersSubEntry,
  IImapResponse
} from "interfaces";
import { DependenciesContext } from "contexts";
import {
  copyEmailToFolder,
  moveEmailToFolder,
  deleteEmailFromFolder,
  getFlagString,
  updateFlags,
  setFlagDefaults
} from "lib";

/**
 * @interface IViewActionsProps
 */
interface IViewActionsProps {
  actionUid?: number;
  actionType: EViewActionType;
  showActionModal: boolean;
  email: IEmail;
  emailFlags: IEmailFlags;
  onHide: () => void;
}

/**
 * @enum EViewActionType
 */
export enum EViewActionType {
  MOVE = 0,
  COPY = 1,
  FLAG = 2,
  VIEW = 3,
  DELETE = 4
}

/**
 * @interface IViewActionComponents
 */
interface IViewActionComponents {
  [key: number]: IViewActionComponent;
}

/**
 * @interface IViewActionComponent
 */
interface IViewActionComponent {
  label: string;
  icon: IconDefinition;
  element: FunctionComponent<IViewActionProps>;
  hideSubmit?: boolean;
}

/**
 * ViewActions
 * @param {IViewActionsProps} properties
 * @returns FunctionComponent
 */
export const ViewActions: FunctionComponent<IViewActionsProps> = ({
  actionUid,
  actionType,
  email,
  emailFlags,
  showActionModal,
  onHide
}) => {
  const { imapHelper, imapSocket } = useContext(DependenciesContext);

  const [submit, changeSubmit] = useState(false);
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

  const ViewAction: IViewActionComponents = {
    [EViewActionType.MOVE]: {
      label: "Move email",
      icon: faEdit,
      element: ViewActionMove
    },
    [EViewActionType.COPY]: {
      label: "Copy email",
      icon: faCopy,
      element: ViewActionCopy
    },
    [EViewActionType.FLAG]: {
      label: "Flag email",
      icon: faFlag,
      element: ViewActionFlag
    },
    [EViewActionType.VIEW]: {
      label: "View source",
      icon: faCode,
      element: ViewActionView,
      hideSubmit: true
    },
    [EViewActionType.DELETE]: {
      label: "Delete email",
      icon: faEdit,
      element: ViewActionDelete
    }
  };

  return (
    <Modal show={showActionModal} centered={true} aria-labelledby="contained-modal-title-vcenter">
      <ModalHeader closeButton onClick={() => onHide()}>
        <ModalTitle id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={ViewAction[actionType].icon} /> {ViewAction[actionType].label}
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        {createElement(ViewAction[actionType].element, {
          actionUid,
          folders,
          email,
          emailFlags,
          submit,
          changeSubmit,
          successfulSubmit
        })}
      </ModalBody>
      <ModalFooter>
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
      </ModalFooter>
    </Modal>
  );
};

/**
 * @interface IViewActionProps
 */
interface IViewActionProps {
  actionUid?: number;
  folders: IFoldersEntry[];
  email: IEmail;
  emailFlags: IEmailFlags;
  submit: boolean;
  changeSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * ViewActionMove
 * @param {IViewActionProps} properties
 * @returns FunctionComponent
 */
export const ViewActionMove: FunctionComponent<IViewActionProps> = ({
  actionUid,
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
    if (!actionUid || !destinationFolder) {
      return;
    }

    moveEmailToFolder([actionUid], destinationFolder);

    successfulSubmit();
  };

  return (
    <FormGroup controlId="formDisplayName">
      <FormLabel>
        Copy folder to <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
      </FormLabel>
      <FormControl
        as="select"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setDestinationFolder(event.target.value)
        }
      >
        {folders?.map((folder: IFoldersEntry) => (
          <Fragment key={folder.id}>
            <option key={folder.id} value={folder.name}>
              {folder.name}
            </option>
            {folder.folders?.map((subFolder: IFoldersSubEntry) => (
              <option key={subFolder.id} value={`${folder.name}/${subFolder.name}`}>
                &nbsp;{subFolder.name}
              </option>
            ))}
          </Fragment>
        ))}
      </FormControl>
    </FormGroup>
  );
};

/**
 * ViewActionCopy
 * @param {IViewActionProps} properties
 * @returns FunctionComponent
 */
export const ViewActionCopy: FunctionComponent<IViewActionProps> = ({
  actionUid,
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
    if (!actionUid || !destinationFolder) {
      return;
    }

    copyEmailToFolder([actionUid], destinationFolder);

    successfulSubmit();
  };

  return (
    <FormGroup controlId="formDisplayName">
      <FormLabel>
        Move folder to <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
      </FormLabel>
      <FormControl
        as="select"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setDestinationFolder(event.target.value)
        }
      >
        {folders?.map((folder: IFoldersEntry) => (
          <Fragment key={folder.id}>
            <option key={folder.id} value={folder.name}>
              {folder.name}
            </option>
            {folder.folders?.map((subFolder: IFoldersSubEntry) => (
              <option key={subFolder.id} value={`${folder.name}/${subFolder.name}`}>
                &nbsp;{subFolder.name}
              </option>
            ))}
          </Fragment>
        ))}
      </FormControl>
    </FormGroup>
  );
};

/**
 * ViewActionFlag
 * @param {IViewActionProps} properties
 * @returns FunctionComponent
 */
export const ViewActionFlag: FunctionComponent<IViewActionProps> = ({
  actionUid,
  emailFlags,
  submit,
  changeSubmit,
  successfulSubmit
}) => {
  const [flags, setFlags] = useState<IEmailFlagType[]>(setFlagDefaults(emailFlags.flags));

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
    <FormGroup controlId="formEmailAutoLogin">
      <ul>
        {flags.map((flag: IEmailFlagType, flagIndex: number) => (
          <li key={flagIndex}>
            <FormCheck
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
    </FormGroup>
  );
};

/**
 * ViewActionView
 * @param {IViewActionProps} properties
 * @returns FunctionComponent
 */
export const ViewActionView: FunctionComponent<IViewActionProps> = ({ email }) => {
  return (
    <div className="overflow-auto" style={{ height: 300 }}>
      <pre>{email.emailRaw}</pre>
    </div>
  );
};

/**
 * ViewActionDelete
 * @param {IViewActionProps} properties
 * @returns FunctionComponent
 */
export const ViewActionDelete: FunctionComponent<IViewActionProps> = ({
  actionUid,
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
    if (actionUid) {
      deleteEmailFromFolder([actionUid]);
    }

    successfulSubmit();
  };

  return (
    <Alert variant="danger">
      <FontAwesomeIcon icon={faExclamationTriangle} /> Are you sure you want to delete this email?
    </Alert>
  );
};
