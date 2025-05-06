import { waitFor } from "@testing-library/dom";
import { sleep } from "__tests__/fixtures";
import { initiateProgressBar } from "lib";

describe("Testing ProgressBar", () => {
  it("test initiateProgressBar() function", async () => {
    const setProgressBarNow = () => 100;

    let currentBytesCounter: number = 0;

    const currentBytesFn = () => {
      currentBytesCounter += 10;
      return currentBytesCounter;
    };

    const finalCallbackFn = jest.fn().mockImplementation(() => true);

    initiateProgressBar(100, setProgressBarNow, currentBytesFn, finalCallbackFn);

    await sleep(200);

    await waitFor(() => expect(finalCallbackFn).toHaveBeenCalled());
  });

  it("test initiateProgressBar() function when current bytes exceed total", async () => {
    const setProgressBarNow = () => 100;

    const currentBytesFn = () => 1000;

    const finalCallbackFn = jest.fn().mockImplementation(() => true);

    initiateProgressBar(100, setProgressBarNow, currentBytesFn, finalCallbackFn);

    await sleep(200);

    await waitFor(() => expect(finalCallbackFn).toHaveBeenCalled());
  });
});
