/**
 * sleep
 * @param {number} milliSeconds
 * @returns {Promise<unknown>}
 */
export const sleep = async (milliSeconds: number) =>
  new Promise((resolve: (value: unknown) => void) => setTimeout(resolve, milliSeconds));
