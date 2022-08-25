export const createAnAccount = 'Create an Account';
export const signOut = 'Sign In';

export const firstName = 'John';
export const lastName = 'Doe';
export const accountPassword = '123123^q';

export const updatedFirstName = 'John 2';
export const updatedLastName = 'Doe 2';
export const updatedAccountPassword = '123123^q2';

// Need unique email for test account creation
const uuid = () => Cypress._.random(0, 1e6);
const id = uuid();

export const accountEmail = `${id}test@example.com`;
export const updatedAccountEmail = `${id}test2@example.com`;

export const signInFormAction = 'signIn';
export const createAccountFormAction = 'createAccount';
