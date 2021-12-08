import { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';

import useScript from '@magento/peregrine/lib/hooks/useScript';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './googleReCaptchaConfig.gql';

const GOOGLE_RECAPTCHA_HEADER = 'X-ReCaptcha';
const GOOGLE_RECAPTCHA_URL = 'https://www.google.com/recaptcha/api.js';

/**
 * Returns props necessary to attach Google ReCaptcha V3 to a form.
 *
 * @function
 *
 * @param {String} props.currentForm - form name to compare with backend
 * @param {Object} [props.operations] - GraphQL operations to be run by the hook.
 *
 * @returns {GoogleReCaptchaProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useGoogleReCaptcha } from '@magento/peregrine/lib/hooks/useGoogleReCaptcha';
 */
export const useGoogleReCaptcha = props => {
    const operations = mergeOperations(defaultOperations, props.operations);
    const { currentForm } = props;

    const {
        data: configData,
        error: configError,
        loading: configLoading
    } = useQuery(operations.getReCaptchaV3ConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const [isGenerating, setIsGenerating] = useState(false);

    const recaptchaBadge = configData?.recaptchaV3Config?.badge_position || '';
    const recaptchaKey = configData?.recaptchaV3Config?.website_key || '';
    const recaptchaLang = configData?.recaptchaV3Config?.language_code || '';
    const activeForms = configData?.recaptchaV3Config?.forms || [];
    const isEnabled =
        !(configError instanceof Error) &&
        recaptchaKey.length > 0 &&
        activeForms.includes(currentForm);

    // Set API when available
    const grecaptchaApi = globalThis?.grecaptcha;

    // Construct script url with configs
    const scriptUrl = new URL(GOOGLE_RECAPTCHA_URL);

    if (recaptchaKey.length > 0) {
        scriptUrl.searchParams.append('render', recaptchaKey);
    }
    if (recaptchaLang.length > 0) {
        scriptUrl.searchParams.append('hl', recaptchaLang);
    }
    if (recaptchaBadge.length > 0) {
        scriptUrl.searchParams.append('badge', recaptchaBadge);
    }

    // Load Script only if the API is not already set, if the key is set
    // and if the current form is enabled in the V3 configs
    const status = useScript(!grecaptchaApi && isEnabled ? scriptUrl : null);

    // Wait for config to be loaded and script to be ready
    const isLoading =
        configLoading || (isEnabled && !grecaptchaApi && status !== 'ready');

    // Generate the object that will be sent with the request
    const generateReCaptchaData = useCallback(async () => {
        if (isEnabled) {
            try {
                setIsGenerating(true);

                const result = {
                    // TODO: Use Apollo Link middleware when solution is found
                    context: {
                        headers: {
                            [GOOGLE_RECAPTCHA_HEADER]: await globalThis.grecaptcha.execute(
                                recaptchaKey,
                                {
                                    action: currentForm
                                }
                            )
                        }
                    }
                };

                setIsGenerating(false);

                return result;
            } catch (error) {
                // Log API error
                console.error(error);

                setIsGenerating(false);
            }
        }

        return {};
    }, [currentForm, isEnabled, recaptchaKey]);

    return {
        generateReCaptchaData,
        isGenerating,
        isLoading
    };
};

/** JSDocs type definitions */

/**
 * Object type returned by the {@link useGoogleReCaptcha} hook.
 * It provides props data to use when attaching Google ReCaptcha V3 to a form.
 *
 * @typedef {Object} GoogleReCaptchaProps
 *
 * @property {Function} generateReCaptchaData - The function to generate ReCaptcha Mutation data.
 * @property {Boolean} isGenerating - Indicates if hook is generating Mutation data.
 * @property {Boolean} isLoading - Indicates if hook is loading data and script.
 */
