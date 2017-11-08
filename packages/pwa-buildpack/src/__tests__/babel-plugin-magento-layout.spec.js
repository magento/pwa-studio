const babel = require('babel-core');
const dedent = require('dedent');
const jsxSyntax = require('babel-plugin-syntax-jsx');
const pluginFactory = require('../babel-plugin-magento-layout');

const transform = (plugin, input) => {
    const { code } = babel.transform(input, {
        plugins: [jsxSyntax, plugin]
    });
    return code;
};

test('Does not transform when no extensions are registered', () => {
    const extensions = new Map();
    const plugin = pluginFactory({ extensions });
    const result = transform(plugin, '<Abc />');
    expect(result).toMatchSnapshot();
});

test('Removes targetProp prop even if that element was not targeted', () => {
    const extensions = new Map();
    const plugin = pluginFactory({ extensions });
    const result = transform(plugin, '<Abc mid="bar" />');
    expect(result).toMatchSnapshot();
});

test('replacement injects new import declaration, and replaces target', () => {
    const op = {
        componentPath: '/My/extension/path.js'
    };
    const extensions = new Map([['foo.bar', [op]]]);
    const result = transform(
        pluginFactory({ extensions }),
        `<div mid='foo.bar' />`
    );
    expect(result).toMatchSnapshot();
});

test('replace transfers children when "withoutChildren" not specified', () => {
    const op = {
        componentPath: '/My/extension/path.js'
    };
    const extensions = new Map([['foo.bar', [op]]]);
    const result = transform(
        pluginFactory({ extensions }),
        dedent`
            <div mid='foo.bar'>
                <div>I should be transferred</div>
            </div>
        `
    );
    expect(result).toMatchSnapshot();
});

test('replace using "withoutChildren" does not copy children', () => {
    const op = {
        componentPath: '/My/extensions/path.js',
        withoutChildren: true
    };
    const extensions = new Map([['foo.bar', [op]]]);
    const result = transform(
        pluginFactory({ extensions }),
        dedent`
            <div mid='foo.bar'>
                <div>I should not be in the output</div>
            </div>
        `
    );
    expect(result).toMatchSnapshot();
});

test('Throws when targetProp is not a string literal', () => {
    const extensions = new Map();
    const plugin = pluginFactory({ extensions });

    const resultFn = () => transform(plugin, '<Abc mid={1} />');
    expect(resultFn).toThrow(/mid prop must be a literal string/);

    const resultFn2 = () => transform(plugin, '<Abc mid={`heh`} />');
    expect(resultFn2).toThrow(/mid prop must be a literal string/);
});

test('replace copies over props by default', () => {
    const op = {
        componentPath: '/My/extensions/path.js'
    };
    const extensions = new Map([['foo.bar', [op]]]);
    const result = transform(
        pluginFactory({ extensions }),
        '<div mid="foo.bar" customPropShouldStay="test" />'
    );
    expect(result).toMatchSnapshot();
});

test('replace does not copy over props when "withoutProps" is true', () => {
    const op = {
        componentPath: '/My/extensions/path.js',
        withoutProps: true
    };
    const extensions = new Map([['foo.bar', [op]]]);
    const result = transform(
        pluginFactory({ extensions }),
        '<div mid="foo.bar" customPropShouldNotStay="test" />'
    );
    expect(result).toMatchSnapshot();
});

test('throws with descriptive message when "extensions" is not provided', () => {
    const fn = () => pluginFactory();
    expect(fn).toThrow(/should be a Map/);
});

test('throws if a new name for "targetProp" is provided, and it is not a string', () => {
    const fn = () =>
        pluginFactory({
            extensions: new Map(),
            targetProp: 1
        });
    expect(fn).toThrow(/must be a string/);
});
