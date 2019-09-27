import { variable, and, or, imply, not } from '../../src/domain/formula';
import { prove } from '../../src/domain/proof';
import { sequent } from '../../src/domain/sequent';

const a = variable('A');
const b = variable('B');

test('Proves a sequent: `A |- A`', () => {
    const s = sequent([a], [a]);
    const p = prove(s);
    expect(p).toMatchObject({
        provable: true,
        figure: {
            height: 1,
            root: {
                level: 0,
                sequent: s
            }
        }
    });
});

test('Proves a sequent: `A |-`', () => {
    const s = sequent([a], []);
    const p = prove(s);
    expect(p).toMatchObject({
        provable: false
    });
});

test('Proves a sequent: `|- A || !A`', () => {
    const s = sequent([], [or(a, not(a))]);
    const p = prove(s);
    expect(p.provable).toBe(true);
});

test('Proves a sequent: `A -> B |- !(A && !B)`', () => {
    const s = sequent([imply(a, b)], [not(and(a, not(b)))]);
    const p = prove(s);
    expect(p.provable).toBe(true);
});

test('Proves a sequent: `A -> B, A -> !B |- !A`', () => {
    const s = sequent([imply(a, b), imply(a, not(b))], [not(a)]);
    const p = prove(s);
    expect(p.provable).toBe(true);
});
