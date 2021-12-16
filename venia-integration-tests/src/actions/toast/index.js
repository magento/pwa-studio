import {
    toastActionButton,
    toastDismissActionButton
} from '../../fields/toast';

/**
 * Utility function to click on toast action when present on ToastContainer
 */
export const clickOnToastAction = () => {
    cy.get(toastActionButton).click();
};

/**
 * Utility function to click on toast dismiss action when present on ToastContainer
 */
export const clickOnDismissToastAction = () => {
    cy.get(toastDismissActionButton).click();
};
