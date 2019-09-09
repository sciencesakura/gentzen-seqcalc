import { Formula, formcmp } from './formula';
import { dedupe } from '../util/arrays';

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

export { Sequent, sequent, normalize };
