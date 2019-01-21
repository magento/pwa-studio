const validators = new Map();

const keys = ['email', 'firstName', 'lastName', 'street', 'city', 'postcode', 'telephone', 'regionCode'];

for (const key of keys) {
    validators.set(key, jest.fn());
}

export default validators;
