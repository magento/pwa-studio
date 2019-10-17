jest.mock('klaw');
const klaw = require('klaw');

const boundKlaw = require('../klaw-bound-fs');

test('binds a passed fs, tolerating missing methods', () => {
    const fs = {
        foo: 'bar',
        stat() {
            return this.foo;
        }
    };
    boundKlaw('.', { fs });
    expect(klaw).toHaveBeenCalled();
    const boundFs = klaw.mock.calls[0][1].fs;
    expect(typeof boundFs.stat).toBe('function');
    expect(typeof boundFs.foo).toBe('string');
    const unboundStat = boundFs.stat;
    expect(unboundStat()).toBe('bar');
});

test('does nothing when a fs is not passed', () => {
    boundKlaw('.', { someOption: 1 });
    const options = klaw.mock.calls[0][1];
    expect(options).not.toHaveProperty('fs');
    expect(options).toHaveProperty('someOption', 1);
});
