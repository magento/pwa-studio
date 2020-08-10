// don't actually word wrap, it messes with tests since the autodetect is
// system-dependent
const wordWrap = jest.requireActual('word-wrap');
module.exports = (str, opts) =>
    wordWrap(str, {
        ...opts,
        width: 1000
    });
