import { fequals, variable, and, or, imply, not } from '../../src/domain/formula';

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

describe('releations of the formulas', () => {
    it('fequals#1', () => {
        const p = variable('A');
        const actual = fequals(p, p);
        expect(actual).toBe(true);
    });

    it('fequals#2', () => {
        const p = and(not(variable('A')), or(variable('B'), variable('C')));
        const q = and(not(variable('A')), or(variable('B'), variable('C')));
        const actual = fequals(p, q);
        expect(actual).toBe(true);
    });

    it('fequals#3', () => {
        const p = and(not(variable('A')), or(variable('B'), variable('C')));
        const q = and(not(variable('A')), or(variable('X'), variable('C')));
        const actual = fequals(p, q);
        expect(actual).toBe(false);
    });
});
