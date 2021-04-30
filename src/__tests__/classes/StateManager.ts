import { StateManager } from "classes";

const mockItem: any = {};

const stateManager = new StateManager({} as any);

describe("Testing the StateManager class", () => {
  describe("Test ", () => {
    test("", () => {
      const mockUid: number = 1;

      stateManager.setActiveUid(mockUid);

      const getActiveUidResponse:
        | number
        | undefined = stateManager.getActiveUid();

      expect(getActiveUidResponse).toEqual(mockUid);
    });
  });
});
