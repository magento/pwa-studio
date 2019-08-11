import memoize from '../unaryMemoize';

test('caches results', () => {
    const fn = memoize(i => ({ i }));
    const a = fn(0);
    const b = fn(1);
    const c = fn(0);

    expect(a).not.toBe(b);
    expect(a).toBe(c);
});

test('calls the function only on cache miss', () => {
    const noop = jest.fn();
    const fn = memoize(i => noop(i));

    fn(0);
    fn(0);
    fn(1);

    expect(noop).toHaveBeenCalledTimes(2);
});
