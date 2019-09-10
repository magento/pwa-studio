import { Magento2 } from '../../../../RestApi';
import actions from '../actions';
import { getCountries } from '../asyncActions';

jest.mock('../../../../RestApi');

const { request } = Magento2;
const dispatch = jest.fn();
const getState = jest.fn(() => ({}));
const thunkArgs = [dispatch, getState];

test('getCountries() to return a thunk', () => {
    expect(getCountries()).toBeInstanceOf(Function);
});

test('getCountries thunk returns undefined', async () => {
    const thunk = getCountries();

    await expect(thunk(...thunkArgs)).resolves.toBeUndefined();
});

test('getCountries thunk does nothing if data is present', async () => {
    getState.mockImplementationOnce(() => ({
        directory: {
            countries: []
        }
    }));

    await getCountries()(...thunkArgs);

    expect(request).not.toHaveBeenCalled();
});

test('getCountries thunk requests API data', async () => {
    await getCountries()(...thunkArgs);

    expect(request).toHaveBeenCalled();
});

test('getCountries thunk dispatches actions on success', async () => {
    const response = 'FOO';

    getState.mockImplementationOnce(() => ({
        directory: {}
    }));

    request.mockResolvedValueOnce(response);
    await getCountries()(...thunkArgs);

    expect(dispatch).toHaveBeenCalledWith(actions.getCountries(response));
    expect(dispatch).toHaveBeenCalledTimes(1);
});

test('getCountries thunk dispatches actions on failure', async () => {
    const error = new Error('BAR');

    getState.mockImplementationOnce(() => ({
        directory: {}
    }));

    request.mockRejectedValueOnce(error);
    await getCountries()(...thunkArgs);

    expect(dispatch).toHaveBeenCalledWith(actions.getCountries(error));
    expect(dispatch).toHaveBeenCalledTimes(1);
});
