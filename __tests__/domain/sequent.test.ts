import { variable, and, or } from '../../src/domain/formula';
import { sequent } from '../../src/domain/sequent';

const a = variable('A');
const b = variable('B');
const c = variable('C');

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
