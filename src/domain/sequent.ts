import { Operator, Formula, formcmp } from './formula';
import { dedupe, findLastIndex } from '../util/arrays';

/**
 * Represents the sequence of zero or more formulas.
 */
type Formulas = ReadonlyArray<Formula>;

/**
 * Represents the sequent.
 */
interface Sequent {
    /** Gets the formula sequence for antecedents. */
    readonly antecedents: Formulas;

    /** Gets the formula sequence for succedents. */
    readonly succedents: Formulas;
}

/**
 * Return the sequent.
 *
 * @param antecedents the formula sequence for antecedents
 * @param succedents the formula sequence for succedents
 * @return the sequent
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

/**
 * Returns the normalized sequent.
 *
 * @param s the sequent to normalize
 * @return the normalized sequent
 */
const normalize: (s: Sequent) => Sequent = (s: Sequent) => {
    const antecedent = dedupe(s.antecedents, formcmp);
    const succedent = dedupe(s.succedents, formcmp);
    return sequent(antecedent, succedent);
};

/**
 * Represents the disassembly target.
 */
interface DisassemblyTarget {
    /** Gets the side that the target formula belongs. */
    readonly side: 'L' | 'R';

    /** Gets the target formula. */
    readonly formula: Formula;

    /** Gets the formula sequence that excluded the target formula. */
    readonly excluded: Formulas;
}

/**
 * Returns the next disassembly target, or `null` if not found.
 */
const disassemblyTarget: (s: Sequent) => DisassemblyTarget | null = (s: Sequent) => {
    let side: 'L' | 'R' = 'L';
    let sequence = s.antecedents;
    let index = findLastIndex(sequence, f => !f.atomic);
    if (index === -1) {
        side = 'R';
        sequence = s.succedents;
        index = findLastIndex(sequence, f => !f.atomic);
    }
    if (index === -1) return null;
    const excluded = sequence.filter((_, i) => i !== index);
    return {
        side,
        formula: sequence[index],
        excluded
    };
};

interface DisassemblyResult {
    readonly sequent1: Sequent;

    readonly sequent2?: Sequent;
}

const disassemblyResult: (s1: Sequent, s2?: Sequent) => DisassemblyResult = (s1: Sequent, s2?: Sequent) => {
    if (s2)
        return {
            sequent1: normalize(s1),
            sequent2: normalize(s2)
        };
    return {
        sequent1: normalize(s1)
    };
};

const disassembleLeft: (s: Sequent, target: DisassemblyTarget) => DisassemblyResult = (
    s: Sequent,
    target: DisassemblyTarget
) => {
    const formula = target.formula;
    const excluded = target.excluded.slice();
    switch (formula.operator) {
        case Operator.And: {
            excluded.push(formula.operand1!);
            excluded.push(formula.operand2!);
            return disassemblyResult(sequent(excluded, s.succedents));
        }
        case Operator.Or: {
            const ant2 = excluded.slice();
            ant2.push(formula.operand2!);
            excluded.push(formula.operand1!);
            return disassemblyResult(sequent(excluded, s.succedents), sequent(ant2, s.succedents));
        }
        case Operator.Imply: {
            const suc1 = s.succedents.slice();
            const ant2 = excluded.slice();
            suc1.push(formula.operand1!);
            ant2.push(formula.operand2!);
            return disassemblyResult(sequent(excluded, suc1), sequent(ant2, s.succedents));
        }
        case Operator.Not: {
            const suc1 = s.succedents.slice();
            suc1.push(formula.operand1!);
            return disassemblyResult(sequent(excluded, suc1));
        }
        default:
            throw new Error(`Unsupported operator: ${formula.operator}`);
    }
};

const disassembleRight: (s: Sequent, target: DisassemblyTarget) => DisassemblyResult = (
    s: Sequent,
    target: DisassemblyTarget
) => {
    const formula = target.formula;
    const excluded = target.excluded.slice();
    switch (formula.operator!) {
        case Operator.And: {
            const suc2 = excluded.slice();
            suc2.push(formula.operand2!);
            excluded.push(formula.operand1!);
            return disassemblyResult(sequent(s.antecedents, excluded), sequent(s.antecedents, suc2));
        }
        case Operator.Or: {
            excluded.push(formula.operand1!);
            excluded.push(formula.operand2!);
            return disassemblyResult(sequent(s.antecedents, excluded));
        }
        case Operator.Imply: {
            const ant1 = s.antecedents.slice();
            ant1.push(formula.operand1!);
            excluded.push(formula.operand2!);
            return disassemblyResult(sequent(ant1, excluded));
        }
        case Operator.Not: {
            const ant1 = s.antecedents.slice();
            ant1.push(formula.operand1!);
            return disassemblyResult(sequent(ant1, excluded));
        }
        default:
            throw new Error(`Unsupported operator: ${formula.operator}`);
    }
};

/**
 * Disassembles the sequent and returns disassembled one or two sequents, or `null` if could not disassemble.
 *
 * @param s the sequent to disassemble
 * @return disassembled one or two sequents, or `null` if could not disassemble
 */
const disassemble: (s: Sequent) => DisassemblyResult | null = (s: Sequent) => {
    const target = disassemblyTarget(s);
    if (!target) return null;
    return target.side === 'L' ? disassembleLeft(s, target) : disassembleRight(s, target);
};

export { Sequent, sequent, normalize, disassemble };
