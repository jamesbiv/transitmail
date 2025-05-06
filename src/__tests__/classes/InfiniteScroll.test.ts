import { fireEvent } from "@testing-library/dom";
import { sleep } from "__tests__/fixtures";
import { InfiniteScroll } from "classes";
import { IInfinateScrollHandler } from "interfaces";

jest.mock("contexts/DependenciesContext");

describe("Testing the InfiniteScroll class", () => {
  const originalIntersectionObserver = global.IntersectionObserver;

  beforeEach(() => {
    const containerMain = document.createElement("div");
    containerMain.setAttribute("id", "container-main");

    document.body.appendChild(containerMain);

    const topObserver = document.createElement("div");
    topObserver.setAttribute("id", "topObserver");

    document.body.appendChild(topObserver);

    const bottomObserver = document.createElement("div");
    bottomObserver.setAttribute("id", "bottomObserver");

    document.body.appendChild(bottomObserver);

    global.IntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) {
        callback(
          [{ intersectionRatio: 1 }, { intersectionRatio: 0 }] as IntersectionObserverEntry[],
          undefined!
        );
      }

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
    document.body.replaceChildren();

    global.IntersectionObserver = originalIntersectionObserver;

    jest.restoreAllMocks();
  });

  describe("Test initiateHandlers()", () => {
    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );
    });

    it("", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 200;

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );

      window.innerWidth = originalWindowInnerWidth;
    });
  });

  describe("Test startTopObservation()", () => {
    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );

      infiniteScroll.startTopObservation();
    });

    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.startTopObservation();
    });

    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "invalidTopObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );

      infiniteScroll.startTopObservation();
    });
  });

  describe("Test startBottomObservation()", () => {
    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );

      infiniteScroll.startBottomObservation();
    });

    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.startBottomObservation();
    });

    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "invalidBottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );

      infiniteScroll.startBottomObservation();
    });
  });

  describe("Test handleHeavyDesktopScroll()", () => {
    it("", async () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 100;

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );

      infiniteScroll.startHandleScroll();

      fireEvent.scroll(document.getElementById("container-main")!, {
        target: { scrollBottom: 0 }
      });

      await sleep(400);

      fireEvent.scroll(document.getElementById("container-main")!, {
        target: { scrollBottom: 100 }
      });

      await sleep(400);

      fireEvent.scroll(document.getElementById("container-main")!, {
        target: { scrollBottom: 1000 }
      });

      await sleep(400);

      fireEvent.scroll(document.getElementById("container-main")!, {
        target: { scrollBottom: 10000 }
      });

      window.innerWidth = originalWindowInnerWidth;
    });

    it("", async () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      jest
        .spyOn(document.getElementById("container-main")!, "scrollTop", "get")
        .mockImplementationOnce(() => 200);

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );

      infiniteScroll.startHandleScroll();

      fireEvent.scroll(document.getElementById("container-main")!, {
        target: { scrollBottom: 0 }
      });

      await sleep(400);

      fireEvent.scroll(document.getElementById("container-main")!, {
        target: { scrollBottom: 100 }
      });

      await sleep(400);

      fireEvent.scroll(document.getElementById("container-main")!, {
        target: { scrollBottom: 1000 }
      });

      await sleep(400);

      fireEvent.scroll(document.getElementById("container-main")!, {
        target: { scrollBottom: 10000 }
      });

      window.innerWidth = originalWindowInnerWidth;
    });
  });

  describe("Test startHandleScroll()", () => {
    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.startHandleScroll();
    });

    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "invalid-container-main",
        "topObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );

      infiniteScroll.startHandleScroll();
    });
  });

  describe("Test stopHandleScroll()", () => {
    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "invalid-container-main",
        "topObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );
      infiniteScroll.startHandleScroll();

      infiniteScroll.stopHandleScroll();
    });

    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );
      infiniteScroll.startHandleScroll();

      infiniteScroll.stopHandleScroll();
    });
  });

  describe("Test stopObservertions()", () => {
    it("", () => {
      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );

      infiniteScroll.stopObservertions();
    });
  });

  describe("Test setTotalEntries()", () => {
    test("", () => {
      const totalEntries: number = 100;

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );

      infiniteScroll.setTotalEntries(totalEntries);
    });
  });

  describe("Test stopHandleScroll()", () => {
    test("", () => {
      const infiniteScroll = new InfiniteScroll();

      const getCurrentSliceResponse = infiniteScroll.getCurrentSlice();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        ({
          minIndex,
          maxIndex,
          folderPlaceholder,
          folderScrollSpinner,
          callback
        }: IInfinateScrollHandler) => {}
      );

      expect(getCurrentSliceResponse).toEqual({
        maxIndex: 0,
        minIndex: 0
      });
    });
  });
});
