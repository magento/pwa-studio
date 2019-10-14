jest.mock('../../../pwa-buildpack/lib/Utilities/findPackageRoot', () => ({
    local: () => '/fake/module',
    remote: () => {}
}));
jest.mock('child_process');
const { execSync } = require('child_process');
execSync.mockImplementation((cmd, { cwd }) =>
    JSON.stringify([{ filename: `${cwd.split('/').pop()}.tgz` }])
);

const MockFS = require('../../__mocks__/memFsExtraMock');

const {
    makeCommonTasks,
    makeCopyStream
} = require('../../../pwa-buildpack/lib/Utilities/createProject');
const createVenia = require('../create');

const runCreate = async (fs, options) => {
    const { visitor } = createVenia({
        fs,
        tasks: makeCommonTasks(fs, options),
        options
    });
    await makeCopyStream({
        fs,
        options: {
            ...options,
            directory: '/project/'
        },
        visitor,
        packageRoot: '/repo/packages/me',
        directory: '/project/',
        ignores: []
    });
};

beforeEach(() => {
    MockFS.instances = [];
});

test('copies files and writes new file structure, ignoring ignores', async () => {
    const fs = new MockFS({
        '/repo/packages/me/src/index.js': 'alert("index")',
        '/repo/packages/me/src/components/Fake/Fake.js': 'alert("fake")',
        '/repo/packages/me/src/components/Fake/Fake.css': '#fake {}',
        '/repo/packages/me/CHANGELOG.md': '#markdown'
    });
    await expect(
        runCreate(fs, {
            name: 'whee',
            author: 'me',
            npmClient: 'yarn'
        })
    ).resolves.not.toThrow();
    expect(fs.readFileSync('/project/src/index.js', 'utf8')).toBe(
        'alert("index")'
    );
    expect(
        fs.readFileSync('/project/src/components/Fake/Fake.js', 'utf8')
    ).toBe('alert("fake")');
    expect(
        fs.readFileSync('/project/src/components/Fake/Fake.css', 'utf8')
    ).toBe('#fake {}');
    expect(() => fs.readFileSync('/project/CHANGELOG.md', 'utf8')).toThrow();
});

test.only('outputs custom package.json', async () => {
    const fs = new MockFS({
        '/repo/packages/me/package.json': JSON.stringify({
            browser: './browser.lol',
            dependencies: {
                'left-pad': '1.0.0'
            },
            scripts: {
                'do-not-copy': 'this',
                test: 'yarn run do test this'
            }
        })
    });
    await runCreate(fs, {
        name: 'whee',
        author: 'me',
        npmClient: 'yarn'
    });
    console.error('fuck');
    // throw new Error(require('util').inspect(fs.data));
    await expect(
        fs.readJson('/project/package.json')
    ).resolves.toMatchSnapshot();
});

test('outputs npm package.json', async () => {
    const fs = new MockFS({
        '/repo/packages/me/package.json': JSON.stringify({
            browser: './browser.lol',
            dependencies: {
                'left-pad': '1.0.0'
            },
            scripts: {
                'do-not-copy': 'this',
                test: 'yarn run do test this'
            }
        })
    });
    await runCreate(fs, {
        name: 'whee',
        author: 'me',
        npmClient: 'npm'
    });
    // throw new Error(require('util').inspect(fs.data));
    expect(fs.readJsonSync('/project/package.json')).toMatchSnapshot();
});

// TODO: add these lockfiles back when we have a strategy for regenerating them
test.skip('outputs package-lock or yarn.lock based on npmClient', async () => {
    const files = {
        '/repo/packages/me/package-lock.json.cached': '{ "for": "npm" }',
        '/repo/packages/me/yarn.lock.cached': '{ "for": "yarn" }'
    };
    let fs = new MockFS(files);
    await runCreate(fs, {
        name: 'foo',
        author: 'bar',
        npmClient: 'yarn'
    });
    expect(() => fs.readJsonSync('/project/package-lock.json')).toThrow();
    expect(fs.readJsonSync('/project/yarn.lock')).toMatchObject({
        for: 'yarn'
    });

    fs = new MockFS(files);
    await runCreate(fs, {
        name: 'foo',
        author: 'bar',
        npmClient: 'npm'
    });
    expect(() => fs.readJsonSync('/project/yarn.lock')).toThrow();
    expect(fs.readJsonSync('/project/package-lock.json')).toMatchObject({
        for: 'npm'
    });
});
