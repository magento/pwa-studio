// This tests the script as a JS module (to achieve coverage analysis),
// and also as a separately running process (to mimic CI).
// These scripts aren't run through Babel, so neither are their tests;
// use require() here.
const { exec } = require('child_process');
const { promisify } = require('util');
const { resolve } = require('path');
const mockServer = require('./__helpers__/mock-http-server');

const patchCircleCIEnvironment = require('../patch_circleci_environment');

const execp = promisify(exec);

const patchScript = resolve(__dirname, '../patch_circleci_env');

const possiblePRVars = [
    'CIRCLE_PULL_REQUEST',
    'CIRCLE_PULL_REQUESTS',
    'CI_PULL_REQUEST',
    'CI_PULL_REQUESTS',
    'CIRCLE_PR_USERNAME',
    'CIRCLE_PR_NUMBER',
    'CIRCLE_PR_REPONAME'
];
const blankPRVars = possiblePRVars.reduce((out, name) => {
    out[name] = '';
    return out;
}, {});

/**
 * GitHub API simulation
 * In order to test in-process and out-of-process, we must expose a real
 * mock web server which a subprocess can contact, rather than mock with Jest.
 */
const GithubMock = (() => {
    const handler = jest.fn();
    const server = mockServer(handler);
    const api = {};
    api.reset = () => {
        handler.mockRestore();
        handler.mockReturnValue({
            status: 400,
            body: 'No mock response configured for this test run'
        });
    };
    api.start = async () => {
        api.url = await server.mount();
    };
    api.stop = async () => {
        delete api.url;
        return server.unmount();
    };
    api.responds = values => handler.mockReturnValue(values);
    api.getCalls = () => {
        return handler.mock.calls;
    };
    return api;
})();

beforeAll(GithubMock.start);
afterAll(GithubMock.stop);

beforeEach(GithubMock.reset);

/**
 * Test the script running in process (this provices code coverage)
 */
async function testInProcess(env) {
    const setEnv = jest.fn();
    const log = jest.fn();
    await patchCircleCIEnvironment({
        env,
        setEnv,
        log
    });
    return {
        stdout: setEnv.mock.calls
            .map(call => call.join('\n'))
            .join('\n')
            .trim(),
        stderr: log.mock.calls
            .map(call => call.join('\n'))
            .join('\n')
            .trim(),
        status: 0
    };
}

/**
 * Test the shell script which passes real OS objects, in a child process.
 * (this provides a stronger similarity to the way this works in CI)
 */
async function testOutOfProcess(env) {
    const { stdout, stderr, error } = await execp(patchScript, {
        encoding: 'utf8',
        env: Object.assign(
            {
                PATH: process.env.PATH
            },
            env
        )
    }).catch(e => e);
    return {
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        status: (error && error.code) || 0
    };
}

async function testPatchWithEnv(env) {
    const mockedEnv = Object.assign(
        {
            GITHUB_GRAPHQL_ENDPOINT: GithubMock.url,
            DANGER_GITHUB_API_TOKEN: '##DANGER_GITHUB_API_TOKEN##'
        },
        env
    );
    // test both in-process functionality and child process functionality
    // (for code coverage and CI simulation)
    // return a big object for comparison and snapshotting
    return {
        inProcess: await testInProcess(mockedEnv),
        childProcess: await testOutOfProcess(mockedEnv)
    };
}

test('logs to stderr when graphql and/or github tokens are not in env', async () => {
    expect(
        await testPatchWithEnv({
            GITHUB_GRAPHQL_ENDPOINT: ''
        })
    ).toMatchSnapshot();
    expect(
        await testPatchWithEnv({
            DANGER_GITHUB_API_TOKEN: ''
        })
    ).toMatchSnapshot();
});

test('logs to stderr that PR env vars are already set and exits', async () => {
    function justOnePRVar(present) {
        return Object.assign(
            [
                'CIRCLE_PULL_REQUEST',
                'CIRCLE_PULL_REQUESTS',
                'CI_PULL_REQUEST',
                'CI_PULL_REQUESTS'
            ].reduce((out, name) => {
                out[name] =
                    name === present
                        ? 'https://github.com/someOwner/someRepo/pulls/4'
                        : '';
                return out;
            }, {}),
            {
                CIRCLE_PR_USERNAME: 'darkseid'
            }
        );
    }

    for (const envName of possiblePRVars) {
        const results = await testPatchWithEnv(justOnePRVar(envName));
        expect(results.childProcess.status).toBe(0);
        expect(results.inProcess).toEqual(results.childProcess);
        expect(results).toMatchSnapshot();
    }
});

test('logs to stderr some PR env vars exist but not all of them', async () => {
    GithubMock.responds({
        status: 200,
        body: {
            data: {
                repository: {
                    ref: {
                        associatedPullRequests: {
                            nodes: []
                        }
                    }
                }
            }
        }
    });
    const results = await testPatchWithEnv(
        Object.assign({}, blankPRVars, {
            CIRCLE_PROJECT_USERNAME: 'apokolips',
            CIRCLE_PROJECT_REPONAME: 'darkseid',
            CIRCLE_PR_USERNAME: 'new-genesis',
            CIRCLE_PR_REPONAME: 'orion',
            CIRCLE_BRANCH: 'nonexistent/branch'
        })
    );
    expect(results.childProcess.status).toBe(0);
    expect(results.inProcess).toEqual(results.childProcess);
    expect(results).toMatchSnapshot();
    expect(GithubMock.getCalls()).toMatchSnapshot();
});

test('logs to stderr if fetch network-errors', async () => {
    expect(
        await testPatchWithEnv({
            GITHUB_GRAPHQL_ENDPOINT: 'a bad url'
        })
    ).toMatchSnapshot();
    expect(GithubMock.getCalls()).toMatchSnapshot();
});

test('logs to stderr if response comes back non-200', async () => {
    GithubMock.responds({
        status: 200,
        body: {
            status: 404,
            body: {
                data: {
                    repository: {
                        ref: {
                            associatedPullRequests: {}
                        }
                    }
                }
            }
        }
    });
    const results = await testPatchWithEnv({
        CIRCLE_PROJECT_USERNAME: 'apokolips',
        CIRCLE_PROJECT_REPONAME: 'darkseid',
        CIRCLE_BRANCH: 'missing/branch'
    });
    expect(results.childProcess.status).toBe(0);
    expect(results.inProcess).toEqual(results.childProcess);
    expect(results).toMatchSnapshot();
    expect(GithubMock.getCalls()).toMatchSnapshot();
});

test('writes script that sets env vars to stdout if pr exists', async () => {
    GithubMock.responds({
        status: 200,
        body: {
            data: {
                repository: {
                    ref: {
                        associatedPullRequests: {
                            nodes: [
                                {
                                    url: 'https://github.com/found/me',
                                    number: 420
                                }
                            ]
                        }
                    }
                }
            }
        }
    });
    const results = await testPatchWithEnv({
        CIRCLE_PROJECT_USERNAME: 'apokolips',
        CIRCLE_PROJECT_REPONAME: 'darkseid',
        CIRCLE_BRANCH: 'missing/branch'
    });
    expect(results.childProcess.status).toBe(0);
    expect(results.inProcess).toEqual(results.childProcess);
    expect(results).toMatchSnapshot();
    expect(GithubMock.getCalls()).toMatchSnapshot();
});
