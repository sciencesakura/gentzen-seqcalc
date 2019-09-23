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

/**
 * Represents a logical operator.
 */
enum Operator {
    And = '&&',

    Or = '||',

    Imply = '->',

    Not = '!'
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
            return this.identifier;
        }
    };
    _varcache.set(identifier, v);
    return v;
};

const _paren: (formula: Formula) => string = (formula: Formula) => {
    return formula.atomic || formula.operator === Operator.Not ? `${formula}` : `(${formula})`;
};

const _binconn: (op: Operator, a: Formula, b: Formula) => Formula = (op: Operator, a: Formula, b: Formula) => {
    return {
        atomic: false,
        operator: op,
        operand1: a,
        operand2: b,
        toString(): string {
            return `${_paren(this.operand1!)} ${this.operator} ${_paren(this.operand2!)}`;
        }
    };
};

/**
 * Returns the formula that means `a && b`.
 *
 * @param a first operand
 * @param b second operand
 * @return the formula that means `a && b`
 */
const and: (a: Formula, b: Formula) => Formula = (a: Formula, b: Formula) => {
    return _binconn(Operator.And, a, b);
};

/**
 * Returns the formula that means `a || b`.
 *
 * @param a first operand
 * @param b second operand
 * @return the formula that means `a || b`
 */
const or: (a: Formula, b: Formula) => Formula = (a: Formula, b: Formula) => {
    return _binconn(Operator.Or, a, b);
};

/**
 * Returns the formula that means `a -> b`.
 *
 * @param a first operand
 * @param b second operand
 * @return the formula that means `a -> b`
 */
const imply: (a: Formula, b: Formula) => Formula = (a: Formula, b: Formula) => {
    return _binconn(Operator.Imply, a, b);
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
            return `!${_paren(this.operand1!)}`;
        }
    };
};

/**
 * Provides an equivalence relation of formulas.
 *
 * @param a the formula to compare
 * @param b the formula to compare
 * @return `true` if two formulas is same, `false` otherwise
 */
const formequ: (a: Formula, b: Formula) => boolean = (a: Formula, b: Formula) => {
    return (
        a === b ||
        (a.atomic && b.atomic && a.identifier === b.identifier) ||
        (a.operator === b.operator &&
            formequ(a.operand1!, b.operand2!) &&
            (a.operator === Operator.Not ? true : formequ(b.operand1!, b.operand2!)))
    );
};

export { Formula, Operator, variable, and, or, imply, not, formequ };
