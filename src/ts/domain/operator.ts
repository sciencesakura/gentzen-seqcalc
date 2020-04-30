/**
 * Represents a logical operator.
 */
enum Operator {
  And = '&&',

  Or = '||',

  Imply = '->',

  Not = '!',
}

/**
 * Checks wether the specified operator is an unary operator or not.
 *
 * @param operator the operator to check
 * @return `true` if the specified operator is unary, `false` otherwise
 */
const isUnary = (operator: Operator) => operator === Operator.Not;

/*
 * Checks wether the specified operator is a binary operator or not.
 *
 * @param operator the operator to check
 * @return `true` if the specified operator is binary, `false` otherwise
 */
const isBinary = (operator: Operator) => operator !== Operator.Not;

export { Operator, isUnary, isBinary };
