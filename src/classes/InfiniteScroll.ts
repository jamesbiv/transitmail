import { IFolderPlaceholder, IFolderScrollSpinner, IInfinateScrollHandler } from "interfaces";

interface IInfiniteScrollSlice {
  minIndex: number;
  maxIndex: number;
}

interface IInfiniteScrollSettings {
  pageSize: number;
  increment: number;
  desktopBreakpoint: number;
  placeholderDesktopHeight: number;
  placeholderMobileHeight: number;
  loaderHeight: number;
  navbarOffset: number;
}

export class InfiniteScroll {
  /**
   * @var {number} defaultPageSize
   */
  protected defaultPageSize: number = 15;

  /**
   * @var {number} totalEntries
   */
  protected totalEntries: number = 0;

  /**
   * @var {IntersectionObserverInit} observerDefaults
   */
  protected observerDefaults: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
  };

  /**
   * @var {string} topElementId
   */
  protected topElementId: string | undefined;

  /**
   * @var {HTMLElement} topObserverElement
   */
  protected topObserverElement: HTMLElement | undefined;

  /**
   * @var {IntersectionObserver} topObserver
   */
  protected topObserver: IntersectionObserver;

  /**
   * @var {string} bottomElementId
   */
  protected bottomElementId: string | undefined;

  /**
   * @var {HTMLElement} bottomObserverElement
   */
  protected bottomObserverElement: HTMLElement | undefined;

  /**
   * @var {IntersectionObserver} bottomObserver
   */
  protected bottomObserver: IntersectionObserver;

  /**
   * @var {string} scrollElementId
   */
  protected scrollElementId: string | undefined;

  /**
   * @var {HTMLElement} scrollElement
   */
  protected scrollElement: HTMLElement | undefined;

  /**
   * @var {IInfiniteScrollSettings} settings
   */
  protected settings: IInfiniteScrollSettings;

  /**
   * @var {IInfiniteScrollSlice} slice
   */
  protected slice: IInfiniteScrollSlice;

  /**
   * @var {(args: IInfinateScrollHandler) => void} stateHander
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
   * @param {IInfiniteScrollInitiateHandlers} args
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
   * @name startTopObservation
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
   * @name startBottomObservation
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
   * @name startHandleScroll
   * @returns void
   */
  public startHandleScroll = (): void => {
    if (!this.scrollElementId) {
      return;
    }

    this.scrollElement = document.getElementById(this.scrollElementId) as HTMLElement;

    if (this.scrollElement) {
      this.scrollElement.addEventListener("scroll", this.handleDesktopScroll);
    }
  };

  /**
   * @name stopHandleScroll
   * @returns void
   */
  public stopHandleScroll = (): void => {
    if (this.scrollElement?.removeEventListener) {
      this.scrollElement.removeEventListener("scroll", this.handleDesktopScroll);
    }
  };

  /**
   * @name stopObservertions
   * @returns void
   */
  public stopObservertions(): void {
    this.topObserver.disconnect();
    this.bottomObserver.disconnect();
  }

  /**
   * @name setTotalEntries
   * @params {number} totalEntries
   * @returns void
   */
  public setTotalEntries(totalEntries: number): void {
    this.totalEntries = totalEntries;
  }

  /**
   * @name getCurrentSlice
   * @returns IInfiniteScrollSlice
   */
  public getCurrentSlice(): IInfiniteScrollSlice {
    return this.slice;
  }

  /**
   * @name topObservationCallback
   * @params {IntersectionObserverEntry[]} intersectionEntries
   * @returns void
   */
  private topObservationCallback = (intersectionEntries: IntersectionObserverEntry[]): void => {
    intersectionEntries.forEach((intersectionEntry: IntersectionObserverEntry) => {
      if (intersectionEntry.intersectionRatio > 0) {
        const minIndex: number = this.slice.minIndex - this.settings.increment;
        const maxIndex: number = minIndex + this.settings.increment * 2;

        if (window.innerWidth >= this.settings.desktopBreakpoint) {
          this.triggerStateHandler(minIndex, maxIndex, true);
        } else {
          const callback: (() => void) | undefined =
            this.slice.minIndex > 0
              ? () => {
                  const lastEntryPosition =
                    this.settings.increment * this.settings.placeholderMobileHeight +
                    this.settings.loaderHeight +
                    this.settings.navbarOffset;

                  this.scrollElement?.scrollTo(0, lastEntryPosition);
                }
              : undefined;

          this.triggerStateHandler(minIndex, maxIndex, false, callback);
        }
      }
    });
  };

  /**
   * @name bottomObservationCallback
   * @params {IntersectionObserverEntry[]} intersectionEntries
   * @returns void
   */
  private bottomObservationCallback = (intersectionEntries: IntersectionObserverEntry[]): void => {
    intersectionEntries.forEach((intersectionEntry: IntersectionObserverEntry) => {
      if (intersectionEntry.intersectionRatio > 0) {
        const maxIndex: number = this.slice.maxIndex + this.settings.increment;
        const minIndex: number = maxIndex - this.settings.increment * 2;

        this.slice.minIndex = minIndex > 0 ? minIndex : 0;
        this.slice.maxIndex = maxIndex < this.totalEntries ? maxIndex : this.totalEntries;

        this.triggerStateHandler(
          minIndex,
          maxIndex,
          window.innerWidth >= this.settings.desktopBreakpoint
        );
      }
    });
  };

  /**
   * @name handleDesktopScroll
   * @param {Event} event
   * @returns void
   */
  private handleDesktopScroll = (event: Event): void => {
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

      this.triggerStateHandler(minIndex, maxIndex, true);
    }
  };

  /**
   * @name triggerStateHandler
   * @param {number} minIndex
   * @param {number } maxIndex
   * @param {() => void} callback
   * @returns void
   */
  private triggerStateHandler(
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
    } else {
      folderScrollSpinner = {
        top: this.slice.minIndex > 0,
        bottom: true
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
