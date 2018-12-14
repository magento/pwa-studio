jest.mock('fs');
jest.mock('execa');

const fs = require('fs');
const execa = require('execa');

const updateRepoEnvironment = require('../update_repo_environment');
beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();
});
afterEach(jest.resetAllMocks);
afterAll(jest.restoreAllMocks);

test('does nothing if git config list fails', () => {
    execa.sync.mockImplementationOnce(() => {
        throw new Error('Git not installed');
    });
    updateRepoEnvironment();
    expect(execa.sync).toHaveBeenCalledTimes(1);
});

test('does nothing if stdout does not match the npm merge driver', () => {
    execa.sync.mockReturnValueOnce({
        stdout: 'core.repositoryformatversion=0\ncore.filemode=true\n'
    });
    updateRepoEnvironment();
    expect(execa.sync).toHaveBeenCalledTimes(1);
});

test('warns console and removes any merge driver present', () => {
    execa.sync.mockReturnValueOnce({
        stdout:
            'core.repositoryformatversion=0\nmerge.npm-blurge-driver.driver=npx npm-merge-driver %s etc\n'
    });
    fs.readFileSync.mockReturnValueOnce('');
    updateRepoEnvironment();
    expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/removing/i)
    );
    expect(execa.sync).toHaveBeenCalledTimes(2);
    expect(execa.sync.mock.calls[1]).toMatchObject([
        'git',
        ['config', '--local', '--remove-section', 'merge.npm-blurge-driver']
    ]);
    expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/removed/i));
    expect(fs.readFileSync).toHaveBeenCalledWith(
        '.git/info/attributes',
        'utf8'
    );
});

test('removes attributes', () => {
    execa.sync.mockReturnValueOnce({
        stdout:
            'core.repositoryformatversion=0\nmerge.npm-blurge-driver.driver=npx npm-merge-driver %s etc\n'
    });
    fs.readFileSync.mockReturnValueOnce(
        'package-lock.json merge=npm-blurge-driver\n'
    );
    updateRepoEnvironment();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
        '.git/info/attributes',
        '',
        'utf8'
    );
});
