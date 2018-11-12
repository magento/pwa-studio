import { processDate } from '../helpers';

test('processDate generates string representation of Date object', () => {
    const date = new Date(1542027090628);

    expect(processDate(date)).toBe('November 12, 2018');
});
