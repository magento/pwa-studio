/**
 * Find the combination of k elements in the array.
 * For example: array is [1,2,3]. k=2.
 * The results are [[1,2],[1,3],[2,3]]
 * @return {Array}
 */
export function getCombinations(array, k, prefix = []) {
    if (k == 0) return [prefix];
    return array.flatMap((value, index) =>
        getCombinations(array.slice(index + 1), k - 1, [...prefix, value])
    );
}
