import { Operator, isUnary } from './operator';

/**
 * Represents a logical formula.
 */
interface Formula {
    /** Gets the identifier if this formula is a propositional variable, `undefined` otherwise. */
    readonly identifier?: string;

    /** Gets the operator if this formula is a compound formula, `undefined` otherwise. */
    readonly operator?: Operator;

    /** Gets the first operand if this formula is a compound formula, `undefined` otherwise. */
    readonly operand1?: Formula;

    /** Gets the second operand if this formula is a compound formula and the operator is binary, `undefined` otherwise. */
    readonly operand2?: Formula;
}

/**
 * Represents a propositional variable.
 */
interface Variable extends Formula {
    /** Gets the identifier. */
    readonly identifier: string;
}

/**
 * Represents a compound formula.
 */
interface CompoundFormula extends Formula {
    /** Gets the operator. */
    readonly operator: Operator;
}

/**
 * Represents a unary connective.
 */
interface UnaryConnective extends CompoundFormula {
    /** Gets the first operand. */
    readonly operand1: Formula;
}

/**
 * Represents a binary connective.
 */
interface BinaryConnective extends CompoundFormula {
    /** Gets the first operand. */
    readonly operand1: Formula;

    /** Gets the second operand. */
    readonly operand2: Formula;
}

// the variable cache
const varcache = new Map<string, Variable>();

/**
 * Returns the formula that consists of only one propositional variable.
 *
 * @param identifier the identifier of the propositional variable
 * @return the formula that consists of only one propositional variable
 */
const variable: (identifier: string) => Variable = (identifier: string) => {
    const cache = varcache.get(identifier);
    if (cache) return cache;
    const v = {
        atomic: true,
        identifier,
        toString(): string {
            return this.identifier;
        }
    };
    varcache.set(identifier, v);
    return v;
};

/**
 * Returns the binary connective formula.
 */
const binaryConnective: (operator: Operator, operand1: Formula, operand2: Formula) => BinaryConnective = (
    operator: Operator,
    operand1: Formula,
    operand2: Formula
) => {
    return {
        atomic: false,
        operator,
        operand1,
        operand2,
        toString(): string {
            const opd1 = isAtomic(this.operand1) || isUnary(this.operand1.operator!) ? this.operand1 : `(${this.operand1})`;
            const opd2 = isAtomic(this.operand2) || isUnary(this.operand2.operator!) ? this.operand2 : `(${this.operand2})`;
            return `${opd1} ${this.operator} ${opd2}`;
        }
    };
};

/**
 * Returns the formula that means `a && b`.
 *
 * @param a the first operand
 * @param b the second operand
 * @return the formula that means `a && b`
 */
const and: (a: Formula, b: Formula) => BinaryConnective = (a: Formula, b: Formula) => {
    return binaryConnective(Operator.And, a, b);
};

/**
 * Returns the formula that means `a || b`.
 *
 * @param a the first operand
 * @param b the second operand
 * @return the formula that means `a || b`
 */
const or: (a: Formula, b: Formula) => BinaryConnective = (a: Formula, b: Formula) => {
    return binaryConnective(Operator.Or, a, b);
};

/**
 * Returns the formula that means `a -> b`.
 *
 * @param a the first operand
 * @param b the second operand
 * @return the formula that means `a -> b`
 */
const imply: (a: Formula, b: Formula) => BinaryConnective = (a: Formula, b: Formula) => {
    return binaryConnective(Operator.Imply, a, b);
};

/**
 * Returns the formula that means `!a`.
 *
 * @param a the operand
 * @return the formula that means `!a`
 */
const not: (a: Formula) => UnaryConnective = (a: Formula) => {
    return {
        atomic: false,
        operator: Operator.Not,
        operand1: a,
        toString(): string {
            const opd = isAtomic(this.operand1) || isUnary(this.operand1.operator!) ? this.operand1 : `(${this.operand1})`;
            return `!${opd}`;
        }
    };
};

/**
 * Checks whether the specified formula is an atomic formula or not.
 *
 * @param formula the formula to check
 * @return `true` if the specified formula is an atomic formula, `false` otherwise
 */
const isAtomic = (formula: Formula): formula is Variable => {
    return formula.operator === undefined;
};

/**
 * Checks whether the specified formula is a compound formula or not.
 *
 * @param formula the formula to check
 * @return `true` if the specified formula is a compound formula, `false` otherwise
 */
const isCompound = (formula: Formula): formula is CompoundFormula => {
    return formula.operator !== undefined;
};

/**
 * Checks whether the specified two formulas are same or not.
 *
 * @param a the formula to compare
 * @param b the formula to compare
 * @return `true` if the specified two formulas are same, `false` otherwise
 */
const formequ: (a: Formula, b: Formula) => boolean = (a: Formula, b: Formula) => {
    if (a === b) return true;
    if (isAtomic(a) && isAtomic(b)) return a.identifier === b.identifier;
    if (isCompound(a) && isCompound(b) && a.operator === b.operator) {
        const equOpd1 = formequ(a.operand1!, b.operand1!);
        return isUnary(a.operator) ? equOpd1 : equOpd1 && formequ(a.operand2!, b.operand2!);
    }
    return false;
};

export { Formula, variable, and, or, imply, not, isAtomic, isCompound, formequ };
