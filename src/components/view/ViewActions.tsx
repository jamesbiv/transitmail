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
  hideActionModal: () => void;
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
  element: FunctionComponent<TViewActionProps>;
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
  hideActionModal
}) => {
  const { imapHelper, imapSocket } = useContext(DependenciesContext);

  const [submit, setSubmit] = useState(false);
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

  const successfulSubmit = hideActionModal;

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
      <ModalHeader closeButton onClick={() => hideActionModal()}>
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
          setSubmit,
          successfulSubmit
        })}
      </ModalBody>
      <ModalFooter>
        <Button
          className={`${ViewAction[actionType].hideSubmit && "d-none"}`}
          onClick={() => setSubmit(true)}
        >
          Ok
        </Button>
        <Button
          className={`${ViewAction[actionType].hideSubmit && "btn-block"}`}
          onClick={() => hideActionModal()}
        >
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

/**
 * @type TViewActionProps
 */
type TViewActionProps = IViewActionMoveProps &
  IViewActionCopyProps &
  IViewActionFlagProps &
  IViewActionViewProps &
  IViewActionDeleteProps;

/**
 * @interface IViewActionMoveProps
 */
interface IViewActionMoveProps {
  actionUid?: number;
  folders: IFoldersEntry[];
  submit: boolean;
  setSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * ViewActionMove
 * @param {IViewActionProps} properties
 * @returns FunctionComponent
 */
export const ViewActionMove: FunctionComponent<IViewActionMoveProps> = ({
  actionUid,
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
    if (!actionUid || !destinationFolder) {
      return;
    }

    moveEmailToFolder([actionUid], destinationFolder);

    successfulSubmit();
  };

  return (
    <FormGroup controlId="formMoveFolderTo">
      <FormLabel>
        Move folder to <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
      </FormLabel>
      <FormControl
        data-testid="selectMoveFolderTo"
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
 * @interface IViewActionCopyProps
 */
interface IViewActionCopyProps {
  actionUid?: number;
  folders: IFoldersEntry[];
  submit: boolean;
  setSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * ViewActionCopy
 * @param {IViewActionProps} properties
 * @returns FunctionComponent
 */
export const ViewActionCopy: FunctionComponent<IViewActionCopyProps> = ({
  actionUid,
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
    if (!actionUid || !destinationFolder) {
      return;
    }

    copyEmailToFolder([actionUid], destinationFolder);

    successfulSubmit();
  };

  return (
    <FormGroup controlId="formCopyFolderTo">
      <FormLabel>
        Copy folder to <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
      </FormLabel>
      <FormControl
        data-testid="selectCopyFolderTo"
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
 * @interface IViewActionFlagProps
 */
interface IViewActionFlagProps {
  actionUid?: number;
  emailFlags: IEmailFlags;
  submit: boolean;
  setSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * ViewActionFlag
 * @param {IViewActionProps} properties
 * @returns FunctionComponent
 */
export const ViewActionFlag: FunctionComponent<IViewActionFlagProps> = ({
  actionUid,
  emailFlags,
  submit,
  setSubmit,
  successfulSubmit
}) => {
  const [flags, setFlags] = useState<IEmailFlagType[]>(setFlagDefaults(emailFlags.flags));

  useEffect(() => {
    if (submit) {
      submitAction();
      setSubmit(false);
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
    <FormGroup controlId="formEmailFlagType">
      <ul>
        {flags.map((flag: IEmailFlagType, flagIndex: number) => (
          <li key={flag.name}>
            <FormCheck
              type="switch"
              id={flags[flagIndex].name}
              label={flags[flagIndex].name}
              defaultChecked={flags[flagIndex].enabled}
              onChange={() => {
                flags[flagIndex].enabled = !flags[flagIndex].enabled;
                flags[flagIndex].flagChanged = true;

                emailFlags.flags = getFlagString(flags);

                setFlags({ ...flags });
              }}
            />
          </li>
        ))}
      </ul>
    </FormGroup>
  );
};

/**
 * @interface IViewActionViewProps
 */
interface IViewActionViewProps {
  email: IEmail;
}

/**
 * ViewActionView
 * @param {IViewActionProps} properties
 * @returns FunctionComponent
 */
export const ViewActionView: FunctionComponent<IViewActionViewProps> = ({ email }) => {
  return (
    <div className="overflow-auto" style={{ height: 300 }}>
      <pre>{email.emailRaw}</pre>
    </div>
  );
};

/**
 * @interface IViewActionDeleteProps
 */
interface IViewActionDeleteProps {
  actionUid?: number;
  submit: boolean;
  setSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * ViewActionDelete
 * @param {IViewActionProps} properties
 * @returns FunctionComponent
 */
export const ViewActionDelete: FunctionComponent<IViewActionDeleteProps> = ({
  actionUid,
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
