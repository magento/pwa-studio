jest.mock('fs-extra');
jest.mock('tar');
jest.mock('node-fetch', () => require('jest-fetch-mock'));
jest.mock('pkg-dir');
jest.mock('execa');
const path = require('path');
const fse = require('fs-extra');
const tar = require('tar');
const fetch = require('node-fetch');
const pkgDir = require('pkg-dir');
const execa = require('execa');
const { PassThrough } = require('stream');
const findPackageRoot = require('../findPackageRoot');

beforeEach(() => {
    fse.readdir.mockReset();
    pkgDir.mockReset();
    execa.shell.mockReset();
    fetch.resetMocks();
});

const simulate = {
    validDirectory(yes) {
        if (yes) {
            fse.readdir.mockResolvedValueOnce([
                'index.js',
                'subdirectory',
                'package.json',
                'package-lock.json'
            ]);
        } else {
            fse.readdir.mockRejectedValueOnce(new Error('ENOENT'));
        }
        return simulate;
    },
    packageFileAt(loc) {
        pkgDir.mockResolvedValueOnce(loc);
        return simulate;
    },
    tarballUrl(tarball) {
        if (!tarball) {
            execa.shell.mockRejectedValueOnce(new Error('it was bad'));
        } else {
            execa.shell.mockResolvedValueOnce({
                stdout: JSON.stringify({
                    dist: {
                        tarball
                    }
                })
            });
        }
        return simulate;
    },
    validTarball(yes) {
        if (yes) {
            const stream = new PassThrough();
            setImmediate(() => {
                stream.write('tarball stream', 'utf8');
                stream.emit('end');
            });
            fetch.mockResponseOnce(stream);
        } else {
            fetch.mockRejectOnce(new Error('401'));
        }
        return simulate;
    },
    untarSuccess(yes) {
        tar.extract.mockImplementationOnce(() => {
            const stream = new PassThrough();
            setImmediate(() =>
                yes
                    ? stream.resume()
                    : stream.emit('error', new Error('untar failed'))
            );
            return stream;
        });
    },
    untarThrew() {
        tar.extract.mockImplementationOnce(() => {
            throw new Error('untar stream construction failed');
        });
    }
};

test('.local() returns its argument if it is a valid directory', async () => {
    simulate.validDirectory(true);

    await expect(findPackageRoot.local('/absolute/path/to')).resolves.toEqual(
        '/absolute/path/to'
    );
});

test('.local() returns null if it is not a valid dir', async () => {
    simulate.validDirectory(false);

    await expect(
        findPackageRoot.local('/absolute/path/to')
    ).resolves.toBeNull();
});

test('.local() returns the root of a valid node module', async () => {
    simulate.packageFileAt('/location/of/package');

    await expect(findPackageRoot.local('jest')).resolves.toEqual(
        '/location/of/package'
    );
});

test('.local() returns null if module cannot be found', async () => {
    simulate.packageFileAt(null);
    await expect(findPackageRoot.local('./missing/place')).resolves.toBeNull();
    await expect(findPackageRoot.local('jest')).resolves.toBeNull();
});

test('.local() throws informative errors on bad args', async () => {
    await expect(findPackageRoot.local(false)).rejects.toThrowError(
        'directory name'
    );
});

test('.remote() downloads and extracts a tarball', async () => {
    simulate
        .tarballUrl('https://some-tarball.local/tgz')
        .validTarball(true)
        .untarSuccess(true);

    const resultDir = await findPackageRoot.remote('@magento/fake-package');
    await expect(resultDir).toMatch(/^\/.+/);
    expect(execa.shell.mock.calls[0][0]).toEqual(
        `npm view --json @magento/fake-package`
    );
    expect(fetch).toHaveBeenCalledWith('https://some-tarball.local/tgz');
    expect(tar.extract).toHaveBeenCalledWith(
        expect.objectContaining({
            cwd: path.resolve(resultDir, '..')
        })
    );
});

test('.remote() returns null if npm has no package by that name', async () => {
    simulate.tarballUrl(false);
    await expect(
        findPackageRoot.remote('@magento/other-fake-package')
    ).resolves.toBeNull();
});

test('.remote() throws if fetching tarball failed', async () => {
    simulate.tarballUrl('https://some.local').validTarball(false);
    await expect(
        findPackageRoot.remote('@magento/other-fake-package')
    ).rejects.toThrowError('could not download');
});

test('.remote() throws if untar stream errored', async () => {
    simulate
        .tarballUrl('https://some-tarball.local/tgz')
        .validTarball(true)
        .untarSuccess(false);
    await expect(
        findPackageRoot.remote('@magento/other-fake-package')
    ).rejects.toThrowError('not extract');

    simulate
        .tarballUrl('https://some-tarball.local/tgz')
        .validTarball(true)
        .untarThrew();
    await expect(
        findPackageRoot.remote('@magento/other-fake-package')
    ).rejects.toThrowError('not extract');
});
