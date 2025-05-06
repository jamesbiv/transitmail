import { IFolderPlaceholder, IFolderScrollSpinner, IInfinateScrollHandler } from "interfaces";

/**
 * @interface IInfiniteScrollSlice
 */
interface IInfiniteScrollSlice {
  minIndex: number;
  maxIndex: number;
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

    this.topObserver = new IntersectionObserver(this.topObservationCallback, this.observerDefaults);

    this.bottomObserver = new IntersectionObserver(
      this.bottomObservationCallback,
      this.observerDefaults
    );
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
      this.scrollElement.addEventListener("scroll", this.handleHeavyDesktopScroll);
    }
  };

  /**
   * @method stopHandleScroll
   * @returns void
   */
  public stopHandleScroll = (): void => {
    if (this.scrollElement?.removeEventListener) {
      this.scrollElement.removeEventListener("scroll", this.handleHeavyDesktopScroll);
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
   * @method topObservationCallback
   * @params {IntersectionObserverEntry[]} intersectionEntries
   * @returns void
   */
  private readonly topObservationCallback = (
    intersectionEntries: IntersectionObserverEntry[]
  ): void => {
    intersectionEntries.forEach((intersectionEntry: IntersectionObserverEntry) => {
      if (intersectionEntry.intersectionRatio > 0) {
        const minIndex: number = this.slice.minIndex - this.settings.increment;
        const maxIndex: number = minIndex + this.settings.increment * 2;

        this.triggerScrollHandler(
          minIndex,
          maxIndex,
          window.innerWidth >= this.settings.desktopBreakpoint
        );
      }
    });
  };

  /**
   * @method bottomObservationCallback
   * @params {IntersectionObserverEntry[]} intersectionEntries
   * @returns void
   */
  private readonly bottomObservationCallback = (
    intersectionEntries: IntersectionObserverEntry[]
  ): void => {
    intersectionEntries.forEach((intersectionEntry: IntersectionObserverEntry) => {
      if (intersectionEntry.intersectionRatio > 0) {
        const maxIndex: number = this.slice.maxIndex + this.settings.increment;
        const minIndex: number = maxIndex - this.settings.increment * 2;

        this.triggerScrollHandler(
          minIndex,
          maxIndex,
          window.innerWidth >= this.settings.desktopBreakpoint
        );
      }
    });
  };

  /**
   * @method handleHeavyDesktopScroll
   * @param {Event} event
   * @returns void
   */
  private readonly handleHeavyDesktopScroll = (event: Event): void => {
    if (window.innerWidth <= this.settings.desktopBreakpoint) {
      return;
    }

    const scrollTop: number = this.scrollElement?.scrollTop ?? 0;

    const topObserverPosition: number = this.topObserverElement?.offsetTop ?? 0;
    const bottomObserverPosition: number = this.bottomObserverElement?.offsetTop ?? 0;

    if (scrollTop > bottomObserverPosition + 100 || scrollTop < topObserverPosition - 100) {
      const currentIndex = Math.floor(scrollTop / this.settings.placeholderDesktopHeight);

      const minIndex: number = currentIndex;
      const maxIndex: number = minIndex + this.settings.increment * 2;

      this.triggerScrollHandler(minIndex, maxIndex, true);
    }
  };

  /**
   * @method triggerScrollHandler
   * @param {number} minIndex
   * @param {number } maxIndex
   * @param {() => void} callback
   * @returns void
   */
  private triggerScrollHandler(
    minIndex: number,
    maxIndex: number,
    desktopMode: boolean = false,
    callback?: () => void
  ): void {
    this.slice.minIndex = minIndex > 0 ? minIndex : 0;
    this.slice.maxIndex = maxIndex < this.totalEntries ? maxIndex : this.totalEntries;

    let folderPlaceholder: IFolderPlaceholder | undefined;
    let folderScrollSpinner: IFolderScrollSpinner | undefined;

    if (desktopMode) {
      folderPlaceholder = {
        top: this.slice.minIndex * this.settings.placeholderDesktopHeight,
        bottom: (this.totalEntries - this.slice.maxIndex) * this.settings.placeholderDesktopHeight
      };

      folderScrollSpinner = {
        top: false,
        bottom: false
      };
    } else {
      const placeHolderSize = 4 * this.settings.placeholderMobileHeight;

      folderPlaceholder = {
        top: this.slice.minIndex > 0 ? placeHolderSize : 0,
        bottom:
          this.totalEntries - this.defaultPageSize >= this.slice.maxIndex ? 0 : placeHolderSize
      };

      folderScrollSpinner = {
        top: this.slice.minIndex > 0,
        bottom: this.totalEntries - this.defaultPageSize >= this.slice.maxIndex
      };
    }

    if (this.scrollHandler) {
      this.scrollHandler({
        minIndex: this.slice.minIndex,
        maxIndex: this.slice.maxIndex,
        folderScrollSpinner,
        folderPlaceholder,
        callback
      });
    }
  }
}
