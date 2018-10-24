import {
    queryStringToObject,
    objectToQueryString
} from '../queryStringHelpers';

const params = { param1: 'value1', param2: 'value2' };
const queryString = '?param1=value1&param2=value2';

test('objectToQueryString generates query string from params object', () => {
    expect(objectToQueryString(params)).toBe(queryString);
});

test('queryStringToObject parses query string and returns params object', () => {
    expect(queryStringToObject(queryString)).toEqual(params);
});
