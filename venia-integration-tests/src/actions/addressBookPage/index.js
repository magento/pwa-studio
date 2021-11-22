import {
    addressBookAddButton,
    addressBookModalFirstNameTextField,
    addressBookModalMiddleNameTextField,
    addressBookModalLastNameTextField,
    addressBookModalCountrySelectField,
    addressBookModalStreet1TextField,
    addressBookModalStreet2TextField,
    addressBookModalCityTextField,
    addressBookModalRegionSelectField,
    addressBookModalRegionTextField,
    addressBookModalPostCodeTextField,
    addressBookModalTelephoneTextField,
    addressBookModalDefaultCheckboxField,
    addressBookModalSubmitButton,
    addressCardRoot,
    addressCardEditButton,
    addressCardDeleteButton,
    addressCardConfirmDeleteButton
} from '../../fields/addressBookPage';

/**
 * Utility function to open Address Book Add Modal
 */
export const openAddressBookAddModal = () => {
    cy.get(addressBookAddButton).click();
};

/**
 * Utility function to open Address Book Edit Modal
 *
 * @param {Number} addressPosition address position
 */
export const openAddressBookEditModal = addressPosition => {
    cy.get(addressCardRoot)
        .eq(addressPosition)
        .find(addressCardEditButton)
        .click();
};

/**
 * Utility function to add/edit an Address
 *
 * @param {Object} data address data
 * @param {String} [data.firstName] first name
 * @param {String} [data.middleName] middle name
 * @param {String} [data.lastName] last name
 * @param {String} [data.countryCode] country code
 * @param {String} [data.street1] street 1
 * @param {String} [data.street2] street 2
 * @param {String} [data.city] city
 * @param {String} [data.regionId] region id
 * @param {String} [data.region] region text
 * @param {String} [data.postCode] postal code
 * @param {String} [data.telephone] phone number
 * @param {Boolean} [data.isDefault] is default shipping address
 */
export const addEditAddressCard = ({
    firstName,
    middleName,
    lastName,
    countryCode,
    street1,
    street2,
    city,
    regionId,
    region,
    postCode,
    telephone,
    isDefault = false
}) => {
    if (firstName) {
        cy.get(addressBookModalFirstNameTextField)
            .clear()
            .type(firstName);
    }

    if (middleName) {
        cy.get(addressBookModalMiddleNameTextField)
            .clear()
            .type(middleName);
    }

    if (lastName) {
        cy.get(addressBookModalLastNameTextField)
            .clear()
            .type(lastName);
    }

    if (countryCode) {
        cy.get(addressBookModalCountrySelectField).select(countryCode);
    }

    if (street1) {
        cy.get(addressBookModalStreet1TextField)
            .clear()
            .type(street1);
    }

    if (street2) {
        cy.get(addressBookModalStreet2TextField)
            .clear()
            .type(street2);
    }

    if (city) {
        cy.get(addressBookModalCityTextField)
            .clear()
            .type(city);
    }

    if (regionId) {
        cy.get(addressBookModalRegionSelectField)
            .should('not.be.disabled')
            .select(regionId);
    } else if (region) {
        cy.get(addressBookModalRegionTextField)
            .should('not.be.disabled')
            .clear()
            .type(region);
    }

    if (postCode) {
        cy.get(addressBookModalPostCodeTextField)
            .clear()
            .type(postCode);
    }

    if (telephone) {
        cy.get(addressBookModalTelephoneTextField)
            .clear()
            .type(telephone);
    }

    if (isDefault) {
        cy.get(addressBookModalDefaultCheckboxField).check();
    } else {
        cy.get(addressBookModalDefaultCheckboxField).uncheck();
    }

    cy.get(addressBookModalSubmitButton).click();
};

/**
 * Utility function to delete an Address
 *
 * @param {Object} data address data
 * @param {String} data.firstName first name
 * @param {String} [data.middleName] middle name
 */
export const deleteAddressCard = ({ firstName, middleName, lastName }) => {
    const fullName = middleName
        ? `${firstName} ${middleName} ${lastName}`
        : `${firstName} ${lastName}`;

    cy.get(addressCardRoot)
        .should('exist')
        .contains(addressCardRoot, fullName)
        .find(addressCardDeleteButton)
        .click();

    cy.get(addressCardRoot)
        .should('exist')
        .contains(addressCardRoot, fullName)
        .find(addressCardConfirmDeleteButton)
        .click();
};
