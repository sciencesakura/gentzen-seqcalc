import { Operator, Formula, formcmp } from './formula';
import { dedupe, findLastIndex } from '../util/arrays';

/**
 * Represents a sequence of zero or more formulas.
 */
type Formulas = ReadonlyArray<Formula>;

/**
 * Represents a sequent.
 */
interface Sequent {
    /** Gets the formula sequence for antecedents. */
    readonly antecedents: Formulas;

    /** Gets the formula sequence for succedents. */
    readonly succedents: Formulas;
}

/**
 * Return the new sequent.
 *
 * @param antecedents the formula sequence for antecedents
 * @param succedents the formula sequence for succedents
 * @return the new sequent
 */
const sequent: (antecedents: Formulas, succedents: Formulas) => Sequent = (antecedents: Formulas, succedents: Formulas) => {
    return {
        antecedents,
        succedents,
        toString(): string {
            let str = '';
            if (antecedents.length !== 0) {
                str = `${antecedents.join(', ')} `;
            }
            str += '|-';
            if (succedents.length !== 0) {
                str += ` ${succedents.join(', ')}`;
            }
            return str;
        }
    };
};

const _normalize: (s: Sequent) => Sequent = (s: Sequent) => {
    const antecedent = dedupe(s.antecedents, formcmp);
    const succedent = dedupe(s.succedents, formcmp);
    return sequent(antecedent, succedent);
};

interface DecomposeResult {
    readonly sequent1: Sequent;

    readonly sequent2?: Sequent;
}

const result: (s1: Sequent, s2?: Sequent) => DecomposeResult = (s1: Sequent, s2?: Sequent) => {
    return s2 ? { sequent1: _normalize(s1), sequent2: _normalize(s2) } : { sequent1: _normalize(s1) };
};

const _decompose: (s: Sequent) => DecomposeResult | null = (s: Sequent) => {
    let sequence = s.antecedents;
    let index = findLastIndex(sequence, f => !f.atomic);
    if (index !== -1) {
        const formula = sequence[index];
        const excluded = sequence.filter((_, i) => i !== index);
        switch (formula.operator) {
            case Operator.And: {
                excluded.push(formula.operand1!);
                excluded.push(formula.operand2!);
                return result(sequent(excluded, s.succedents));
            }
            case Operator.Or: {
                const ant2 = excluded.slice();
                ant2.push(formula.operand2!);
                excluded.push(formula.operand1!);
                return result(sequent(excluded, s.succedents), sequent(ant2, s.succedents));
            }
            case Operator.Imply: {
                const suc1 = s.succedents.slice();
                const ant2 = excluded.slice();
                suc1.push(formula.operand1!);
                ant2.push(formula.operand2!);
                return result(sequent(excluded, suc1), sequent(ant2, s.succedents));
            }
            case Operator.Not: {
                const suc1 = s.succedents.slice();
                suc1.push(formula.operand1!);
                return result(sequent(excluded, suc1));
            }
        }
    }
    sequence = s.succedents;
    index = findLastIndex(sequence, f => !f.atomic);
    if (index !== -1) {
        const formula = sequence[index];
        const excluded = sequence.filter((_, i) => i !== index);
        switch (formula.operator!) {
            case Operator.And: {
                const suc2 = excluded.slice();
                suc2.push(formula.operand2!);
                excluded.push(formula.operand1!);
                return result(sequent(s.antecedents, excluded), sequent(s.antecedents, suc2));
            }
            case Operator.Or: {
                excluded.push(formula.operand1!);
                excluded.push(formula.operand2!);
                return result(sequent(s.antecedents, excluded));
            }
            case Operator.Imply: {
                const ant1 = s.antecedents.slice();
                ant1.push(formula.operand1!);
                excluded.push(formula.operand2!);
                return result(sequent(ant1, excluded));
            }
            case Operator.Not: {
                const ant1 = s.antecedents.slice();
                ant1.push(formula.operand1!);
                return result(sequent(ant1, excluded));
            }
        }
    }
    return null;
};

/**
 * Represents a node of a decomposition tree.
 */
interface DecompositionTreeNode {
    readonly sequent: Sequent;

    readonly child1?: DecompositionTreeNode;

    readonly child2?: DecompositionTreeNode;
}

/**
 * Returns the complete decomposition tree of the given sequent.
 *
 * Decomposes the sequent into one or two sequents and repeats this decomposition until the sequents don't contain logical
 * connectives.
 *
 * @param s the sequent to decompose
 * @return the complete decomposition tree
 */
const decompose: (s: Sequent) => DecompositionTreeNode = (s: Sequent) => {
    const d = _decompose(_normalize(s));
    if (!d) return { sequent: s };
    if (d.sequent2) {
        return {
            sequent: s,
            child1: decompose(d.sequent1),
            child2: decompose(d.sequent2)
        };
    } else {
        return {
            sequent: s,
            child1: decompose(d.sequent1)
        };
    }
};

export { Sequent, sequent, decompose };
