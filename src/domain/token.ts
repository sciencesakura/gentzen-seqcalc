import { SequentParseError } from './error';
import { Operator } from './formula';
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

    Tee
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
            case Operator.And:
                tokens.push({ type: TokenType.And, position });
                p++;
                continue;
            case Operator.Or:
                tokens.push({ type: TokenType.Or, position });
                p++;
                continue;
            case Operator.Imply:
                tokens.push({ type: TokenType.Imply, position });
                p++;
                continue;
            case '|-':
                tokens.push({ type: TokenType.Tee, position });
                p++;
                continue;
        }
        if (isAlpha(c)) {
            while (isAlpha(str[p++]));
            tokens.push({
                type: TokenType.Variable,
                position,
                identifier: str.substring(position, p)
            });
            continue;
        }
        switch (c) {
            case Operator.Not:
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
    return tokens;
};

export { Token, TokenType, TokenList, tokenize };
