jest.mock('find-cache-dir');
jest.mock('tar');
jest.mock('node-fetch');

class TempFS extends require('memory-fs') {
    constructor({ emptyDirs = [], files = {} }) {
        super();
        for (const dir of emptyDirs) {
            this.mkdirpSync(dir);
        }
        for (const [filePath, contents] of Object.entries(files)) {
            this.mkdirpSync(dirname(filePath));
            this.writeFileSync(filePath, contents, 'utf8');
        }
        TempFS.current = this;
    }
    mkdirSync(...args) {
        return super.mkdirpSync(...args);
    }
}

const findCacheDir = require('find-cache-dir');
const { resolve, dirname } = require('path');
const fetch = require('node-fetch');
const stream = require('stream');
const tar = require('tar');

function mockFetchBodyOnce(body) {
    fetch.mockResolvedValueOnce({
        body: stream.Readable.from([body])
    });
}

function mockFetchJsonOnce(json) {
    fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(json)
    });
}

const TemplateRepository = require('../TemplateRepository');
describe('TemplateRepository for scaffolding', () => {
    beforeAll(() => {
        tar.extract.mockImplementation(({ cwd }) => {
            const fs = TempFS.current;
            fs.mkdirpSync(resolve(cwd, 'package'));
            return fs.createWriteStream(
                resolve(cwd, 'package', 'package.json')
            );
        });
        findCacheDir.mockReturnValue('/thecache');
    });

    test('finds and stores local cache directory with find-cache-dir', () => {
        const repo = new TemplateRepository();
        expect(repo.cacheDir).toBe('/thecache/scaffold-templates');
    });

    describe('#getPackageFromCache', () => {
        test('gets the local path of a cached package', async () => {
            const repo = new TemplateRepository({
                fs: new TempFS({
                    files: {
                        '/thecache/scaffold-templates/@testns/testpkg/package/package.json': JSON.stringify(
                            {
                                name: '@testns/testpkg'
                            }
                        )
                    }
                })
            });
            await expect(
                repo.getPackageFromCache('@testns/testpkg')
            ).resolves.toBe(
                '/thecache/scaffold-templates/@testns/testpkg/package'
            );
        });
        test('returns false if no cached package dir is found', async () => {
            const repo = new TemplateRepository({ fs: new TempFS({}) });
            await expect(
                repo.getPackageFromCache('@testns/nonexistent')
            ).resolves.toBe(false);
        });
        test('returns false if cached package dir has no package.json in it', async () => {
            const repo = new TemplateRepository({
                fs: new TempFS({
                    emptyDirs: [
                        '/thecache/scaffold-templates/@testns/nonexistent/package'
                    ]
                })
            });
            await expect(
                repo.getPackageFromCache('@testns/nonexistent')
            ).resolves.toBe(false);
        });
        test('does not search for cache path more than once per instance', async () => {
            const repo = new TemplateRepository({
                fs: new TempFS({})
            });
            await expect(repo.getPackageFromCache('absent')).resolves.toBe(
                false
            );
            await expect(repo.getPackageFromCache('absent')).resolves.toBe(
                false
            );
            expect(findCacheDir).toHaveBeenCalledTimes(1);
        });
    });
    describe('#getPackageFromRegistry', () => {
        describe('looks up tarball on registry', () => {
            test('downloads and extracts tarball from registry', async () => {
                const repo = new TemplateRepository({ fs: new TempFS({}) });
                const packageToWrite = { name: '@testns/remote' };
                mockFetchJsonOnce({
                    dist: {
                        tarball: 'http://example.com/tarball.tgz'
                    }
                });
                mockFetchBodyOnce(JSON.stringify(packageToWrite));
                const expectedDir =
                    '/thecache/scaffold-templates/@testns/remote/package';
                await expect(
                    repo.getPackageFromRegistry('@testns/remote')
                ).resolves.toBe(expectedDir);

                expect(fetch).toHaveBeenCalledWith(
                    'https://registry.npmjs.com/@testns/remote/latest'
                );
                expect(fetch).toHaveBeenCalledWith(
                    'http://example.com/tarball.tgz'
                );
                expect(
                    JSON.parse(
                        TempFS.current.readFileSync(
                            `${expectedDir}/package.json`
                        )
                    )
                ).toEqual(packageToWrite);
            });
            test('throws if package info fetch failed', async () => {
                const repo = new TemplateRepository({ cache: false });
                fetch.mockRejectedValueOnce(new Error('403'));
                await expect(
                    repo.getPackageFromRegistry('@testns/remote')
                ).rejects.toThrowErrorMatchingSnapshot();
            });
            test('throws if tarball fetch failed', async () => {
                mockFetchJsonOnce({
                    dist: {
                        tarball: 'http://example.com/tarball-nonexistent.tgz'
                    }
                });
                fetch.mockRejectedValueOnce(new Error('404'));
                const repo = new TemplateRepository({ cache: false });
                await expect(
                    repo.getPackageFromRegistry('@testns/remote')
                ).rejects.toThrowErrorMatchingSnapshot();
            });
            test('downloads from custom registry', async () => {
                fetch.mockRejectedValueOnce(new Error('who even are you'));
                const repo = new TemplateRepository({
                    fs: new TempFS({}),
                    cache: false,
                    registry: 'https://other-registry.com'
                });
                await expect(
                    repo.getPackageFromRegistry('@testns/remote')
                ).rejects.toThrow();
                expect(fetch).toHaveBeenCalledWith(
                    'https://other-registry.com/@testns/remote/latest'
                );
            });
            test('throws if tarball extract failed', async () => {
                mockFetchJsonOnce({
                    dist: {
                        tarball: 'http://example.com/tarball.tgz'
                    }
                });
                mockFetchBodyOnce(JSON.stringify({ name: '@testns/remote' }));
                const repo = new TemplateRepository({
                    fs: new TempFS({})
                });
                repo.extractToDir = () => Promise.reject(new Error('oh no'));
                await expect(
                    repo.getPackageFromRegistry('@testns/remote')
                ).rejects.toThrowErrorMatchingSnapshot();
            });
        });
    });
    describe('#makeDirFromDevPackage', () => {
        test('provides local path to venia', async () => {
            const repo = new TemplateRepository();
            await expect(
                repo.makeDirFromDevPackage('@magento/venia-concept')
            ).resolves.toMatch(/pwa\-studio\/packages\/venia-concept$/);
        });
        test('currently errors if anything else is requested', async () => {
            const repo = new TemplateRepository();
            await expect(
                repo.makeDirFromDevPackage('@anything/else')
            ).rejects.toThrowErrorMatchingSnapshot();
        });
    });
    describe('#findTemplateDir', () => {
        const localTemplatePackage = '/path/to/local/template/';
        const mockFs = new TempFS({
            files: {
                '/path/to/local/template/package.json': JSON.stringify({
                    name: '@testns/testpkg'
                })
            }
        });
        const proto = TemplateRepository.prototype;
        beforeEach(() => {
            jest.spyOn(proto, 'makeDirFromDevPackage');
            jest.spyOn(proto, 'getPackageFromCache');
            jest.spyOn(proto, 'getPackageFromRegistry');
        });
        afterEach(() => {
            proto.makeDirFromDevPackage.mockRestore();
            proto.getPackageFromCache.mockRestore();
            proto.getPackageFromRegistry.mockRestore();
        });
        test('Returns its argument if it is a real local path with a package.json in it', async () => {
            const repo = new TemplateRepository({
                fs: mockFs
            });
            await expect(
                repo.findTemplateDir(localTemplatePackage)
            ).resolves.toBe(localTemplatePackage);
        });
        test('Runs this.makeDirFromDevPackage if local is set', async () => {
            const repo = new TemplateRepository({ local: true });
            repo.makeDirFromDevPackage.mockResolvedValueOnce('/path/to/venia');
            await expect(
                repo.findTemplateDir('@magento/venia-concept')
            ).resolves.toMatch('/path/to/venia');
            expect(repo.getPackageFromCache).not.toHaveBeenCalled();
            expect(repo.getPackageFromRegistry).not.toHaveBeenCalled();
        });
        test('Runs this.getPackageFromCache first', async () => {
            const repo = new TemplateRepository({ fs: mockFs });
            repo.getPackageFromCache.mockResolvedValueOnce('/path/to/venia');
            await expect(
                repo.findTemplateDir('@magento/venia-concept')
            ).resolves.toMatch('/path/to/venia');
            expect(repo.getPackageFromRegistry).not.toHaveBeenCalled();
        });
        test('If no cache present, runs this.getPackageFromRegistry', async () => {
            const repo = new TemplateRepository({});
            repo.getPackageFromRegistry.mockResolvedValueOnce(
                '/path/to/remote'
            );
            repo.getPackageFromCache.mockResolvedValueOnce(false);
            await expect(
                repo.findTemplateDir('@magento/venia-concept')
            ).resolves.toMatch('/path/to/remote');
            expect(repo.getPackageFromCache).toHaveBeenCalled();
            expect(repo.getPackageFromRegistry).toHaveBeenCalled();
        });
        test('If cache is set to false, goes directly to registry', async () => {
            const repo = new TemplateRepository({ cache: false });
            repo.getPackageFromRegistry.mockResolvedValueOnce(
                '/path/to/remote'
            );
            await expect(
                repo.findTemplateDir('@magento/venia-concept')
            ).resolves.toMatch('/path/to/remote');
            expect(repo.getPackageFromCache).not.toHaveBeenCalled();
            expect(repo.getPackageFromRegistry).toHaveBeenCalled();
        });
    });
});
