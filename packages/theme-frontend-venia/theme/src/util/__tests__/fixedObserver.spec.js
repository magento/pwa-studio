import fixedObserver from '../fixedObserver';

test('yields undefined', () => {
    const gen = fixedObserver(2);

    expect(gen.next()).toEqual({ value: undefined, done: false });
    expect(gen.next()).toEqual({ value: undefined, done: false });
    expect(gen.next()).toEqual({ value: undefined, done: true });
});

test('terminates if `length` is 0', () => {
    const gen = fixedObserver(0);

    expect(gen.next()).toEqual({ value: undefined, done: true });
    expect(gen.next()).toEqual({ value: undefined, done: true });
});
