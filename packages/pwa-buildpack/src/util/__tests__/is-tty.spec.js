const isTTY = require.requireActual('../is-tty');

test('tests against process.stdin.isTTY', () => {
    expect(isTTY({ stdin: { isTTY: true } })).toBe(true);
    expect(isTTY({ stdin: {} })).toBe(false);
});
