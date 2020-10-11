import { SequentParseError } from "./error";
import { Formula, variable, and, or, imply, not } from "./formula";
import { Sequent, sequent } from "./sequent";
import { TokenList, tokenize } from "./token";

let p: number;

const term: (tokens: TokenList) => Formula = (tokens: TokenList) => {
  const token = tokens[p];
  if (token.type === "Variable") {
    p++;
    return variable(token.identifier!);
  }
  if (token.type === "ParenOpen") {
    p++;
    const f = binary(tokens);
    if (tokens[p].type === "End") throw new SequentParseError("unexpected end of input", tokens[p].position);
    if (tokens[p].type !== "ParenClose") throw new SequentParseError("unexpected token", tokens[p].position);
    p++;
    return f;
  }
  throw new SequentParseError(token.type === "End" ? "unexpected end of input" : "unexpected token", token.position);
};

const unary: (tokens: TokenList) => Formula = (tokens: TokenList) => {
  if (tokens[p].type === "Not") {
    p++;
    return not(unary(tokens));
  }
  return term(tokens);
};

const binary: (tokens: TokenList) => Formula = (tokens: TokenList) => {
  let f = unary(tokens);
  while (true) {
    switch (tokens[p].type) {
      case "And":
        p++;
        f = and(f, unary(tokens));
        break;
      case "Or":
        p++;
        f = or(f, unary(tokens));
        break;
      case "Imply":
        p++;
        f = imply(f, unary(tokens));
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
export const parse: (str: string) => Sequent = (str: string) => {
  const tokens = tokenize(str);
  p = 0;
  const antecedents = new Array<Formula>();
  if (tokens[p].type !== "Tee") {
    antecedents.push(binary(tokens));
    while (tokens[p].type !== "Tee") {
      if (tokens[p].type === "End") throw new SequentParseError("unexpected end of input", tokens[p].position);
      if (tokens[p].type !== "Comma") throw new SequentParseError("unexpected token", tokens[p].position);
      p++;
      antecedents.push(binary(tokens));
    }
  }
  p++;
  const succedents = new Array<Formula>();
  while (tokens[p].type !== "End") {
    succedents.push(binary(tokens));
    if (tokens[p].type === "End") break;
    if (tokens[p].type !== "Comma") throw new SequentParseError("unexpected token", tokens[p].position);
    p++;
  }
  return sequent(antecedents, succedents);
};
