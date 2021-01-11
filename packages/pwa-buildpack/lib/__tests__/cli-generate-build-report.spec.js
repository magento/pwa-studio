const os = require('os');

const generateBuildReport = require('../cli/generate-build-report');
const prettyLogger = require('../util/pretty-logger');

jest.mock('../util/pretty-logger', () => ({
    info: jest.fn().mockName('info'),
    log: jest.fn().mockName('log'),
    error: jest.fn().mockName('error')
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

jest.mock('child_process', () => {
    const childProcess = jest.requireActual('child_process');

    return {
        ...childProcess,
        spawnSync: jest.fn().mockReturnValue({
            stdout: {
                toString: jest.fn().mockReturnValueOnce('Mock NPM Version')
            }
        })
    };
});

jest.mock('path', () => {
    const cwd = process.cwd();
    const path = jest.requireActual('path');

    return {
        ...path,
        resolve: jest.fn().mockImplementation((...pathToResolve) => {
            if (pathToResolve.includes('package.json')) {
                return path.resolve(
                    cwd,
                    'packages/pwa-buildpack/lib/__fixtures__/mock-package.json'
                );
            } else if (pathToResolve.includes('yarn.lock')) {
                return path.resolve(
                    cwd,
                    'packages/pwa-buildpack/lib/__fixtures__/mock-yarn.lock'
                );
            } else if (pathToResolve.includes('package-lock.json')) {
                return path.resolve(
                    cwd,
                    'packages/pwa-buildpack/lib/__fixtures__/mock-package-lock.json'
                );
            } else {
                return path.resolve(...pathToResolve);
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

const _processVersion = process.version;

beforeAll(() => {
    jest.spyOn(os, 'version').mockReturnValue('Mock OS Version');
    Object.defineProperty(process, 'version', {
        value: 'Mock Node Version'
    });
});

afterAll(() => {
    Object.defineProperty(process, 'version', {
        value: _processVersion
    });
});

let logs = [];
let infos = [];
let errors = [];

beforeEach(() => {
    logs = [];
    infos = [];
    errors = [];

    prettyLogger.info = jest.fn().mockImplementation((...args) => {
        infos.push(...args);
    });
    prettyLogger.log = jest.fn().mockImplementation((...args) => {
        logs.push(...args);
    });
    prettyLogger.error = jest.fn().mockImplementation((...args) => {
        errors.push(...args);
    });
});

test('should return proper shape', () => {
    expect(generateBuildReport).toMatchSnapshot();
});

test('should log package and system info', async () => {
    await generateBuildReport.handler();

    expect(infos).toMatchSnapshot();
    expect(logs).toMatchSnapshot();
    expect(errors).toMatchSnapshot();
});
