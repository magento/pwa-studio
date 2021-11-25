import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';

import { useGoogleReCaptcha } from '@magento/peregrine/lib/hooks/useGoogleReCaptcha';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './forgotPassword.gql';

/**
 * Returns props necessary to render a ForgotPassword form.
 *
 * @function
 *
 * @param {Function} props.onCancel - callback function to call when user clicks the cancel button
 * @param {Object} [props.operations] - GraphQL operations to be run by the talon.
 *
 * @returns {ForgotPasswordProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useForgotPassword } from '@magento/peregrine/lib/talons/ForgotPassword/useForgotPassword.js';
 */
export const useForgotPassword = props => {
    const operations = mergeOperations(defaultOperations, props.operations);
    const { onCancel } = props;

    const [hasCompleted, setCompleted] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState(null);

    const [
        requestResetEmail,
        { error: requestResetEmailError, loading: isResettingPassword }
    ] = useMutation(operations.requestPasswordResetEmailMutation);

    const {
        generateReCaptchaData,
        isGenerating: recaptchaIsGenerating,
        isLoading: recaptchaIsLoading
    } = useGoogleReCaptcha({
        currentForm: 'CUSTOMER_FORGOT_PASSWORD'
    });

    const handleFormSubmit = useCallback(
        async ({ email }) => {
            try {
                const reCaptchaData = generateReCaptchaData();

                await requestResetEmail({
                    variables: { email },
                    ...reCaptchaData
                });

                setForgotPasswordEmail(email);
                setCompleted(true);
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setCompleted(false);
            }
        },
        [generateReCaptchaData, requestResetEmail]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const formProps = {
        isBusy:
            isResettingPassword || recaptchaIsGenerating || recaptchaIsLoading,
        onSubmit: handleFormSubmit,
        onCancel: handleCancel
    };

    return {
        forgotPasswordEmail,
        formErrors: [requestResetEmailError],
        hasCompleted,
        formProps
    };
};

/** JSDocs type definitions */

/**
 * Object type returned by the {@link useForgotPassword} talon.
 * It provides props data to use when rendering the forgot password form component.
 *
 * @typedef {Object} ForgotPasswordProps
 *
 * @property {String} forgotPasswordEmail email address of the user whose password reset has been requested
 * @property {Array} formErrors A list of form errors
 * @property {Boolean} hasCompleted True if password reset mutation has completed. False otherwise
 * @property {Object} formProps Form props
 * @property {Boolean} formProps.isBusy True if form awaits events. False otherwise
 * @property {Function} formProps.onSubmit Callback function to handle form submission
 * @property {Function} formProps.onCancel Callback function to handle form cancellations
 */
