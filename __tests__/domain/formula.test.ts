import { formcmp, variable, and, or, imply, not } from '../../src/domain/formula';

test('constructs a formula: `A`', () => {
    const a = variable('A');
    expect(a.toString()).toBe('A');
});

test('constructs a formula: `A && B`', () => {
    const a = variable('A');
    const b = variable('B');
    const f = and(a, b);
    expect(f.toString()).toBe('A && B');
});

test('constructs a formula: `A || B`', () => {
    const a = variable('A');
    const b = variable('B');
    const f = or(a, b);
    expect(f.toString()).toBe('A || B');
});

test('constructs a formula: `A -> B`', () => {
    const a = variable('A');
    const b = variable('B');
    const f = imply(a, b);
    expect(f.toString()).toBe('A -> B');
});

test('constructs a formula: `!A`', () => {
    const a = variable('A');
    const f = not(a);
    expect(f.toString()).toBe('!A');
});

test('constructs a formula: `(A && B) || C', () => {
    const f = or(and(variable('A'), variable('B')), variable('C'));
    expect(f.toString()).toBe('(A && B) || C');
});

test('constructs a formula: `!((!A && !B) || !C)`', () => {
    const f = not(or(and(not(variable('A')), not(variable('B'))), not(variable('C'))));
    expect(f.toString()).toBe('!((!A && !B) || !C)');
});

test('`A` < `B`', () => {
    const a = variable('A');
    const b = variable('B');
    const actual = formcmp(a, b);
    expect(actual).toBeLessThan(0);
});

test('`A` = `A`', () => {
    const a = variable('A');
    const actual = formcmp(a, a);
    expect(actual).toBe(0);
});

test('`B` > `A`', () => {
    const a = variable('A');
    const b = variable('B');
    const actual = formcmp(b, a);
    expect(actual).toBeGreaterThan(0);
});

test('`X` < `A && A`', () => {
    const x = variable('X');
    const f = and(variable('A'), variable('A'));
    const actual = formcmp(x, f);
    expect(actual).toBeLessThan(0);
});

test('`A && B` > `A && A`', () => {
    const f1 = and(variable('A'), variable('B'));
    const f2 = and(variable('A'), variable('A'));
    const actual = formcmp(f1, f2);
    expect(actual).toBeGreaterThan(0);
});
