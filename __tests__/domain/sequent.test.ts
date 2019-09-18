import { variable, and, or, imply, not } from '../../src/domain/formula';
import { sequent, decompose } from '../../src/domain/sequent';

const a = variable('A');
const b = variable('B');
const c = variable('C');
const x = variable('X');
const y = variable('Y');
const z = variable('Z');

test('constructs a sequent: `A, B && C |- A || B, C`', () => {
    const s = sequent([a, and(b, c)], [or(a, b), c]);
    expect(s.toString()).toBe('A, B && C |- A || B, C');
});

test('constructs a sequent: `|- A`', () => {
    const s = sequent([], [a]);
    expect(s.toString()).toBe('|- A');
});

test('constructs a sequent: `A |-`', () => {
    const s = sequent([a], []);
    expect(s.toString()).toBe('A |-');
});

test('decomposes (&&R): `X |- Y, A && B, Z ==> X |- A, Y, Z; X |- B, Y, Z`', () => {
    const s = sequent([x], [y, and(a, b), z]);
    const actual = decompose(s);
    expect(actual.sequent.toString()).toBe('X |- Y, A && B, Z');
    expect(actual.child1!.sequent.toString()).toBe('X |- A, Y, Z');
    expect(actual.child1!.child1).toBeUndefined();
    expect(actual.child1!.child2).toBeUndefined();
    expect(actual.child2!.sequent.toString()).toBe('X |- B, Y, Z');
    expect(actual.child2!.child1).toBeUndefined();
    expect(actual.child2!.child2).toBeUndefined();
});

test('decomposes (&&L): `X, A && B, Y |- Z ==> A, B, X, Y |- Z`', () => {
    const s = sequent([x, and(a, b), y], [z]);
    const actual = decompose(s);
    expect(actual.sequent.toString()).toBe('X, A && B, Y |- Z');
    expect(actual.child1!.sequent.toString()).toBe('A, B, X, Y |- Z');
    expect(actual.child1!.child1).toBeUndefined();
    expect(actual.child1!.child2).toBeUndefined();
    expect(actual.child2).toBeUndefined();
});

test('decomposes (||R): `X |- Y, A || B, Z ==> X |- A, B, Y, Z`', () => {
    const s = sequent([x], [y, or(a, b), z]);
    const actual = decompose(s);
    expect(actual.sequent.toString()).toBe('X |- Y, A || B, Z');
    expect(actual.child1!.sequent.toString()).toBe('X |- A, B, Y, Z');
    expect(actual.child1!.child1).toBeUndefined();
    expect(actual.child1!.child2).toBeUndefined();
    expect(actual.child2).toBeUndefined();
});

test('decomposes (||L): `X, A || B, Y |- Z ==> A, X, Y |- Z; B, X, Y |- Z`', () => {
    const s = sequent([x, or(a, b), y], [z]);
    const actual = decompose(s);
    expect(actual.sequent.toString()).toBe('X, A || B, Y |- Z');
    expect(actual.child1!.sequent.toString()).toBe('A, X, Y |- Z');
    expect(actual.child1!.child1).toBeUndefined();
    expect(actual.child1!.child2).toBeUndefined();
    expect(actual.child2!.sequent.toString()).toBe('B, X, Y |- Z');
    expect(actual.child2!.child1).toBeUndefined();
    expect(actual.child2!.child2).toBeUndefined();
});

test('decomposes (->R): `X |- Y, A -> B, Z ==> A, X |- B, Y, Z`', () => {
    const s = sequent([x], [y, imply(a, b), z]);
    const actual = decompose(s);
    expect(actual.sequent.toString()).toBe('X |- Y, A -> B, Z');
    expect(actual.child1!.sequent.toString()).toBe('A, X |- B, Y, Z');
    expect(actual.child1!.child1).toBeUndefined();
    expect(actual.child1!.child2).toBeUndefined();
    expect(actual.child2).toBeUndefined();
});

test('decomposes (->L): `X, A -> B, Y |- Z ==> X, Y |- A, Z; B, X, Y |- Z`', () => {
    const s = sequent([x, imply(a, b), y], [z]);
    const actual = decompose(s);
    expect(actual.sequent.toString()).toBe('X, A -> B, Y |- Z');
    expect(actual.child1!.sequent.toString()).toBe('X, Y |- A, Z');
    expect(actual.child1!.child1).toBeUndefined();
    expect(actual.child1!.child2).toBeUndefined();
    expect(actual.child2!.sequent.toString()).toBe('B, X, Y |- Z');
    expect(actual.child2!.child1).toBeUndefined();
    expect(actual.child2!.child2).toBeUndefined();
});

test('decomposes (!R): `X |- Y, !A, Z ==> A, X |- Y, Z`', () => {
    const s = sequent([x], [y, not(a), z]);
    const actual = decompose(s);
    expect(actual.sequent.toString()).toBe('X |- Y, !A, Z');
    expect(actual.child1!.sequent.toString()).toBe('A, X |- Y, Z');
    expect(actual.child1!.child1).toBeUndefined();
    expect(actual.child1!.child2).toBeUndefined();
    expect(actual.child2).toBeUndefined();
});

test('decomposes (!L): `X, !A, Y |- Z ==> X, Y |- A, Z`', () => {
    const s = sequent([x, not(a), y], [z]);
    const actual = decompose(s);
    expect(actual.sequent.toString()).toBe('X, !A, Y |- Z');
    expect(actual.child1!.sequent.toString()).toBe('X, Y |- A, Z');
    expect(actual.child1!.child1).toBeUndefined();
    expect(actual.child1!.child2).toBeUndefined();
    expect(actual.child2).toBeUndefined();
});

test('decomposes repeatedly', () => {
    const s = sequent([not(and(a, b))], [or(not(a), not(b))]);
    const actual = decompose(s);
    expect(actual.sequent.toString()).toBe('!(A && B) |- !A || !B');
    expect(actual.child1!.sequent.toString()).toBe('|- A && B, !A || !B');
    expect(actual.child1!.child1!.sequent.toString()).toBe('|- !A, !B, A && B');
    expect(actual.child1!.child1!.child1!.sequent.toString()).toBe('|- A, !A, !B');
    expect(actual.child1!.child1!.child1!.child1!.sequent.toString()).toBe('B |- A, !A');
    expect(actual.child1!.child1!.child1!.child1!.child1!.sequent.toString()).toBe('A, B |- A');
    expect(actual.child1!.child1!.child2!.sequent.toString()).toBe('|- B, !A, !B');
    expect(actual.child1!.child1!.child2!.child1!.sequent.toString()).toBe('B |- B, !A');
    expect(actual.child1!.child1!.child2!.child1!.child1!.sequent.toString()).toBe('A, B |- B');
});
