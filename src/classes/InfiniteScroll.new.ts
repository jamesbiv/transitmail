import { IFolderPlaceholder, IFolderScrollSpinner, IInfinateScrollHandler } from "interfaces";

/**
 * @interface IInfiniteScrollSlice
 */
interface IInfiniteScrollSlice {
  minIndex: number;
  maxIndex: number;
}

/**
 * @enum EInfiniteScrollDirection
 */
enum EInfiniteScrollDirection {
  UP,
  DOWN
}

/**
 * @interface IInfiniteScrollSettings
 */
interface IInfiniteScrollSettings {
  pageSize: number;
  increment: number;
  desktopBreakpoint: number;
  placeholderDesktopHeight: number;
  placeholderMobileHeight: number;
  loaderHeight: number;
  navbarOffset: number;
}

/**
 * @class InfiniteScroll
 */
export class InfiniteScroll {
  /**
   * @protected {number} defaultPageSize
   */
  protected defaultPageSize: number = 15;

  /**
   * @protected {number} totalEntries
   */
  protected totalEntries: number = 0;

  /**
   * @protected {IntersectionObserverInit} observerDefaults
   */
  protected observerDefaults: IntersectionObserverInit = {
    rootMargin: "0px",
    threshold: 1.0
  };

  /**
   * @protected {string} topElementId
   */
  protected topElementId: string | undefined;

  /**
   * @protected {HTMLElement} topObserverElement
   */
  protected topObserverElement: HTMLElement | undefined;

  /**
   * @protected {IntersectionObserver} topObserver
   */
  protected topObserver: IntersectionObserver;

  /**
   * @protected {string} bottomElementId
   */
  protected bottomElementId: string | undefined;

  /**
   * @protected {HTMLElement} bottomObserverElement
   */
  protected bottomObserverElement: HTMLElement | undefined;

  /**
   * @protected {IntersectionObserver} bottomObserver
   */
  protected bottomObserver: IntersectionObserver;

  /**
   * @protected {string} scrollElementId
   */
  protected scrollElementId: string | undefined;

  /**
   * @protected {HTMLElement} scrollElement
   */
  protected scrollElement: HTMLElement | undefined;

  /**
   * @protected {EInfiniteScrollDirection} scrollDirection
   */
  protected scrollDirection: EInfiniteScrollDirection | undefined;

  /**
   * @protected {number} previousScrollTop
   */
  protected previousScrollTop: number;

  /**
   * @protected {IInfiniteScrollSettings} settings
   */
  protected settings: IInfiniteScrollSettings;

  /**
   * @protected {IInfiniteScrollSlice} slice
   */
  protected slice: IInfiniteScrollSlice;

  /**
   * @protected {((args: IInfinateScrollHandler) => void) | undefined} scrollHandler
   */
  protected scrollHandler: ((args: IInfinateScrollHandler) => void) | undefined;

  /**
   * @constructor
   * @param {Partial<IInfiniteScrollSettings>} settings
   */
  constructor(settings?: Partial<IInfiniteScrollSettings>) {
    this.settings = {
      pageSize: this.defaultPageSize,
      increment: this.defaultPageSize,
      desktopBreakpoint: 576,
      loaderHeight: 65,
      navbarOffset: 56,
      placeholderDesktopHeight: 65,
      placeholderMobileHeight: 141,
      ...settings
    };

    this.slice = {
      minIndex: 0,
      maxIndex: this.settings.pageSize
    };

    this.topObserver = new IntersectionObserver(
      this.topMobileObservationCallback,
      this.observerDefaults
    );

    this.bottomObserver = new IntersectionObserver(
      this.bottomMobileObservationCallback,
      this.observerDefaults
    );

    this.previousScrollTop = 0;
  }

  /**
   * @method initiateHandlers
   * @param {string} scrollElementId
   * @param {string} topElementId
   * @param {string} bottomElementId
   * @param {(args: IInfinateScrollHandler) => void} scrollHandler
   * @returns void
   */
  public initiateHandlers(
    scrollElementId: string,
    topElementId: string,
    bottomElementId: string,
    scrollHandler: (args: IInfinateScrollHandler) => void
  ): void {
    this.scrollElementId = scrollElementId;
    this.topElementId = topElementId;
    this.bottomElementId = bottomElementId;

    this.scrollHandler = scrollHandler;
  }

  /**
   * @method startTopObservation
   * @returns void
   */
  public startTopObservation(): void {
    if (!this.topElementId) {
      return;
    }

    this.topObserverElement = document.getElementById(this.topElementId) as HTMLElement;

    if (this.topObserverElement) {
      this.topObserver.observe(this.topObserverElement);
    }
  }

  /**
   * @method startBottomObservation
   * @returns void
   */
  public startBottomObservation(): void {
    if (!this.bottomElementId) {
      return;
    }

    this.bottomObserverElement = document.getElementById(this.bottomElementId) as HTMLElement;

    if (this.bottomObserverElement) {
      this.bottomObserver.observe(this.bottomObserverElement);
    }
  }

  /**
   * @method startHandleScroll
   * @returns void
   */
  public startHandleScroll = (): void => {
    if (!this.scrollElementId) {
      return;
    }

    this.scrollElement = document.getElementById(this.scrollElementId) as HTMLElement;

    if (this.scrollElement) {
      this.scrollElement.addEventListener("scroll", this.handleDesktopScroll);
      this.scrollElement.addEventListener("scroll", this.getScrollDirection);
    }
  };

  /**
   * @method stopHandleScroll
   * @returns void
   */
  public stopHandleScroll = (): void => {
    if (this.scrollElement?.removeEventListener) {
      this.scrollElement.removeEventListener("scroll", this.handleDesktopScroll);
      this.scrollElement.removeEventListener("scroll", this.getScrollDirection);
    }
  };

  /**
   * @method stopObservertions
   * @returns void
   */
  public stopObservertions(): void {
    this.topObserver.disconnect();
    this.bottomObserver.disconnect();
  }

  /**
   * @method setTotalEntries
   * @params {number} totalEntries
   * @returns void
   */
  public setTotalEntries(totalEntries: number): void {
    this.totalEntries = totalEntries;
  }

  /**
   * @method getCurrentSlice
   * @returns IInfiniteScrollSlice
   */
  public getCurrentSlice(): IInfiniteScrollSlice {
    return this.slice;
  }

  /**
   * @method getCurrentIncrement
   * @returns number
   */
  private getCurrentIncrement(): number {
    if (window.innerWidth >= this.settings.desktopBreakpoint) {
      return this.settings.pageSize;
    }

    const availableSpace = window.innerHeight - this.settings.navbarOffset;

    const currentIncrement: number = Math.ceil(
      availableSpace / this.settings.placeholderMobileHeight
    );

    return currentIncrement;
  }

  /**
   * @method getScrollDirection
   * @param {Event} event
   * @returns void
   */
  private readonly getScrollDirection = (event: Event): void => {
    const { target } = event as unknown as { target: HTMLElement };
    const currentScrollTop: number = target?.scrollTop ?? 0;

    this.scrollDirection =
      currentScrollTop > this.previousScrollTop
        ? EInfiniteScrollDirection.DOWN
        : EInfiniteScrollDirection.UP;

    this.previousScrollTop = currentScrollTop;
  };

  /**
   * @method topMobileObservationCallback
   * @params {IntersectionObserverEntry[]} intersectionEntries
   * @returns void
   */
  private readonly topMobileObservationCallback = (
    intersectionEntries: IntersectionObserverEntry[]
  ): void => {
    intersectionEntries.forEach((intersectionEntry: IntersectionObserverEntry) => {
      if (intersectionEntry.intersectionRatio < 1) {
        return;
      }

      const currentMinIndex: number = this.slice.minIndex - this.getCurrentIncrement();

      const minIndex: number = currentMinIndex > 0 ? currentMinIndex : 0;
      const maxIndex: number = minIndex + this.getCurrentIncrement() * 2;

      window.innerWidth > this.settings.desktopBreakpoint
        ? this.triggerScrollHandlerForDesktop(minIndex, maxIndex)
        : this.triggerScrollHandlerForMobile(minIndex, maxIndex);
    });
  };

  /**
   * @method bottomMobileObservationCallback
   * @params {IntersectionObserverEntry[]} intersectionEntries
   * @returns void
   */
  private readonly bottomMobileObservationCallback = (
    intersectionEntries: IntersectionObserverEntry[]
  ): void => {
    intersectionEntries.forEach((intersectionEntry: IntersectionObserverEntry) => {
      if (intersectionEntry.intersectionRatio < 1) {
        return;
      }

      const currentMaxIndex: number = this.slice.minIndex - this.getCurrentIncrement();

      const maxIndex: number =
        currentMaxIndex < this.totalEntries ? currentMaxIndex : this.totalEntries;
      const minIndex: number = maxIndex - this.getCurrentIncrement() * 2;

      window.innerWidth > this.settings.desktopBreakpoint
        ? this.triggerScrollHandlerForDesktop(minIndex, maxIndex)
        : this.triggerScrollHandlerForMobile(minIndex, maxIndex);
    });
  };

  /**
   * @method triggerScrollHandlerForMobile
   * @param {number} minIndex
   * @param {number } maxIndex
   * @returns void
   */
  private triggerScrollHandlerForMobile(minIndex: number, maxIndex: number): void {
    if (!this.scrollHandler) {
      return;
    }

    this.slice.minIndex = minIndex > 0 ? minIndex : 0;
    this.slice.maxIndex = maxIndex < this.totalEntries ? maxIndex : this.totalEntries;

    const folderPlaceholder: IFolderPlaceholder = {
      top: this.slice.minIndex * this.settings.placeholderMobileHeight,
      bottom: (this.totalEntries - this.slice.maxIndex) * this.settings.placeholderMobileHeight
    };

    const folderScrollSpinner: IFolderScrollSpinner = {
      top: false,
      bottom: false
    };

    this.scrollHandler({
      minIndex: this.slice.minIndex,
      maxIndex: this.slice.maxIndex,
      folderPlaceholder,
      folderScrollSpinner
    });
  }

  /**
   * @method handleDesktopScroll
   * @param {Event} event
   * @returns void
   */
  private readonly handleDesktopScroll = (event: Event): void => {
    if (window.innerWidth < this.settings.desktopBreakpoint) {
      return;
    }

    const scrollTop: number = this.scrollElement?.scrollTop ?? 0;

    const topObserverPosition: number = this.topObserverElement?.offsetTop ?? 0;
    const bottomObserverPosition: number = this.bottomObserverElement?.offsetTop ?? 0;

    if (scrollTop > bottomObserverPosition + 100 || scrollTop < topObserverPosition - 100) {
      const currentIndex = Math.floor(scrollTop / this.settings.placeholderDesktopHeight);

      const minIndex: number = currentIndex;
      const maxIndex: number = minIndex + this.settings.increment * 2;

      this.triggerScrollHandlerForDesktop(minIndex, maxIndex);
    }
  };

  /**
   * @method triggerScrollHandlerForDesktop
   * @param {number} minIndex
   * @param {number } maxIndex
   * @returns void
   */
  private triggerScrollHandlerForDesktop(minIndex: number, maxIndex: number): void {
    if (!this.scrollHandler) {
      return;
    }

    this.slice.minIndex = minIndex > 0 ? minIndex : 0;
    this.slice.maxIndex = maxIndex < this.totalEntries ? maxIndex : this.totalEntries;

    const folderPlaceholder: IFolderPlaceholder = {
      top: this.slice.minIndex * this.settings.placeholderDesktopHeight,
      bottom: (this.totalEntries - this.slice.maxIndex) * this.settings.placeholderDesktopHeight
    };

    this.scrollHandler({
      minIndex: this.slice.minIndex,
      maxIndex: this.slice.maxIndex,
      folderPlaceholder
    });
  }
}
