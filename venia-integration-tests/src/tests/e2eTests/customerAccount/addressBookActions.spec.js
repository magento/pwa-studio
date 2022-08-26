import {
    accountAccess as accountAccessFixtures,
    addressBookPage as addressBookPageFixtures,
    homePage as homePageFixtures,
    myAccountMenu as myAccountMenuFixtures,
    graphqlMockedCalls as graphqlMockedCallsFixtures
} from '../../../fixtures';
import {
    addressBookPage as addressBookPageActions,
    myAccountMenu as myAccountMenuActions
} from '../../../actions';
import {
    addressBookPage as addressBookPageAssertions,
    myAccountMenu as myAccountMenuAssertions
} from '../../../assertions';
import { aliasMutation } from '../../../utils/graphql-test-utils';

const {
    firstName,
    lastName,
    accountEmail,
    accountPassword
} = accountAccessFixtures;
const {
    addressBookAddModalTitle,
    addressBookEditModalTitle,
    addressBookData
} = addressBookPageFixtures;
const { addressBookPage } = myAccountMenuFixtures;
const { homePage } = homePageFixtures;
const { hitGraphqlPath } = graphqlMockedCallsFixtures;

const {
    openAddressBookAddModal,
    openAddressBookEditModal,
    addEditAddressCard,
    deleteAddressCard
} = addressBookPageActions;
const { goToMyAccount } = myAccountMenuActions;

const {
    assertAddressBookHeading,
    assertAddressBookAddButton,
    assertAddressBookEmpty,
    assertAddressBookModalHeading,
    assertAddressCardCount,
    assertAddressInAddressBook,
    assertAddressIsDefault
} = addressBookPageAssertions;
const { assertCreateAccount } = myAccountMenuAssertions;

describe(
    'PWA-1421: verify customer account address book actions',
    { tags: ['@e2e', '@commerce', '@open-source', '@ci', '@authuser'] },
    () => {
        it('user should be able to update their address book', () => {
            // Test - Create an account
            cy.intercept('POST', hitGraphqlPath, req => {
                aliasMutation(req, 'AddNewCustomerAddressToAddressBook');
                aliasMutation(req, 'CreateAccount');
                aliasMutation(req, 'SignInAfterCreate');
                aliasMutation(req, 'UpdateCustomerAddressInAddressBook');
                aliasMutation(req, 'DeleteCustomerAddressFromAddressBook');
            });

            cy.visitPage(homePage);

            cy.toggleLoginDialog();
            cy.createAccount(
                accountAccessFixtures.firstName,
                lastName,
                accountEmail,
                accountPassword
            );
            // Needed to avoid intermittent call being made before cypress even starts waiting for it
            cy.wait(1000);
            cy.wait(
                ['@gqlCreateAccountMutation', '@gqlSignInAfterCreateMutation'],
                {
                    timeout: 60000
                }
            );

            assertCreateAccount(firstName);

            // Test - Add New Default Address
            goToMyAccount(firstName, addressBookPage);

            assertAddressBookHeading(addressBookPage);
            assertAddressBookEmpty();
            assertAddressBookAddButton();

            openAddressBookAddModal();
            assertAddressBookModalHeading(addressBookAddModalTitle);
            addEditAddressCard({ ...addressBookData[0], isDefault: true });

            cy.wait(['@gqlAddNewCustomerAddressToAddressBookMutation'], {
                timeout: 60000
            });

            assertAddressCardCount(1);
            assertAddressInAddressBook({ ...addressBookData[0] });
            assertAddressIsDefault({ ...addressBookData[0] });

            // Test - Add New Address
            openAddressBookAddModal();
            assertAddressBookModalHeading(addressBookAddModalTitle);
            addEditAddressCard({ ...addressBookData[1] });

            cy.wait(['@gqlAddNewCustomerAddressToAddressBookMutation'], {
                timeout: 60000
            });

            assertAddressCardCount(2);
            assertAddressInAddressBook({ ...addressBookData[1] });

            // Test - Edit Address
            openAddressBookEditModal(1);
            assertAddressBookModalHeading(addressBookEditModalTitle);
            addEditAddressCard({ isDefault: true });

            cy.wait(['@gqlUpdateCustomerAddressInAddressBookMutation'], {
                timeout: 60000
            });

            assertAddressIsDefault({ ...addressBookData[1] });

            // Test - Delete Address
            deleteAddressCard({ ...addressBookData[0] });

            cy.wait(['@gqlDeleteCustomerAddressFromAddressBookMutation'], {
                timeout: 60000
            });

            assertAddressCardCount(1);
            assertAddressIsDefault({ ...addressBookData[1] });
        });
    }
);
