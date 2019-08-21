import { emptyData } from '../items';

// no render tests for now, since enzyme doesn't support React Fragment yet
// see https://github.com/airbnb/enzyme/issues/1213

test('emptyData contains only nulls', () => {
    expect(emptyData.every(v => v === null)).toBe(true);
});
