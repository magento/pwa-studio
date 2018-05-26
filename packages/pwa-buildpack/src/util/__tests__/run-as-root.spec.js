jest.mock('../promisified/child_process');
jest.mock('../promisified/fs');

const path = require('path');
const fs = require('../promisified/fs');
const { exec } = require('../promisified/child_process');

const implDir = path.resolve(__dirname, '..');

const runAsRoot = require('../run-as-root');

afterEach(jest.restoreAllMocks);

test('serializes and writes a script to fs', async () => {
    exec.mockImplementationOnce(() => Promise.resolve({ stdout: '23' }));
    fs.writeFile.mockResolvedValueOnce();
    fs.unlink.mockResolvedValueOnce();
    await runAsRoot(
        'Adding numbers requires temporary administrative privileges. \nEnter password for [%u]: ',
        (x, y) => x + y * 5,
        3,
        4
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        '((x, y) => x + y * 5)(...[3,4])',
        'utf8'
    );
    expect(path.dirname(fs.writeFile.mock.calls[0][0])).toBe(implDir);
    expect(eval(fs.writeFile.mock.calls[0][1])).toBe(23);
});

test('runs sudo to call that script with a custom prompt', async () => {
    exec.mockImplementationOnce(() => Promise.resolve({ stdout: '23' }));
    fs.writeFile.mockResolvedValueOnce();
    fs.unlink.mockResolvedValueOnce();
    await runAsRoot(
        'Adding numbers requires temporary administrative privileges. \nEnter password for [ %u ]: ',
        (x, y) => x + y * 5,
        3,
        4
    );
    expect(exec).toHaveBeenCalledWith(
        expect.stringMatching(
            'sudo -p \\"Adding numbers requires temporary administrative privileges'
        )
    );
});

test('reports errors informatively', async () => {
    jest.spyOn(fs, 'writeFile').mockResolvedValue();
    const error = new Error('object error message');
    error.stdout = 'standard out';
    error.stderr = 'standard error';
    exec.mockImplementationOnce(() => Promise.reject(error));
    jest.spyOn(fs, 'unlink').mockResolvedValue();
    await expect(
        runAsRoot('Enter password for %u to run as %p on %H ', x => x)
    ).rejects.toThrowError(
        /object error message\s+standard error\s+standard out/m
    );
    exec.mockImplementationOnce(() => Promise.reject('raw error message'));
    await expect(runAsRoot('Password: ', x => x)).rejects.toThrowError(
        /raw error message/
    );
});

test('cleans up temp file on success or failure', async () => {
    fs.writeFile.mockResolvedValueOnce();
    fs.unlink.mockResolvedValueOnce();
    exec.mockImplementationOnce(() => Promise.resolve({ stdout: 'foo' }));
    await expect(
        runAsRoot('Enter password to log to console', () => console.log('foo'))
    ).resolves.toMatch('foo');
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    expect(fs.unlink).toHaveBeenCalledTimes(1);
    await expect(
        runAsRoot('Enter password to do whatevs I guess', x => x)
    ).rejects.toThrowError();
    expect(fs.writeFile).toHaveBeenCalledTimes(2);
    expect(fs.unlink).toHaveBeenCalledTimes(2);
    fs.writeFile.mock.calls.forEach((call, index) =>
        expect(call[0]).toEqual(fs.unlink.mock.calls[index][0])
    );
});

test('errors if first arg is not a prompt string', async () => {
    exec.mockImplementationOnce(i => Promise.resolve({ stdout: i }));
    await expect(runAsRoot(x => x, 5)).rejects.toThrowError(
        'takes a prompt string as its first argument'
    );
});

test('errors if second arg is not a function', async () => {
    exec.mockImplementationOnce(i => Promise.resolve({ stdout: i }));
    await expect(runAsRoot('nothing')).rejects.toThrowError(
        'takes a function as its second argument'
    );
});
