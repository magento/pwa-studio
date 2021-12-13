import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { useGoogleReCaptcha } from '@magento/peregrine/lib/hooks/useGoogleReCaptcha';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './resetPassword.gql';

/**
 * Returns props necessary to render a ResetPassword form.
 *
 * @param {Object} [props.operations] - GraphQL operations to be run by the hook.
 *
 * @returns {ResetPasswordProps} - GraphQL mutations for the reset password form.
 *
 * @example <caption>Importing into your project</caption>
 * import { useResetPassword } from '@magento/peregrine/lib/talons/MyAccount/useResetPassword.js';
 */
export const useResetPassword = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);

    const [hasCompleted, setHasCompleted] = useState(false);
    const location = useLocation();
    const [
        resetPassword,
        { error: resetPasswordErrors, loading }
    ] = useMutation(operations.resetPasswordMutation);

    const {
        recaptchaLoading,
        generateReCaptchaData,
        recaptchaWidgetProps
    } = useGoogleReCaptcha({
        currentForm: 'CUSTOMER_FORGOT_PASSWORD',
        formAction: 'resetPassword'
    });

    const searchParams = useMemo(() => new URLSearchParams(location.search), [
        location
    ]);
    const token = searchParams.get('token');

    const handleSubmit = useCallback(
        async ({ email, newPassword }) => {
            try {
                if (email && token && newPassword) {
                    const reCaptchaData = await generateReCaptchaData();

                    await resetPassword({
                        variables: { email, token, newPassword },
                        ...reCaptchaData
                    });

                    setHasCompleted(true);
                }
            } catch (err) {
                // Error is logged by apollo link - no need to double log.

                setHasCompleted(false);
            }
        },
        [generateReCaptchaData, resetPassword, token]
    );

    return {
        isBusy: loading || recaptchaLoading,
        formErrors: [resetPasswordErrors],
        recaptchaWidgetProps,
        handleSubmit,
        hasCompleted,
        token
    };
};

/** JSDocs type definitions */

/**
 * Object type returned by the {@link useResetPassword} talon.
 * It provides props data to use when rendering the reset password form component.
 *
 * @typedef {Object} ResetPasswordProps
 *
 * @property {Boolean} isBusy True if form awaits events. False otherwise
 * @property {Array} formErrors A list of form errors
 * @property {Object} recaptchaWidgetProps Props for the GoogleReCaptcha component
 * @property {Function} handleSubmit Callback function to handle form submission
 * @property {Boolean} hasCompleted True if password reset mutation has completed. False otherwise
 * @property {String} token token needed for password reset, will be sent in the mutation
 */
