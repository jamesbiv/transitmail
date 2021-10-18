import { directAccessToDependencies } from "contexts";
import { IFolderEmail } from "interfaces";

/**
 * @name copyEmailToFolder
 * @param {number} actionUid
 * @param {destinationFolderId} destinationFolderId
 * @returns boolean
 */
export const copyEmailToFolder = (
  actionUids: number | number[],
  destinationFolderId: string
): boolean => {
  const { stateManager } = directAccessToDependencies();

  const currentEmailFolder = stateManager.getCurrentFolder()?.emails;
  const currentEmailFolderId = stateManager.getFolderId();

  if (!currentEmailFolder || !currentEmailFolderId) {
    return false;
  }

  const actionUidArray: number[] =
    actionUids instanceof Array ? actionUids : [actionUids];

  const correctEmailKeys: number[] | undefined = getEmailKeys(
    actionUidArray,
    currentEmailFolder
  );

  if (!correctEmailKeys) {
    return false;
  }

  stateManager.setFolderId(destinationFolderId);

  const destinationEmailFolder = stateManager.getCurrentFolder()?.emails;

  if (!destinationEmailFolder) {
    return true;
  }

  correctEmailKeys.forEach((correctEmailKey: number) => {
    destinationEmailFolder.push({ ...currentEmailFolder[correctEmailKey] });
  });

  stateManager.updateCurrentFolder(currentEmailFolder);
  stateManager.setFolderId(currentEmailFolderId);

  return true;
};

/**
 * @name moveEmailToFolder
 * @param {number} actionUid
 * @param {destinationFolderId} destinationFolderId
 * @returns boolean
 */
export const moveEmailToFolder = (
  actionUids: number | number[],
  destinationFolderId: string
): boolean => {
  const { stateManager } = directAccessToDependencies();

  const currentEmailFolder = stateManager.getCurrentFolder()?.emails;
  const currentEmailFolderId = stateManager.getFolderId();

  if (!currentEmailFolder || !currentEmailFolderId) {
    return false;
  }

  const actionUidArray: number[] =
    actionUids instanceof Array ? actionUids : [actionUids];

  const correctEmailKeys: number[] | undefined = getEmailKeys(
    actionUidArray,
    currentEmailFolder
  );

  if (!correctEmailKeys) {
    return false;
  }

  const movedFolderEmails: IFolderEmail[] = [];

  correctEmailKeys.forEach((correctEmailKey: number) => {
    movedFolderEmails.push({ ...currentEmailFolder[correctEmailKey] });
    currentEmailFolder.splice(correctEmailKey, 1);
  });

  stateManager.updateCurrentFolder(currentEmailFolder);
  stateManager.setFolderId(destinationFolderId);

  const destinationEmailFolder = stateManager.getCurrentFolder()?.emails;

  if (!destinationEmailFolder || !movedFolderEmails.length) {
    return true;
  }

  movedFolderEmails.forEach((movedFolderEmail: IFolderEmail) => {
    destinationEmailFolder.push(movedFolderEmail);
  });

  stateManager.updateCurrentFolder(currentEmailFolder);
  stateManager.setFolderId(currentEmailFolderId);

  return true;
};

/**
 * @name deleteEmailFromFolder
 * @param {number} actionUid
 * @returns boolean
 */
export const deleteEmailFromFolder = (
  actionUids: number | number[]
): boolean => {
  const { stateManager } = directAccessToDependencies();

  const currentEmailFolder = stateManager.getCurrentFolder()?.emails;
  const currentEmailFolderId = stateManager.getFolderId();

  if (!currentEmailFolder || !currentEmailFolderId) {
    return false;
  }

  const actionUidArray: number[] =
    actionUids instanceof Array ? actionUids : [actionUids];

  const correctEmailKeys: number[] | undefined = getEmailKeys(
    actionUidArray,
    currentEmailFolder
  );

  if (!correctEmailKeys) {
    return false;
  }

  correctEmailKeys.forEach((correctEmailKey: number) => {
    currentEmailFolder.splice(correctEmailKey, 1);
  });

  stateManager.updateCurrentFolder(currentEmailFolder);

  return true;
};

/**
 * @name getEmailKey[]
 * @param {number[]} actionUid
 * @param {IFolderEmail[]} emailFolder
 * @returns {number[] | undefined}
 */
const getEmailKeys = (
  actionUids: number[],
  emailFolder: IFolderEmail[]
): number[] | undefined => {
  const emailKeys: number[] = actionUids.reduce(
    (emailKeys: number[], actionUid) => {
      const emailKey = getEmailKey(actionUid, emailFolder);

      if (emailKey !== undefined) {
        emailKeys.push(emailKey);
      }

      return emailKeys;
    },
    []
  );

  return emailKeys.length ? emailKeys : undefined;
};

/**
 * @name getEmailKey
 * @param {number} actionUid
 * @param {IFolderEmail[]} emailFolder
 * @returns number | undefined
 */
const getEmailKey = (
  actionUid: number,
  emailFolder: IFolderEmail[]
): number | undefined =>
  emailFolder.reduce(
    (
      emailKeyResult: number | undefined,
      emails: IFolderEmail,
      emailKey: number
    ) => {
      if (emails.id === actionUid) {
        emailKeyResult = emailKey;
      }

      return emailKeyResult;
    },
    undefined
  );
