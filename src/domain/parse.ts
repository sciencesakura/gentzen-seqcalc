import { SequentParseError } from './error';
import { Formula, variable, and, or, imply, not } from './formula';
import { Sequent, sequent } from './sequent';
import { TokenType, TokenList, tokenize } from './token';

let p: number;

const _term: (tokens: TokenList) => Formula = (tokens: TokenList) => {
    const token = tokens[p];
    if (token.type === TokenType.Variable) {
        p++;
        return variable(token.identifier!);
    }
    if (token.type === TokenType.ParenOpen) {
        p++;
        const f = _connective(tokens);
        if (tokens[p].type === TokenType.End) throw new SequentParseError('unexpected end of input');
        if (tokens[p].type !== TokenType.ParenClose) throw new SequentParseError('unexpected token');
        p++;
        return f;
    }
    throw new SequentParseError(token.type === TokenType.End ? 'unexpected end of input' : 'unexpected token');
};

const _unary: (tokens: TokenList) => Formula = (tokens: TokenList) => {
    if (tokens[p].type === TokenType.Not) {
        p++;
        return not(_unary(tokens));
    }
    return _term(tokens);
};

const _connective: (tokens: TokenList) => Formula = (tokens: TokenList) => {
    let f = _unary(tokens);
    while (true) {
        switch (tokens[p].type) {
            case TokenType.And:
                p++;
                f = and(f, _unary(tokens));
                break;
            case TokenType.Or:
                p++;
                f = or(f, _unary(tokens));
                break;
            case TokenType.Imply:
                p++;
                f = imply(f, _unary(tokens));
                break;
            default:
                return f;
        }
    }
};

/**
 * Parses the specified string as a sequent.
 *
 * @param str the string to parse
 * @return the sequent
 */
const parse: (str: string) => Sequent = (str: string) => {
    const tokens = tokenize(str);
    p = 0;
    const antecedents = new Array<Formula>();
    if (tokens[p].type !== TokenType.Tee) {
        antecedents.push(_connective(tokens));
        while (tokens[p].type !== TokenType.Tee) {
            if (tokens[p].type === TokenType.End) throw new SequentParseError('unexpected end of input');
            if (tokens[p].type !== TokenType.Comma) throw new SequentParseError('unexpected token');
            p++;
            antecedents.push(_connective(tokens));
        }
    }
    p++;
    const succedents = new Array<Formula>();
    while (tokens[p].type !== TokenType.End) {
        succedents.push(_connective(tokens));
        if (tokens[p].type === TokenType.End) break;
        if (tokens[p].type !== TokenType.Comma) throw new SequentParseError('unexpected token');
        p++;
    }
    return sequent(antecedents, succedents);
};

export { parse };
