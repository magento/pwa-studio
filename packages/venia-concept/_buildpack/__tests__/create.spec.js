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
const sampleBackends = require('@magento/pwa-buildpack/sampleBackends.json');
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

const runCreate = async (fs, opts) => {
    const options = {
        ...opts,
        directory: '/target'
    };
    const { after, before, visitor } = await createVenia({
        fs,
        tasks: makeCommonTasks(fs),
        options,
        sampleBackends
    });
    if (before) {
        await before({ options });
    }
    await makeCopyStream({
        fs,
        options,
        visitor,
        packageRoot: '/repo/packages/me',
        directory: '/project',
        ignores: []
    });
    if (after) {
        await after({ options });
    }
};

test('copies files and writes new file structure, ignoring ignores', async () => {
    const fs = mockFs({
        '/repo/packages/me/src/index.js': 'alert("index")',
        '/repo/packages/me/src/components/Fake/Fake.js': 'alert("fake")',
        '/repo/packages/me/src/components/Fake/Fake.css': '#fake {}',
        '/repo/packages/me/CHANGELOG.md': '#markdown',
        '/repo/packages/me/.graphqlconfig': JSON.stringify({
            projects: { venia: { 'venia-options': true } }
        })
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
    expect(fs.readJsonSync('/project/.graphqlconfig')).toMatchObject({
        projects: {
            whee: {
                'venia-options': true
            }
        }
    });
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
                watch: 'yarn run do watch this'
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
                watch: 'yarn run do watch this'
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

describe('when DEBUG_PROJECT_CREATION is set', () => {
    const old = process.env.DEBUG_PROJECT_CREATION;
    const mockWorkspaceResponse = JSON.stringify({
        foo: { location: '/repo/packages/me' },
        '@magento/create-pwa': { location: 'packages/create-pwa' },
        '@magento/pwa-buildpack': { location: 'packages/pwa-buildpack' },
        '@magento/peregrine': { location: 'packages/peregrine' },
        '@magento/venia-ui': { location: 'packages/venia-ui' }
    });

    let fs;
    let pkg;

    beforeEach(() => {
        process.env.DEBUG_PROJECT_CREATION = 1;
        pkg = {
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
        };
        fs = mockFs({
            '/repo/packages/me/package.json': JSON.stringify(pkg),
            '/repo/packages/me/package-lock.json': '{ "for": "npm" }',
            '/repo/packages/me/yarn.lock': '{ "for": "yarn" }',
            [resolve(packagesRoot, 'venia-ui/package.json')]: JSON.stringify({
                name: '@magento/venia-ui'
            }),
            [resolve(packagesRoot, 'peregrine/package.json')]: JSON.stringify({
                name: '@magento/peregrine'
            }),
            [resolve(
                packagesRoot,
                'pwa-buildpack/package.json'
            )]: JSON.stringify({
                name: '@magento/pwa-buildpack'
            })
        });
    });

    afterEach(() => {
        process.env.DEBUG_PROJECT_CREATION = old;
    });

    test('forces yarn client, local deps, and console debugging if DEBUG_PROJECT_CREATION is set', async () => {
        // mock the yarn workspaces response
        execSync.mockReturnValueOnce(mockWorkspaceResponse);

        await runCreate(fs, {
            name: 'foo',
            author: 'bar',
            npmClient: 'npm'
        });

        const packageJSON = fs.readJsonSync('/project/package.json');

        expect(packageJSON.dependencies['@magento/pwa-buildpack']).toMatch(
            /^file/
        );
        expect(packageJSON.dependencies['@magento/create-pwa']).toBeUndefined();
        expect(packageJSON.resolutions['@magento/peregrine']).toMatch(/^file/);
    });

    test('handles unexpected child process responses', async () => {
        execSync.mockReturnValueOnce('bad { json');
        await expect(
            runCreate(fs, { name: 'foo', author: 'bar', npmClient: 'yarn' })
        ).rejects.toThrowError('workspaces');

        execSync
            .mockReturnValueOnce(mockWorkspaceResponse)
            .mockReturnValueOnce('very bad { json');
        await expect(
            runCreate(fs, { name: 'foo', author: 'bar', npmClient: 'yarn' })
        ).rejects.toThrowError('pack');
    });

    test('handles missing scripts section or zero overrides', async () => {
        delete pkg.scripts;
        fs.outputJsonSync('/repo/packages/me/package.json', pkg, 'utf8');
        await expect(
            runCreate(fs, { name: 'foo', author: 'bar', npmClient: 'yarn' })
        ).rejects.toThrow('scripts');
    });

    test('does not log or overwrite if there are zero overrides', async () => {
        execSync.mockReturnValueOnce('{}'); // yarn prints zero workspaces
        await expect(
            runCreate(fs, { name: 'foo', author: 'bar', npmClient: 'yarn' })
        ).resolves.not.toThrow();
        expect(fs.readJsonSync('/project/package.json')).not.toHaveProperty(
            'resolutions'
        );
    });

    test('works with modern versions of NPM that spit out the tarball name', async () => {
        // Arrange.
        execSync
            .mockReturnValueOnce(mockWorkspaceResponse)
            .mockReturnValueOnce('unit_test.tgz');

        // Act & Assert.
        await expect(
            runCreate(fs, { name: 'foo', author: 'bar', npmClient: 'yarn' })
        ).resolves.not.toThrow();
    });
});
