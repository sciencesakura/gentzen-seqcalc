/**
 * Represents a logical operator.
 */
export const Operator = ["And", "Or", "Imply", "Not"] as const;
export type Operator = typeof Operator[number];

/**
 * Checks wether the specified operator is an unary operator or not.
 *
 * @param o the operator to check
 * @returns `true` if the specified operator is unary, `false` otherwise
 */
export const isUnary = (o: Operator): o is "Not" => o === "Not";

/**
 * Checks wether the specified operator is a binary operator or not.
 *
 * @param o the operator to check
 * @returns `true` if the specified operator is binary, `false` otherwise
 */
export const isBinary = (o: Operator): o is "And" | "Or" | "Imply" => o !== "Not";

/**
 * Returns a string representation.
 *
 * @param o the operator to string
 * @returns the string representation
 */
export const toString: (o: Operator) => string = (o: Operator) => {
  switch (o) {
    case "And":
      return "&&";
    case "Or":
      return "||";
    case "Imply":
      return "->";
    case "Not":
      return "!";
  }
};
