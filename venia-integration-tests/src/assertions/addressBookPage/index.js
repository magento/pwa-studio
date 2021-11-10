import {
    addressBookPageHeading,
    addressBookAddButton,
    addressBookContent,
    addressCardRoot,
    addressCardContentContainer,
    addressCardDefaultBadge,
    addressBookModalTitle
} from '../../fields/addressBookPage';

/**
 * Utility function to assert Address Book Add Button exists
 */
export const assertAddressBookAddButton = () => {
    cy.get(addressBookAddButton).should('exist');
};

/**
 * Utility function to assert Address Book Page is empty
 */
export const assertAddressBookEmpty = () => {
    cy.get(addressCardRoot).should('not.exist');
};

/**
 * Utility function to assert Address Book Page
 *
 * @param {String} headerText header text
 */
export const assertAddressBookHeading = headerText => {
    cy.get(addressBookPageHeading).should('contain', headerText);
};

/**
 * Utility function to assert Address Book Modal
 *
 * @param {String} modalText modal text
 */
export const assertAddressBookModalHeading = modalText => {
    cy.get(addressBookModalTitle).should('contain', modalText);
};

/**
 * Utility function to assert Address Card Count
 *
 * @param {Number} count card count
 */
export const assertAddressCardCount = count => {
    cy.get(addressBookContent).within($addressBookContent => {
        cy.wrap($addressBookContent)
            .get(addressCardRoot)
            .should('have.length', count);
    });
};

/**
 * Utility function to assert Address is in Address Book
 *
 * @param {Object} data address data
 * @param {String} data.firstName first name
 * @param {String} [data.middleName] middle name
 * @param {String} data.lastName last name
 * @param {String} data.street1 street 1
 * @param {String} [data.street2] street 2
 * @param {String} data.city city
 * @param {String} data.postCode postal code
 * @param {String} data.telephone phone number
 */
export const assertAddressInAddressBook = ({
    firstName,
    middleName,
    lastName,
    street1,
    street2,
    city,
    postCode,
    telephone
}) => {
    const fullName = middleName
        ? `${firstName} ${middleName} ${lastName}`
        : `${firstName} ${lastName}`;

    cy.get(addressCardContentContainer).should('contain', fullName);
    cy.get(addressCardContentContainer).should('contain', street1);
    cy.get(addressCardContentContainer).should('contain', street1);
    if (street2) {
        cy.get(addressCardContentContainer).should('contain', street2);
    }
    cy.get(addressCardContentContainer).should('contain', city);
    cy.get(addressCardContentContainer).should('contain', postCode);
    cy.get(addressCardContentContainer).should('contain', telephone);
};

/**
 * Utility function to assert Address is set as default
 *
 * @param {Object} data address data
 * @param {String} data.firstName first name
 * @param {String} [data.middleName] middle name
 */
export const assertAddressIsDefault = ({ firstName, middleName, lastName }) => {
    const fullName = middleName
        ? `${firstName} ${middleName} ${lastName}`
        : `${firstName} ${lastName}`;

    cy.get(addressCardRoot)
        .should('exist')
        .and('contain', fullName)
        .find(addressCardDefaultBadge)
        .should('exist');
};
