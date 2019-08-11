const memoize = fn => {
    const cache = new Map();

    return x => (cache.has(x) ? cache.get(x) : cache.set(x, fn(x)).get(x));
};

export default memoize;
