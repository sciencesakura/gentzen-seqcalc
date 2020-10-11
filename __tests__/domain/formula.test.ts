import { variable, and, or, imply, not, toString } from "../../src/domain/formula";

test("constructs a formula: `A`", () => {
  const a = variable("A");
  expect(toString(a)).toBe("A");
});

test("constructs a formula: `A && B`", () => {
  const a = variable("A");
  const b = variable("B");
  const f = and(a, b);
  expect(toString(f)).toBe("A && B");
});

test("constructs a formula: `A || B`", () => {
  const a = variable("A");
  const b = variable("B");
  const f = or(a, b);
  expect(toString(f)).toBe("A || B");
});

test("constructs a formula: `A -> B`", () => {
  const a = variable("A");
  const b = variable("B");
  const f = imply(a, b);
  expect(toString(f)).toBe("A -> B");
});

test("constructs a formula: `!A`", () => {
  const a = variable("A");
  const f = not(a);
  expect(toString(f)).toBe("!A");
});

test("constructs a formula: `(A && B) || C", () => {
  const f = or(and(variable("A"), variable("B")), variable("C"));
  expect(toString(f)).toBe("(A && B) || C");
});

test("constructs a formula: `!A || B", () => {
  const f = or(not(variable("A")), variable("B"));
  expect(toString(f)).toBe("!A || B");
});

test("constructs a formula: `!(A && B)`", () => {
  const f = not(and(variable("A"), variable("B")));
  expect(toString(f)).toBe("!(A && B)");
});

test("constructs a formula: `!!A`", () => {
  const f = not(not(variable("A")));
  expect(toString(f)).toBe("!!A");
});
