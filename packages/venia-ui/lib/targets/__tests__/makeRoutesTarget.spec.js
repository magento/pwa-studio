const {
    mockTargetProvider
} = require('@magento/pwa-buildpack/lib/TestHelpers');

const makeRoutesTarget = require('../makeRoutesTarget');
const TargetableSet = require('@magento/pwa-buildpack/lib/WebpackTools/targetables/TargetableSet');

const FAKE_ADDED_ROUTE = 'ADDED_ROUTE';

const targets = mockTargetProvider(
    '@magento/venia-ui',
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

jest.mock(
    '../../defaultRoutes.json',
    () => [
        {
            name: 'Single path route',
            pattern: '/simple',
            path: '../AccountInformationPage'
        },
        {
            name: 'Single path route that needs authentication',
            pattern: '/authed',
            exact: true,
            path: '../AccountInformationPage',
            authed: true,
            redirectTo: '/'
        },
        {
            name: 'Multiple path route',
            pattern: ['/one', '/two'],
            exact: true,
            path: '../AccountInformationPage'
        }
    ],
    { virtual: true }
);

beforeAll(() => {
    jest.spyOn(targetable, 'reactComponent').mockImplementation(() => ({
        addReactLazyImport: () => FAKE_ADDED_ROUTE,
        prependJSX: mockPrependJSX
    }));
});

test('Call prependJSX with the correct path patterns', async () => {
    makeRoutesTarget(targetable);

    expect(mockPrependJSX).toHaveBeenNthCalledWith(
        1,
        'Switch',
        `<Route path={"/simple"}><${FAKE_ADDED_ROUTE}/></Route>`
    );
    expect(mockPrependJSX).toHaveBeenNthCalledWith(
        2,
        'Switch',
        `<AuthRoute exact redirectTo={"/"} path={"/authed"}><${FAKE_ADDED_ROUTE}/></AuthRoute>`
    );
    expect(mockPrependJSX).toHaveBeenNthCalledWith(
        3,
        'Switch',
        `<Route exact path={["/one","/two"]}><${FAKE_ADDED_ROUTE}/></Route>`
    );
});
