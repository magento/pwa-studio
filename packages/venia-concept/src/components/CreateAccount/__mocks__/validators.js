const validators = new Map();
const asyncValidators = new Map();

const keys = ['confirm', 'email', 'firstName', 'lastName', 'password'];

for (const key of keys) {
    validators.set(key, jest.fn());
}

asyncValidators.set('email', jest.fn());

export { asyncValidators, validators };
