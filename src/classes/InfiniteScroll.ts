import { IFolderPlaceholder, IFolderScrollSpinner } from "interfaces";

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

interface IInfinateScrollStateHandlerParams {
  minIndex: number;
  maxIndex: number;
  folderPlaceholder?: IFolderPlaceholder;
  folderScrollSpinner?: IFolderScrollSpinner;
  callback?: () => void;
}

export class InfiniteScroll {
  /**
   * @var {IntersectionObserverInit} observerDefaults
   */
  protected observerDefaults: IntersectionObserverInit = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  /**
   * @var {string} topElementId
   */
  protected topElementId: string;

  /**
   * @var {HTMLElement} topObserverElement
   */
  protected topObserverElement: HTMLElement = {} as HTMLElement;

  /**
   * @var {IntersectionObserver} topObserver
   */
  protected topObserver: IntersectionObserver;

  /**
   * @var {string} bottomElementId
   */
  protected bottomElementId: string;

  /**
   * @var {HTMLElement} bottomObserverElement
   */
  protected bottomObserverElement: HTMLElement = {} as HTMLElement;

  /**
   * @var {IntersectionObserver} bottomObserver
   */
  protected bottomObserver: IntersectionObserver;

  /**
   * @var {string} scrollElementId
   */
  protected scrollElementId: string;

  /**
   * @var {HTMLElement} scrollElement
   */
  protected scrollElement: HTMLElement = {} as HTMLElement;

  /**
   * @var {IInfiniteScrollSettings} settings
   */
  protected settings: IInfiniteScrollSettings;

  /**
   * @var {IInfiniteScrollSlice} slice
   */
  protected slice: IInfiniteScrollSlice;

  /**
   * @var {(params: IInfinateScrollStateHandlerParams) => void} stateHander
   */
  protected stateHandler: (params: IInfinateScrollStateHandlerParams) => void;

  /**
   * @var {number} totalEntries
   */
  protected totalEntries: number = 0;

  /**
   * @constructor
   * @param {string} elementId
   * @param {(arg0: number, arg1: number) => void} stateHandler
   * @param {number} pageSize
   */
  constructor(
    scrollElementId: string,
    topElementId: string,
    bottomElementId: string,
    stateHandler: (params: IInfinateScrollStateHandlerParams) => void,
    pageSize: number
  ) {
    this.scrollElementId = scrollElementId;
    this.topElementId = topElementId;
    this.bottomElementId = bottomElementId;

    this.stateHandler = stateHandler;

    this.settings = {
      pageSize,
      increment: pageSize,
      desktopBreakpoint: 576,
      loaderHeight: 64,
      navbarOffset: 56,
      placeholderDesktopHeight: 61,
      placeholderMobileHeight: 133,
    };

    this.slice = {
      minIndex: 0,
      maxIndex: pageSize,
    };

    this.topObserver = new IntersectionObserver(
      this.topObservationCallback,
      this.observerDefaults
    );

    this.bottomObserver = new IntersectionObserver(
      this.bottomObservationCallback,
      this.observerDefaults
    );
  }

  /**
   * @name startObservation
   * @returns void
   */
  public startObservation(): void {
    this.topObserverElement = document.getElementById(this.topElementId)!;
    this.bottomObserverElement = document.getElementById(this.bottomElementId)!;

    this.topObserver.observe(this.topObserverElement);
    this.bottomObserver.observe(this.bottomObserverElement);
  }

  /**
   * @name stopObservertion
   * @returns void
   */
  public stopObservertion(): void {
    this.topObserver.disconnect();
    this.bottomObserver.disconnect();
  }

  /**
   * @name startHandleScroll
   * @returns void
   */
  public startHandleScroll = (): void => {
    this.scrollElement = document.getElementById(this.scrollElementId)!;

    this.scrollElement.addEventListener("scroll", this.handleDesktopScroll);
  };

  /**
   * @name stopHandleScroll
   * @returns void
   */
  public stopHandleScroll = (): void => {
    if (this.scrollElement.removeEventListener) {
      this.scrollElement.removeEventListener(
        "scroll",
        this.handleDesktopScroll
      );
    }
  };

  /**
   * @name setTotalEntries
   * @params {number} totalEntries
   * @returns void
   */
  public setTotalEntries(totalEntries: number): void {
    this.totalEntries = totalEntries;
  }

  /**
   * @name topObservationCallback
   * @params {IntersectionObserverEntry[]} intersectionEntries
   * @returns void
   */
  private topObservationCallback = (
    intersectionEntries: IntersectionObserverEntry[]
  ): void => {
    intersectionEntries.forEach(
      (intersectionEntry: IntersectionObserverEntry) => {
        if (intersectionEntry.intersectionRatio > 0) {
          console.log(1);

          const minIndex: number =
            this.slice.minIndex - this.settings.increment;
          const maxIndex: number = minIndex + this.settings.increment * 2;

          if (window.innerWidth >= this.settings.desktopBreakpoint) {
            this.triggerStateHandler(minIndex, maxIndex, true);
          } else {
            const callback: (() => void) | undefined =
              this.slice.minIndex > 0
                ? () => {
                    const lastEntryPosition =
                      this.settings.increment *
                        this.settings.placeholderMobileHeight +
                      this.settings.loaderHeight +
                      this.settings.navbarOffset;

                    this.scrollElement.scrollTo(0, lastEntryPosition);
                  }
                : undefined;

            this.triggerStateHandler(minIndex, maxIndex, false, callback);
          }
        }
      }
    );
  };

  /**
   * @name bottomObservationCallback
   * @params {IntersectionObserverEntry[]} intersectionEntries
   * @returns void
   */
  private bottomObservationCallback = (
    intersectionEntries: IntersectionObserverEntry[]
  ): void => {
    intersectionEntries.forEach(
      (intersectionEntry: IntersectionObserverEntry) => {
        if (intersectionEntry.intersectionRatio > 0) {
          const maxIndex: number =
            this.slice.maxIndex + this.settings.increment;
          const minIndex: number = maxIndex - this.settings.increment * 2;

          this.slice.minIndex = minIndex > 0 ? minIndex : 0;
          this.slice.maxIndex =
            maxIndex < this.totalEntries ? maxIndex : this.totalEntries;

          this.triggerStateHandler(
            minIndex,
            maxIndex,
            window.innerWidth >= this.settings.desktopBreakpoint
          );
        }
      }
    );
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

    const scrollTop: number = this.scrollElement.scrollTop;

    const topObserverPosition: number = this.topObserverElement.offsetTop;
    const bottomObserverPosition: number = this.bottomObserverElement.offsetTop;

    if (
      scrollTop > bottomObserverPosition + 100 ||
      scrollTop < topObserverPosition - 100
    ) {
      const currentIndex = Math.floor(
        scrollTop / this.settings.placeholderDesktopHeight
      );

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
    this.slice.maxIndex =
      maxIndex < this.totalEntries ? maxIndex : this.totalEntries;

    let folderPlaceholder: IFolderPlaceholder | undefined;
    let folderScrollSpinner: IFolderScrollSpinner | undefined;

    if (desktopMode) {
      folderPlaceholder = {
        top: this.slice.minIndex * this.settings.placeholderDesktopHeight,
        bottom:
          (this.totalEntries - this.slice.maxIndex) *
          this.settings.placeholderDesktopHeight,
      };
    } else {
      folderScrollSpinner = {
        top: this.slice.minIndex > 0,
        bottom: true,
      };
    }

    this.stateHandler({
      minIndex: this.slice.minIndex,
      maxIndex: this.slice.maxIndex,
      folderScrollSpinner,
      folderPlaceholder,
      callback,
    });
  }
}
