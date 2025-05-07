import { IFolderPlaceholder, IFolderScrollSpinner, IInfinateScrollHandler } from "interfaces";

/**
 * @interface IInfiniteScrollvisibleSlice
 */
interface IInfiniteScrollvisibleSlice {
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
  navbarHeight: number;
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
   * @protected {IInfiniteScrollvisibleSlice} visibleSlice
   */
  protected visibleSlice: IInfiniteScrollvisibleSlice;

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
      loaderHeight: 50,
      navbarHeight: 56,
      placeholderDesktopHeight: 65,
      placeholderMobileHeight: 141,
      ...settings
    };

    if (window.innerWidth < this.settings.desktopBreakpoint) {
      const placeholderSize: number = window.innerHeight - this.settings.navbarHeight;
      const placeholderMaxElements: number = Math.ceil(
        placeholderSize / this.settings.placeholderMobileHeight
      );

      this.settings.pageSize = placeholderMaxElements * 5;
      this.settings.increment = placeholderMaxElements * 5;
    }

    this.visibleSlice = {
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

    if (!this.topObserverElement) {
      return;
    }

    this.topObserver.observe(this.topObserverElement);
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

    if (!this.bottomObserverElement) {
      return;
    }

    this.bottomObserver.observe(this.bottomObserverElement);
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

    if (!this.scrollElement) {
      return;
    }

    this.scrollElement.addEventListener("scroll", this.handleDesktopScroll);
  };

  /**
   * @method stopHandleScroll
   * @returns void
   */
  public stopHandleScroll = (): void => {
    if (!this.scrollElement?.removeEventListener) {
      return;
    }

    this.scrollElement.removeEventListener("scroll", this.handleDesktopScroll);
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
   * @method setVisibleSlice
   * @returns IInfiniteScrollvisibleSlice
   */
  public setVisibleSlice(visibleSlice: IInfiniteScrollvisibleSlice): void {
    this.visibleSlice = visibleSlice;
  }

  /**
   * @method getVisibleSlice
   * @returns IInfiniteScrollvisibleSlice
   */
  public getVisibleSlice(): IInfiniteScrollvisibleSlice {
    return this.visibleSlice;
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
        const previousMinIndex: number = this.visibleSlice.minIndex;

        const boundlessMinIndex: number = previousMinIndex - this.settings.increment;
        const minIndex = boundlessMinIndex > 0 ? boundlessMinIndex : 0;

        const boundlessMaxIndex: number = minIndex + this.settings.increment * 2;
        const maxIndex =
          boundlessMaxIndex < this.totalEntries ? boundlessMaxIndex : this.totalEntries;

        this.setVisibleSlice({ minIndex, maxIndex });

        if (window.innerWidth < this.settings.desktopBreakpoint) {
          const callback: (() => void) | undefined =
            this.visibleSlice.minIndex > 0
              ? () => {
                  if (!this.scrollElement) {
                    return;
                  }

                  const lastEntryPosition: number =
                    this.settings.increment * this.settings.placeholderMobileHeight +
                    this.settings.loaderHeight -
                    this.scrollElement.scrollTop;

                  this.scrollElement.scrollTo({ top: lastEntryPosition });
                }
              : undefined;

          this.triggerScrollHandlerAsMobile(callback);

          return;
        }

        this.triggerScrollHandlerAsDestop();
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
        const topObserverPosition: number = this.topObserverElement?.offsetTop ?? 0;
        const bottomObserverPosition: number = this.bottomObserverElement?.offsetTop ?? 0;

        const observerPositionDifference: number = Math.abs(
          topObserverPosition - bottomObserverPosition
        );

        if (observerPositionDifference < 5) {
          return;
        }

        const previousMaxIndex: number = this.visibleSlice.maxIndex;

        const boundlessMaxIndex: number = previousMaxIndex + this.settings.increment;
        const maxIndex =
          boundlessMaxIndex < this.totalEntries ? boundlessMaxIndex : this.totalEntries;

        const boundlessMinIndex: number = maxIndex - this.settings.increment * 2;
        const minIndex = boundlessMinIndex > 0 ? boundlessMinIndex : 0;

        this.setVisibleSlice({ minIndex, maxIndex });

        window.innerWidth < this.settings.desktopBreakpoint
          ? this.triggerScrollHandlerAsMobile()
          : this.triggerScrollHandlerAsDestop();
      }
    });
  };

  /**
   * @method handleDesktopScroll
   * @param {Event} event
   * @returns void
   */
  private readonly handleDesktopScroll = (event: Event): void => {
    if (window.innerWidth <= this.settings.desktopBreakpoint) {
      return;
    }

    const scrollTop: number = this.scrollElement?.scrollTop ?? 0;

    const topObserverPosition: number = this.topObserverElement?.offsetTop ?? 0;
    const bottomObserverPosition: number = this.bottomObserverElement?.offsetTop ?? 0;

    if (scrollTop > bottomObserverPosition + 100 || scrollTop < topObserverPosition - 100) {
      const currentIndex = Math.floor(scrollTop / this.settings.placeholderDesktopHeight);

      const boundlessMinIndex: number = currentIndex;
      const minIndex = boundlessMinIndex > 0 ? boundlessMinIndex : 0;

      const boundlessMaxIndex: number = minIndex + this.settings.increment * 2;
      const maxIndex =
        boundlessMaxIndex < this.totalEntries ? boundlessMaxIndex : this.totalEntries;

      this.setVisibleSlice({ minIndex, maxIndex });

      this.triggerScrollHandlerAsDestop();
    }
  };

  /**
   * triggerScrollHandlerAsDestop
   * @param {() => void} callback
   * @returns void
   */
  private triggerScrollHandlerAsDestop(callback?: () => void) {
    if (!this.scrollHandler) {
      return;
    }

    const { minIndex, maxIndex } = this.getVisibleSlice();

    const folderPlaceholder: IFolderPlaceholder = {
      top: minIndex * this.settings.placeholderDesktopHeight,
      bottom: (this.totalEntries - maxIndex) * this.settings.placeholderDesktopHeight
    };

    this.scrollHandler({ minIndex, maxIndex, folderPlaceholder, callback });
  }

  /**
   * triggerScrollHandlerAsMobile
   * @param {() => void} callback
   * @returns void
   */
  private triggerScrollHandlerAsMobile(callback?: () => void) {
    if (!this.scrollHandler) {
      return;
    }

    const { minIndex, maxIndex } = this.getVisibleSlice();

    const placeholderThreshold: number = 100;

    const placeholderSize: number = window.innerHeight - this.settings.navbarHeight;
    const placeholderMaxElements: number = Math.ceil(
      placeholderSize / this.settings.placeholderMobileHeight
    );

    const definativePlaceholderSize: number = placeholderSize - placeholderThreshold;

    const topPlaceholderSize: number =
      minIndex - placeholderMaxElements > 0 ? definativePlaceholderSize : 0;

    const bottomPlaceholderSize: number =
      this.totalEntries - placeholderMaxElements > maxIndex ? definativePlaceholderSize : 0;

    const folderScrollSpinner: IFolderScrollSpinner = {
      top: topPlaceholderSize > 0,
      bottom: bottomPlaceholderSize > 0
    };

    this.scrollHandler({ minIndex, maxIndex, folderScrollSpinner, callback });
  }
}
