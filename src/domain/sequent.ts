import { Formula } from './formula';

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
 * Represents a sequence of zero or more formulas.
 */
type Formulas = ReadonlyArray<Formula>;

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
            const s1 = this.antecedents.length === 0 ? '|-' : `${this.antecedents.join(', ')} |-`;
            return this.succedents.length === 0 ? s1 : `${s1} ${this.succedents.join(', ')}`;
        }
    };
};

export { Sequent, sequent };
