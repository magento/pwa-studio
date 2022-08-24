import { getCombinations } from '../getCombinations';

test('it return the combination of k elements in the array ', () => {
    const array = [1, 2, 3];
    const k = 2;

    expect(getCombinations(array, k)).toMatchInlineSnapshot(`
        Array [
          Array [
            1,
            2,
          ],
          Array [
            1,
            3,
          ],
          Array [
            2,
            3,
          ],
        ]
    `);
});

test('it return empty array if k is 0 ', () => {
    const array = [1, 2, 3];
    const k = 0;

    expect(getCombinations(array, k)).toMatchInlineSnapshot(`
        Array [
          Array [],
        ]
    `);
});
