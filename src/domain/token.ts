import { SequentParseError } from "./error";
import { isAlpha, isWhiteSpace } from "../util/text";

/**
 * Represents a token.
 */
export interface Token {
  /** Gets the type of this token. */
  readonly type: TokenType;

  /** Gets the 0-based position of this token in the input string. */
  readonly position: number;

  /** Gets the identifier of this token if `type` is `Variable`, `undefined` otherwise. */
  readonly identifier?: string;
}

/**
 * Represents a token type.
 */
export const TokenType = [
  "Variable",
  "And",
  "Or",
  "Imply",
  "Not",
  "Comma",
  "ParenOpen",
  "ParenClose",
  "Tee",
  "End",
] as const;
export type TokenType = typeof TokenType[number];

/**
 * Represents a sequence of zero or more tokens.
 */
export type TokenList = ReadonlyArray<Token>;

/**
 * Tokenizes the specified string and returns the sequence of tokens.
 *
 * @param str the string to tokenize
 * @return the token sequence
 */
export const tokenize: (str: string) => TokenList = (str: string) => {
  const tokens = new Array<Token>();
  let p = 0;
  while (p < str.length) {
    const position = p;
    const c = str[p++];
    if (isWhiteSpace(c)) continue;
    switch (str.substring(position, position + 2)) {
      case "&&":
        tokens.push({ type: "And", position });
        p++;
        continue;
      case "||":
        tokens.push({ type: "Or", position });
        p++;
        continue;
      case "->":
        tokens.push({ type: "Imply", position });
        p++;
        continue;
      case "|-":
        tokens.push({ type: "Tee", position });
        p++;
        continue;
    }
    if (isAlpha(c)) {
      while (p < str.length && isAlpha(str[p])) p++;
      tokens.push({
        type: "Variable",
        position,
        identifier: str.substring(position, p),
      });
      continue;
    }
    switch (c) {
      case "!":
        tokens.push({ type: "Not", position });
        continue;
      case ",":
        tokens.push({ type: "Comma", position });
        continue;
      case "(":
        tokens.push({ type: "ParenOpen", position });
        continue;
      case ")":
        tokens.push({ type: "ParenClose", position });
        continue;
    }
    throw new SequentParseError(`unexpected character: '${c}`, position);
  }
  tokens.push({ type: "End", position: p });
  return tokens;
};
