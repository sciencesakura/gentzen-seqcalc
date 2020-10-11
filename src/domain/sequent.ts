import { Formula, equal as fequal, toString as ftostr } from "./formula";

/**
 * Represents a sequent.
 */
export interface Sequent {
  /** Gets the formula sequence for antecedents. */
  readonly antecedents: Formulas;

  /** Gets the formula sequence for succedents. */
  readonly succedents: Formulas;
}

/**
 * Represents a sequence of zero or more formulas.
 */
export type Formulas = ReadonlyArray<Formula>;

/**
 * Return the new sequent.
 *
 * @param a the formula sequence for antecedents
 * @param b the formula sequence for succedents
 * @returns the new sequent
 */
export const sequent: (a: Formulas, b: Formulas) => Sequent = (a: Formulas, b: Formulas) => ({
  antecedents: a,
  succedents: b,
});

/**
 * Checks whether the specified sequent is an initial sequent.
 *
 * @param seq the sequent to check
 * @returns `true` if the specified sequent is an initial sequent, `false` otherwise
 */
export const isInitial: (seq: Sequent) => boolean = (seq: Sequent) => {
  for (const i of seq.antecedents) {
    for (const j of seq.succedents) {
      if (fequal(i, j)) return true;
    }
  }
  return false;
};

/**
 * Returns a string representation.
 *
 * @param seq the sequent to string
 * @returns the string representation
 */
export const toString: (seq: Sequent) => string = (seq: Sequent) => {
  const a = seq.antecedents.map(ftostr).join(", ");
  const b = seq.succedents.map(ftostr).join(", ");
  return `${a} |- ${b}`.trim();
};
