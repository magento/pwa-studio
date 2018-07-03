import timeout from '../timeout';

const delay = 1000;

test('returns a promise', () => {
    expect(timeout(delay)).toBeInstanceOf(Promise);
});

test('resolves after timeout expires', async () => {
    const start = performance.now();
    await timeout(delay);
    const end = performance.now();
    const duration = end - start;
    const variance = Math.abs(duration - delay);

    expect(variance).toBeLessThanOrEqual(10);
});
