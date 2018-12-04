import { processDate } from '../helpers';

test('processDate generates string representation of Date object', () => {
    const date = Date.now();

    expect(typeof processDate(date)).toBe('string');
});
