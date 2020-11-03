const babel = require('@babel/core');
const JSXSnippetParser = require('../JSXSnippetParser');
const Operation = require('../Operation');
const { MockBabelNodePath } = require('../../../../TestHelpers');

const parser = new JSXSnippetParser(babel, 'fake-file.js');
const file = {}; // not used yet

const mockPath = source => new MockBabelNodePath(source);
const makeOperation = options =>
    Operation.fromRequest({ options }, { parser, file });

const elementQueryMatches = (element, jsxSource) =>
    makeOperation({ operation: 'remove', element }).match(mockPath(jsxSource));

describe('detects matching JSX elements with', () => {
    test('no attributes', () => {
        expect(elementQueryMatches('<div   />', '<div/>')).toBeTruthy();
    });
    test('string attributes', () => {
        expect(
            elementQueryMatches(
                '<Button a="b">',
                '<Button c={d.g} a="b"></Button>'
            )
        ).toBeTruthy();
    });
    test('identifier attributes', () => {
        expect(
            elementQueryMatches(
                '<Button a={value}>',
                '<Button c={d.g} a={value}></Button>'
            )
        ).toBeTruthy();
    });
    test('dot lookup attributes', () => {
        expect(
            elementQueryMatches(
                '<Button a={root.value}>',
                '<Button c={d.g} a={root.value}></Button>'
            )
        ).toBeTruthy();
    });
    test('arbitrary expressions', () => {
        expect(
            elementQueryMatches(
                '<span id={`${dot.path}`}>',
                '<span id={`${dot.path}`}>pryvit</span>'
            )
        ).toBeTruthy();
    });
});

describe('rejects JSX elements which', () => {
    test('have missing attributes', () => {
        expect(
            elementQueryMatches(
                '<Route path={somePath}>',
                '<Route otherPath={somePath} />'
            )
        ).toBeFalsy();
    });
    test('have non-matching attributes', () => {
        expect(
            elementQueryMatches(
                '<Route path={somePath}>',
                '<Route path="someString" />'
            )
        ).toBeFalsy();
    });
    test('have too few attributes', () => {
        expect(
            elementQueryMatches('<Route path={somePath}>', '<Route />')
        ).toBeFalsy();
    });
});

test('serializes all pretty', () => {
    const insertBefore = new Operation(
        {
            options: {
                operation: 'insertBefore',
                element: 'span',
                params: {
                    jsx:
                        '<i>yo this is MTV raps coming at you after the break</i>'
                }
            }
        },
        { parser }
    );

    expect(insertBefore.toString()).toMatchSnapshot();

    const remove = new Operation(
        {
            options: {
                operation: 'remove',
                element: '<i>'
            }
        },
        { parser }
    );

    expect(remove.toString()).toMatchSnapshot();
});

test('throws when element is not a string', () => {
    expect(() => new Operation({ options: {} }, {})).toThrowError(
        'must be a string'
    );
});
