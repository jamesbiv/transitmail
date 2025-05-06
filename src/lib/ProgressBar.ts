import { Dispatch } from "react";

/**
 * @interface IProgressBar
 */
interface IProgressBar {
  currentBytes: number;
  maxBytes: number;
  now: number;
  callbackFn?: () => void;
}

/**
 * @constant {IProgressBar} progressBar
 */
const progressBar: IProgressBar = { currentBytes: 0, maxBytes: 0, now: 0 };

/**
 * @name initiateProgressBar
 * @param {number} maxBytes
 * @param {React.Dispatch<number>} setProgressBarNow
 * @param {() => number} currentBytesFn
 * @param {() => void} finalCallbackFn
 * @returns void
 */
export const initiateProgressBar = (
  maxBytes: number,
  setProgressBarNow: Dispatch<number>,
  currentBytesFn: () => number,
  finalCallbackFn: () => void
): void => {
  progressBar.maxBytes = maxBytes;

  checkProgressBar(setProgressBarNow, currentBytesFn, finalCallbackFn);
};

/**
 * @name checkProgressBar
 * @param {Dispatch<number>} setProgressBarNow
 * @param {() => number} currentBytesFn
 * @param {() => void} finalCallbackFn
 * @returns void
 */
const checkProgressBar = (
  setProgressBarNow: Dispatch<number>,
  currentBytesFn: () => number,
  finalCallbackFn: () => void
): void => {
  const setTimeoutMaxMs: number = 300000; // 5mins
  let setTimeoutFallback: number = 0;

  progressBar.currentBytes = currentBytesFn();

  const progressBarPercent: number = Math.ceil(
    (progressBar.currentBytes / progressBar.maxBytes) * 100
  );

  progressBar.now = progressBarPercent > 100 ? 100 : progressBarPercent;

  setProgressBarNow(progressBar.now);

  const progressBarThreshold: number = progressBar.maxBytes - (progressBar.maxBytes * 5) / 100;

  if (progressBarThreshold > progressBar.currentBytes && setTimeoutFallback < setTimeoutMaxMs) {
    setTimeout(() => {
      setTimeoutFallback += 10;

      checkProgressBar(setProgressBarNow, currentBytesFn, finalCallbackFn);
    }, 10);
  } else {
    setTimeout(finalCallbackFn, 1000);
  }
};
