/**
 * @name parseMimeWords
 * @param {string} content
 * @returns string
 */
export const parseMimeWords = (content: string): string => {
  const joinRegex: RegExp = /(=\?[^?]+\?[Bb]\?)([^?]+)\?=\s*\1([^?]+)\?=/g;
  const decodeRegex: RegExp = /=\?([\w_-]+)\?([QqBb])\?[^?]*\?=/g;

  const joinCallback: (...args: string[]) => string = (
    match: string,
    header: string,
    firstSegment: string,
    secondSegment: string
  ) => {
    const result: string = Buffer.concat([
      Buffer.from(firstSegment, "base64"),
      Buffer.from(secondSegment, "base64"),
    ]).toString("base64");

    return `${header}${result}?=`;
  };

  const decodeCallback: (...args: string[]) => string = (mimeWord: string) => {
    return decodeMimeWord(mimeWord.replace(/\s+/g, ""));
  };

  /* for (let loop; ; ) {
      loop = content.replace(
        /(=\?[^?]+\?[Qq]\?)([^?]*)\?=\s*\1([^?]*\?=)/g,
        "$1$2$3"
      );

      if (loop === content) {
        break;
      }

      content = loop;
    } */

  return content
    .replace(joinRegex, joinCallback)
    .replace(decodeRegex, decodeCallback);
};

/**
 * @name base64toBlob
 * @param {string} content
 * @param {string} contentType
 * @param {number} sliceSize
 * @returns Blob
 */
export const base64toBlob = (
  content: string,
  contentType: string,
  sliceSize: number = 512
): Blob => {
  const byteCharacters: string = atob(content);
  const byteArrays: Uint8Array[] = [];

  for (
    let byteOffset: number = 0;
    byteOffset < byteCharacters.length;
    byteOffset += sliceSize
  ) {
    const byteSlice: string = byteCharacters.slice(
      byteOffset,
      byteOffset + sliceSize
    );

    const byteNumbers: number[] = new Array(byteSlice.length);

    for (let increment: number = 0; increment < byteSlice.length; increment++) {
      byteNumbers[increment] = byteSlice.charCodeAt(increment);
    }

    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * @name base64toBlob
 * @param {string} content
 * @param {string} contentType
 * @param {number} sliceSize
 * @returns Blob
 */
export const binaryStringToBlob = (
  content: string,
  contentType: string,
  sliceSize: number = 512
): Blob => {
  const byteArrays: Uint8Array[] = [];

  for (
    let byteOffset: number = 0;
    byteOffset < content.length;
    byteOffset += sliceSize
  ) {
    const byteSlice: string = content.slice(byteOffset, byteOffset + sliceSize);

    const byteNumbers: number[] = new Array(byteSlice.length);

    for (let increment: number = 0; increment < byteSlice.length; increment++) {
      byteNumbers[increment] = byteSlice.charCodeAt(increment);
    }

    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * @name mimeDecode
 * @param {string} content
 * @returns string
 */
export const mimeDecode = (content: string): string => {
  const encodedBytesCount: number = (content.match(/=[\da-fA-F]{2}/g) || [])
    .length;
  const bufferLength: number = content.length - encodedBytesCount * 2;
  const buffer: Buffer = Buffer.alloc(bufferLength);

  let bufferPos: number = 0;
  let char: string;
  let hexValue: string;

  for (
    let increment: number = 0, contentLength = content.length;
    increment < contentLength;
    increment++
  ) {
    char = content.charAt(increment);

    if (
      char === "=" &&
      (hexValue = content.substr(increment + 1, 2)) &&
      /[\da-fA-F]{2}/.test(hexValue)
    ) {
      increment += 2;
      buffer[bufferPos++] = parseInt(hexValue, 16);
    } else {
      buffer[bufferPos++] = char.charCodeAt(0);
    }
  }

  return buffer.toString();
};

/**
 * @name decodeMimeWord
 * @param {string} content
 * @resturns string
 */
export const decodeMimeWord = (content: string): string => {
  const match: RegExpMatchArray | undefined =
    content.trim().match(/^=\?([\w_-]+)\?([QqBb])\?([^?]*)\?=$/i) ?? undefined;

  if (!match) {
    return content;
  }

  content = (match[3] ?? "").replace(/_/g, " ");

  const encodingType: string = (match[2] || "Q").toUpperCase();

  switch (encodingType) {
    case "B":
      return decodeBase64(content);

    case "Q":
      return mimeDecode(content);

    default:
      return content;
  }
};

/**
 * @name decodeQuotedPrintable
 * @param {string} content
 * @returns string
 */
export const decodeQuotedPrintable = (content: string): string => {
  return mimeDecode(content.replace(/=(?:\r?\n|$)/g, ""));
};

/**
 * @name decodeBase64
 * @param {string} content
 * @returns string
 */
export const decodeBase64 = (content: string): string => {
  return Buffer.from(content, "base64").toString();
};
