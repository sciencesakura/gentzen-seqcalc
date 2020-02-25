import { variable, and, or, imply, not } from '../../src/ts/domain/formula';
import { prove } from '../../src/ts/domain/proof';
import { sequent } from '../../src/ts/domain/sequent';

const a = variable('A');
const b = variable('B');

test('Provable sequent: `A |- A`', () => {
    const s = sequent([a], [a]);
    const p = prove(s);
    expect(p.provable).toBe(true);
    expect(p.figure!.toString()).toBe('A |- A');
});

test('Provable sequent: `|- A || !A`', () => {
    const s = sequent([], [or(a, not(a))]);
    const p = prove(s);
    expect(p.provable).toBe(true);
    expect(p.figure!.toString()).toBe([
        '  A |- A  ',
        ' -------- ',
        ' |- A, !A ',
        '----------',
        '|- A || !A'
    ].join('\n'));
});

test('Provable sequent: `A -> B |- !(A && !B)`', () => {
    const s = sequent([imply(a, b)], [not(and(a, not(b)))]);
    const p = prove(s);
    expect(p.provable).toBe(true);
    expect(p.figure!.toString()).toBe([
        '   A |- A, B         A, B |- B   ',
        '   ----------       -----------  ',
        '   A, !B |- A       A, !B, B |-  ',
        '  ------------     ------------- ',
        '  A && !B |- A     A && !B, B |- ',
        '----------------  ---------------',
        '|- !(A && !B), A  B |- !(A && !B)',
        '---------------------------------',
        '      A -> B |- !(A && !B)       '
    ].join('\n'));
});

test('Provable sequent: `A -> B, A -> !B |- !A`', () => {
    const s = sequent([imply(a, b), imply(a, not(b))], [not(a)]);
    const p = prove(s);
    expect(p.provable).toBe(true);
    expect(p.figure!.toString()).toBe([
        '              A |- A, B               A, B |- B  ',
        '             -----------              ---------- ',
        ' A |- A, A   |- !A, A, B  A, B |- A   B |- !A, B ',
        '-----------  -----------  ----------  -----------',
        '|- !A, A, A  !B |- !A, A  B |- !A, A  B, !B |- !A',
        '------------------------  -----------------------',
        '    A -> !B |- !A, A         B, A -> !B |- !A    ',
        '-------------------------------------------------',
        '              A -> B, A -> !B |- !A              '
    ].join('\n'));
});

test('Unprovable sequent: `A |-`', () => {
    const s = sequent([a], []);
    const p = prove(s);
    expect(p.provable).toBe(false);
});

test('Unprovable sequent: `!(A && B) |- !A && !B', () => {
    const s = sequent([not(and(a, b))], [and(not(a), not(b))]);
    const p = prove(s);
    expect(p.provable).toBe(false);
});
