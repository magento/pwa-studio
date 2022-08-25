jest.mock('../../util/klaw-bound-fs');
const walk = require('../../util/klaw-bound-fs');
const createProject = require('../createProject');
const { resolve } = require('path');
const klaw = jest.requireActual('../../util/klaw-bound-fs');

// can't spy because it exports a function
walk.mockImplementation(klaw);

const mockBase = require.resolve('buildpack-template-package');

const packageFile = relativePath => resolve(mockBase, '..', relativePath);

const { mock } = require(packageFile('_buildpack/create'));

beforeAll(() => {
    createProject.GITIGNORE_FILE = '_gitignore_test';
});
afterAll(() => {
    createProject.GITIGNORE_FILE = '.gitignore';
});

test('createProject accepts a visitor object', async () => {
    await createProject({
        template: 'buildpack-template-package',
        directory: 'fake/path'
    });
    expect(mock.visitor['index.js']).toHaveBeenCalledWith(
        expect.objectContaining({
            path: packageFile('index.js')
        })
    );
    const [[first], [second]] = mock.visitor['**/*.css'].mock.calls;
    expect(first.path).toBe(packageFile('stylesheets/index.css'));
    expect(second.path).toBe(
        packageFile('stylesheets/other-stylesheets/other.css')
    );
    expect(mock.after).toHaveBeenCalled();
});

test('createProject fails if a handler fails', async () => {
    mock.visitor['index.js'].mockImplementationOnce(() => {
        throw new Error('guh');
    });

    mock.after.mockImplementationOnce(() => {
        throw new Error('bleh');
    });

    await expect(
        createProject({
            template: 'buildpack-template-package',
            directory: 'fake/path'
        })
    ).rejects.toThrow('guh');
    await expect(
        createProject({
            template: 'buildpack-template-package',
            directory: 'fake/path'
        })
    ).rejects.toThrow('bleh');
});

test('createProject will not try to resolve a rejected promise if a trailing end event happens', async () => {
    walk.mockImplementationOnce((...args) => {
        const walker = klaw(...args);
        setImmediate(() => {
            walker.emit('error', new Error('oopes'));
            walker.emit('end'); // will it reject?
        });
        return walker;
    });
    await expect(
        createProject({
            template: 'buildpack-template-package',
            directory: 'fake/path'
        })
    ).rejects.toThrow('oopes');
});

test('createProject will not run files in gitignore', async () => {
    await expect(
        createProject({
            template: 'buildpack-template-package',
            directory: 'fake/path'
        })
    ).resolves.toBe(undefined);
    expect(mock.visitor['index.js']).toHaveBeenCalled();
    expect(mock.visitor['ignoreexp/*'].mock.calls[0]).not.toBeTruthy();
});

test('createProject will accept a custom gitignore', async () => {
    mock.ignores = ['*ignore*'];
    await expect(
        createProject({
            template: 'buildpack-template-package',
            directory: 'fake/path'
        })
    ).resolves.toBe(undefined);
    expect(mock.visitor['index.js']).toHaveBeenCalled();
    expect(mock.visitor['ignoreexp/*'].mock.calls[0]).not.toBeTruthy();
    delete mock.ignores;
});

test('createProject will not die with a busted gitignore', async () => {
    createProject.GITIGNORE_FILE = false;
    await expect(
        createProject({
            template: 'buildpack-template-package',
            directory: 'fake/path'
        })
    ).resolves.toBe(undefined);
    expect(mock.visitor['index.js']).toHaveBeenCalled();
    expect(mock.visitor['ignoreexp/*']).toHaveBeenCalled();
});

test('createProject will support optional before/after functions', async () => {
    delete mock.before;
    delete mock.after;
    await expect(
        createProject({
            template: 'buildpack-template-package',
            directory: 'fake/path'
        })
    ).resolves.toBe(undefined);
});
