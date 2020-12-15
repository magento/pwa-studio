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

const WEBPACK_BUILD_TIMEOUT = 20000;

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

test('declares targets richContentRenderers and routes', async () => {
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
    expect(await routes.promise(10)).toBe(4);
});

test('uses RichContentRenderers to inject a default strategy into RichContent', async () => {
    jest.setTimeout(WEBPACK_BUILD_TIMEOUT);

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
    jest.setTimeout(WEBPACK_BUILD_TIMEOUT);

    const routesModule = '../../components/Routes/routes';
    const built = await buildModuleWith(routesModule, {
        context: path.dirname(require.resolve(routesModule)),
        dependencies: ['@magento/peregrine', thisDep],
        mockFiles: {
            '../../RootComponents/Search/index.js': mockDefault('Search'),
            '../LoadingIndicator/index.js':
                'export const fullPageLoadingIndicator = "Loading";',
            '../CartPage/index.js': mockDefault('Cart'),
            '../CreateAccountPage/index.js': mockDefault('CreateAccount'),
            '../CheckoutPage/index.js': mockDefault('Checkout'),
            '../MagentoRoute/index.js': mockDefault('MagentoRoute')
        },
        optimization: {
            splitChunks: false
        }
    });
    // Testing this with a shallow renderer is obtusely hard because of
    // Suspense, but these strings lurking in the build tell the story.
    expect(built.bundle).toContain('DynamicSearch');
    expect(built.bundle).toContain('DynamicCart');
    expect(built.bundle).toContain('DynamicCreateAccount');
    expect(built.bundle).toContain('DynamicCheckout');
});

test('declares checkoutPagePaymentTypes target', async () => {
    const bus = mockBuildBus({
        context: __dirname,
        dependencies: [thisDep]
    });
    bus.runPhase('declare');
    const { checkoutPagePaymentTypes } = bus.getTargetsOf('@magento/venia-ui');

    const interceptor = jest.fn();
    // no implementation testing in declare phase
    checkoutPagePaymentTypes.tap('test', interceptor);
    checkoutPagePaymentTypes.call('woah');
    expect(interceptor).toHaveBeenCalledWith('woah');
});

test('uses RichContentRenderers to default strategy Payment Method', async () => {
    jest.setTimeout(WEBPACK_BUILD_TIMEOUT);

    const built = await buildModuleWith(
        '../../components/CheckoutPage/PaymentInformation/paymentMethodCollection.js',
        {
            context: __dirname,
            dependencies: ['@magento/peregrine', thisDep]
        }
    );

    const checkoutPagePaymentTypes = built.run();
    expect(checkoutPagePaymentTypes).toHaveProperty('braintree');
});

test('declares savedPaymentTypes target', async () => {
    const bus = mockBuildBus({
        context: __dirname,
        dependencies: [thisDep]
    });
    bus.runPhase('declare');
    const { savedPaymentTypes } = bus.getTargetsOf('@magento/venia-ui');

    const interceptor = jest.fn();
    // no implementation testing in declare phase
    savedPaymentTypes.tap('test', interceptor);
    savedPaymentTypes.call('woah');
    expect(interceptor).toHaveBeenCalledWith('woah');
});
