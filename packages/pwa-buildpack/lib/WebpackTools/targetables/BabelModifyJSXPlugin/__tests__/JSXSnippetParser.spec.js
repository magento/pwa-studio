const JSXSnippetParser = require('../JSXSnippetParser');
const babel = require('@babel/core');
const parser = new JSXSnippetParser(babel, 'fake-file.js');

test('normalizes JSX without brackets or closing elements', () => {
    const snippets = [
        ['   <div/>  ', '<div/>'],
        ['<>  a fragment </>'],
        ['<HasClose prop={val}></HasClose>'],
        ['<A b={c} d="e">', '<A b={c} d="e" />'],
        ['wat', '<wat />'],
        ['  oh  no="crap"', '<oh  no="crap" />']
    ];

    snippets.forEach(([input, output]) =>
        expect(parser.normalizeElement(input)).toBe(output || input)
    );
});

test('parses JSX query into a JSXElement AST', () => {
    expect(parser.parseElement('<A b={c} d="e" f={g.h} />')).toHaveProperty(
        'type',
        'JSXElement'
    );

    expect(parser.parseElement('<>frag</>')).toHaveProperty(
        'type',
        'JSXFragment'
    );
});

test('parses JSXAttributes provided as an array of source code', () => {
    const attrs = {
        className: '"Dinosauria"',
        phylum: '{Chordata}',
        family: '<Theropoda.Allosauridae/>'
    };
    expect(parser.parseAttributes(Object.entries(attrs))).toMatchSnapshot();
});

test('errors informatively if passed snippet is not jsx', () => {
    expect(() => parser.parseElement('() => {}')).toThrowError(
        'does not parse'
    );
    expect(() => parser.parseElement(7)).toThrowError('does not parse');
    expect(() => parser.parseElement('*&&*^!I')).toThrowError(
        'Unexpected token'
    );
    expect(() => parser.parseElement('')).toThrowError('No code');
});
