import { SequentParseError } from './error';
import { isAlpha, isWhiteSpace } from '../util/text';

/**
 * Represents a token.
 */
interface Token {
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
enum TokenType {
  Variable,

  And,

  Or,

  Imply,

  Not,

  Comma,

  ParenOpen,

  ParenClose,

  Tee,

  End
}

/**
 * Represents a sequence of zero or more tokens.
 */
type TokenList = ReadonlyArray<Token>;

/**
 * Tokenizes the specified string and returns the sequence of tokens.
 *
 * @param str the string to tokenize
 * @return the token sequence
 */
const tokenize: (str: string) => TokenList = (str: string) => {
  const tokens = new Array<Token>();
  let p = 0;
  while (p < str.length) {
    const position = p;
    const c = str[p++];
    if (isWhiteSpace(c)) continue;
    switch (str.substring(position, position + 2)) {
      case '&&':
        tokens.push({ type: TokenType.And, position });
        p++;
        continue;
      case '||':
        tokens.push({ type: TokenType.Or, position });
        p++;
        continue;
      case '->':
        tokens.push({ type: TokenType.Imply, position });
        p++;
        continue;
      case '|-':
        tokens.push({ type: TokenType.Tee, position });
        p++;
        continue;
    }
    if (isAlpha(c)) {
      while (p < str.length && isAlpha(str[p])) p++;
      tokens.push({
        type: TokenType.Variable,
        position,
        identifier: str.substring(position, p)
      });
      continue;
    }
    switch (c) {
      case '!':
        tokens.push({ type: TokenType.Not, position });
        continue;
      case ',':
        tokens.push({ type: TokenType.Comma, position });
        continue;
      case '(':
        tokens.push({ type: TokenType.ParenOpen, position });
        continue;
      case ')':
        tokens.push({ type: TokenType.ParenClose, position });
        continue;
    }
    throw new SequentParseError(`unexpected character: '${c}`, position);
  }
  tokens.push({ type: TokenType.End, position: p });
  return tokens;
};

export { TokenType, TokenList, tokenize };
