import React, {
  ChangeEvent,
  createElement,
  Dispatch,
  Fragment,
  FunctionComponent,
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
  FormGroup,
  FormLabel,
  FormControl
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faAsterisk,
  faPlus,
  faCopy,
  faTrash,
  faEdit,
  faSuitcase,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { IFoldersEntry, EImapResponseStatus, IImapResponse } from "interfaces";
import { ImapSocket } from "classes";

/**
 * @interface IFoldersEntryActionsProps
 */
interface IFoldersEntryActionsProps {
  folderId?: string;
  folders?: IFoldersEntry[];
  actionType: EFolderEntryActionType;
  showActionModal: boolean;
  imapSocket: ImapSocket;
  getFolders: () => Promise<void>;
  hideActionModal: () => void;
}

/**
 * @enum EFolderEntryActionType
 */
export enum EFolderEntryActionType {
  ADD = 0,
  COPY = 1,
  MOVE = 2,
  RENAME = 3,
  DELETE = 4
}

/**
 * @interface IFolderEntryActionComponents
 */
interface IFolderEntryActionComponents {
  [key: number]: IFolderEntryActionComponent;
}

/**
 * @interface IFolderEntryActionComponent
 */
interface IFolderEntryActionComponent {
  label: string;
  icon: IconDefinition;
  element: FunctionComponent<TFoldersEntryActionProps>;
}

/**
 * FoldersEntryActions
 * @param {IFoldersEntryActionsProps} properties
 * @returns FunctionComponent
 */
export const FoldersEntryActions: FunctionComponent<IFoldersEntryActionsProps> = ({
  folderId,
  folders,
  actionType,
  showActionModal,
  imapSocket,
  getFolders,
  hideActionModal
}) => {
  const [triggerSubmit, setTriggerSubmit] = useState<boolean>(false);

  const folderEntryAction: IFolderEntryActionComponents = {
    [EFolderEntryActionType.ADD]: {
      label: "Add folder",
      icon: faPlus,
      element: FoldersEntryActionAdd
    },
    [EFolderEntryActionType.COPY]: {
      label: "Copy folder",
      icon: faCopy,
      element: FoldersEntryActionCopy
    },
    [EFolderEntryActionType.MOVE]: {
      label: "Move folder",
      icon: faSuitcase,
      element: FoldersEntryActionMove
    },
    [EFolderEntryActionType.RENAME]: {
      label: "Rename folder",
      icon: faEdit,
      element: FoldersEntryActionRename
    },
    [EFolderEntryActionType.DELETE]: {
      label: "Delete folder",
      icon: faTrash,
      element: FoldersEntryActionDelete
    }
  };

  const successfulSubmit: () => void = (): void => {
    getFolders();
    hideActionModal();
  };

  return (
    <Modal show={showActionModal} centered={true} aria-labelledby="contained-modal-title-vcenter">
      <ModalHeader closeButton onClick={() => hideActionModal()}>
        <ModalTitle id="contained-modal-title-vcenter">
          <FontAwesomeIcon icon={folderEntryAction[actionType].icon} />{" "}
          {folderEntryAction[actionType].label}
        </ModalTitle>
      </ModalHeader>
      <ModalBody>
        {createElement(folderEntryAction[actionType].element, {
          folderId,
          folders,
          imapSocket,
          triggerSubmit,
          setTriggerSubmit,
          successfulSubmit
        })}
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => setTriggerSubmit(true)}>Ok</Button>
        <Button onClick={() => hideActionModal()}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

/**
 * @type TFoldersEntryActionProps
 */
type TFoldersEntryActionProps = IFoldersEntryActionAddProps &
  IFoldersEntryActionCopyProps &
  IFoldersEntryActionMoveProps &
  IFoldersEntryActionRenameProps &
  IFoldersEntryActionDeleteProps;

/**
 * @interface IFoldersEntryActionAddProps
 */
interface IFoldersEntryActionAddProps {
  folders?: IFoldersEntry[];
  imapSocket: ImapSocket;
  triggerSubmit: boolean;
  setTriggerSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * FoldersEntryActionAdd
 * @param {IFoldersEntryActionProps} properties
 * @returns FunctionComponent
 */
export const FoldersEntryActionAdd: FunctionComponent<IFoldersEntryActionAddProps> = ({
  folders,
  imapSocket,
  triggerSubmit,
  setTriggerSubmit,
  successfulSubmit
}) => {
  const [folderName, setFolderName] = useState<string | undefined>();
  const [subFolder, setSubFolder] = useState<string | undefined>();

  useEffect(() => {
    if (triggerSubmit) {
      setTriggerSubmit(false);

      submitAction();
    }
  });

  const submitAction = async () => {
    const folderPath: string | undefined = subFolder ? `${subFolder}/${folderName}` : folderName;

    const createResponse: IImapResponse = await imapSocket.imapRequest(`CREATE "${folderPath}"`);

    if (createResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    successfulSubmit();
  };

  return (
    <Fragment>
      <FormGroup controlId="formDisplayName">
        <FormLabel>
          Add new folder{" "}
          <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
        </FormLabel>
        <FormControl
          type="text"
          placeholder="Enter new folder name"
          defaultValue={folderName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setFolderName(event.target.value)}
        />
      </FormGroup>
      <FormGroup controlId="formDisplayName">
        <FormLabel>
          Add to a sub folder{" "}
          <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
        </FormLabel>
        <FormControl
          as="select"
          onChange={(event: ChangeEvent<HTMLInputElement>) => setSubFolder(event.target.value)}
        >
          <option>(root)</option>
          {folders?.map((folder: IFoldersEntry) => (
            <Fragment key={folder.id}>
              <option key={folder.id}>{folder.name}</option>
            </Fragment>
          ))}
        </FormControl>
      </FormGroup>
    </Fragment>
  );
};

/**
 * @interface IFoldersEntryActionCopyProps
 */
interface IFoldersEntryActionCopyProps {
  folderId?: string;
  folders?: IFoldersEntry[];
  imapSocket: ImapSocket;
  triggerSubmit: boolean;
  setTriggerSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * FoldersEntryActionCopy
 * @param {IFoldersEntryActionProps} properties
 * @returns FunctionComponent
 */
export const FoldersEntryActionCopy: FunctionComponent<IFoldersEntryActionCopyProps> = ({
  folderId,
  folders,
  imapSocket,
  triggerSubmit,
  setTriggerSubmit,
  successfulSubmit
}) => {
  const [newFolderName, setNewFolderName] = useState<string | undefined>();
  const [destinationSubFolder, setDestinationSubFolder] = useState<string | undefined>();

  useEffect(() => {
    if (triggerSubmit) {
      setTriggerSubmit(false);

      submitAction();
    }
  });

  const submitAction = async () => {
    const newFolderPath: string | undefined = destinationSubFolder
      ? `${destinationSubFolder}/${newFolderName}`
      : newFolderName;

    const createResponse: IImapResponse = await imapSocket.imapRequest(`CREATE "${newFolderPath}"`);

    if (createResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const selectResponse: IImapResponse = await imapSocket.imapRequest(`SELECT "${folderId}"`);

    if (selectResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const copyResponse: IImapResponse = await imapSocket.imapRequest(
      `UID COPY 1:* "${newFolderName}"`
    );

    if (copyResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    successfulSubmit();
  };

  return (
    <Fragment>
      <FormGroup controlId="formDisplayName">
        <FormLabel>
          Copy folder as{" "}
          <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
        </FormLabel>
        <FormControl
          type="text"
          placeholder="Enter new folder name"
          defaultValue={newFolderName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setNewFolderName(event.target.value)}
        />
      </FormGroup>
      <FormGroup controlId="formDisplayName">
        <FormLabel>
          Copy folder to{" "}
          <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
        </FormLabel>
        <FormControl
          as="select"
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setDestinationSubFolder(event.target.value)
          }
        >
          <option>(root)</option>
          {folders?.map((folder: IFoldersEntry) => (
            <Fragment key={folder.id}>
              <option key={folder.id}>{folder.name}</option>
            </Fragment>
          ))}
        </FormControl>
      </FormGroup>
    </Fragment>
  );
};

/**
 * @interface IFoldersEntryActionMoveProps
 */
interface IFoldersEntryActionMoveProps {
  folderId?: string;
  folders?: IFoldersEntry[];
  imapSocket: ImapSocket;
  triggerSubmit: boolean;
  setTriggerSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * FoldersEntryActionMove
 * @param {IFoldersEntryActionProps} properties
 * @returns FunctionComponent
 */
export const FoldersEntryActionMove: FunctionComponent<IFoldersEntryActionMoveProps> = ({
  folderId,
  folders,
  imapSocket,
  triggerSubmit,
  setTriggerSubmit,
  successfulSubmit
}) => {
  const [destinationFolder, setDestinationFolder] = useState<string | undefined>();

  useEffect(() => {
    if (triggerSubmit) {
      setTriggerSubmit(false);

      submitAction();
    }
  });

  const submitAction = async () => {
    const destinationFolderPath: string | undefined = destinationFolder
      ? `${destinationFolder}/${folderId}`
      : folderId;

    const moveResponse: IImapResponse = await imapSocket.imapRequest(
      `RENAME "${folderId}" "${destinationFolderPath}"`
    );

    if (moveResponse.status !== EImapResponseStatus.OK) {
      return;
    }

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
        <option>(root)</option>
        {folders?.map((folder: IFoldersEntry) => (
          <Fragment key={folder.id}>
            <option key={folder.id}>{folder.name}</option>
          </Fragment>
        ))}
      </FormControl>
    </FormGroup>
  );
};

/**
 * @interface IFoldersEntryActionRenameProps
 */
interface IFoldersEntryActionRenameProps {
  folderId?: string;
  imapSocket: ImapSocket;
  triggerSubmit: boolean;
  setTriggerSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * FoldersEntryActionRename
 * @param {IFoldersEntryActionProps} properties
 * @returns FunctionComponent
 */
export const FoldersEntryActionRename: FunctionComponent<IFoldersEntryActionRenameProps> = ({
  folderId,
  imapSocket,
  triggerSubmit,
  setTriggerSubmit,
  successfulSubmit
}) => {
  const [newFolderName, setNewFolderName] = useState<string | undefined>();

  useEffect(() => {
    if (triggerSubmit) {
      setTriggerSubmit(false);

      submitAction();
    }
  });

  const submitAction = async () => {
    const renameResponse: IImapResponse = await imapSocket.imapRequest(
      `RENAME "${folderId}" "${newFolderName}"`
    );

    if (renameResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    successfulSubmit();
  };

  return (
    <FormGroup controlId="formDisplayName">
      <FormLabel>
        Rename folder as{" "}
        <FontAwesomeIcon icon={faAsterisk} size="xs" className="text-danger mb-1" />
      </FormLabel>
      <FormControl
        type="text"
        placeholder="Enter new folder name"
        defaultValue={newFolderName}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setNewFolderName(event.target.value)}
      />
    </FormGroup>
  );
};

/**
 * @interface IFoldersEntryActionDeleteProps
 */
interface IFoldersEntryActionDeleteProps {
  folderId?: string;
  imapSocket: ImapSocket;
  triggerSubmit: boolean;
  setTriggerSubmit: Dispatch<boolean>;
  successfulSubmit: () => void;
}

/**
 * FoldersEntryActionDelete
 * @param {IFoldersEntryActionProps} properties
 * @returns FunctionComponent
 */
export const FoldersEntryActionDelete: FunctionComponent<IFoldersEntryActionDeleteProps> = ({
  folderId,
  imapSocket,
  triggerSubmit,
  setTriggerSubmit,
  successfulSubmit
}) => {
  useEffect(() => {
    if (triggerSubmit) {
      setTriggerSubmit(false);

      submitAction();
    }
  });

  const submitAction = async () => {
    const deleteResponse: IImapResponse = await imapSocket.imapRequest(`DELETE "${folderId}"`);

    if (deleteResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    successfulSubmit();
  };

  return (
    <Alert variant="danger">
      <FontAwesomeIcon icon={faExclamationTriangle} /> Are you sure you want to delete this folder?
    </Alert>
  );
};
