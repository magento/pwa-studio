import M2ApiResponseError from '../M2ApiResponseError';

test('pretty prints a JSON response', () => {
    const { message } = new M2ApiResponseError({
        method: 'GET',
        path: 'bad-path',
        res: {
            status: 500,
            statusText: 'Just the worst'
        },
        bodyText: JSON.stringify({
            message: 'Server error 1',
            trace: 'Server error 1 trace'
        })
    });
    expect(message).toMatchSnapshot();
});

test('handles random extra properties', () => {
    const { message } = new M2ApiResponseError({
        method: 'GET',
        path: 'bad-path',
        res: {
            status: 500,
            statusText: 'Just the worst'
        },
        bodyText: JSON.stringify({
            message: 'Server error 1',
            trace: 'Server error 1 trace',
            randomProp: 12
        })
    });
    expect(message).toMatchSnapshot();
});
