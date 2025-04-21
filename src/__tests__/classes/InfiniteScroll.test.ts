import { InfiniteScroll } from "classes";

jest.mock("contexts/DependenciesContext");

describe("Testing the InfiniteScroll class", () => {
  const originalIntersectionObserver = global.IntersectionObserver;

  beforeEach(() => {
    global.IntersectionObserver = class {
      readonly root = document.createElement("root");
      readonly rootMargin: string = "";
      readonly thresholds: ReadonlyArray<number> = [];

      disconnect() {
        return undefined;
      }
      observe(target: Element) {
        return undefined;
      }
      takeRecords() {
        return [];
      }
      unobserve(target: Element) {
        return undefined;
      }
    };
  });

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;

    jest.restoreAllMocks();
  });

  describe("Test startTopObservation", () => {
    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.startTopObservation();
    });
  });

  describe("Test startBottomObservation", () => {
    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.startBottomObservation();
    });
  });

  describe("Test startHandleScroll", () => {
    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.startHandleScroll();
    });
  });

  describe("Test stopHandleScroll", () => {
    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.stopHandleScroll();
    });
  });

  describe("Test setTotalEntries", () => {
    test("", () => {
      const totalEntries: number = 100;

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setTotalEntries(totalEntries);
    });
  });

  describe("Test stopHandleScroll", () => {
    test("", () => {
      const infiniteScroll = new InfiniteScroll();

      const getCurrentSliceResponse = infiniteScroll.getCurrentSlice();

      expect(getCurrentSliceResponse).toEqual({
        maxIndex: 15,
        minIndex: 0
      });
    });
  });
});
