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

    /** Gets the identifier of the propositional variable if `atomic` is `true`, undefined otherwise. */
    readonly identifier?: string;

    /** Gets the operator if `atomic` is `false`, undefined otherwise. */
    readonly operator?: Operator;

    /** Gets the first operand if `atomic` is `false`, undefined otherwise. */
    readonly operand1?: Formula;

    /** Gets the second operand if `atomic` is `false` and `operator` is binary, undefined otherwise. */
    readonly operand2?: Formula;
}

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
        operator: Operator.Not,
        operand1: a,
        toString(): string {
            return a.atomic ? `!${a}` : `!(${a})`;
        }
    };
};

export { Operator, Formula, variable, and, or, imply, not };
