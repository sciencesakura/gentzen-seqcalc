/**
 * Checks whether the specified character is white-space character or not.
 *
 * @param c the character to check
 * @param `true` if the specified character is white-space character, `false` otherwise
 */
export const isWhiteSpace: (c: string) => boolean = (c: string) =>
  c === " " || c === "\t" || c === "\n" || c === "\v" || c === "\f" || c === "\r";

/**
 * Checks whether the specified character is an alphabet letter or not.
 *
 * @param c the character to check
 * @return `true` if the specified character is an alphabet letter, `false` otherwise
 */
export const isAlpha: (c: string) => boolean = (c: string) => {
  const code = c.codePointAt(0)!;
  return (0x0041 <= code && code <= 0x005a) || (0x0061 <= code && code <= 0x007a);
};

/**
 * Repeats the specified string a certain number of times.
 *
 * @param s the string to repeat
 * @param n the number of times
 * @return the string composed of repeatition
 */
export const times: (s: string, n: number) => string = (s: string, n: number) => {
  let str = "";
  for (let i = 0; i < n; i++) str += s;
  return str;
};
