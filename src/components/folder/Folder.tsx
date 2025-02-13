import React, { useContext, useEffect, useState } from "react";
import { DependenciesContext } from "contexts";
import {
  EComposePresetType,
  EImapResponseStatus,
  IFolderEmail,
  IImapResponse,
} from "interfaces";
import { Card, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import {
  FolderEmailActions,
  EFolderEmailActionType,
  FolderCardHeader,
} from ".";
import { FolderScrollContainer } from "./FolderScrollContainer";

interface IFolderEmailActionState {
  actionUids?: number[];
  actionType: EFolderEmailActionType;
  showActionModal: boolean;
}

export const Folder: React.FC = () => {
  const { imapHelper, imapSocket, stateManager } =
    useContext(DependenciesContext);

  const [folderEmails, setFolderEmails] = useState<IFolderEmail[] | undefined>(
    undefined
  );

  const [displayCardHeader, setDisplayCardHeader] = useState<boolean>(true);
  const [folderSpinner, setFolderSpinner] = useState<boolean>(true);

  const [folderEmailActionState, setFolderEmailActionState] =
    useState<IFolderEmailActionState>({
      actionUids: undefined,
      actionType: EFolderEmailActionType.COPY,
      showActionModal: false,
    });

  let initalizeFoldersRun: boolean = false;

  useEffect(() => {
    if (!initalizeFoldersRun) {
      initalizeFoldersRun = true;

      initalizeFolders();
    }
  }, []);

  const initalizeFolders = async (): Promise<void> => {
    if (imapSocket.getReadyState() !== 1) {
      imapSocket.imapConnect();
    }

    setFolderSpinner(true);

    const currentFolder: IFolderEmail[] | undefined =
      stateManager.getCurrentFolder()?.emails || (await getLatestEmails());

    setFolderEmails(currentFolder);
    setFolderSpinner(false);

    stateManager.updateCurrentFolder(currentFolder);
  };

  const checkEmail = async (): Promise<void> => {
    setFolderSpinner(true);

    const latestEmails: IFolderEmail[] | undefined = await getLatestEmails(
      folderEmails && folderEmails[0]?.uid
    );

    if (latestEmails && latestEmails[0]?.uid === folderEmails?.[0]?.uid) {
      latestEmails.shift();
    }

    const currentEmails: IFolderEmail[] =
      stateManager.getCurrentFolder()?.emails ?? [];

    const allCurrentEmails: IFolderEmail[] = latestEmails
      ? [...latestEmails, ...currentEmails]
      : currentEmails;

    setFolderSpinner(false);

    setFolderEmails(allCurrentEmails);
    stateManager.updateCurrentFolder(allCurrentEmails);
  };

  const getLatestEmails = async (
    lastUid?: number
  ): Promise<IFolderEmail[] | undefined> => {
    const folderId: string | undefined = stateManager.getFolderId();

    const selectResponse: IImapResponse = await imapSocket.imapRequest(
      `SELECT "${folderId}"`
    );

    if (selectResponse.status !== EImapResponseStatus.OK) {
      return undefined;
    }

    const fetchUid: number = (lastUid ?? 0) + 1;

    const fetchResponse: IImapResponse = await imapSocket.imapRequest(
      `UID FETCH ${fetchUid}:* (FLAGS BODY[HEADER.FIELDS (DATE FROM SUBJECT)] BODYSTRUCTURE)`
    );

    if (fetchResponse.status !== EImapResponseStatus.OK) {
      return undefined;
    }

    const latestEmails: IFolderEmail[] =
      imapHelper.formatFetchFolderEmailsResponse(fetchResponse.data);

    latestEmails.sort((a, b) => [1, -1][Number(a.epoch > b.epoch)]);

    return latestEmails;
  };

  const searchEmails = (searchQuery: string): void => {
    const searchQueryLowercase: string = searchQuery.toLowerCase();

    const currentEmails: IFolderEmail[] =
      stateManager.getCurrentFolder()?.emails ?? [];

    const filteredEmails: IFolderEmail[] = !searchQuery.length
      ? currentEmails
      : currentEmails.filter((email: IFolderEmail) => {
          let queryFound: boolean = false;

          if (
            email.date.toLowerCase().indexOf(searchQueryLowercase) > -1 ||
            email.from.toLowerCase().indexOf(searchQueryLowercase) > -1 ||
            email.subject.toLowerCase().indexOf(searchQueryLowercase) > -1
          ) {
            queryFound = true;
          }

          return queryFound;
        });

    setFolderEmails(filteredEmails);
  };

  const viewEmail = (emailUid: number): void => {
    stateManager.setActiveUid(emailUid);
    stateManager.updateActiveKey("view");
  };

  const deleteEmail = (emailUid: number): void =>
    setFolderEmailActionState({
      actionUids: [emailUid],
      actionType: EFolderEmailActionType.DELETE,
      showActionModal: true,
    });

  const replyToEmail = async (emailUid: number): Promise<void> => {
    stateManager.setComposePresets({
      type: EComposePresetType.Reply,
      uid: emailUid,
    });

    stateManager.updateActiveKey("compose");
  };

  const forwardEmail = async (emailUid: number): Promise<void> => {
    stateManager.setComposePresets({
      type: EComposePresetType.Forward,
      uid: emailUid,
    });

    stateManager.updateActiveKey("compose");
  };

  const toggleActionModal = (actionType: EFolderEmailActionType): void => {
    const actionUids: number[] | undefined = folderEmails?.reduce(
      (selectedUids: number[], folderEmail: IFolderEmail) => {
        if (folderEmail.selected) {
          selectedUids.push(folderEmail.uid);
        }

        return selectedUids;
      },
      []
    );

    setFolderEmailActionState({
      actionType: actionType,
      actionUids: actionUids,
      showActionModal: true,
    });
  };

  const updateFolderActionState = (): void => {
    if (folderEmailActionState.actionType === EFolderEmailActionType.MOVE) {
      setFolderEmails(stateManager.getCurrentFolder()?.emails ?? []);
    }

    setFolderEmailActionState({
      actionType: folderEmailActionState.actionType,
      actionUids: [],
      showActionModal: false,
    });
  };

  return (
    <React.Fragment>
      <Card className={`${displayCardHeader ? "p-0 mt-0 mt-sm-3" : ""} mb-3`}>
        {displayCardHeader && (
          <FolderCardHeader
            folderName={stateManager.getFolderId()?.split("/").pop() ?? ""}
            folderSpinner={folderSpinner}
            checkEmail={checkEmail}
            searchEmails={searchEmails}
          />
        )}
        {!folderEmails ? (
          <Spinner
            className="mt-3 mb-3 ms-auto me-auto"
            animation="grow"
            variant="dark"
          />
        ) : !folderEmails.length ? (
          <Card.Body className="text-center text-secondary">
            <FontAwesomeIcon icon={faFolderOpen} size="lg" />
            <br />
            <em>Folder empty</em>
          </Card.Body>
        ) : (
          <FolderScrollContainer
            folderEmails={folderEmails}
            setDisplayCardHeader={setDisplayCardHeader}
            toggleActionModal={toggleActionModal}
            folderEmailActions={{
              viewEmail,
              deleteEmail,
              replyToEmail,
              forwardEmail,
            }}
          />
        )}
      </Card>
      <FolderEmailActions
        folderEmailActionState={folderEmailActionState}
        onHide={updateFolderActionState}
      />
    </React.Fragment>
  );
};
