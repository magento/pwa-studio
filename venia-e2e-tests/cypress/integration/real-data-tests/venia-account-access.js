/// <reference types="cypress" />

context('Assert User account Create, Sign-In, Sign-out', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    describe('Verify user account related actions', () => {
        // Need unique email ID for each test
        const uuid = () => Cypress._.random(0, 1e6)
        const id = uuid()
        const testname = `${id}test@tester.com`
        it('.should() - make an assertion about the account creation is success', () => {
            // Next two lines are just try to wait till page is fully loaded, else the click will happen when page is still loading causes overlay to close and test fails.
            cy.get('[class^="slider-bannerWrapper-"]').eq(0).invoke('attr', 'style').should('contain', 'background-image: url("/media/venia-hero1.jpg?auto=webp&format=pjpg&quality=85")')
            cy.get('*[class^="slider-bannerWrapper-"]').eq(1).invoke('attr', 'style').should('contain', 'background-image: url("/media/venia-hero2.jpg?auto=webp&format=pjpg&quality=85")')
            cy.get('button[class^="accountTrigger-trigger-"]').click()
            cy.get('[class^="button-content-"]').contains('Create an Account').click()
            cy.get('input[name="customer.firstname"]').type('John')
            cy.get('input[name="customer.lastname"]').type('Doe')
            cy.get('input[name="customer.email"]').type(testname);
            cy.get('input[name="password"]').type('123123^q');
            cy.get('[class^="createAccount-submitButton-"]').contains('Create an Account').click()
            cy.get('button[class^="accountTrigger-trigger-"]').contains('Hi, John')
            cy.get('button[class^="accountTrigger-trigger-"]').click()
            cy.get('button[class^="accountMenuItems-signOut-"]').click()
            cy.get('button[class^="accountTrigger-trigger-"]').contains('Sign In')
        })

        it('.should() - make an assertion about the account sign in is success', () => {
            cy.get('button[class^="accountTrigger-trigger-"]').click()
            cy.get('input[name="email"]').type(testname);
            cy.get('input[name="password"]').type('123123^q');
            cy.get('[class^="button-root_highPriority-"]').contains('Sign In').click()
            cy.get('button[class^="accountTrigger-trigger-"]').contains('Hi, John')
            cy.get('button[class^="accountMenuItems-signOut-"]').click()
            cy.get('button[class^="accountTrigger-trigger-"]').contains('Sign In')
        })

        it('.should() - make an assertion about the forgot password', () => {
            cy.get('button[class^="accountTrigger-trigger-"]').click()
            cy.get('[class^="button-content-"]').contains('Forgot Password?').click()
            cy.get('input[name="email"]').type(testname);
            cy.get('[class^="forgotPasswordForm-submitButton-"]').contains('Submit').click()
            cy.get('[class^="formSubmissionSuccessful-text-"]').should('contain', `If there is an account associated with ${testname} you will receive an email with a link to change your password.`)

        })

    })
})