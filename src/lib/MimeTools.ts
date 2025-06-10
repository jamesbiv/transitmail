/**
 * parseMimeWords
 * @param {string} content
 * @returns {string}
 */
export const parseMimeWords = (content: string): string => {
  const joinRegex: RegExp = /(=\?[^?]+\?[Bb]\?)([^?]+)\?=\s*\1([^?]+)\?=/g;
  const decodeRegex: RegExp = /=\?([\w_-]+)\?([QqBb])\?[^?]*\?=/g;

  return content
    .replace(
      joinRegex,
      (match: string, header: string, firstSegment: string, secondSegment: string) =>
        joinMimeWords(match, header, firstSegment, secondSegment)
    )
    .replace(decodeRegex, (mimeWord: string) => decodeMimeWord(mimeWord));
};

/**
 * joinMimeWords
 * @param {string} match
 * @param {string} header
 * @param {string} firstSegment
 * @param {string} secondSegment
 * @returns {string}
 */
const joinMimeWords = (
  match: string,
  header: string,
  firstSegment: string,
  secondSegment: string
) => {
  const result: string = Buffer.concat([
    Buffer.from(firstSegment, "base64"),
    Buffer.from(secondSegment, "base64")
  ]).toString("base64");

  return `${header}${result}?=`;
};

/**
 * decodeMimeWord
 * @param {string} content
 * @returns string
 */
const decodeMimeWord = (content: string): string => {
  const contentNoWhitespace: string = content.replace(/\s+/g, "");

  const [_, _charset, encoding, encodedContent]: RegExpMatchArray =
    /^=\?([\w_-]+)\?([QqBb])\?([^?]*)\?=$/i.exec(contentNoWhitespace.trim())!;

  if (!encodedContent) {
    return content;
  }

  const sanitisedEncodedContent: string = encodedContent.replace(/_/g, " ");
  const encodingType: string = encoding.toUpperCase();

  switch (encodingType) {
    case "B":
      return decodeBase64(sanitisedEncodedContent);

    case "Q":
    default:
      return decodeQuotedPrintable(sanitisedEncodedContent);
  }
};

/**
 * decodeQuotedPrintable
 * @param {string} content
 * @returns {string}
 */
export const decodeQuotedPrintable = (content: string): string => {
  return quotedPrintableDecoder(content.replace(/=(?:\r?\n|$)/g, ""));
};

/**
 * decodeBase64
 * @param {string} content
 * @returns {string}
 */
export const decodeBase64 = (content: string): string => {
  return Buffer.from(content, "base64").toString();
};

/**
 * base64toBlob
 * @param {string} content
 * @param {string} contentType
 * @param {number} sliceSize
 * @returns {Blob}
 */
export const base64toBlob = (
  content: string,
  contentType: string,
  sliceSize: number = 512
): Blob => {
  return binaryStringToBlob(atob(content), contentType, sliceSize);
};

/**
 * base64toBlob
 * @param {string} content
 * @param {string} contentType
 * @param {number} sliceSize
 * @returns {Blob}
 */
export const binaryStringToBlob = (
  content: string,
  contentType: string,
  sliceSize: number = 512
): Blob => {
  const byteArrays: Uint8Array[] = [];

  for (let byteOffset: number = 0; byteOffset < content.length; byteOffset += sliceSize) {
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
 * quotedPrintableDecoder
 * @param {string} content
 * @returns {string}
 */
const quotedPrintableDecoder = (content: string): string => {
  const encodedBytesCount: number = (content.match(/=[\da-fA-F]{2}/g) || []).length;
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
      (hexValue = content.slice(increment + 1, 3)) &&
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
