import { variable, and, or, imply, not } from '../../src/domain/formula';

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

test('constructs a formula: `!A || B', () => {
    const f = or(not(variable('A')), variable('B'));
    expect(f.toString()).toBe('!A || B');
});

test('constructs a formula: `!(A && B)`', () => {
    const f = not(and(variable('A'), variable('B')));
    expect(f.toString()).toBe('!(A && B)');
});

test('constructs a formula: `!!A`', () => {
    const f = not(not(variable('A')));
    expect(f.toString()).toBe('!!A');
});
