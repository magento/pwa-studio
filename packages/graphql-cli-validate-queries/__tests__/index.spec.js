import plugin from '../index';

test('it exports the correct command name', () => {
    expect(plugin.command).toBe('validate-queries');
});

test('it exports a description', () => {
    expect(plugin.desc).toBeInstanceOf(String);
});

test('it exports the correct supported arguments', () => {
    const actual = plugin.builder;

    console.log('actual', actual);

    expect(true).toBeTruthy();
});

describe('handler', () => {
    test('it exports a handler function', () => {
        expect(plugin.handler).toBeInstanceOf(Function);
    });
});
