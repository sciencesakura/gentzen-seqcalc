import { variable, and, or, imply, not } from '../../src/domain/formula';
import { sequent, disassemble } from '../../src/domain/sequent';

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

test('disassembles (&&R): `X |- Y, A && B, Z ==> X |- A, Y, Z; X |- B, Y, Z`', () => {
    const s = sequent([x], [y, and(a, b), z]);
    const actual = disassemble(s);
    expect(actual!.sequent1.toString()).toBe('X |- A, Y, Z');
    expect(actual!.sequent2!.toString()).toBe('X |- B, Y, Z');
});

test('disassembles (&&L): `X, A && B, Y |- Z ==> A, B, X, Y |- Z`', () => {
    const s = sequent([x, and(a, b), y], [z]);
    const actual = disassemble(s);
    expect(actual!.sequent1.toString()).toBe('A, B, X, Y |- Z');
    expect(actual!.sequent2).toBeUndefined();
});

test('disassembles (||R): `X |- Y, A || B, Z ==> X |- A, B, Y, Z`', () => {
    const s = sequent([x], [y, or(a, b), z]);
    const actual = disassemble(s);
    expect(actual!.sequent1.toString()).toBe('X |- A, B, Y, Z');
    expect(actual!.sequent2).toBeUndefined();
});

test('disassembles (||L): `X, A || B, Y |- Z ==> A, X, Y |- Z; B, X, Y |- Z`', () => {
    const s = sequent([x, or(a, b), y], [z]);
    const actual = disassemble(s);
    expect(actual!.sequent1.toString()).toBe('A, X, Y |- Z');
    expect(actual!.sequent2!.toString()).toBe('B, X, Y |- Z');
});

test('disassembles (->R): `X |- Y, A -> B, Z ==> A, X |- B, Y, Z`', () => {
    const s = sequent([x], [y, imply(a, b), z]);
    const actual = disassemble(s);
    expect(actual!.sequent1.toString()).toBe('A, X |- B, Y, Z');
    expect(actual!.sequent2).toBeUndefined();
});

test('disassembles (->L): `X, A -> B, Y |- Z ==> X, Y |- A, Z; B, X, Y |- Z`', () => {
    const s = sequent([x, imply(a, b), y], [z]);
    const actual = disassemble(s);
    expect(actual!.sequent1.toString()).toBe('X, Y |- A, Z');
    expect(actual!.sequent2!.toString()).toBe('B, X, Y |- Z');
});

test('disassembles (!R): `X |- Y, !A, Z ==> A, X |- Y, Z`', () => {
    const s = sequent([x], [y, not(a), z]);
    const actual = disassemble(s);
    expect(actual!.sequent1.toString()).toBe('A, X |- Y, Z');
    expect(actual!.sequent2).toBeUndefined();
});

test('disassembles (!L): `X, !A, Y |- Z ==> X, Y |- A, Z`', () => {
    const s = sequent([x, not(a), y], [z]);
    const actual = disassemble(s);
    expect(actual!.sequent1.toString()).toBe('X, Y |- A, Z');
    expect(actual!.sequent2).toBeUndefined();
});
