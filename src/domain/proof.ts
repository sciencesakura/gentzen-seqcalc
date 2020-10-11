import { isCompound, CompoundFormula } from "./formula";
import { InferenceRule, leftRule, rightRule } from "./inference-rule";
import { Sequent, isInitial, toString as stostr } from "./sequent";
import { times } from "../util/text";

/**
 * Represents a proof.
 */
export interface Proof {
  /** Gets whether the sequent was proved or not. */
  readonly provable: boolean;

  /** Gets the proof figure if `provable` is `true`, `undefined` otherwise. */
  readonly figure?: ProofTree;
}

/**
 * Represents a proof figure as tree structure.
 */
export interface ProofTree {
  /** Gets the height of this tree. */
  readonly height: number;

  /** Gets the root node of this tree. */
  readonly root: ProofTreeNode;
}

/**
 * Represents a node of `ProofTree`.
 */
export interface ProofTreeNode {
  /** Gets the level of this node. */
  readonly level: number;

  /** Gets the sequent. */
  readonly sequent: Sequent;

  /** Gets the reference to left child node. */
  readonly left?: ProofTreeNode;

  /** Gets the reference to right child node. */
  readonly right?: ProofTreeNode;
}

/**
 * Decomposes the specified sequent into one or two sequents.
 *
 * @param sequent the sequent to decompose
 * @return one or two decomposed sequents if possible, `undefined` otherwise
 */
const decompose: (sequent: Sequent) => [Sequent, Sequent?] | undefined = (sequent: Sequent) => {
  let position = sequent.antecedents.findIndex(isCompound);
  let rule: InferenceRule;
  if (position === -1) {
    position = sequent.succedents.findIndex(isCompound);
    if (position === -1) return;
    rule = rightRule((sequent.succedents[position] as CompoundFormula).operator);
  } else {
    rule = leftRule((sequent.antecedents[position] as CompoundFormula).operator);
  }
  return rule(sequent, position);
};

/**
 * Proves the specified sequent.
 *
 * @param seq the sequent to prove
 * @return the proof result
 */
export const prove: (seq: Sequent) => Proof = (seq: Sequent) => {
  let provable = true;
  let maxLv = 0;
  const makeTree: (s: Sequent, level: number) => ProofTreeNode = (s: Sequent, level: number) => {
    if (!provable) return { level, sequent: s };
    const decomposed = decompose(s);
    if (!decomposed) {
      provable = provable && isInitial(s);
      maxLv = Math.max(maxLv, level);
      return { level, sequent: s };
    }
    if (decomposed[1]) {
      return {
        level,
        sequent: s,
        left: makeTree(decomposed[0], level + 1),
        right: makeTree(decomposed[1], level + 1),
      };
    } else {
      return {
        level,
        sequent: s,
        left: makeTree(decomposed[0], level + 1),
      };
    }
  };
  const root = makeTree(seq, 0);
  if (provable) {
    return {
      provable,
      figure: {
        height: maxLv + 1,
        root,
      },
    };
  } else {
    return { provable };
  }
};

export const toString: (t: ProofTree) => string = (t: ProofTree) => toStringArray(t.root).reverse().join("\n");

const pad: (s: string, len: number) => string = (s: string, len: number) => {
  const padsize = len - s.length;
  if (padsize <= 0) return s;
  const halfsize = Math.floor(padsize / 2);
  const pad = times(" ", halfsize);
  return padsize % 2 === 0 ? `${pad}${s}${pad}` : `${pad}${s}${pad} `;
};

const toStringArray: (n: ProofTreeNode) => string[] = (n: ProofTreeNode) => {
  const sequent = stostr(n.sequent);
  if (!n.left) return [sequent];
  const left = toStringArray(n.left);
  const lwidth = left[0].length;
  if (n.right) {
    const right = toStringArray(n.right);
    const rwidth = right[0].length;
    const width = Math.max(sequent.length, lwidth + rwidth + 2);
    const sqary = [pad(sequent, width), times("-", width)];
    const childHeight = Math.max(left.length, right.length);
    for (let i = 0; i < childHeight; i++) {
      const ls = left[i];
      const rs = right[i];
      if (ls && rs) {
        sqary.push(pad(`${ls}  ${rs}`, width));
      } else if (ls) {
        sqary.push(pad(`${ls}  ${times(" ", rwidth)}`, width));
      } else {
        sqary.push(pad(`${times(" ", lwidth)}  ${rs}`, width));
      }
    }
    return sqary;
  } else {
    const width = Math.max(sequent.length, lwidth);
    return [pad(sequent, width), times("-", width), ...left.map((s) => pad(s, width))];
  }
};
