import { Operator, isUnary as isUnaryOp, isBinary as isBinaryOp, toString as otostr } from "./operator";

/**
 * Represents a logical formula.
 */
export type Formula = Variable | CompoundFormula;

/**
 * Represents a propositional variable.
 */
export interface Variable {
  /** Gets the identifier if this formula is a propositional variable, `undefined` otherwise. */
  readonly identifier: string;
}

/**
 * Represents a compound formula.
 */
export type CompoundFormula = UnaryConnective | BinaryConnective;

/**
 * Represents a unary connective.
 */
export interface UnaryConnective {
  /** Gets the operator if this formula is a compound formula, `undefined` otherwise. */
  readonly operator: Operator;
  /** Gets the first operand if this formula is a compound formula, `undefined` otherwise. */
  readonly operand1: Formula;
}

/**
 * Represents a binary connective.
 */
export interface BinaryConnective {
  /** Gets the operator if this formula is a compound formula, `undefined` otherwise. */
  readonly operator: Operator;
  /** Gets the first operand if this formula is a compound formula, `undefined` otherwise. */
  readonly operand1: Formula;
  /** Gets the second operand if this formula is a compound formula and the operator is binary, `undefined` otherwise. */
  readonly operand2: Formula;
}

// the variable cache
const varcache = new Map<string, Variable>();

/**
 * Returns the formula that consists of only one propositional variable.
 *
 * @param identifier the identifier of the propositional variable
 * @returns the formula that consists of only one propositional variable
 */
export const variable: (identifier: string) => Variable = (identifier: string) => {
  const cache = varcache.get(identifier);
  if (cache) return cache;
  const v = { identifier };
  varcache.set(identifier, v);
  return v;
};

/**
 * Returns the formula that means `a && b`.
 *
 * @param a the first operand
 * @param b the second operand
 * @returns the formula that means `a && b`
 */
export const and: (a: Formula, b: Formula) => BinaryConnective = (a: Formula, b: Formula) => ({
  operator: "And",
  operand1: a,
  operand2: b,
});

/**
 * Returns the formula that means `a || b`.
 *
 * @param a the first operand
 * @param b the second operand
 * @returns the formula that means `a || b`
 */
export const or: (a: Formula, b: Formula) => BinaryConnective = (a: Formula, b: Formula) => ({
  operator: "Or",
  operand1: a,
  operand2: b,
});

/**
 * Returns the formula that means `a -> b`.
 *
 * @param a the first operand
 * @param b the second operand
 * @returns the formula that means `a -> b`
 */
export const imply: (a: Formula, b: Formula) => BinaryConnective = (a: Formula, b: Formula) => ({
  operator: "Imply",
  operand1: a,
  operand2: b,
});

/**
 * Returns the formula that means `!a`.
 *
 * @param a the operand
 * @returns the formula that means `!a`
 */
export const not: (a: Formula) => UnaryConnective = (a: Formula) => ({
  operator: "Not",
  operand1: a,
});

/**
 * Checks whether the specified formula is an atomic formula or not.
 *
 * @param f the formula to check
 * @returns `true` if the specified formula is an atomic formula, `false` otherwise
 */
export const isAtomic = (f: Formula): f is Variable => "identifier" in f;

/**
 * Checks whether the specified formula is a compound formula or not.
 *
 * @param f the formula to check
 * @returns `true` if the specified formula is a compound formula, `false` otherwise
 */
export const isCompound = (f: Formula): f is CompoundFormula => "operator" in f;

/**
 * Checks whether the specified formula is an unary connective or not.
 *
 * @param f the formula to check
 * @returns `true` if the specified formula is an unary connective, `false` otherwise
 */
export const isUnary = (f: Formula): f is UnaryConnective => isCompound(f) && isUnaryOp(f.operator);

/**
 * Checks whether the specified formula is a binary connective or not.
 *
 * @param f the formula to check
 * @returns `true` if the specified formula is a binary connective, `false` otherwise
 */
export const isBinary = (f: Formula): f is BinaryConnective => isCompound(f) && isBinaryOp(f.operator);

/**
 * Checks whether the specified two formulas are same or not.
 *
 * @param a the formula to compare
 * @param b the formula to compare
 * @returns `true` if the specified two formulas are same, `false` otherwise
 */
export const equal: (a: Formula, b: Formula) => boolean = (a: Formula, b: Formula) => {
  if (a === b) {
    return true;
  } else if (isAtomic(a) && isAtomic(b)) {
    return a.identifier === b.identifier;
  } else if (isUnary(a) && isUnary(b)) {
    return a.operator === b.operator && equal(a.operand1, b.operand1);
  } else if (isBinary(a) && isBinary(b)) {
    return a.operator === b.operator && equal(a.operand1, b.operand1) && equal(a.operand2, b.operand2);
  }
  return false;
};

/**
 * Returns a string representation.
 *
 * @param f the formula to string
 * @returns the string representation
 */
export const toString: (f: Formula) => string = (f: Formula) => {
  if (isAtomic(f)) {
    return f.identifier;
  } else {
    const op = otostr(f.operator);
    let opd1 = toString(f.operand1);
    opd1 = isAtomic(f.operand1) || isUnary(f.operand1) ? opd1 : `(${opd1})`;
    if (isBinary(f)) {
      let opd2 = toString(f.operand2);
      opd2 = isAtomic(f.operand2) || isUnary(f.operand2) ? opd2 : `(${opd2})`;
      return `${opd1} ${op} ${opd2}`;
    } else {
      return `${op}${opd1}`;
    }
  }
};
