import { getCreateAccountInitialValues } from '../helpers';

const email = 'roni_cost@example.com';
const firstName = 'Veronica';
const lastName = 'Costello';
const invalidParameter = 'invalid';

test('getCreateAccountInitialValues takes initial values from search string', () => {
    const search = `?${new URLSearchParams({ email, firstName, lastName })}`;
    expect(getCreateAccountInitialValues(search)).toEqual({
        email,
        firstName,
        lastName
    });
});

test('getCreateAccountInitialValues filters values from search string', () => {
    const search = `?${new URLSearchParams({
        email,
        firstName,
        lastName,
        invalidParameter
    })}`;

    expect(getCreateAccountInitialValues(search)).not.toHaveProperty(
        'invalidParameter'
    );
});
