import React, { Fragment, FunctionComponent, useContext, useEffect, useState } from "react";
import { DependenciesContext } from "contexts";
import { EComposePresetType, EImapResponseStatus, IFolderEmail, IImapResponse } from "interfaces";
import { Card, CardBody, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FolderEmailActions, EFolderEmailActionType, FolderCardHeader } from ".";
import { FolderScrollContainer } from "./FolderScrollContainer";

/**
 * @interface IFolderEmailActionState
 */
interface IFolderEmailActionState {
  actionUids?: number[];
  actionType: EFolderEmailActionType;
  showActionModal: boolean;
}

/**
 * Folder
 * @returns {ReactNode}
 */
export const Folder: FunctionComponent = () => {
  const { imapHelper, imapSocket, stateManager } = useContext(DependenciesContext);

  const [folderEmails, setFolderEmails] = useState<IFolderEmail[] | undefined>(undefined);

  const [displayCardHeader, setDisplayCardHeader] = useState<boolean>(true);
  const [folderSpinner, setFolderSpinner] = useState<boolean>(true);

  const [folderEmailActionState, setFolderEmailActionState] = useState<IFolderEmailActionState>({
    actionUids: undefined,
    actionType: EFolderEmailActionType.COPY,
    showActionModal: false
  });

  let initalizeFoldersRun: boolean = false;

  useEffect(() => {
    if (!initalizeFoldersRun) {
      initalizeFoldersRun = true;

      try {
        imapSocket.imapCheckOrConnect();
      } catch (error: unknown) {
        throw new Error(`Websockets: ${(error as Error).message}`);
      }

      getFolderEmails();
    }
  }, []);

  const getFolderEmails = async (): Promise<void> => {
    setFolderSpinner(true);

    const currentFolder: IFolderEmail[] | undefined =
      stateManager.getCurrentFolder()?.emails || (await getLatestEmails());

    setFolderEmails(currentFolder);
    setFolderSpinner(false);

    stateManager.updateCurrentFolder(currentFolder);
  };

  const checkEmail = async (): Promise<void> => {
    setFolderSpinner(true);

    const heighestUid: number =
      folderEmails?.reduce((currentHighestUid, folderEmail) => {
        if (folderEmail.uid > currentHighestUid) {
          currentHighestUid = folderEmail.uid;
        }

        return currentHighestUid;
      }, 0) ?? 0;

    const latestEmails: IFolderEmail[] | undefined = await getLatestEmails(heighestUid);

    const currentEmails: IFolderEmail[] = stateManager.getCurrentFolder()?.emails ?? [];

    const allCurrentEmails: IFolderEmail[] = latestEmails
      ? [...latestEmails, ...currentEmails]
      : currentEmails;

    const allCurrentEmailsUnqiue: IFolderEmail[] = allCurrentEmails.filter(
      (currentEmail, currentEmailIndex) =>
        allCurrentEmails.findIndex(
          (currentEmailComparison) => currentEmailComparison.uid === currentEmail.uid
        ) === currentEmailIndex
    );

    setFolderSpinner(false);
    setFolderEmails(allCurrentEmailsUnqiue);

    stateManager.updateCurrentFolder(allCurrentEmailsUnqiue);
  };

  const getLatestEmails = async (lastUid?: number): Promise<IFolderEmail[] | undefined> => {
    const folderId: string | undefined = stateManager.getFolderId();

    const selectResponse: IImapResponse = await imapSocket.imapRequest(`SELECT "${folderId}"`);

    if (selectResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const fetchUid: number = (lastUid ?? 0) + 1;

    const fetchResponse: IImapResponse = await imapSocket.imapRequest(
      `UID FETCH ${fetchUid}:* (FLAGS BODY[HEADER.FIELDS (DATE FROM SUBJECT)] BODYSTRUCTURE)`
    );

    if (fetchResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const latestEmails: IFolderEmail[] = imapHelper.formatFetchFolderEmailsResponse(
      fetchResponse.data
    );

    latestEmails.sort(
      (first: IFolderEmail, second: IFolderEmail) => [1, -1][Number(first.epoch > second.epoch)]
    );

    return latestEmails;
  };

  const searchEmails = (searchQuery: string): void => {
    const searchQueryLowercase: string = searchQuery.toLowerCase();

    const currentEmails: IFolderEmail[] = stateManager.getCurrentFolder()?.emails ?? [];

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
      showActionModal: true
    });

  const replyToEmail = (emailUid: number): void => {
    stateManager.setComposePresets({
      type: EComposePresetType.Reply,
      uid: emailUid
    });

    stateManager.updateActiveKey("compose");
  };

  const forwardEmail = (emailUid: number): void => {
    stateManager.setComposePresets({
      type: EComposePresetType.Forward,
      uid: emailUid
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
      showActionModal: true
    });
  };

  const updateFolderActionState = (): void => {
    if (folderEmailActionState.actionType === EFolderEmailActionType.MOVE) {
      setFolderEmails(stateManager.getCurrentFolder()?.emails ?? []);
    }

    setFolderEmailActionState({
      actionType: folderEmailActionState.actionType,
      actionUids: [],
      showActionModal: false
    });
  };

  return (
    <Fragment>
      <Card className={`${displayCardHeader ? "p-0 mt-0 mt-sm-3" : ""} mb-3`}>
        {displayCardHeader && (
          <FolderCardHeader
            folderName={stateManager.getFolderId()?.split("/").pop() ?? ""}
            folderSpinner={folderSpinner}
            checkEmail={checkEmail}
            searchEmails={searchEmails}
          />
        )}
        {!folderEmails && (
          <Spinner className="mt-3 mb-3 ms-auto me-auto" animation="grow" variant="dark" />
        )}
        {folderEmails && !folderEmails.length && (
          <CardBody className="text-center text-secondary">
            <FontAwesomeIcon icon={faFolderOpen} size="lg" />
            <br />
            <em>Folder empty</em>
          </CardBody>
        )}
        {folderEmails && folderEmails.length > 0 && (
          <FolderScrollContainer
            folderEmails={folderEmails}
            setDisplayCardHeader={setDisplayCardHeader}
            toggleActionModal={toggleActionModal}
            folderEmailActions={{
              viewEmail,
              deleteEmail,
              replyToEmail,
              forwardEmail
            }}
          />
        )}
      </Card>
      <FolderEmailActions
        folderEmailActionState={folderEmailActionState}
        hideActionModal={updateFolderActionState}
      />
    </Fragment>
  );
};
