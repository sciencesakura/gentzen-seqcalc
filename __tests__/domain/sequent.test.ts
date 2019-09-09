import { variable, and, or, not } from '../../src/domain/formula';
import { sequent, normalized } from '../../src/domain/sequent';

describe('constructs the sequent', () => {
    it('constructs a sequent#1', () => {
        const s = sequent(
            [variable('A'), and(variable('B'), variable('C'))],
            [or(variable('D'), variable('E')), variable('F')]
        );
        expect(s.toString()).toBe('A, B && C |- D || E, F');
    });

    it('constructs a sequent#2', () => {
        const s = sequent([], [variable('A')]);
        expect(s.toString()).toBe('|- A');
    });

    it('constructs a sequent#3', () => {
        const s = sequent([variable('A')], []);
        expect(s.toString()).toBe('A |-');
    });
});

describe('normalizing of the sequent', () => {
    it('', () => {
        const p = variable('A');
        const q = variable('B');
        const s = sequent([p, q, p, and(p, q), q, or(p, q), and(p, q), and(q, p)], [and(p, q), q, p, q, not(and(p, q))]);
        expect(s.toString()).toBe('A, B, A, A && B, B, A || B, A && B, B && A |- A && B, B, A, B, !(A && B)');
        const t = normalized(s);
        expect(t.toString()).toBe('A, B, A && B, B && A, A || B |- A, B, A && B, !(A && B)');
    });
});
