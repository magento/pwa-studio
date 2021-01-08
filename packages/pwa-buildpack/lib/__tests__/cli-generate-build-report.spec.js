const generateBuildReport = require('../cli/generate-build-report');
const prettyLogger = require('../util/pretty-logger');

jest.mock('../util/pretty-logger', () => ({
    info: jest.fn().mockName('info'),
    log: jest.fn().mockName('log')
}));

jest.mock('../cli/create-project', () => ({
    sampleBackends: {
        environments: [
            {
                name: '2.3.3-venia-cloud',
                description: 'Magento 2.3.3 with Venia sample data installed',
                url:
                    'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/'
            }
        ]
    }
}));

jest.mock('path', () => {
    const path = jest.requireActual('path');

    return {
        ...path,
        resolve: jest.fn().mockImplementation(pathToResolve => {
            if (pathToResolve.includes('package.json')) {
                return '../__fixtures__/mock-package.json';
            } else if (pathToResolve.includes('yarn.lock')) {
                return '../__fixtures__/mock-yarn.lock';
            } else if (pathToResolve.includes('package-lock.json')) {
                return '../__fixtures__/mock-package-lock.json';
            } else {
                return pathToResolve;
            }
        })
    };
});

jest.mock('node-fetch', () =>
    jest.fn().mockImplementation(url => {
        if (
            url ===
            'https://fvp0esmt8f.execute-api.us-east-1.amazonaws.com/default/getSampleBackends'
        ) {
            return Promise.resolve({
                json: jest.fn().mockResolvedValue({
                    sampleBackends: {
                        environments: [
                            {
                                name: '2.3.3-venia-cloud',
                                description:
                                    'Magento 2.3.3 with Venia sample data installed',
                                url:
                                    'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/'
                            },
                            {
                                name: '2.3.4-venia-cloud',
                                description:
                                    'Magento 2.3.4 with Venia sample data installed',
                                url: 'https://www.magento-backend-2.3.4.com/'
                            }
                        ]
                    }
                })
            });
        } else if (url === 'MAGENTO_BACKEND_URL') {
            return Promise.resolve({ ok: true });
        } else {
            return jest.requireActual('node-fetch')(url);
        }
    })
);

jest.mock('../Utilities', () => ({
    loadEnvironment: jest.fn().mockResolvedValue({
        env: { MAGENTO_BACKEND_URL: 'MAGENTO_BACKEND_URL' }
    })
}));

test('should return proper shape', () => {
    expect(generateBuildReport).toMatchSnapshot();
});

test.skip('should log package info', () => {
    try {
        generateBuildReport.handler();
    } catch (err) {
        console.log(err);
    }

    expect(prettyLogger.info.mock.calls).toMatchSnapshot();
    expect(prettyLogger.log.mock.calls).toMatchSnapshot();
});
