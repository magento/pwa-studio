import getQueryParameterValue from '../getQueryParameterValue';

const MOCK_LOCATION = { search: '?param=test' };

beforeAll(() => {
    // Mock a window.location.search for these tests.
    window.history.replaceState({}, 'Unit Test', '/unittest.html?query=test');
});

test('successfully returns the parameter value', () => {
    const result = getQueryParameterValue({
        location: MOCK_LOCATION,
        queryParameter: 'param'
    });

    expect(result).toBe('test');
});

test('returns an empty string if not found', () => {
    const result = getQueryParameterValue({
        location: MOCK_LOCATION,
        queryParameter: 'not_found'
    });

    expect(result).toBe('');
});

test('supplies a default location parameter', () => {
    const result = getQueryParameterValue({
        // location is intentionally not supplied.
        queryParameter: 'query'
    });

    expect(result).toBe('test');
});

test('supplies a default queryParameter parameter', () => {
    const result = getQueryParameterValue({
        // queryParameter is intentionally not supplied.
        location: MOCK_LOCATION
    });

    expect(result).toBe('');
});
