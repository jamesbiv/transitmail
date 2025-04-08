import { ImapHelper, ImapSocket, SmtpSocket } from "classes";
import { EImapResponseStatus, IEmailFlagType } from "interfaces";
import { getFlagString, setFlagDefaults, updateFlags } from "lib";

const mockDirectAccessToDependencies = {
  imapHelper: new ImapHelper(),
  imapSocket: new ImapSocket(),
  smtpSocket: new SmtpSocket()
};

jest.mock("contexts/DependenciesContext", () => {
  return {
    directAccessToDependencies: () => mockDirectAccessToDependencies
  };
});

describe("Test FlagActions", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Test setFlagDefaults() function", () => {
    it("a successful response", () => {
      const flagString: string = "\\Answered";

      const setFlagDefaultsResponse: IEmailFlagType[] = setFlagDefaults(flagString);

      expect(setFlagDefaultsResponse).toEqual([
        { enabled: true, flagChanged: false, id: "\\Answered", name: "Answered" },
        { enabled: false, flagChanged: false, id: "\\Flagged", name: "Urgent" },
        { enabled: false, flagChanged: false, id: "\\Draft", name: "Draft" }
      ]);
    });
  });

  describe("Test updateFlags() function", () => {
    it("a successful response", async () => {
      const imapRequestSpy: jest.SpyInstance = jest.spyOn(ImapSocket.prototype, "imapRequest");

      imapRequestSpy.mockImplementation((request: string) => {
        switch (true) {
          case /UID STORE (.*) +FLAGS \((.*)\)/i.test(request):
          case /UID STORE (.*) -FLAGS \((.*)\)/i.test(request):
            return {
              data: [[""]],
              status: EImapResponseStatus.OK
            };
        }
      });

      const actionUids: number[] = [1];
      const flags: IEmailFlagType[] = [];

      const updateFlagsResponse: boolean = await updateFlags(actionUids, flags);

      expect(updateFlagsResponse).toBeTruthy();
    });

    it("an unsuccessful response since actionUids was empty", async () => {
      const actionUids: number[] = [];
      const flags: IEmailFlagType[] = [];

      const updateFlagsResponse: boolean = await updateFlags(actionUids, flags);

      expect(updateFlagsResponse).toBeFalsy();
    });
  });

  describe("Test getFlagString() function", () => {
    it("a successful response with a true condition request", () => {
      const flags: IEmailFlagType[] = [
        {
          name: "Answered",
          id: "\\Answered",
          enabled: true,
          flagChanged: true
        }
      ];

      const getFlagDefaultsResponse: string = getFlagString(flags, true);

      expect(getFlagDefaultsResponse).toEqual("\\Answered");
    });

    it("a successful response with a false condition request", () => {
      const flags: IEmailFlagType[] = [
        {
          name: "Answered",
          id: "\\Answered",
          enabled: false,
          flagChanged: false
        }
      ];

      const getFlagDefaultsResponse: string = getFlagString(flags, false);

      expect(getFlagDefaultsResponse).toEqual("");
    });
  });
});
