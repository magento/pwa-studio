// TODO: replace with actual swatch colors or images from API
// M2 GraphQL doesn't currently support them
const cache = new Map();
const memoize = fn => key =>
    cache.has(key) ? cache.get(key) : cache.set(key, fn(key)).get(key);

const getRandomColor = () =>
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 255)).join(',');

export const memoizedGetRandomColor = memoize(getRandomColor);
export default getRandomColor;
