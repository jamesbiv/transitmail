import { InfiniteScroll } from "classes";

jest.mock("contexts/DependenciesContext");

(global.IntersectionObserver as any) = class IntersectionObserver {
  constructor() {}

  observe = () => {
    return undefined;
  };

  disconnect = () => {
    return undefined;
  };

  unobserve = () => {
    return undefined;
  };
};

const mockEmailRaw: any = {};

const infiniteScroll = new InfiniteScroll(
  "container-main",
  "topObserver",
  "bottomObserver",
  ({ minIndex, maxIndex, folderPlaceholder, folderScrollSpinner, callback }) => {},
  1
);

describe("Testing the InfiniteScroll class", () => {
  describe("Test startObservation", () => {
    test("", () => {
      // infiniteScroll.startObservation();
    });
  });

  describe("Test stopObservertion", () => {
    test("", () => {
      // infiniteScroll.stopObservertion();
    });
  });

  describe("Test startHandleScroll", () => {
    test("", () => {
      // infiniteScroll.startHandleScroll();
    });
  });

  describe("Test stopHandleScroll", () => {
    test("", () => {
      //  infiniteScroll.stopHandleScroll();
    });
  });

  describe("Test setTotalEntries", () => {
    test("", () => {
      const totalEntries: number = 100;

      infiniteScroll.setTotalEntries(totalEntries);
    });
  });

  describe("Test stopHandleScroll", () => {
    test("", () => {
      const getCurrentSliceResponse: any = infiniteScroll.getCurrentSlice();

      expect(getCurrentSliceResponse).toEqual({
        maxIndex: 15,
        minIndex: 0
      });
    });
  });
});
