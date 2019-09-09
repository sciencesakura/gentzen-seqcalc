import { Formula } from './formula';

/**
 * Represents the sequent.
 */
interface Sequent {
    /** Gets the antecedent of this sequent. */
    readonly antecedent: Array<Formula>;

    /** Gets the succedent of this sequent. */
    readonly succedent: Array<Formula>;
}

/**
 * Return the sequent.
 *
 * @param antecedent the antecedent
 * @param succedent the succedent
 * @return the sequent
 */
const sequent: (antecedent: Array<Formula>, succedent: Array<Formula>) => Sequent = (
    antecedent: Array<Formula>,
    succedent: Array<Formula>
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

export { Sequent, sequent };
