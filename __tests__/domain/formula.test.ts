import { formequ, formcmp, variable, and, or, imply, not } from '../../src/domain/formula';

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
    it('equal#1', () => {
        const p = variable('A');
        const actual = formequ(p, p);
        expect(actual).toBe(true);
    });

    it('equal#2', () => {
        const p = and(not(variable('A')), or(variable('B'), variable('C')));
        const q = and(not(variable('A')), or(variable('B'), variable('C')));
        const actual = formequ(p, q);
        expect(actual).toBe(true);
    });

    it('equal#3', () => {
        const p = and(not(variable('A')), or(variable('B'), variable('C')));
        const q = and(not(variable('A')), or(variable('X'), variable('C')));
        const actual = formequ(p, q);
        expect(actual).toBe(false);
    });

    it('compare#1', () => {
        const p = variable('A');
        const q = variable('B');
        const actual = formcmp(p, q);
        expect(actual).toBeLessThan(0);
    });

    it('compare#2', () => {
        const p = variable('A');
        const q = variable('A');
        const actual = formcmp(p, q);
        expect(actual).toBe(0);
    });

    it('compare#3', () => {
        const p = variable('B');
        const q = variable('A');
        const actual = formcmp(p, q);
        expect(actual).toBeGreaterThan(0);
    });

    it('compare#4', () => {
        const p = not(variable('C'));
        const q = and(variable('A'), variable('A'));
        const actual = formcmp(p, q);
        expect(actual).toBeLessThan(0);
    });

    it('compare#5', () => {
        const p = and(variable('A'), variable('B'));
        const q = or(variable('A'), variable('B'));
        const actual = formcmp(p, q);
        expect(actual).toBeLessThan(0);
    });

    it('compare#6', () => {
        const p = and(variable('A'), variable('C'));
        const q = and(variable('A'), variable('B'));
        const actual = formcmp(p, q);
        expect(actual).toBeGreaterThan(0);
    });
});
