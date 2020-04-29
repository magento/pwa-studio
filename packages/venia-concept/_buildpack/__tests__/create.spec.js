jest.mock('child_process');
const { execSync } = require('child_process');
execSync.mockImplementation((cmd, { cwd }) =>
    JSON.stringify([{ filename: `${cwd.split('/').pop()}.tgz` }])
);

const { dirname, resolve } = require('path');
const packagesRoot = resolve(__dirname, '../../../');

const MemoryFS = require('memory-fs');
const {
    makeCommonTasks,
    makeCopyStream
} = require('@magento/pwa-buildpack/lib/Utilities/createProject');
const createVenia = require('../create');

const mockFs = data => {
    const fs = new MemoryFS();
    Object.assign(fs, {
        ensureDirSync(path) {
            fs.mkdirpSync(path);
        },
        readJsonSync(path) {
            try {
                return JSON.parse(fs.readFileSync(path));
            } catch (e) {
                throw new Error(`${path}: ${e.message}`);
            }
        },
        outputFileSync(path, contents) {
            fs.mkdirpSync(dirname(path));
            return fs.writeFileSync(path, contents);
        },
        outputJsonSync(path, json) {
            fs.outputFileSync(path, JSON.stringify(json));
        },
        copyFileSync(path, targetPath) {
            fs.outputFileSync(targetPath, fs.readFileSync(path));
        }
    });
    Object.entries(data).forEach(args => fs.outputFileSync(...args));
    return fs;
};

const runCreate = (fs, options) => {
    const { visitor } = createVenia({
        fs,
        tasks: makeCommonTasks(fs),
        options
    });
    return makeCopyStream({
        fs,
        options: {
            ...options,
            directory: '/target'
        },
        visitor,
        packageRoot: '/repo/packages/me',
        directory: '/project',
        ignores: []
    });
};

test('copies files and writes new file structure, ignoring ignores', async () => {
    const fs = mockFs({
        '/repo/packages/me/src/index.js': 'alert("index")',
        '/repo/packages/me/src/components/Fake/Fake.js': 'alert("fake")',
        '/repo/packages/me/src/components/Fake/Fake.css': '#fake {}',
        '/repo/packages/me/CHANGELOG.md': '#markdown'
    });
    await runCreate(fs, {
        name: 'whee',
        author: 'me',
        npmClient: 'yarn'
    });
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

test('outputs custom package.json', async () => {
    const fs = mockFs({
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
    expect(fs.readJsonSync('/project/package.json')).toMatchSnapshot();
});

test('outputs npm package.json', async () => {
    const fs = mockFs({
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
    expect(fs.readJsonSync('/project/package.json')).toMatchSnapshot();
});

// TODO: add these lockfiles back when we have a strategy for regenerating them
test.skip('outputs package-lock or yarn.lock based on npmClient', async () => {
    const files = {
        '/repo/packages/me/package-lock.json.cached': '{ "for": "npm" }',
        '/repo/packages/me/yarn.lock.cached': '{ "for": "yarn" }'
    };
    let fs = mockFs(files);
    await runCreate(fs, {
        name: 'foo',
        author: 'bar',
        npmClient: 'yarn'
    });
    expect(() => fs.readJsonSync('/project/package-lock.json')).toThrow();
    expect(fs.readJsonSync('/project/yarn.lock')).toMatchObject({
        for: 'yarn'
    });

    fs = mockFs(files);
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

test('forces yarn client, local deps, and console debugging if DEBUG_PROJECT_CREATION is set', async () => {
    const old = process.env.DEBUG_PROJECT_CREATION;
    process.env.DEBUG_PROJECT_CREATION = 1;

    const files = {
        '/repo/packages/me/package.json': JSON.stringify({
            name: 'foo',
            author: 'bar',
            dependencies: {
                '@magento/venia-ui': '1.0.0'
            },
            devDependencies: {
                '@magento/peregrine': '1.0.0'
            },
            scripts: {},
            optionalDependencies: {
                'no-package': '0.0.1'
            }
        }),
        '/repo/packages/me/package-lock.json': '{ "for": "npm" }',
        '/repo/packages/me/yarn.lock': '{ "for": "yarn" }',
        [resolve(packagesRoot, 'venia-ui/package.json')]: JSON.stringify({
            name: '@magento/venia-ui'
        }),
        [resolve(packagesRoot, 'peregrine/package.json')]: JSON.stringify({
            name: '@magento/peregrine'
        }),
        [resolve(packagesRoot, 'bad-package/package.json')]: 'bad json',
        [resolve(packagesRoot, 'some-file.txt')]: 'not a package'
    };

    const fs = mockFs(files);

    await runCreate(fs, {
        name: 'foo',
        author: 'bar',
        npmClient: 'npm'
    });
    expect(
        fs.readJsonSync('/project/package.json').resolutions[
            '@magento/peregrine'
        ]
    ).toMatch(/^file/);
    process.env.DEBUG_PROJECT_CREATION = old;
});
