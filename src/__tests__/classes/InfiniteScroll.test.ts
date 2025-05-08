import { fireEvent } from "@testing-library/react";
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
      private readonly callback: IntersectionObserverCallback;

      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
      }

      readonly root = document.createElement("root");
      readonly rootMargin: string = "";
      readonly thresholds: ReadonlyArray<number> = [];

      disconnect() {
        return undefined;
      }

      observe(target: Element) {
        this.callback(
          [{ intersectionRatio: 1 }, { intersectionRatio: 0 }] as IntersectionObserverEntry[],
          undefined!
        );

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
    it("ensuire that scrollHandler() was successfully assigned", () => {
      const infiniteScroll = new InfiniteScroll();

      const scrollHandler = jest
        .fn()
        .mockImplementationOnce(({ minIndex, maxIndex }: IInfinateScrollHandler) => {});

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startTopObservation();

      expect(scrollHandler).toHaveBeenCalled();
    });
  });

  describe("Test startTopObservation()", () => {
    it("a successful response with observe() being called", () => {
      const intersectionObserverSpy: jest.SpyInstance = jest.spyOn(
        IntersectionObserver.prototype,
        "observe"
      );

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startTopObservation();

      expect(intersectionObserverSpy).toHaveBeenCalled();
    });

    it("observe() wont be called because topElementId was not set", () => {
      const intersectionObserverSpy: jest.SpyInstance = jest.spyOn(
        IntersectionObserver.prototype,
        "observe"
      );

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.startTopObservation();

      expect(intersectionObserverSpy).not.toHaveBeenCalled();
    });

    it("observe() wont be called because topObserverElement was not found", () => {
      const intersectionObserverSpy: jest.SpyInstance = jest.spyOn(
        IntersectionObserver.prototype,
        "observe"
      );

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "invalidTopObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startTopObservation();

      expect(intersectionObserverSpy).not.toHaveBeenCalled();
    });
  });

  describe("Test startBottomObservation()", () => {
    it("a successful response with observe() being called", () => {
      const intersectionObserverSpy: jest.SpyInstance = jest.spyOn(
        IntersectionObserver.prototype,
        "observe"
      );

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startBottomObservation();

      expect(intersectionObserverSpy).toHaveBeenCalled();
    });

    it("observe() wont be called because bottomElementId was not set", () => {
      const intersectionObserverSpy: jest.SpyInstance = jest.spyOn(
        IntersectionObserver.prototype,
        "observe"
      );

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.startBottomObservation();

      expect(intersectionObserverSpy).not.toHaveBeenCalled();
    });

    it("observe() wont be called because bottomObserverElement was not found", () => {
      const intersectionObserverSpy: jest.SpyInstance = jest.spyOn(
        IntersectionObserver.prototype,
        "observe"
      );

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "invalidBottomObserver",
        scrollHandler
      );

      infiniteScroll.startBottomObservation();

      expect(intersectionObserverSpy).not.toHaveBeenCalled();
    });
  });

  describe("Test startHandleScroll()", () => {
    it("a successful response with handleDesktopScroll() being called", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const containerMain = document.getElementById("container-main")!;
      const containerMainSpy = jest.spyOn(containerMain, "addEventListener");

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startHandleScroll();

      fireEvent.scroll(containerMain, { target: { scrollTop: 0 } });

      expect(containerMainSpy).toHaveBeenCalled();

      window.innerWidth = originalWindowInnerWidth;
    });

    it("handleDesktopScroll() wont be called because scrollElementId was not set", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      const containerMain = document.getElementById("container-main")!;
      const containerMainSpy = jest.spyOn(containerMain, "addEventListener");

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.startHandleScroll();
      fireEvent.scroll(containerMain, { target: { scrollTop: 0 } });

      expect(containerMainSpy).not.toHaveBeenCalled();

      window.innerWidth = originalWindowInnerWidth;
    });

    it("handleDesktopScroll() wont be called because scrollElement was not found", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const containerMain = document.getElementById("container-main")!;
      const containerMainSpy = jest.spyOn(containerMain, "addEventListener");

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "invalid-container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startHandleScroll();

      fireEvent.scroll(containerMain, { target: { scrollTop: 0 } });

      expect(containerMainSpy).not.toHaveBeenCalled();

      window.innerWidth = originalWindowInnerWidth;
    });
  });

  describe("Test stopHandleScroll()", () => {
    it("a successful response with handleDesktopScroll() being removed as eventHandler", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const containerMain = document.getElementById("container-main")!;
      const containerMainSpy = jest.spyOn(containerMain, "removeEventListener");

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startHandleScroll();

      infiniteScroll.stopHandleScroll();

      expect(containerMainSpy).toHaveBeenCalled();

      window.innerWidth = originalWindowInnerWidth;
    });

    it("handleDesktopScroll() wont be called because scrollElement was not valid", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const containerMain = document.getElementById("container-main")!;
      const containerMainSpy = jest.spyOn(containerMain, "removeEventListener");

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "invalid-container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startHandleScroll();

      infiniteScroll.stopHandleScroll();

      expect(containerMainSpy).not.toHaveBeenCalled();

      window.innerWidth = originalWindowInnerWidth;
    });
  });

  describe("Test stopObservertions()", () => {
    it("a successful response", () => {
      const intersectionObserverSpy: jest.SpyInstance = jest.spyOn(
        IntersectionObserver.prototype,
        "disconnect"
      );

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.stopObservertions();

      expect(intersectionObserverSpy).toHaveBeenCalled();
    });
  });

  describe("Test setTotalEntries()", () => {
    it("a successful response", () => {
      const totalEntries: number = 100;

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      const setTotalEntriesResponse = infiniteScroll.setTotalEntries(totalEntries);

      expect(setTotalEntriesResponse).toBeUndefined();
    });
  });

  describe("Test setVisibleSlice() and getVisibleSlice()", () => {
    it("a successful getting and setting", () => {
      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const visibleSlice = { minIndex: 10, maxIndex: 20 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.setVisibleSlice(visibleSlice);

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toBe(visibleSlice);
    });
  });

  describe("Test topObservationCallback()", () => {
    it("a successful response as desktop", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(200);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startTopObservation();

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toEqual({ minIndex: 70, maxIndex: 100 });

      window.innerWidth = originalWindowInnerWidth;
    });

    it("a successful response as mobile triggering callback", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 100;

      const containerMain = document.getElementById("container-main")!;
      containerMain.scrollTo = jest.fn();

      const scrollHandler = ({ minIndex, maxIndex, callback }: IInfinateScrollHandler) => {
        callback && callback();
      };

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(200);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startHandleScroll();

      infiniteScroll.startTopObservation();

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toEqual({ minIndex: 55, maxIndex: 115 });
      expect(containerMain.scrollTo).toHaveBeenCalledWith({ top: 4298 });

      window.innerWidth = originalWindowInnerWidth;
    });

    it("a successful response as mobile without triggering callback because containerMain was invalid", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 100;

      const containerMain = document.getElementById("container-main")!;
      containerMain.scrollTo = jest.fn();

      const scrollHandler = ({ minIndex, maxIndex, callback }: IInfinateScrollHandler) => {
        callback && callback();
      };

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(200);

      infiniteScroll.initiateHandlers(
        "invalid-container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startHandleScroll();

      infiniteScroll.startTopObservation();

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toEqual({ minIndex: 55, maxIndex: 115 });
      expect(containerMain.scrollTo).not.toHaveBeenCalled();

      window.innerWidth = originalWindowInnerWidth;
    });

    it("a successful response as mobile but callback is not set for minIndex being 0", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 100;

      const containerMain = document.getElementById("container-main")!;
      containerMain.scrollTo = jest.fn();

      const scrollHandler = ({ minIndex, maxIndex, callback }: IInfinateScrollHandler) => {
        callback && callback();
      };

      const visibleSlice = { minIndex: 0, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(200);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startHandleScroll();

      infiniteScroll.startTopObservation();

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toEqual({ minIndex: 0, maxIndex: 60 });
      expect(containerMain.scrollTo).not.toHaveBeenCalled();

      window.innerWidth = originalWindowInnerWidth;
    });
  });

  describe("Test bottomObservationCallback()", () => {
    it("a successful response as desktop", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      const topObserver = document.getElementById("topObserver")!;
      Object.defineProperty(topObserver, "offsetTop", { value: 10 });

      const bottomObserver = document.getElementById("bottomObserver")!;
      Object.defineProperty(bottomObserver, "offsetTop", { value: 100 });

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(200);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startTopObservation();
      infiniteScroll.startBottomObservation();

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();
      expect(getVisibleSliceResponse).toEqual({ minIndex: 85, maxIndex: 115 });

      window.innerWidth = originalWindowInnerWidth;
    });

    it("a successful response as desktop without scrollHandler", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      const topObserver = document.getElementById("topObserver")!;
      Object.defineProperty(topObserver, "offsetTop", { value: 10 });

      const bottomObserver = document.getElementById("bottomObserver")!;
      Object.defineProperty(bottomObserver, "offsetTop", { value: 100 });

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(200);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        undefined!
      );

      infiniteScroll.startTopObservation();
      infiniteScroll.startBottomObservation();

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();
      expect(getVisibleSliceResponse).toEqual({ minIndex: 85, maxIndex: 115 });

      window.innerWidth = originalWindowInnerWidth;
    });

    it("a successful response as mobile", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 100;

      const topObserver = document.getElementById("topObserver")!;
      Object.defineProperty(topObserver, "offsetTop", { value: 10 });

      const bottomObserver = document.getElementById("bottomObserver")!;
      Object.defineProperty(bottomObserver, "offsetTop", { value: 100 });

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(200);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startTopObservation();
      infiniteScroll.startBottomObservation();

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toEqual({ minIndex: 85, maxIndex: 145 });

      window.innerWidth = originalWindowInnerWidth;
    });

    it("a successful response as mobile without scrollHandler", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 100;

      const topObserver = document.getElementById("topObserver")!;
      Object.defineProperty(topObserver, "offsetTop", { value: 10 });

      const bottomObserver = document.getElementById("bottomObserver")!;
      Object.defineProperty(bottomObserver, "offsetTop", { value: 100 });

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(200);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        undefined!
      );

      infiniteScroll.startTopObservation();
      infiniteScroll.startBottomObservation();

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toEqual({ minIndex: 85, maxIndex: 145 });

      window.innerWidth = originalWindowInnerWidth;
    });

    it("a successful response as mobile but bottomObserver offsetTop is invalid", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 100;

      const topObserver = document.getElementById("topObserver")!;
      Object.defineProperty(topObserver, "offsetTop", { value: 10 });

      const bottomObserver = document.getElementById("bottomObserver")!;
      Object.defineProperty(bottomObserver, "offsetTop", { value: undefined });

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(10);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startTopObservation();
      infiniteScroll.startBottomObservation();

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toEqual({ minIndex: 0, maxIndex: 10 });

      window.innerWidth = originalWindowInnerWidth;
    });
  });

  describe("Test handleDesktopScroll()", () => {
    it("a successful response", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      const topObserver = document.getElementById("topObserver")!;
      Object.defineProperty(topObserver, "offsetTop", { value: 10 });

      const bottomObserver = document.getElementById("bottomObserver")!;
      Object.defineProperty(bottomObserver, "offsetTop", { value: 100 });

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(200);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startHandleScroll();

      const containerMain = document.getElementById("container-main")!;
      fireEvent.scroll(containerMain, { target: { scrollTop: 1000 } });

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toEqual({ minIndex: 15, maxIndex: 45 });

      window.innerWidth = originalWindowInnerWidth;
    });

    it("a successful response with scrollTop of scrollElement being invalid", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      const topObserver = document.getElementById("topObserver")!;
      Object.defineProperty(topObserver, "offsetTop", { value: 10 });

      const bottomObserver = document.getElementById("bottomObserver")!;
      Object.defineProperty(bottomObserver, "offsetTop", { value: 100 });

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(200);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startHandleScroll();

      const containerMain = document.getElementById("container-main")!;
      Object.defineProperty(containerMain, "scrollTop", { value: undefined });
      fireEvent.scroll(containerMain, { target: { scrollBottom: 1000 } });

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toEqual({ minIndex: 85, maxIndex: 100 });

      window.innerWidth = originalWindowInnerWidth;
    });

    it("a successful response with minIndex set to 0 when scrolling goes into negative values", async () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      const topObserver = document.getElementById("topObserver")!;
      Object.defineProperty(topObserver, "offsetTop", { value: 10 });

      const bottomObserver = document.getElementById("bottomObserver")!;
      Object.defineProperty(bottomObserver, "offsetTop", { value: 100 });

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(200);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startHandleScroll();

      const containerMain = document.getElementById("container-main")!;

      fireEvent.scroll(containerMain, { target: { scrollTop: 0 } });

      await sleep(10);

      fireEvent.scroll(containerMain, { target: { scrollTop: -200 } });

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toEqual({ minIndex: 0, maxIndex: 30 });

      window.innerWidth = originalWindowInnerWidth;
    });

    it("a successful response with minIndex set to 0 when scrolling goes into negative values", async () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 1000;

      const topObserver = document.getElementById("topObserver")!;
      Object.defineProperty(topObserver, "offsetTop", { value: 10 });

      const bottomObserver = document.getElementById("bottomObserver")!;
      Object.defineProperty(bottomObserver, "offsetTop", { value: 100 });

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(100);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startHandleScroll();

      const containerMain = document.getElementById("container-main")!;
      fireEvent.scroll(containerMain, { target: { scrollTop: 0 } });

      await sleep(10);

      fireEvent.scroll(containerMain, { target: { scrollTop: 5000 } });

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toEqual({ minIndex: 76, maxIndex: 100 });

      window.innerWidth = originalWindowInnerWidth;
    });

    it("breaks early and makes no changes to visibleSlice if is mobile mode", () => {
      const originalWindowInnerWidth = window.innerWidth;

      window.innerWidth = 100;

      const topObserver = document.getElementById("topObserver")!;
      Object.defineProperty(topObserver, "offsetTop", { value: 10 });

      const bottomObserver = document.getElementById("bottomObserver")!;
      Object.defineProperty(bottomObserver, "offsetTop", { value: 100 });

      const scrollHandler = ({ minIndex, maxIndex }: IInfinateScrollHandler) => {};

      const visibleSlice = { minIndex: 85, maxIndex: 100 };

      const infiniteScroll = new InfiniteScroll();

      infiniteScroll.setVisibleSlice(visibleSlice);
      infiniteScroll.setTotalEntries(200);

      infiniteScroll.initiateHandlers(
        "container-main",
        "topObserver",
        "bottomObserver",
        scrollHandler
      );

      infiniteScroll.startHandleScroll();

      const containerMain = document.getElementById("container-main")!;
      fireEvent.scroll(containerMain, { target: { scrollTop: 1000 } });

      const getVisibleSliceResponse = infiniteScroll.getVisibleSlice();

      expect(getVisibleSliceResponse).toEqual({ minIndex: 85, maxIndex: 100 });

      window.innerWidth = originalWindowInnerWidth;
    });
  });
});
