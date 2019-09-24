import { Operator, formequ } from './formula';
import { Sequent, sequent } from './sequent';

/**
 * Represents a proof.
 */
interface Proof {
    readonly provable: boolean;

    readonly figure?: ProofTree;
}

interface ProofTree {
    readonly height: number;

    readonly root: ProofTreeNode;
}

interface ProofTreeNode {
    readonly level: number;

    readonly sequent: Sequent;

    readonly left?: ProofTreeNode;

    readonly right?: ProofTreeNode;
}

const _decompose: (s: Sequent) => [Sequent?, Sequent?] = (s: Sequent) => {
    let sequence = s.antecedents;
    let index = sequence.findIndex(f => !f.atomic);
    if (index !== -1) {
        const principal = sequence[index];
        const ex1 = sequence.slice(0, index);
        const ex2 = sequence.slice(index + 1);
        switch (principal.operator) {
            case Operator.And:
                return [sequent([...ex1, principal.operand1!, principal.operand2!, ...ex2], s.succedents)];
            case Operator.Or:
                return [
                    sequent([...ex1, principal.operand1!, ...ex2], s.succedents),
                    sequent([...ex1, principal.operand2!, ...ex2], s.succedents)
                ];
            case Operator.Imply:
                return [
                    sequent([...ex1, ...ex2], [...s.succedents, principal.operand1!]),
                    sequent([...ex1, principal.operand2!, ...ex2], s.succedents)
                ];
            case Operator.Not:
                return [sequent([...ex1, ...ex2], [...s.succedents, principal.operand1!])];
        }
    }
    sequence = s.succedents;
    index = sequence.findIndex(f => !f.atomic);
    if (index !== -1) {
        const principal = sequence[index];
        const ex1 = sequence.slice(0, index);
        const ex2 = sequence.slice(index + 1);
        switch (principal.operator) {
            case Operator.And:
                return [
                    sequent(s.antecedents, [...ex1, principal.operand1!, ...ex2]),
                    sequent(s.antecedents, [...ex1, principal.operand2!, ...ex2])
                ];
            case Operator.Or:
                return [sequent(s.antecedents, [...ex1, principal.operand1!, principal.operand2!, ...ex2])];
            case Operator.Imply:
                return [sequent([principal.operand1!, ...s.antecedents], [...ex1, principal.operand2!, ...ex2])];
            case Operator.Not:
                return [sequent([principal.operand1!, ...s.antecedents], [...ex1, ...ex2])];
        }
    }
    return [];
};

const _isInitial: (s: Sequent) => boolean = (s: Sequent) => {
    for (const antc of s.antecedents) {
        for (const succ of s.succedents) {
            if (formequ(antc, succ)) return true;
        }
    }
    return false;
};

const _pad: (s: string, len: number) => string = (s: string, len: number) => {
    const padsize = len - s.length;
    if (padsize <= 0) return s;
    const halfsize = Math.floor(padsize / 2);
    let pad = '';
    for (let i = 0; i < halfsize; i++) pad += ' ';
    return padsize % 2 === 0 ? `${pad}${s}${pad}` : `${pad}${s}${pad} `;
};

const _bar: (len: number) => string = (len: number) => {
    let bar = '';
    for (let i = 0; i < len; i++) bar += '-';
    return bar;
};

const stimes: (s: string, n: number) => string = (s: string, n: number) => {
    let str = '';
    for (let i = 0; i < n; i++) str += s;
    return str;
};

const _tostr: (node: ProofTreeNode) => Array<string> = (node: ProofTreeNode) => {
    const sequent = node.sequent.toString();
    if (!node.left) return [sequent];
    const left = _tostr(node.left);
    const lwidth = left[0].length;
    if (node.right) {
        const right = _tostr(node.right);
        const rwidth = right[0].length;
        const width = Math.max(sequent.length, lwidth + rwidth + 2);
        const sqary = [_pad(sequent, width), _bar(width)];
        const childHeight = Math.max(left.length, right.length);
        for (let i = 0; i < childHeight; i++) {
            const ls = left[i];
            const rs = right[i];
            if (ls && rs) {
                sqary.push(_pad(`${ls}  ${rs}`, width));
            } else if (ls) {
                sqary.push(_pad(`${ls}  ${stimes(' ', rwidth)}`, width));
            } else {
                sqary.push(_pad(`${stimes(' ', lwidth)}  ${rs}`, width));
            }
        }
        return sqary;
    } else {
        const width = Math.max(sequent.length, lwidth);
        return [_pad(sequent, width), _bar(width), ...left.map(s => _pad(s, width))];
    }
};

/**
 * Proves the given sequent.
 */
const prove: (sequent: Sequent) => Proof = (sequent: Sequent) => {
    let provable = true;
    let maxLv = 0;
    const makeTree: (s: Sequent, level: number) => ProofTreeNode = (s: Sequent, level: number) => {
        const decomposed = _decompose(s);
        if (!decomposed[0]) {
            provable = provable && _isInitial(s);
            maxLv = Math.max(maxLv, level);
            return { level, sequent: s };
        }
        if (decomposed[1]) {
            return {
                level,
                sequent: s,
                left: makeTree(decomposed[0], level + 1),
                right: makeTree(decomposed[1], level + 1)
            };
        } else {
            return {
                level,
                sequent: s,
                left: makeTree(decomposed[0], level + 1)
            };
        }
    };
    const root = makeTree(sequent, 0);
    if (provable) {
        return {
            provable,
            figure: {
                height: maxLv + 1,
                root,
                toString(): string {
                    return _tostr(this.root).reverse().join('\n');
                }
            }
        };
    } else {
        return { provable };
    }
};

export { Proof, prove };
