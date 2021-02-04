const react = jest.requireActual('react');

module.exports = {
    ...react,
    lazy: fn => fn.toString()
};
