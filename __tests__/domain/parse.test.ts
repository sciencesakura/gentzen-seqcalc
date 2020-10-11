import { parse } from "../../src/domain/parse";
import { toString } from "../../src/domain/sequent";

test("parses a sequent: `A |- A`", () => {
  const s = parse("A |- A");
  expect(toString(s)).toBe("A |- A");
});

test("parses a sequent: `A|-A`", () => {
  const s = parse("A|-A");
  expect(toString(s)).toBe("A |- A");
});

test("parses a sequent: ` A |- A `", () => {
  const s = parse(" A |- A ");
  expect(toString(s)).toBe("A |- A");
});

test("parses a sequent: `|- A`", () => {
  const s = parse("|- A");
  expect(toString(s)).toBe("|- A");
});

test("parses a sequent: `A |-`", () => {
  const s = parse("A |-");
  expect(toString(s)).toBe("A |-");
});

test("parses a sequent: `|-`", () => {
  const s = parse("|-");
  expect(toString(s)).toBe("|-");
});

test("parses a sequent: `A && B, A || B, A -> B, !A |-`", () => {
  const s = parse("A && B, A || B, A -> B, !A |-");
  expect(toString(s)).toBe("A && B, A || B, A -> B, !A |-");
});

test("parses a sequent: `A && (B && C), (A && B) && C, (A && B) && (C && D) |-`", () => {
  const s = parse("A && (B && C), (A && B) && C, (A && B) && (C && D) |-");
  expect(toString(s)).toBe("A && (B && C), (A && B) && C, (A && B) && (C && D) |-");
});

test("parses a sequent: `A || (B || C), (A || B) || C, (A || B) || (C || D) |-`", () => {
  const s = parse("A || (B || C), (A || B) || C, (A || B) || (C || D) |-");
  expect(toString(s)).toBe("A || (B || C), (A || B) || C, (A || B) || (C || D) |-");
});

test("parses a sequent: `A -> (B -> C), (A -> B) -> C, (A -> B) -> (C -> D) |-`", () => {
  const s = parse("A -> (B -> C), (A -> B) -> C, (A -> B) -> (C -> D) |-");
  expect(toString(s)).toBe("A -> (B -> C), (A -> B) -> C, (A -> B) -> (C -> D) |-");
});

test("parses a sequent: `!A, !(A && B), !!A, !(!A && !B) |-`", () => {
  const s = parse("!A, !(A && B), !!A, !(!A && !B) |-");
  expect(toString(s)).toBe("!A, !(A && B), !!A, !(!A && !B) |-");
});

test("parses a sequent: `A && B && C, A || B || C, A -> B -> C |-`", () => {
  const s = parse("A && B && C, A || B || C, A -> B -> C |-");
  expect(toString(s)).toBe("(A && B) && C, (A || B) || C, (A -> B) -> C |-");
});

test("parses a sequent that contains redundant parentheses", () => {
  const s = parse("(A), ((A)), (A && B), (A) && (B), ((A) && (B)), !(A), (!A), (!(!A)) |-");
  expect(toString(s)).toBe("A, A, A && B, A && B, A && B, !A, !A, !!A |-");
});

test("failed to parse (unexpected end of input)", () => {
  expect(() => parse("")).toThrow("unexpected end of input (0)");
  expect(() => parse("A")).toThrow("unexpected end of input (1)");
  expect(() => parse("A |- (A &&")).toThrow("unexpected end of input (10)");
  expect(() => parse("A |- (A && B")).toThrow("unexpected end of input (12)");
});
