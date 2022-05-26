import initObserver from '../initObserver';

// mock a simple observer-type generator
function* arrayObserver() {
    const array = [];

    array.push(yield);
    array.push(yield);

    return array;
}

test('starts an observer', () => {
    const gen = initObserver(arrayObserver)();

    expect(gen.next(0)).toEqual({ value: void 0, done: false });
    expect(gen.next(1)).toEqual({ value: [0, 1], done: true });
});
