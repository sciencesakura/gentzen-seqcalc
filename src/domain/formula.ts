/**
 * Represents a logical operator.
 */
enum Operator {
    And = '&&',

    Or = '||',

    Imply = '->',

    Not = '!'
}

/**
 * Represents a logical formula.
 */
interface Formula {
    /** Gets `true` if this formula consists of only one propositional variable, `false` otherwise. */
    readonly atomic: boolean;

    readonly size: number;

    /** Gets the identifier of the propositional variable if `atomic` is `true`, undefined otherwise. */
    readonly identifier?: string;

    /** Gets the operator if `atomic` is `false`, undefined otherwise. */
    readonly operator?: Operator;

    /** Gets the first operand if `atomic` is `false`, undefined otherwise. */
    readonly operand1?: Formula;

    /** Gets the second operand if `atomic` is `false` and `operator` is binary, undefined otherwise. */
    readonly operand2?: Formula;
}

/**
 * Provides an total order.
 *
 * @param a the formula to compare
 * @param b the formula to compare
 * @return negative, zero or positive as `a < b`, `a = b` or `a > b`
 */
const formcmp: (a: Formula, b: Formula) => number = (a: Formula, b: Formula) => {
    if (a === b) return 0;
    const sizecmp = a.size - b.size;
    if (sizecmp !== 0) return sizecmp;
    if (a.atomic) return a.identifier!.localeCompare(b.identifier!);
    const opecmp = a.operator!.localeCompare(b.operator!);
    if (opecmp !== 0) return opecmp;
    return a.toString().localeCompare(b.toString());
};

const _varcache = new Map<string, Formula>();

/**
 * Returns the formula that consists of a propositional variable.
 *
 * @param identifier the identifier of the propositional variable
 * @return the formula that consists of a propositional variable
 */
const variable: (identifier: string) => Formula = (identifier: string) => {
    const cache = _varcache.get(identifier);
    if (cache) return cache;
    const v = {
        atomic: true,
        size: 1,
        identifier,
        toString(): string {
            return identifier;
        }
    };
    _varcache.set(identifier, v);
    return v;
};

const _binaryToString: (operator: Operator, operand1: Formula, operand2: Formula) => string = (
    operator: Operator,
    operand1: Formula,
    operand2: Formula
) => {
    return (
        (operand1.atomic || operand1.operator === Operator.Not ? operand1 : `(${operand1})`) +
        ` ${operator} ` +
        (operand2.atomic || operand2.operator === Operator.Not ? operand2 : `(${operand2})`)
    );
};

/**
 * Returns the formula that means `a && b`.
 *
 * @param a first operand
 * @param b second operand
 * @return the formula that means `a && b`
 */
const and: (a: Formula, b: Formula) => Formula = (a: Formula, b: Formula) => {
    return {
        atomic: false,
        size: a.size + b.size + 1,
        operator: Operator.And,
        operand1: a,
        operand2: b,
        toString(): string {
            return _binaryToString(Operator.And, a, b);
        }
    };
};

/**
 * Returns the formula that means `a || b`.
 *
 * @param a first operand
 * @param b second operand
 * @return the formula that means `a || b`
 */
const or: (a: Formula, b: Formula) => Formula = (a: Formula, b: Formula) => {
    return {
        atomic: false,
        size: a.size + b.size + 1,
        operator: Operator.Or,
        operand1: a,
        operand2: b,
        toString(): string {
            return _binaryToString(Operator.Or, a, b);
        }
    };
};

/**
 * Returns the formula that means `a -> b`.
 *
 * @param a first operand
 * @param b second operand
 * @return the formula that means `a -> b`
 */
const imply: (a: Formula, b: Formula) => Formula = (a: Formula, b: Formula) => {
    return {
        atomic: false,
        size: a.size + b.size + 1,
        operator: Operator.Imply,
        operand1: a,
        operand2: b,
        toString(): string {
            return _binaryToString(Operator.Imply, a, b);
        }
    };
};

/**
 * Returns the formula that means `!a`.
 *
 * @param a first operand
 * @return the formula that means `!a`
 */
const not: (a: Formula) => Formula = (a: Formula) => {
    return {
        atomic: false,
        size: a.size + 1,
        operator: Operator.Not,
        operand1: a,
        toString(): string {
            return a.atomic ? `!${a}` : `!(${a})`;
        }
    };
};

export { Operator, Formula, formcmp, variable, and, or, imply, not };
