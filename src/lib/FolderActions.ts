import { directAccessToDependencies } from "contexts";
import { EImapResponseStatus, IFolderEmail, IImapResponse } from "interfaces";

/**
 * @name copyEmailToFolder
 * @param {number[]} actionUid
 * @param {destinationFolderId} destinationFolderId
 * @returns boolean
 */
export const copyEmailToFolder = (
  actionUids: number[],
  destinationFolderId: string
): boolean => {
  if (!actionUids.length) {
    return false;
  }

  const { imapSocket, stateManager } = directAccessToDependencies();

  actionUids.forEach(async (actionUid: number) => {
    const copyResponse: IImapResponse = await imapSocket.imapRequest(
      `UID COPY ${actionUid} "${destinationFolderId}"`
    );
  });

  const currentEmailFolder = stateManager.getCurrentFolder()?.emails;
  const currentEmailFolderId = stateManager.getFolderId();

  if (!currentEmailFolder || !currentEmailFolderId) {
    return false;
  }

  stateManager.setFolderId(destinationFolderId);

  const destinationEmailFolder = stateManager.getCurrentFolder()?.emails;

  const copiedFolderEmails: IFolderEmail[] = currentEmailFolder.filter(
    (currentEmail) => actionUids.includes(currentEmail.id)
  );

  if (!destinationEmailFolder || !copiedFolderEmails.length) {
    return false;
  }

  const updatedDestinationFolderEmails: IFolderEmail[] = [
    ...destinationEmailFolder,
    ...copiedFolderEmails,
  ];

  stateManager.updateCurrentFolder(updatedDestinationFolderEmails);
  stateManager.setFolderId(currentEmailFolderId);

  return true;
};

/**
 * @name moveEmailToFolder
 * @param {number[]} actionUid
 * @param {destinationFolderId} destinationFolderId
 * @returns boolean
 */
export const moveEmailToFolder = (
  actionUids: number[],
  destinationFolderId: string
): boolean => {
  if (!actionUids.length) {
    return false;
  }

  const { imapSocket, stateManager } = directAccessToDependencies();

  actionUids.forEach(async (actionUid: number) => {
    const moveResponse: IImapResponse = await imapSocket.imapRequest(
      `UID MOVE ${actionUid} "${destinationFolderId}"`
    );

    if (moveResponse.status !== EImapResponseStatus.OK) {
      await imapSocket.imapRequest(
        `UID COPY ${actionUid} "${destinationFolderId}"`
      );

      await imapSocket.imapRequest(
        `UID STORE ${actionUid} +FLAGS.SILENT (\\Deleted)`
      );

      await imapSocket.imapRequest(`UID EXPUNGE ${actionUid}`);
    }
  });

  const currentEmailFolder = stateManager.getCurrentFolder()?.emails;
  const currentEmailFolderId = stateManager.getFolderId();

  if (!currentEmailFolder || !currentEmailFolderId) {
    return false;
  }

  const movedFolderEmails: IFolderEmail[] = currentEmailFolder.filter(
    (currentEmail) => actionUids.includes(currentEmail.id)
  );

  const updatedCurrentFolderEmails: IFolderEmail[] = currentEmailFolder.filter(
    (currentEmail) => !actionUids.includes(currentEmail.id)
  );

  stateManager.updateCurrentFolder(updatedCurrentFolderEmails);
  stateManager.setFolderId(destinationFolderId);

  const destinationEmailFolder = stateManager.getCurrentFolder()?.emails;

  if (!destinationEmailFolder || !movedFolderEmails.length) {
    return false;
  }

  const updatedDestinationFolderEmails: IFolderEmail[] = [
    ...destinationEmailFolder,
    ...movedFolderEmails,
  ];

  stateManager.updateCurrentFolder(updatedDestinationFolderEmails);
  stateManager.setFolderId(currentEmailFolderId);

  return true;
};

/**
 * @name deleteEmailFromFolder
 * @param {number[]} actionUid
 * @returns boolean
 */
export const deleteEmailFromFolder = (actionUids: number[]): boolean => {
  if (!actionUids.length) {
    return false;
  }

  const { imapSocket, stateManager } = directAccessToDependencies();

  actionUids.forEach(async (actionUid: number) => {
    const deleteResponse: IImapResponse = await imapSocket.imapRequest(
      `UID STORE ${actionUid} +FLAGS (\\Deleted)`
    );
  });

  const currentEmailFolder = stateManager.getCurrentFolder()?.emails;
  const currentEmailFolderId = stateManager.getFolderId();

  if (!currentEmailFolder || !currentEmailFolderId) {
    return false;
  }

  const updatedCurrentFolderEmails: IFolderEmail[] = currentEmailFolder.filter(
    (currentEmail) => !actionUids.includes(currentEmail.id)
  );

  if (!updatedCurrentFolderEmails.length) {
    return false;
  }

  stateManager.updateCurrentFolder(updatedCurrentFolderEmails);

  return true;
};
