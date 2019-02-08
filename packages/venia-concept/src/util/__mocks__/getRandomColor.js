const getRandomColor = () =>
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 255)).join(',');

// The primary reason for the existence of this mock is to return a non-random
// memoized color.
export const memoizedGetRandomColor = () => '123,123,123';
export default getRandomColor;
