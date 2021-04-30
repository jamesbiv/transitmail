import { LocalStorage } from "classes";

const mockItem: any = {};

const localStorage = new LocalStorage();

describe("Testing the LocalStorage class", () => {
  describe("Test setData and getData", () => {
    test("Test a successful set and get senario", () => {
      localStorage.setData("activeUid", "mockVariableContent");

      const getDataResponse = localStorage.getData("activeUid");
      expect(getDataResponse).toEqual("mockVariableContent");
    });
  });

  describe("Test setSetting and getSetting", () => {
    test("Test a successful set and get senario", () => {
      localStorage.setSetting("name", "mockVariableContent");

      const getDataResponse = localStorage.getSetting("name");
      expect(getDataResponse).toEqual("mockVariableContent");
    });
  });
});
