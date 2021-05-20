export const createAnAccount = 'Create an Account';
export const firstName = 'John';

export const lastName = 'Doe';

export const accountPassword = '123123^q';

// Need unique email for test account creation
const uuid = () => Cypress._.random(0, 1e6);
const id = uuid();
export const accountEmail = `${id}test@example.com`;
