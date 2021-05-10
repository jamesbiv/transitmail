import React, { useContext, useEffect, useState } from "react";
import { DependenciesContext } from "context";
import { InfiniteScroll } from "classes";
import { convertAttachments } from "lib";
import {
  EImapResponseStatus,
  IComposeAttachment,
  IEmail,
  IFolderEmail,
  IFolderLongPress,
  IFolderPlaceholder,
  IFolderScrollSpinner,
  IImapResponse,
} from "interfaces";
import { Card, Spinner, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import {
  FolderEmailEntry,
  FolderEmailActions,
  EFolderEmailActionType,
  FolderTableHeader,
  FolderTableOptions,
  FolderPlaceholder,
  FolderCardHeader,
} from ".";

const folderPageSize: number = 15;

let folderEmails: IFolderEmail[] | undefined;
let toggleSelectionAll: boolean | undefined;

const folderLongPress: IFolderLongPress = {
  timer: 0,
  isReturned: false,
};

export const Folder: React.FC = () => {
  const { imapHelper, imapSocket, stateManager } = useContext(
    DependenciesContext
  );

  const [emails, setEmails] = useState<IFolderEmail[] | undefined>(undefined);
  const [displayHeaders, setDisplayHeaders] = useState<boolean>(true);
  const [displayTableOptions, setDisplayTableOptions] = useState<boolean>(
    false
  );
  const [folderSpinner, setFolderSpinner] = useState<boolean>(true);
  const [actionUids, setActionUids] = useState<number[] | undefined>(undefined);
  const [actionType, setActionType] = useState<EFolderEmailActionType>(
    EFolderEmailActionType.COPY
  );
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [folderPlaceholder, setFolderPlaceholder] = useState<
    IFolderPlaceholder | undefined
  >(undefined);
  const [folderScrollSpinner, setFolderScrollSpinner] = useState<
    IFolderScrollSpinner | undefined
  >(undefined);

  const infiniteScroll: InfiniteScroll = new InfiniteScroll(
    "container-main",
    "topObserver",
    "bottomObserver",
    ({
      minIndex,
      maxIndex,
      folderPlaceholder,
      folderScrollSpinner,
      callback,
    }) => {
      setEmails(folderEmails?.slice(minIndex, maxIndex));
      setDisplayHeaders(minIndex === 0);
      setFolderPlaceholder(folderPlaceholder);
      setFolderScrollSpinner(folderScrollSpinner);

      if (callback) {
        callback();
      }
    },
    folderPageSize
  );

  useEffect(() => {
    (async () => {
      if (imapSocket.getReadyState() !== 1) {
        imapSocket.imapConnect();
      }

      setFolderSpinner(true);

      folderEmails =
        stateManager.getCurrentFolder()?.emails || (await getLatestEmails());

      stateManager.updateCurrentFolder(folderEmails);

      setEmails(folderEmails?.slice(0, folderPageSize));
      setFolderSpinner(false);

      if (folderEmails?.length) {
        infiniteScroll.setTotalEntries(folderEmails.length ?? 0);

        infiniteScroll.startObservation();
        infiniteScroll.startHandleScroll();

        clearAllSelections();
      }
    })();

    return () => {
      infiniteScroll.stopObservertion();
      infiniteScroll.stopHandleScroll();
    };
  }, []);

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

    folderEmails = latestEmails
      ? [...latestEmails, ...currentEmails]
      : currentEmails;

    stateManager.updateCurrentFolder(folderEmails);

    infiniteScroll.setTotalEntries(folderEmails.length);

    updateVisibleEmails(folderPageSize);
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

    const latestEmails: IFolderEmail[] = imapHelper.formatFetchFolderEmailsResponse(
      fetchResponse.data
    );

    latestEmails.sort((a, b) => [1, -1][Number(a.epoch > b.epoch)]);

    return latestEmails;
  };

  const searchEmails = (searchQuery: string): void => {
    if (!folderEmails?.length) {
      return;
    }

    const searchQueryLowercase: string = searchQuery.toLowerCase();

    const currentEmails: IFolderEmail[] =
      stateManager.getCurrentFolder()?.emails ?? [];

    folderEmails =
      searchQuery.length > 0
        ? currentEmails.filter((email: IFolderEmail) => {
            let queryFound: boolean = false;

            if (
              email.date.toLowerCase().indexOf(searchQueryLowercase) > -1 ||
              email.from.toLowerCase().indexOf(searchQueryLowercase) > -1 ||
              email.subject.toLowerCase().indexOf(searchQueryLowercase) > -1
            ) {
              queryFound = true;
            }

            return queryFound;
          })
        : currentEmails;

    infiniteScroll.setTotalEntries(folderEmails.length);

    updateVisibleEmails(folderPageSize);
  };

  const viewEmail = (uid: number): void => {
    stateManager.setActiveUid(uid);

    stateManager.updateActiveKey("view");
  };

  const deleteEmail = (uid: number): void => {
    setActionUids([uid]);
    setActionType(EFolderEmailActionType.DELETE);
    setShowActionModal(true);
  };

  const replyToEmail = async (uid: number): Promise<void> => {
    const fetchEmailResponse: IImapResponse = await imapSocket.imapRequest(
      `UID FETCH ${uid} RFC822`
    );

    if (fetchEmailResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const email: IEmail = imapHelper.formatFetchEmailResponse(
      fetchEmailResponse.data
    );

    const convertedAttachments:
      | IComposeAttachment[]
      | undefined = await convertAttachments(email.attachments);

    stateManager.setComposePresets({
      subject: email.subject,
      from: email.from,
      email: email.bodyHtml ?? email.bodyText ?? "",
      attachments: convertedAttachments,
    });

    stateManager.updateActiveKey("compose");
  };

  const forwardEmail = async (uid: number): Promise<void> => {
    const fetchEmailResponse: IImapResponse = await imapSocket.imapRequest(
      `UID FETCH ${uid} RFC822`
    );

    if (fetchEmailResponse.status !== EImapResponseStatus.OK) {
      return;
    }

    const email: IEmail = imapHelper.formatFetchEmailResponse(
      fetchEmailResponse.data
    );

    const convertedAttachments:
      | IComposeAttachment[]
      | undefined = await convertAttachments(email.attachments);

    stateManager.setComposePresets({
      subject: email.subject,
      email: email.bodyHtml ?? email.bodyText ?? "",
      attachments: convertedAttachments,
    });

    stateManager.updateActiveKey("compose");
  };

  const removeUids = (uids?: number[]): void => {
    uids?.forEach((uid: number) => {
      emails?.forEach((email: IFolderEmail, emailKey: number) => {
        if (email.uid === uid) {
          emails?.splice(emailKey, 1);
        }
      });
    });

    updateVisibleEmails();
  };

  const updateVisibleEmails = (definedLength?: number): void => {
    if (folderEmails) {
      const currentSlice = infiniteScroll.getCurrentSlice();
      const currentSliceLength: number | undefined = definedLength
        ? definedLength
        : currentSlice.maxIndex - currentSlice.minIndex;

      if (currentSlice && currentSliceLength) {
        setEmails(
          folderEmails?.slice(currentSlice.minIndex, currentSliceLength)
        );
      }
    }
  };

  const toggleTableOptionsDisplay = () => {
    if (folderEmails) {
      let displayTableOptions: boolean = false;

      folderEmails.find((email: IFolderEmail) => {
        if (email.selected === true) {
          displayTableOptions = true;
        }
      });

      setDisplayTableOptions(displayTableOptions);
    }
  };

  const toggleSelection = (uid: number, forceToogle?: boolean): void => {
    if (folderEmails) {
      if (uid === -1) {
        if (forceToogle !== undefined) {
          toggleSelectionAll = forceToogle;
        } else {
          toggleSelectionAll = toggleSelectionAll ? false : true;
        }
      }

      folderEmails?.forEach((folderEmail: IFolderEmail, emailKey: number) => {
        if (uid === -1) {
          folderEmails![emailKey].selected = toggleSelectionAll!;
        } else if (folderEmail.uid === uid) {
          if (forceToogle !== undefined) {
            folderEmails![emailKey].selected = forceToogle;
          } else {
            folderEmails![emailKey].selected = folderEmails![emailKey].selected
              ? false
              : true;
          }
        }
      });

      updateVisibleEmails();

      toggleTableOptionsDisplay();
    }
  };

  const clearAllSelections = (): void => {
    if (folderEmails) {
      folderEmails.forEach((folderEmail: IFolderEmail, emailKey: number) => {
        folderEmails![emailKey].selected = false;
      });
    }
  };

  const handleLongPress: (emailUid: number, delay?: number) => void = (
    emailUid,
    delay = 1000
  ) => {
    folderLongPress.isReturned = false;

    folderLongPress.timer = setTimeout((handler: TimerHandler): void => {
      folderLongPress.isReturned = true;

      toggleSelection(emailUid);
    }, delay);
  };

  const handleLongRelease: () => void = () => {
    clearTimeout(folderLongPress.timer);

    folderLongPress.timer = 0;
  };

  const toggleActionModal = (actionType: EFolderEmailActionType): void => {
    const actionUids: number[] | undefined = emails?.reduce(
      (selectedUids: number[], email: IFolderEmail) => {
        if (email.selected) {
          selectedUids.push(email.uid);
        }

        return selectedUids;
      },
      []
    );

    setActionUids(actionUids);
    setActionType(actionType);
    setShowActionModal(true);
  };

  return (
    <React.Fragment>
      <Card className={`${displayHeaders ? "mt-0 mt-sm-3" : ""} mb-3`}>
        {displayHeaders && (
          <FolderCardHeader
            folderName={stateManager.getFolderId()?.split("/").pop() ?? ""}
            folderSpinner={folderSpinner}
            checkEmail={checkEmail}
            searchEmails={searchEmails}
          />
        )}
        {!emails ? (
          <Spinner
            className="mt-3 mb-3 ml-auto mr-auto"
            animation="grow"
            variant="dark"
          />
        ) : !emails.length ? (
          <Card.Body className="text-center text-secondary">
            <FontAwesomeIcon icon={faFolderOpen} size="lg" />
            <br />
            <em>Folder empty</em>
          </Card.Body>
        ) : (
          <Container fluid>
            <FolderTableOptions
              displayTableOptions={displayTableOptions}
              toggleSelection={toggleSelection}
              toggleActionModal={toggleActionModal}
            />
            {displayHeaders && (
              <FolderTableHeader
                emails={emails ?? []}
                toggleSelection={toggleSelection}
                updateVisibleEmails={updateVisibleEmails}
              />
            )}
            <FolderPlaceholder height={folderPlaceholder?.top} />
            {folderScrollSpinner?.top && (
              <div className="w-100 text-center d-block d-sm-none">
                <Spinner
                  className="mt-3 mb-3"
                  animation="grow"
                  variant="dark"
                />
              </div>
            )}
            <div id="topObserver"></div>
            {emails.map((email: IFolderEmail) => (
              <FolderEmailEntry
                key={email.id}
                email={email}
                toggleSelection={toggleSelection}
                viewEmail={viewEmail}
                replyToEmail={replyToEmail}
                forwardEmail={forwardEmail}
                deleteEmail={deleteEmail}
                folderLongPress={folderLongPress}
                handleLongPress={handleLongPress}
                handleLongRelease={handleLongRelease}
              />
            ))}
            <div id="bottomObserver"></div>
            {folderScrollSpinner?.bottom && (
              <div className="w-100 text-center d-block d-sm-none">
                <Spinner
                  className="mt-3 mb-3"
                  animation="grow"
                  variant="dark"
                />
              </div>
            )}
            <FolderPlaceholder height={folderPlaceholder?.bottom} />
          </Container>
        )}
      </Card>
      <FolderEmailActions
        actionUids={actionUids}
        actionType={actionType}
        showActionModal={showActionModal}
        removeUids={removeUids}
        imapHelper={imapHelper}
        imapSocket={imapSocket}
        onHide={() => setShowActionModal(false)}
      />
    </React.Fragment>
  );
};
