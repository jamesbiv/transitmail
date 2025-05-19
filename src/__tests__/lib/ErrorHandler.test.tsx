import { contextSpyHelper } from "__tests__/fixtures";

import { StateManager } from "classes";
import { IMessageModalState } from "interfaces";
import { errorHandler } from "lib";

describe("Test errorHandler", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("showMessageModal()", () => {
    it("triggering error handler", async () => {
      const showMessageModalSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "showMessageModal"
      );

      showMessageModalSpy.mockImplementationOnce((messageModalState: IMessageModalState) => {});

      const messageModalState = {
        type: "",
        timeStamp: 12345,
        reason: {
          message: "string",
          stack: "string"
        }
      } as never;

      errorHandler(messageModalState);

      expect(showMessageModalSpy).toHaveBeenCalled();
    });
  });

  describe("showErrorLimit", () => {
    it("testing when showErrorLimit is hit", async () => {
      const showMessageModalSpy: jest.SpyInstance = jest.spyOn(
        contextSpyHelper<StateManager>("stateManager"),
        "showMessageModal"
      );

      showMessageModalSpy.mockImplementation((messageModalState: IMessageModalState) => {});

      const messageModalState = {
        type: "",
        timeStamp: 12345,
        reason: {
          message: "string",
          stack: "string"
        }
      } as never;

      [...new Array(10)].forEach((_) => {
        errorHandler(messageModalState);
      });

      expect(showMessageModalSpy).toHaveBeenCalledTimes(9);
    });
  });
});
