export const username = 'gooston@gmail.com';

export const password = '**********';

// Need unique email for test account creation
const uuid = () => Cypress._.random(0, 1e6)
const id = uuid()
export const uniqueEmail = `${id}test@tester.com`
