import { assertToastExists, assertToastMessage } from '../toast';

import { successMessage } from '../../fixtures/contactPage';

export const assertSuccessToast = () => {
    assertToastExists();
    assertToastMessage(successMessage);
};
