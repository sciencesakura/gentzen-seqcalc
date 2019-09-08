import { variable, and, or, imply, not } from '../../src/domain/formula';

describe('constructs the formulas', () => {
    it('constructs a propositional variable', () => {
        const p = variable('A');
        expect(p.toString()).toBe('A');
    });

    it('constructs a conjunction', () => {
        const p = variable('A');
        const q = variable('B');
        const r = and(p, q);
        expect(r.toString()).toBe('A && B');
    });

    it('constructs a disjunction', () => {
        const p = variable('A');
        const q = variable('B');
        const r = or(p, q);
        expect(r.toString()).toBe('A || B');
    });

    it('constructs a implication', () => {
        const p = variable('A');
        const q = variable('B');
        const r = imply(p, q);
        expect(r.toString()).toBe('A -> B');
    });

    it('constructs a negation', () => {
        const p = variable('A');
        const r = not(p);
        expect(r.toString()).toBe('!A');
    });

    it('constructs a complex formula#1', () => {
        const p = or(and(variable('A'), variable('B')), variable('C'));
        expect(p.toString()).toBe('(A && B) || C');
    });

    it('constructs a complex formula#2', () => {
        const p = not(or(and(not(variable('A')), not(variable('B'))), not(variable('C'))));
        expect(p.toString()).toBe('!((!A && !B) || !C)');
    });
});
