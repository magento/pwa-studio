import {
    accountAccess as accountAccessFixtures,
    accountInformationPage as accountInformationPageFixtures,
    homePage as homePageFixtures,
    myAccountMenu as myAccountMenuFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';
import {
    accountInformationPage as accountInformationPageActions,
    myAccountMenu as myAccountMenuActions
} from '../../../actions';
import {
    accountAccess as accountAccessAssertions,
    accountInformationPage as accountInformationPageAssertions,
    myAccountMenu as myAccountMenuAssertions
} from '../../../assertions';
import { aliasMutation } from '../../../utils/graphql-test-utils';

const {
    firstName,
    lastName,
    accountEmail,
    accountPassword,
    updatedFirstName,
    updatedLastName,
    updatedAccountPassword,
    updatedAccountEmail
} = accountAccessFixtures;
const { accountInformationEditModalTitle } = accountInformationPageFixtures;
const { accountInformationPage } = myAccountMenuFixtures;
const { homePage } = homePageFixtures;
const { hitGraphqlPath } = graphqlMockedCallsFixtures;

const {
    openAccountInformationEditModal,
    editAccountInformation,
    editAccountInformationPassword
} = accountInformationPageActions;
const { goToMyAccount } = myAccountMenuActions;

const { assertResetPasswordSuccess } = accountAccessAssertions;
const {
    assertAccountInformationHeading,
    assertAccountInformationEditButton,
    assertAccountInformationEditHeading
} = accountInformationPageAssertions;
const { assertCreateAccount, assertSignedOut } = myAccountMenuAssertions;

describe(
    'PWA-1423: verify customer account actions',
    { tags: ['@e2e', '@commerce', '@open-source', '@ci', '@authuser'] },
    () => {
        it('user should be able to create a new account and edit their information', () => {
            // Test - Create an account
            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'ChangeCustomerPassword');
                aliasMutation(req, 'CreateAccount');
                aliasMutation(req, 'createCart');
                aliasMutation(req, 'requestPasswordResetEmail');
                aliasMutation(req, 'SetCustomerInformation');
                aliasMutation(req, 'SignIn');
                aliasMutation(req, 'SignInAfterCreate');
            });

            cy.visitPage(homePage);

            cy.toggleLoginDialog();
            cy.createAccount(
                accountAccessFixtures.firstName,
                lastName,
                accountEmail,
                accountPassword
            );

            cy.wait(
                ['@gqlCreateAccountMutation', '@gqlSignInAfterCreateMutation'],
                {
                    timeout: 60000
                }
            );

            assertCreateAccount(firstName);

            // Test - Edit Account Information
            goToMyAccount(firstName, accountInformationPage);

            assertAccountInformationHeading(accountInformationPage);
            assertAccountInformationEditButton();

            openAccountInformationEditModal();
            assertAccountInformationEditHeading(
                accountInformationEditModalTitle
            );

            editAccountInformation(
                updatedFirstName,
                updatedLastName,
                updatedAccountEmail,
                accountPassword
            );

            cy.wait(['@gqlSetCustomerInformationMutation'], {
                timeout: 60000
            });

            // Test - Edit Account Information Password
            openAccountInformationEditModal();
            assertAccountInformationEditHeading(
                accountInformationEditModalTitle
            );

            editAccountInformationPassword(
                accountPassword,
                updatedAccountPassword
            );

            cy.wait(['@gqlChangeCustomerPasswordMutation'], {
                timeout: 60000
            });

            // Test - Sign Out
            cy.toggleLoginDialog();
            cy.signOutAccount();

            // Wait for page refresh
            cy.wait(5000);

            cy.wait(['@gqlcreateCartMutation'], {
                timeout: 60000
            });

            assertSignedOut();

            // Test - Reset Password
            cy.toggleLoginDialog();

            cy.resetPassword(updatedAccountEmail);

            cy.wait(['@gqlrequestPasswordResetEmailMutation'], {
                timeout: 60000
            });

            assertResetPasswordSuccess(updatedAccountEmail);

            // Close menu
            cy.toggleLoginDialog();

            // Test - Sign In with updated email and updated password
            cy.toggleLoginDialog();
            cy.signInAccount(updatedAccountEmail, updatedAccountPassword);

            cy.wait(['@gqlSignInMutation'], {
                timeout: 60000
            });

            assertCreateAccount(updatedFirstName);
        });
    }
);
