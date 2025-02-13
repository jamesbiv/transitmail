/**
 * @name parseMimeWords
 * @param {string} content
 * @returns string
 */
export const parseMimeWords = (content: string): string => {
  const joinRegex: RegExp = /(=\?[^?]+\?[Bb]\?)([^?]+)\?=\s*\1([^?]+)\?=/g;
  const decodeRegex: RegExp = /=\?([\w_-]+)\?([QqBb])\?[^?]*\?=/g;

  return content
    .replace(
      joinRegex,
      (
        match: string,
        header: string,
        firstSegment: string,
        secondSegment: string
      ) => joinMimeWords(match, header, firstSegment, secondSegment)
    )
    .replace(decodeRegex, (mimeWord: string) => decodeMimeWord(mimeWord));
};

/**
 * joinMimeWords
 * @param {string} match
 * @param {string} header
 * @param {string} firstSegment
 * @param {string} secondSegment
 * @returns string
 */
const joinMimeWords = (
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

/**
 * @name decodeMimeWord
 * @param {string} content
 * @resturns string
 */
const decodeMimeWord = (content: string): string => {
  const contentNoWhitespace: string = content.replace(/\s+/g, "");

  const [match, charset, encoding, encodedContent]: RegExpMatchArray | [] =
    contentNoWhitespace.trim().match(/^=\?([\w_-]+)\?([QqBb])\?([^?]*)\?=$/i) ??
    [];

  if (!encodedContent) {
    return content;
  }

  const sanitisedEncodedContent: string = encodedContent.replace(/_/g, " ");
  const encodingType: string = (encoding ?? "Q").toUpperCase();

  switch (encodingType) {
    case "B":
      return decodeBase64(sanitisedEncodedContent);

    case "Q":
    default:
      return decodeQuotedPrintable(sanitisedEncodedContent);
  }
};

/**
 * @name decodeQuotedPrintable
 * @param {string} content
 * @returns string
 */
export const decodeQuotedPrintable = (content: string): string => {
  return quotedPrintableDecoder(content.replace(/=(?:\r?\n|$)/g, ""));
};

/**
 * @name decodeBase64
 * @param {string} content
 * @returns string
 */
export const decodeBase64 = (content: string): string => {
  return Buffer.from(content, "base64").toString();
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
  return binaryStringToBlob(atob(content), contentType, sliceSize);
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
 * @name quotedPrintableDecoder
 * @param {string} content
 * @returns string
 */
const quotedPrintableDecoder = (content: string): string => {
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
