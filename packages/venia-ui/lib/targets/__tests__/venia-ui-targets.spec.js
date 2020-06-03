const React = require('react');
const path = require('path');
const {
    mockBuildBus,
    buildModuleWith
} = require('@magento/pwa-buildpack/lib/TestHelpers');
const { createTestInstance } = require('@magento/peregrine');
const declare = require('../venia-ui-declare');
const intercept = require('../venia-ui-intercept');

const thisDep = {
    name: '@magento/venia-ui',
    declare,
    intercept
};

const mockComponent = name => `function ${name}(props) { return <div className={name}>{props.children}</div>;
`;
const mockDefault = name => `import React from 'react';
export default ${mockComponent(name)} }
        `;

jest.doMock('react-router-dom', () => ({
    Switch(p) {
        return <div className={'switch'}>{p.children}</div>;
    },
    Route(p) {
        return <div className={'route'}>{p.children}</div>;
    }
}));

test('declares targets richContentRenderers and routes', () => {
    const bus = mockBuildBus({
        context: __dirname,
        dependencies: [thisDep]
    });
    bus.runPhase('declare');
    const { richContentRenderers, routes } = bus.getTargetsOf(
        '@magento/venia-ui'
    );
    expect(richContentRenderers.tap).toBeDefined();
    expect(routes.tap).toBeDefined();
    const interceptor = jest.fn();
    // no implementation testing in declare phase
    richContentRenderers.tap('test', interceptor);
    richContentRenderers.call('woah');
    expect(interceptor).toHaveBeenCalledWith('woah');

    const divByThree = jest.fn(x => x / 3);
    routes.tap('addTwo', x => x + 2);
    routes.tap({ name: 'divideByThree', fn: divByThree });
    expect(routes.call(10)).toBe(4);
});

test('uses RichContentRenderers to inject a default strategy into RichContent', async () => {
    jest.setTimeout(15000);
    const built = await buildModuleWith('../../components/RichContent', {
        context: __dirname,
        dependencies: ['@magento/peregrine', thisDep]
    });

    const RichContent = built.run();

    const wrapper = createTestInstance(<RichContent html="<h1>word up</h1>" />);
    expect(
        wrapper.root.find(c => c.type.name === 'PlainHtmlRenderer')
    ).toBeTruthy();
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('uses routes to inject client-routed pages', async () => {
    const routesModule = '../../components/Routes/routes';
    const built = await buildModuleWith(routesModule, {
        context: path.dirname(require.resolve(routesModule)),
        dependencies: ['@magento/peregrine', thisDep],
        mockFiles: {
            '../../RootComponents/Search/index.js': mockDefault('SearchPage'),
            '../LoadingIndicator/index.js':
                'export const fullPageLoadingIndicator = "Loading";',
            '../CartPage/index.js': mockDefault('CartPage'),
            '../CreateAccountPage/index.js': mockDefault('CreateAccountPage'),
            '../CheckoutPage/index.js': mockDefault('CheckoutPage'),
            '../MagentoRoute/index.js': mockDefault('MagentoRoute')
        },
        optimization: {
            splitChunks: false
        }
    });
    // Testing this with a shallow renderer is obtusely hard because of
    // Suspense, but these strings lurking in the build tell the story.
    expect(built.bundle).toContain('SearchPage');
    expect(built.bundle).toContain('CartPage');
    expect(built.bundle).toContain('CreateAccountPage');
    expect(built.bundle).toContain('CheckoutPage');
});
