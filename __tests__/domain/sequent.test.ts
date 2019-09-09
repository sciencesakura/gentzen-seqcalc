import { variable, and, or } from '../../src/domain/formula';
import { sequent } from '../../src/domain/sequent';

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
