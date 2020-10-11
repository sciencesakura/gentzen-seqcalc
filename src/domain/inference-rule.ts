import { BinaryConnective, UnaryConnective } from "./formula";
import { Operator } from "./operator";
import { Sequent, sequent } from "./sequent";

/**
 * Represents a inference rule.
 */
export type InferenceRule = (seq: Sequent, pos: number) => [Sequent, Sequent?];

/**
 * The inference rule that means `&&L`.
 */
const andL: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.antecedents[position] as BinaryConnective;
  const left = s.antecedents.slice(0, position);
  const right = s.antecedents.slice(position + 1);
  return [sequent([...left, principal.operand1, principal.operand2, ...right], s.succedents)];
};

/**
 * The inference rule that means `&&R`.
 */
const andR: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.succedents[position] as BinaryConnective;
  const left = s.succedents.slice(0, position);
  const right = s.succedents.slice(position + 1);
  return [
    sequent(s.antecedents, [...left, principal.operand1, ...right]),
    sequent(s.antecedents, [...left, principal.operand2, ...right]),
  ];
};

/**
 * The inference rule that means `||L`.
 */
const orL: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.antecedents[position] as BinaryConnective;
  const left = s.antecedents.slice(0, position);
  const right = s.antecedents.slice(position + 1);
  return [
    sequent([...left, principal.operand1, ...right], s.succedents),
    sequent([...left, principal.operand2, ...right], s.succedents),
  ];
};

/**
 * The inference rule that means `||R`.
 */
const orR: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.succedents[position] as BinaryConnective;
  const left = s.succedents.slice(0, position);
  const right = s.succedents.slice(position + 1);
  return [sequent(s.antecedents, [...left, principal.operand1, principal.operand2, ...right])];
};

/**
 * The inference rule that means `->L`.
 */
const implyL: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.antecedents[position] as BinaryConnective;
  const left = s.antecedents.slice(0, position);
  const right = s.antecedents.slice(position + 1);
  return [
    sequent([...left, ...right], [...s.succedents, principal.operand1]),
    sequent([...left, principal.operand2, ...right], s.succedents),
  ];
};

/**
 * The inference rule that means `->R`.
 */
const implyR: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.succedents[position] as BinaryConnective;
  const left = s.succedents.slice(0, position);
  const right = s.succedents.slice(position + 1);
  return [sequent([principal.operand1, ...s.antecedents], [...left, principal.operand2, ...right])];
};

/**
 * The inference rule that means `!L`.
 */
const notL: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.antecedents[position] as UnaryConnective;
  const left = s.antecedents.slice(0, position);
  const right = s.antecedents.slice(position + 1);
  return [sequent([...left, ...right], [...s.succedents, principal.operand1])];
};

/**
 * The inference rule that means `!R`.
 */
const notR: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.succedents[position] as UnaryConnective;
  const left = s.succedents.slice(0, position);
  const right = s.succedents.slice(position + 1);
  return [sequent([principal.operand1, ...s.antecedents], [...left, ...right])];
};

/**
 * Returns the left side inference rule.
 *
 * @param o the operator
 * @return the inference rule
 */
export const leftRule: (o: Operator) => InferenceRule = (o: Operator) => {
  switch (o) {
    case "And":
      return andL;
    case "Or":
      return orL;
    case "Imply":
      return implyL;
    case "Not":
      return notL;
  }
};

/**
 * Returns the right side inference rule.
 *
 * @param o the operator
 * @return the inference rule
 */
export const rightRule: (o: Operator) => InferenceRule = (o: Operator) => {
  switch (o) {
    case "And":
      return andR;
    case "Or":
      return orR;
    case "Imply":
      return implyR;
    case "Not":
      return notR;
  }
};
