import actions from '../actions';

const payload = 'FOO';
const error = new Error('BAR');

test('getCountries.toString() returns the proper action type', () => {
    expect(actions.getCountries.toString()).toBe('DIRECTORY/GET_COUNTRIES');
});

test('getCountries() returns a proper action object', () => {
    expect(actions.getCountries(payload)).toEqual({
        type: 'DIRECTORY/GET_COUNTRIES',
        payload
    });
    expect(actions.getCountries(error)).toEqual({
        type: 'DIRECTORY/GET_COUNTRIES',
        payload: error,
        error: true
    });
});
