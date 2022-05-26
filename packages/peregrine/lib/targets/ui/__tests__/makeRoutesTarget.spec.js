const {
    mockTargetProvider
} = require('@magento/pwa-buildpack/lib/TestHelpers');

const makeRoutesTarget = require('../makeRoutesTarget');
const TargetableSet = require('@magento/pwa-buildpack/lib/WebpackTools/targetables/TargetableSet');

const FAKE_ADDED_ROUTE = 'ADDED_ROUTE';
const FAKE_COMPONENT = 'Component';

const targets = mockTargetProvider(
    '@magento/peregrine',
    (_, dep) =>
        ({
            '@magento/pwa-buildpack': {
                specialFeatures: {
                    tap: jest.fn()
                },
                transformModules: {
                    tapPromise: jest.fn()
                }
            }
        }[dep])
);
const targetable = TargetableSet.using(targets);
const mockPrependJSX = jest.fn();
const mockInsertAfterSource = jest.fn();

jest.mock(
    '../../../ui/defaultRoutes.json',
    () => [
        {
            name: 'Single path route',
            pattern: '/simple',
            path: './components/AccountInformationPage'
        },
        {
            name: 'Single path route that needs authentication',
            pattern: '/authed',
            exact: true,
            path: './components/AccountInformationPage',
            authed: true,
            redirectTo: '/'
        },
        {
            name: 'Multiple path route',
            pattern: ['/one', '/two'],
            exact: true,
            path: './components/AccountInformationPage'
        }
    ],
    { virtual: true }
);

beforeAll(() => {
    jest.spyOn(targetable, 'reactComponent').mockImplementation(() => ({
        addImport: () => FAKE_COMPONENT,
        addReactLazyImport: () => FAKE_ADDED_ROUTE,
        prependJSX: mockPrependJSX,
        insertAfterSource: mockInsertAfterSource
    }));
});

test('Call prependJSX with the correct path patterns', async () => {
    makeRoutesTarget(targetable);

    expect(mockPrependJSX).toHaveBeenNthCalledWith(
        1,
        'Switch',
        `<Route path={"/simple"}><${FAKE_ADDED_ROUTE}/></Route>`
    );
    expect(mockInsertAfterSource).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('availableRoutes'),
        expect.stringContaining('/simple')
    );
    expect(mockPrependJSX).toHaveBeenNthCalledWith(
        2,
        'Switch',
        `<${FAKE_COMPONENT} exact redirectTo={"/"} path={"/authed"}><${FAKE_ADDED_ROUTE}/></${FAKE_COMPONENT}>`
    );
    expect(mockPrependJSX).toHaveBeenNthCalledWith(
        3,
        'Switch',
        `<Route exact path={["/one","/two"]}><${FAKE_ADDED_ROUTE}/></Route>`
    );
    expect(mockInsertAfterSource).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining('availableRoutes'),
        expect.stringContaining(JSON.stringify(['/one', '/two']))
    );
});
