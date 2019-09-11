import { Operator, Formula, formcmp } from './formula';
import { dedupe, findLastIndex } from '../util/arrays';

/**
 * Represents the sequent.
 */
interface Sequent {
    /** Gets the antecedent of this sequent. */
    readonly antecedent: ReadonlyArray<Formula>;

    /** Gets the succedent of this sequent. */
    readonly succedent: ReadonlyArray<Formula>;
}

/**
 * Return the sequent.
 *
 * @param antecedent the antecedent
 * @param succedent the succedent
 * @return the sequent
 */
const sequent: (antecedent: ReadonlyArray<Formula>, succedent: ReadonlyArray<Formula>) => Sequent = (
    antecedent: ReadonlyArray<Formula>,
    succedent: ReadonlyArray<Formula>
) => {
    return {
        antecedent,
        succedent,
        toString(): string {
            let str = '';
            if (antecedent.length !== 0) {
                str = `${antecedent.join(', ')} `;
            }
            str += '|-';
            if (succedent.length !== 0) {
                str += ` ${succedent.join(', ')}`;
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
    const antecedent = dedupe(s.antecedent, formcmp);
    const succedent = dedupe(s.succedent, formcmp);
    return sequent(antecedent, succedent);
};

const _isNonAtomic: (f: Formula) => boolean = (f: Formula) => !f.atomic;

const _findPrincipal: (s: Sequent) => [Formula, number, ReadonlyArray<Formula>, 0 | 1] | null = (s: Sequent) => {
    let i = findLastIndex(s.antecedent, _isNonAtomic);
    if (i !== -1) return [s.antecedent[i], i, s.antecedent, 1];
    i = findLastIndex(s.succedent, _isNonAtomic);
    return i === -1 ? null : [s.succedent[i], i, s.succedent, 0];
};

const disassemble: (s: Sequent) => [Sequent, Sequent?] | null = (s: Sequent) => {
    const p = _findPrincipal(s);
    if (!p) return null;
    const principal = p[0];
    const removed = p[2].filter((_, index) => index !== p[1]);
    let ss: [Sequent, Sequent?];
    switch (principal.operator) {
        case Operator.And:
            if (p[3]) {
                removed.push(principal.operand1!);
                removed.push(principal.operand2!);
                ss = [sequent(removed, s.succedent)];
            } else {
                const suc2 = removed.slice();
                suc2.push(principal.operand2!);
                removed.push(principal.operand1!);
                ss = [sequent(s.antecedent, removed), sequent(s.antecedent, suc2)];
            }
            break;
        case Operator.Or:
            if (p[3]) {
                const ant2 = removed.slice();
                ant2.push(principal.operand2!);
                removed.push(principal.operand1!);
                ss = [sequent(removed, s.succedent), sequent(ant2, s.succedent)];
            } else {
                removed.push(principal.operand1!);
                removed.push(principal.operand2!);
                ss = [sequent(s.antecedent, removed)];
            }
            break;
        case Operator.Imply:
            if (p[3]) {
                const suc1 = s.succedent.slice();
                const ant2 = removed.slice();
                suc1.push(principal.operand1!);
                ant2.push(principal.operand2!);
                ss = [sequent(removed, suc1), sequent(ant2, s.succedent)];
            } else {
                const ant1 = s.antecedent.slice();
                ant1.push(principal.operand1!);
                removed.push(principal.operand2!);
                ss = [sequent(ant1, removed)];
            }
            break;
        case Operator.Not:
            if (p[3]) {
                const suc1 = s.succedent.slice();
                suc1.push(principal.operand1!);
                ss = [sequent(removed, suc1)];
            } else {
                const ant1 = s.antecedent.slice();
                ant1.push(principal.operand1!);
                ss = [sequent(ant1, removed)];
            }
            break;
        default:
            throw new Error(`Unsupported operator: ${principal.operator}`);
    }
    const s1 = normalize(ss[0]);
    if (ss[1]) {
        const s2 = normalize(ss[1]);
        return [s1, s2];
    }
    return [s1];
};

export { Sequent, sequent, normalize, disassemble };
