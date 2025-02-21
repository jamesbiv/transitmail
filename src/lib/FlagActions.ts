import { directAccessToDependencies } from "contexts";
import { IEmailFlagType } from "interfaces";

const flagTypes: IEmailFlagType[] = [
  {
    name: "Answered",
    id: "\\Answered",
    enabled: false,
    flagChanged: false
  },
  {
    name: "Urgent",
    id: "\\Flagged",
    enabled: false,
    flagChanged: false
  },
  {
    name: "Draft",
    id: "\\Draft",
    enabled: false,
    flagChanged: false
  }
];

/**
 * @name setFlagDefaults
 * @param {string} flagString
 * @returns IEmailFlagType[]
 */
export const setFlagDefaults = (flagString: string): IEmailFlagType[] =>
  flagTypes.map((flagType: IEmailFlagType) => {
    flagType.enabled = flagString.includes(flagType.id);

    return flagType;
  });

/**
 * @name updateFlags
 * @param {number[]} actionUids
 * @param {IEmailFlagType[]} flags
 * @returns boolean
 */
export const updateFlags = (actionUids: number[], flags: IEmailFlagType[]): boolean => {
  if (!actionUids.length) {
    return false;
  }

  const { imapSocket } = directAccessToDependencies();

  const enabledFlags: string | undefined = getFlagString(flags, true);

  actionUids.forEach(
    async (actionUid: number) =>
      await imapSocket.imapRequest(`UID STORE ${actionUid} +FLAGS (${enabledFlags})`)
  );

  const disabledFlags: string | undefined = getFlagString(flags, false);

  actionUids.forEach(
    async (actionUid: number) =>
      await imapSocket.imapRequest(`UID STORE ${actionUid} -FLAGS (${disabledFlags})`)
  );

  return true;
};

/**
 * @name getFlagString
 * @param {IEmailFlagType[]} flags
 * @param {boolean | undefined} condition
 * @returns string
 */
export const getFlagString = (flags: IEmailFlagType[], condition?: boolean | undefined): string =>
  flags
    .reduce((flagResult: string[], flag: IEmailFlagType) => {
      if (condition === undefined || (flag.enabled === condition && flag.flagChanged)) {
        flagResult.push(flag.id);
      }

      return flagResult;
    }, [])
    .join(" ");
