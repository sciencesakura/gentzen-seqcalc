import { Operator, formequ } from './formula';
import { Sequent, sequent } from './sequent';
import { times } from '../util/text';

/**
 * Represents a proof.
 */
interface Proof {
    /** Gets whether the sequent was proved or not. */
    readonly provable: boolean;

    /** Gets the proof figure if `provable` is `true`, `undefined` otherwise. */
    readonly figure?: ProofTree;
}

/**
 * Represents a proof figure as tree structure.
 */
interface ProofTree {
    /** Gets the height of this tree. */
    readonly height: number;

    /** Gets the root node of this tree. */
    readonly root: ProofTreeNode;
}

/**
 * Represents a node of `ProofTree`.
 */
interface ProofTreeNode {
    /** Gets the level of this node. */
    readonly level: number;

    /** Gets the sequent. */
    readonly sequent: Sequent;

    /** Gets the reference to left child node. */
    readonly left?: ProofTreeNode;

    /** Gets the reference to right child node. */
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
    const pad = times(' ', halfsize);
    return padsize % 2 === 0 ? `${pad}${s}${pad}` : `${pad}${s}${pad} `;
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
        const sqary = [_pad(sequent, width), times('-', width)];
        const childHeight = Math.max(left.length, right.length);
        for (let i = 0; i < childHeight; i++) {
            const ls = left[i];
            const rs = right[i];
            if (ls && rs) {
                sqary.push(_pad(`${ls}  ${rs}`, width));
            } else if (ls) {
                sqary.push(_pad(`${ls}  ${times(' ', rwidth)}`, width));
            } else {
                sqary.push(_pad(`${times(' ', lwidth)}  ${rs}`, width));
            }
        }
        return sqary;
    } else {
        const width = Math.max(sequent.length, lwidth);
        return [_pad(sequent, width), times('-', width), ...left.map(s => _pad(s, width))];
    }
};

/**
 * Proves the specified sequent.
 *
 * @param sequent the sequent to prove
 * @return the proof result
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
                    return _tostr(this.root)
                        .reverse()
                        .join('\n');
                }
            }
        };
    } else {
        return { provable };
    }
};

export { Proof, prove };
