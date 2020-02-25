import { Operator } from './operator';
import { Sequent, sequent } from './sequent';

/**
 * Represents a inference rule.
 */
type InferenceRule = (sequent: Sequent, position: number) => [Sequent, Sequent?];

/**
 * The inference rule that means `&&L`.
 */
const andL: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.antecedents[position];
  const left = s.antecedents.slice(0, position);
  const right = s.antecedents.slice(position + 1);
  return [sequent([...left, principal.operand1!, principal.operand2!, ...right], s.succedents)];
};

/**
 * The inference rule that means `&&R`.
 */
const andR: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.succedents[position];
  const left = s.succedents.slice(0, position);
  const right = s.succedents.slice(position + 1);
  return [
    sequent(s.antecedents, [...left, principal.operand1!, ...right]),
    sequent(s.antecedents, [...left, principal.operand2!, ...right])
  ];
};

/**
 * The inference rule that means `||L`.
 */
const orL: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.antecedents[position];
  const left = s.antecedents.slice(0, position);
  const right = s.antecedents.slice(position + 1);
  return [
    sequent([...left, principal.operand1!, ...right], s.succedents),
    sequent([...left, principal.operand2!, ...right], s.succedents)
  ];
};

/**
 * The inference rule that means `||R`.
 */
const orR: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.succedents[position];
  const left = s.succedents.slice(0, position);
  const right = s.succedents.slice(position + 1);
  return [sequent(s.antecedents, [...left, principal.operand1!, principal.operand2!, ...right])];
};

/**
 * The inference rule that means `->L`.
 */
const implyL: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.antecedents[position];
  const left = s.antecedents.slice(0, position);
  const right = s.antecedents.slice(position + 1);
  return [
    sequent([...left, ...right], [...s.succedents, principal.operand1!]),
    sequent([...left, principal.operand2!, ...right], s.succedents)
  ];
};

/**
 * The inference rule that means `->R`.
 */
const implyR: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.succedents[position];
  const left = s.succedents.slice(0, position);
  const right = s.succedents.slice(position + 1);
  return [sequent([principal.operand1!, ...s.antecedents], [...left, principal.operand2!, ...right])];
};

/**
 * The inference rule that means `!L`.
 */
const notL: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.antecedents[position];
  const left = s.antecedents.slice(0, position);
  const right = s.antecedents.slice(position + 1);
  return [sequent([...left, ...right], [...s.succedents, principal.operand1!])];
};

/**
 * The inference rule that means `!R`.
 */
const notR: InferenceRule = (s: Sequent, position: number) => {
  const principal = s.succedents[position];
  const left = s.succedents.slice(0, position);
  const right = s.succedents.slice(position + 1);
  return [sequent([principal.operand1!, ...s.antecedents], [...left, ...right])];
};

const LEFT_RULES: ReadonlyMap<Operator, InferenceRule> = new Map<Operator, InferenceRule>([
  [Operator.And, andL],
  [Operator.Or, orL],
  [Operator.Imply, implyL],
  [Operator.Not, notL]
]);

const RIGHT_RULES: ReadonlyMap<Operator, InferenceRule> = new Map<Operator, InferenceRule>([
  [Operator.And, andR],
  [Operator.Or, orR],
  [Operator.Imply, implyR],
  [Operator.Not, notR]
]);

/**
 * Returns the left side inference rule.
 *
 * @param operator the operator
 * @return the inference rule
 */
const leftRule: (operator: Operator) => InferenceRule = (operator: Operator) => {
  return LEFT_RULES.get(operator)!;
};

/**
 * Returns the right side inference rule.
 *
 * @param operator the operator
 * @return the inference rule
 */
const rightRule: (operator: Operator) => InferenceRule = (operator: Operator) => {
  return RIGHT_RULES.get(operator)!;
};

export { InferenceRule, leftRule, rightRule };
