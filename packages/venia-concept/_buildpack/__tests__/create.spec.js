jest.mock('child_process');
const { execSync } = require('child_process');

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
        '/repo/packages/me/src/components/Fake/Fake.module.css': '#fake {}',
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
        fs.readFileSync('/project/src/components/Fake/Fake.module.css', 'utf8')
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
                '@magento/peregrine': '1.0.0',
                '@magento/pwa-buildpack': '1.0.0'
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
        execSync.mockImplementation((cmd, { cwd }) => {
            if (!cmd.match(/npm.+pack/)) {
                throw new Error(
                    `Mock execSync expected passed command to be "npm pack", but it was "${cmd}"`
                );
            }
            const pkgName = cwd.split('/').pop();
            // as of NPM 7.21 npm pack produces this filename
            fs.writeFileSync(
                resolve(packagesRoot, pkgName, `magento-${pkgName}-1.0.0.tgz`),
                `${pkgName} tarball contents`
            );
            // but it produces THIS in filename output. Hilarious!
            return JSON.stringify([
                { filename: `@magento/${pkgName}-1.0.0.tgz` }
            ]);
        });
    });

    afterEach(() => {
        process.env.DEBUG_PROJECT_CREATION = old;
    });
    describe('scaffolds using the current state of the other packages as dependencies, instead of the published release', () => {
        const fileScheme = 'file://';

        const createDebugScaffold = async () => {
            execSync.mockReturnValueOnce(mockWorkspaceResponse);

            await runCreate(fs, {
                name: 'foo',
                author: 'bar',
                npmClient: 'npm',
                testScaffolding: true
            });

            return fs.readJsonSync('/project/package.json');
        };

        test('sets the created package.json to use local tarballs for those dependencies', async () => {
            const {
                dependencies,
                devDependencies,
                resolutions
            } = await createDebugScaffold();
            expect(devDependencies['@magento/pwa-buildpack']).toMatch(
                fileScheme
            );
            expect(dependencies['@magento/create-pwa']).toBeUndefined();
            expect(resolutions['@magento/peregrine']).toMatch(fileScheme);
        });
        test('uses npm to create the local tarballs it references', async () => {
            const {
                dependencies,
                devDependencies
            } = await createDebugScaffold();
            const tryReadTarball = dep => {
                const tarballPath = dep.replace(fileScheme, '');
                try {
                    return fs.readFileSync(tarballPath, 'utf8');
                } catch (e) {
                    throw new Error(
                        `Expected npm to have created ${tarballPath}, but: ${
                            e.message
                        }`
                    );
                }
            };

            expect(
                tryReadTarball(devDependencies['@magento/pwa-buildpack'])
            ).toBe('pwa-buildpack tarball contents');
            expect(tryReadTarball(devDependencies['@magento/peregrine'])).toBe(
                'peregrine tarball contents'
            );
            expect(tryReadTarball(dependencies['@magento/venia-ui'])).toBe(
                'venia-ui tarball contents'
            );
        });
        test('handles lots of older tarballs in the dep directories', async () => {
            const debugPkgJson = await createDebugScaffold();
            fs.writeFileSync(
                resolve(
                    packagesRoot,
                    'peregrine',
                    'magento-peregrine-0.0.1.tgz'
                ),
                'older peregrine tarball'
            );
            fs.writeFileSync(
                resolve(
                    packagesRoot,
                    'peregrine',
                    'magento-peregrine-0.0.2.tgz'
                ),
                'old peregrine tarball'
            );
            fs.writeFileSync(
                resolve(
                    packagesRoot,
                    'pwa-buildpack',
                    'magento-pwa-buildpack-0.0.1.tgz'
                ),
                'old buildpack tarball'
            );
            // now try again, but with too many tarballs.
            // did it get the right ones (the same ones as before)?
            await expect(createDebugScaffold()).resolves.toEqual(debugPkgJson);
        });
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
});
