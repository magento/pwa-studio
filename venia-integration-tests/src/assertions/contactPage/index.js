import { assertToastExists, assertToastMessage } from '../toast';

import {
    assertErrorMessageExists,
    assertErrorMessageContains
} from '../errorMessage';

import { successMessage, invalidEmailError } from '../../fixtures/contactPage';

export const assertSuccessToast = () => {
    assertToastExists();
    assertToastMessage(successMessage);
};

export const assertInvalidEmailErrorMessage = () => {
    assertErrorMessageExists();
    assertErrorMessageContains(invalidEmailError);
};
