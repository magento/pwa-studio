const dedent = require('dedent');
const babel = require('@babel/core');
const jsxTransform = require('@babel/plugin-transform-react-jsx');
const plugin = require('../babel-plugin-magento-layout');

const transform = (opts, input, pragma) => {
    const { code } = babel.transform(input, {
        plugins: [[jsxTransform, { pragma }], [plugin, opts]]
    });
    return code;
};

test('Warns if "data-mid" is found on a Composite Component', () => {
    const onWarning = jest.fn();
    const opts = {
        config: {
            'product.page': [
                {
                    operation: 'removeContainer',
                    targetContainer: 'product.page'
                }
            ]
        },
        onWarning
    };
    transform(
        opts,
        dedent`
            import React from 'react';
            <Foo data-mid='bizz.buzz' />
        `
    );
    expect(onWarning).toHaveBeenCalledWith(
        expect.stringContaining('"data-mid" found on a Composite Component')
    );
});

test('onWarning callback invoked when data-mid is a dynamic value', () => {
    const onWarning = jest.fn();
    const opts = {
        config: {
            'product.page.pricing': []
        },
        onWarning
    };
    transform(
        opts,
        dedent`
            import React from 'react';
            <div data-mid={someRef} />
        `
    );
    expect(onWarning).toHaveBeenCalledWith(
        expect.stringContaining('Expected "data-mid" to be a literal string')
    );
});

test('Operations work when createElement is used instead of React.createElement', () => {
    const opts = {
        config: {
            'product.page': [
                {
                    operation: 'removeContainer',
                    targetContainer: 'product.page'
                }
            ]
        }
    };
    const result = transform(
        opts,
        dedent`
            import { createElement } from 'react';
            <div>
                Should remove container below
                <div data-mid='product.page' />
            </div>
        `,
        'createElement'
    );
    expect(result).toMatchSnapshot();
});

test('"removeContainer" operation removes container', () => {
    const opts = {
        config: {
            'product.page': [
                {
                    operation: 'removeContainer',
                    targetContainer: 'product.page'
                }
            ]
        }
    };
    const result = transform(
        opts,
        dedent`
            import React from 'react';
            <div>
                Should remove container below
                <div data-mid='product.page' />
            </div>
    `
    );
    expect(result).toMatchSnapshot();
});

test('"removeChild" operation removes specified child, but not other children', () => {
    const opts = {
        config: {
            'product.page.pricing': [
                {
                    operation: 'removeChild',
                    targetContainer: 'product.page.pricing',
                    targetChild: 'product.page.pricing.add.button'
                }
            ]
        }
    };
    const result = transform(
        opts,
        dedent`
            import React from 'react';
            import { ContainerChild } from '@magento/peregrine';
            <div data-mid='product.page.pricing'>
                <ContainerChild
                    id='product.page.pricing.add.button'
                    render={() =>
                        <div>I should not render</div>
                    }
                />
                <ContainerChild
                    id='product.page.pricing.some.other.button'
                    render={() => <div>I should render</div>}
                />
            </div>
        `
    );
    expect(result).toMatchSnapshot();
});

test('A removeChild operation works when ContainerChild is aliased in import', () => {
    const opts = {
        config: {
            'product.page.pricing': [
                {
                    operation: 'removeChild',
                    targetContainer: 'product.page.pricing',
                    targetChild: 'product.page.pricing.add.button'
                }
            ]
        }
    };
    const result = transform(
        opts,
        dedent`
            import React from 'react';
            import { ContainerChild as CC } from '@magento/peregrine';
            <div data-mid='product.page.pricing'>
                <CC
                    id='product.page.pricing.add.button'
                    render={() =>
                        <div>I should not render</div>
                    }
                />
            </div>
        `
    );
    expect(result).toMatchSnapshot();
});

test('"insertBefore" injects an extension before its target ContainerChild', () => {
    const opts = {
        config: {
            'product.page.pricing': [
                {
                    operation: 'insertBefore',
                    targetContainer: 'product.page.pricing',
                    targetChild: 'product.page.pricing.add.button',
                    componentPath: '/Users/person/components/SomeComponent.js'
                }
            ]
        }
    };
    const result = transform(
        opts,
        dedent`
            import React from 'react';
            import { ContainerChild } from '@magento/peregrine';
            <div data-mid='product.page.pricing'>
                <ContainerChild
                    id='product.page.pricing.add.button'
                    render={() => {}}
                />
            </div>
        `
    );
    expect(result).toMatchSnapshot();
});

test('"insertAfter" injects an extension after its target ContainerChild', () => {
    const opts = {
        config: {
            'product.page.pricing': [
                {
                    operation: 'insertAfter',
                    targetContainer: 'product.page.pricing',
                    targetChild: 'product.page.pricing.add.button',
                    componentPath: '/Users/person/components/SomeComponent.js'
                }
            ]
        }
    };
    const result = transform(
        opts,
        dedent`
            import React from 'react';
            import { ContainerChild } from '@magento/peregrine';
            <div data-mid='product.page.pricing'>
                <ContainerChild
                    id='product.page.pricing.add.button'
                    render={() => {}}
                />
            </div>
        `
    );
    expect(result).toMatchSnapshot();
});
