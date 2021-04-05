interface IInfiniteScrollSlice {
  start: number;
  minIndex: number;
  maxIndex: number;
  increment: number;
  total: number;
  scrollBottom: boolean;
}

export class InfiniteScroll {
  /**
   * @var {string} elementId
   */
  protected elementId: string;

  /**
   * @var {HTMLElement} element
   */
  protected element: HTMLElement = {} as HTMLElement;

  /**
   * @var {IInfiniteScrollSlice} slice
   */
  protected slice: IInfiniteScrollSlice;

  /**
   * @var {(arg0: number, arg1: number) => void} stateHander
   */
  protected stateHandler: (arg0: number, arg1: number) => void;

  /**
   * @var {number} stateHander
   */
  protected totalEntries: number = 0;

  /**
   * @constructor
   * @param {string} elementId
   * @param (arg0: number, arg1: number) => void} stateHandler
   */
  constructor(
    elementId: string,
    stateHandler: (arg0: number, arg1: number) => void
  ) {
    this.elementId = elementId;
    this.stateHandler = stateHandler;

    this.slice = {
      start: 15,
      minIndex: 0,
      maxIndex: 15,
      increment: 5,
      total: 30,
      scrollBottom: false,
    };
  }

  /**
   * @name startHandler
   * @returns void
   */
  public startHandler(): void {
    this.element = document.getElementById(this.elementId)!;

    this.element.addEventListener("scroll", this.handleScroll);
  }

  /**
   * @name startHandler
   * @returns void
   */
  public stopHandler(): void {
    this.element.removeEventListener("scroll", this.handleScroll);
  }

  /**
   * @name setTotalEntries
   * @returns void
   */
  public setTotalEntries(totalEntries: number): void {
    this.totalEntries = totalEntries;
  }

  /**
   * @name handleScroll
   * @param {Event} event
   * @returns void
   */
  private handleScroll = (event: Event): void => {
    const scrollTop = this.element.scrollTop;
    const offsetHeight = this.element.offsetHeight;
    const scrollHeight = this.element.scrollHeight;

    if (
      scrollTop >= scrollHeight - offsetHeight &&
      this.totalEntries >= this.slice.maxIndex
    ) {
      this.element.scrollTo(0, scrollTop - 1);

      this.slice.minIndex += 1;
      this.slice.maxIndex += 1;
      this.slice.scrollBottom = true;
    } else if (
      scrollTop <= 0 &&
      this.slice.scrollBottom &&
      this.slice.minIndex > 0
    ) {
      this.element.scrollTo(0, 1);

      this.slice.minIndex -= 1;
      this.slice.maxIndex -= 1;
    }

    this.stateHandler(this.slice.minIndex, this.slice.maxIndex);
  };
}
