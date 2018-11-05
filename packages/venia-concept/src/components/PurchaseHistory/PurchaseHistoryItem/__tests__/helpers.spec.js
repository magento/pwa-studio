import { processDate } from '../helpers';

test('processDate generates string representation of Date object', () => {
    const date = new Date(2017, 2, 10);

    expect(processDate(date)).toBe('March 10, 2017');
});
