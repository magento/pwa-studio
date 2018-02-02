const execSync = jest.fn(() => 'cmd stdout');
jest.doMock('child_process', () => ({ execSync }));
const ECRunner = require('../external-command-runner');
const opts = { encoding: 'utf8' };
let runner;
beforeEach(() => {
    runner = new ECRunner('foo');
    execSync.mockClear();
});
test('constructs an ECRunner instance with a cmd property from ctr arg', () => {
    expect(runner).toMatchObject({
        cmd: 'foo'
    });
    expect(runner.run).toBeInstanceOf(Function);
    expect(runner.sudo).toBeInstanceOf(Function);
});
test('runs a synchronous shell command with .run()', () => {
    const result = runner.run('arg1 arg2');
    expect(result).toBe('cmd stdout');
    expect(execSync).toHaveBeenCalledWith('foo arg1 arg2', opts);
});
test('runs the same command under sudo with .sudo()', () => {
    const result = runner.sudo('arg1 arg2');
    expect(result).toBe('cmd stdout');
    expect(execSync).toHaveBeenCalledWith('sudo foo arg1 arg2', opts);
});
test('.sudo() works with one argument just like .run()', () => {
    runner.sudo('arg1 arg2');
    expect(execSync).toHaveBeenCalledWith('sudo foo arg1 arg2', opts);
});
test('.sudo() works with a null first argument and args second', () => {
    runner.sudo(null, 'arg1 arg2');
    expect(execSync).toHaveBeenCalledWith('sudo foo arg1 arg2', opts);
});
test('.sudo() calls sudo with arg1 as custom prompt and arg2 as args', () => {
    runner.sudo('custom prompt', 'arg1 arg2');
    expect(execSync).toHaveBeenCalledWith(
        'sudo -p "custom prompt" foo arg1 arg2',
        opts
    );
});
