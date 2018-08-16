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

const patchScript = resolve(__dirname, '../patch_circleci_environment.js');
const nodeBinPath = process.argv[0];

// We must set and mutate these values before mock calls, since
// `mock-http-server` does not support removing handlers that have been added
// with `on`, and we need to test multiple outcomes from the same request.
const mockGithubResponse = jest.fn(() => ({
    status: 400,
    body: 'No mock response was set'
}));
const mockGithubServer = mockServer(mockGithubResponse);
let mockGithubEndpoint;
beforeAll(async () => {
    mockGithubResponse.mockRestore();
    mockGithubEndpoint = await mockGithubServer.mount();
});
afterAll(mockGithubServer.unmount);

beforeEach(() => mockGithubResponse.mockClear());

async function testScript({ env, githubResponse }) {
    if (githubResponse) {
        mockGithubResponse
            .mockReturnValueOnce(githubResponse)
            .mockReturnValueOnce(githubResponse);
    }
    const mockedEnv = Object.assign(
        {
            MOCK_GITHUB_GRAPHQL_ENDPOINT: mockGithubEndpoint
        },
        env
    );

    const mockConfig = {
        env: mockedEnv,
        setEnv: jest.fn(),
        log: jest.fn()
    };

    // test both in-process functionality and child process functionality
    // (for code coverage and CI)

    await patchCircleCIEnvironment(mockConfig);
    const { stdout, stderr, status } = await execp(
        `${nodeBinPath} ${patchScript}`,
        {
            encoding: 'utf8',
            env: mockedEnv
        }
    ).catch(e => e);

    // return a big object for comparison and snapshotting
    return {
        inProcess: {
            stdout: mockConfig.setEnv.mock.calls,
            stderr: mockConfig.log.mock.calls
        },
        childProcess: {
            stderr,
            stdout,
            status
        }
    };
}

test('logs to stderr that PR env vars are already set and exits', async () => {
    const results = await testScript({
        env: {
            CIRCLE_PULL_REQUEST:
                'https://github.com/someOwner/someRepo/pulls/4',
            CIRCLE_PR_USERNAME: 'darkseid'
        }
    });
    expect(results).toMatchSnapshot();
});

test('logs to stderr some PR env vars exist but not all of them', async () => {
    const results = await testScript({
        env: {
            CIRCLE_PROJECT_USERNAME: 'apokolips',
            CIRCLE_PROJECT_REPONAME: 'darkseid',
            CIRCLE_PR_USERNAME: 'new-genesis',
            CIRCLE_PR_REPONAME: 'orion'
        },
        githubResponse: {
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
        }
    });
    expect(results).toMatchSnapshot();
    expect(mockGithubResponse.mock.calls[0]).toMatchSnapshot();
});

test('logs to stderr if fetch network-errors', async () => {
    const results = await testScript({
        env: {
            CIRCLE_PROJECT_USERNAME: 'apokolips',
            CIRCLE_PROJECT_REPONAME: 'darkseid',
            MOCK_GITHUB_GRAPHQL_ENDPOINT: 'htllnj8 ynot a real url'
        }
    });
    expect(results).toMatchSnapshot();
});

test('logs to stderr if response comes back non-200', async () => {
    const results = await testScript({
        env: {
            CIRCLE_PROJECT_USERNAME: 'apokolips',
            CIRCLE_PROJECT_REPONAME: 'darkseid',
            CIRCLE_BRANCH: 'missing/branch'
        },
        githubResponse: {
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
    expect(results).toMatchSnapshot();
    expect(mockGithubResponse.mock.calls[0]).toMatchSnapshot();
});

test('writes script that sets env vars to stdout if pr exists', async () => {
    const results = await testScript({
        env: {
            CIRCLE_PROJECT_USERNAME: 'apokolips',
            CIRCLE_PROJECT_REPONAME: 'darkseid',
            CIRCLE_BRANCH: 'missing/branch'
        },
        githubResponse: {
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
        }
    });
    expect(results).toMatchSnapshot();
    expect(mockGithubResponse.mock.calls[0]).toMatchSnapshot();
});
