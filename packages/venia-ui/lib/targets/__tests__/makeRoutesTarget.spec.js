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
const mockInsertAfterSource = jest.fn();

jest.mock(
    '../../defaultRoutes.json',
    () => [
        {
            name: 'Single path route',
            pattern: '/simple',
            exact: true,
            path: '../AccountInformationPage'
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
        prependJSX: mockPrependJSX,
        insertAfterSource: mockInsertAfterSource
    }));
});

test('Call prependJSX with the correct path patterns', async () => {
    makeRoutesTarget(targetable);

    expect(mockPrependJSX).toHaveBeenNthCalledWith(
        1,
        'Switch',
        `<Route exact path={"/simple"}><${FAKE_ADDED_ROUTE}/></Route>`
    );
    expect(mockInsertAfterSource).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('availableRoutes'),
        expect.stringContaining('/simple')
    );

    expect(mockPrependJSX).toHaveBeenNthCalledWith(
        2,
        'Switch',
        `<Route exact path={["/one","/two"]}><${FAKE_ADDED_ROUTE}/></Route>`
    );
    expect(mockInsertAfterSource).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('availableRoutes'),
        expect.stringContaining(JSON.stringify(['/one', '/two']))
    );
});
