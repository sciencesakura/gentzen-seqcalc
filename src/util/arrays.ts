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

export { dedupe };
