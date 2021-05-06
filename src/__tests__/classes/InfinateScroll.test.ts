import { InfiniteScroll } from "classes";

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

const imapSocket = new InfiniteScroll(
  "container-main",
  "topObserver",
  "bottomObserver",
  ({
    minIndex,
    maxIndex,
    folderPlaceholder,
    folderScrollSpinner,
    callback,
  }) => {},
  1
);

describe("Testing the InfiniteScroll class", () => {
  describe("Test ", () => {
    test("", () => {});
  });
});
