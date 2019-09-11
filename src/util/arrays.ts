/**
 * Returns the deduped array.
 *
 * @param array the array to dedupe
 * @param comparator the function for comparing
 * @return the deduped array
 */
const dedupe: <T>(array: ReadonlyArray<T>, comparator: (a: T, b: T) => number) => ReadonlyArray<T> = <T>(
    array: ReadonlyArray<T>,
    comparator: (a: T, b: T) => number
) => {
    if (array.length <= 1) return array;
    const sorted = array.slice().sort(comparator);
    let acc = sorted[0];
    const newArray = [acc];
    for (let i = 1; i < sorted.length; i++) {
        const cur = sorted[i];
        if (comparator(acc, cur) === 0) continue;
        newArray.push(cur);
        acc = cur;
    }
    return newArray;
};

/**
 * Returns the index of the last element in the array that satisfies the given predicate.
 *
 * @param array the array
 * @param predicate the predicate to apply to each element to find
 * @return the index of the last element in the array that satisfies `predicate`, or `-1` if not found
 */
const findLastIndex: <T>(array: ReadonlyArray<T>, predicate: (e: T) => boolean) => number = <T>(
    array: ReadonlyArray<T>,
    predicate: (e: T) => boolean
) => {
    for (let i = array.length - 1; 0 <= i; i--) {
        if (predicate(array[i])) return i;
    }
    return -1;
};

export { dedupe, findLastIndex };
