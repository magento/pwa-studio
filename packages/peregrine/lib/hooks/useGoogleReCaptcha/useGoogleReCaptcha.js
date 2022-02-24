import { useCallback, useEffect, useState } from 'react';
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
 * @param {String} props.currentForm - Form name to match GraphQl ReCaptchaFormEnum.
 * @param {String} props.formAction - Action name to use for logging in API.
 * @param {Object} [props.operations] - GraphQL operations to be run by the hook.
 *
 * @returns {GoogleReCaptchaProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useGoogleReCaptcha } from '@magento/peregrine/lib/hooks/useGoogleReCaptcha';
 */
export const useGoogleReCaptcha = props => {
    const operations = mergeOperations(defaultOperations, props.operations);
    const { currentForm, formAction } = props;

    const {
        data: configData,
        error: configError,
        loading: configLoading
    } = useQuery(operations.getReCaptchaV3ConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    if (!globalThis['recaptchaCallbacks']) {
        globalThis['recaptchaCallbacks'] = {};
    }
    const [apiIsReady, setApiIsReady] = useState(
        globalThis.hasOwnProperty('grecaptcha')
    );
    const [isGenerating, setIsGenerating] = useState(false);
    const [widgetId, setWidgetId] = useState(null);

    // Container Reference to be used for the GoogleReCaptcha component
    const [inlineContainer, setInlineContainer] = useState(null);

    // callback to update container element ref in case of mount/unmount
    const updateInlineContainerRef = useCallback(node => {
        if (node !== null) {
            setInlineContainer(node);
        }
    }, []);

    const recaptchaBadge =
        configData?.recaptchaV3Config?.badge_position &&
        configData.recaptchaV3Config.badge_position.length > 0
            ? configData.recaptchaV3Config.badge_position
            : 'bottomright';
    const recaptchaKey = configData?.recaptchaV3Config?.website_key;
    const recaptchaLang = configData?.recaptchaV3Config?.language_code;
    const activeForms = configData?.recaptchaV3Config?.forms || [];
    const isEnabled =
        !(configError instanceof Error) &&
        recaptchaKey &&
        recaptchaKey.length > 0 &&
        activeForms.includes(currentForm);

    // Determine which type of badge should be loaded
    const isInline = recaptchaBadge === 'inline';

    // Construct script url with configs
    const scriptUrl = new URL(GOOGLE_RECAPTCHA_URL);

    scriptUrl.searchParams.append('badge', recaptchaBadge);

    // Render separate widgets with GoogleReCaptcha component when inline
    scriptUrl.searchParams.append(
        'render',
        isInline ? 'explicit' : recaptchaKey
    );
    scriptUrl.searchParams.append('onload', 'onloadRecaptchaCallback');

    if (recaptchaLang && recaptchaLang.length > 0) {
        scriptUrl.searchParams.append('hl', recaptchaLang);
    }

    // Load Script only if the API is not already set, if the key is set
    // and if the current form is enabled in the V3 configs
    const status = useScript(!apiIsReady && isEnabled ? scriptUrl : null);

    // Wait for config to be loaded and script to be ready
    const isLoading =
        configLoading || (isEnabled && !apiIsReady && status !== 'ready');

    // Render inline widget manually
    useEffect(() => {
        // Only render if container is set and API is available
        if (
            inlineContainer !== null &&
            isInline &&
            apiIsReady &&
            widgetId === null
        ) {
            // Avoid loading twice if already rendered
            if ('widgetId' in inlineContainer.dataset) {
                setWidgetId(inlineContainer.dataset.widgetId);
            } else {
                const id = globalThis.grecaptcha.render(inlineContainer, {
                    sitekey: recaptchaKey,
                    size: 'invisible'
                });

                setWidgetId(id);
                inlineContainer.dataset.widgetId = id;
            }
        }
    }, [apiIsReady, isInline, recaptchaKey, widgetId, inlineContainer]);

    // Callback sets API as ready
    if (!globalThis['recaptchaCallbacks'][formAction] && isEnabled) {
        globalThis['recaptchaCallbacks'][formAction] = () => {
            // Update non inline styles
            if (!isInline) {
                const floatingBadge = document.getElementsByClassName(
                    'grecaptcha-badge'
                );

                if (floatingBadge && floatingBadge.length > 0) {
                    floatingBadge[0].style.zIndex = 999;
                }
            }

            setApiIsReady(true);
        };
    }

    // Callback loops through each instance and set API as ready
    globalThis['onloadRecaptchaCallback'] = useCallback(() => {
        for (const key in globalThis['recaptchaCallbacks']) {
            globalThis['recaptchaCallbacks'][key]();
        }
        // Reset value after
        globalThis['recaptchaCallbacks'] = {};
    }, []);

    // Generate the object that will be sent with the request
    const generateReCaptchaData = useCallback(async () => {
        if (apiIsReady) {
            try {
                setIsGenerating(true);

                const token = await globalThis.grecaptcha.execute(
                    isInline ? widgetId : recaptchaKey,
                    {
                        action: formAction
                    }
                );

                const result = {
                    // TODO: Use Apollo Link middleware when solution is found
                    context: {
                        headers: {
                            [GOOGLE_RECAPTCHA_HEADER]: token
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
    }, [apiIsReady, formAction, isInline, recaptchaKey, widgetId]);

    const recaptchaWidgetProps = {
        containerElement: updateInlineContainerRef,
        shouldRender: !!(isEnabled && isInline && apiIsReady)
    };

    return {
        recaptchaLoading: isGenerating || isLoading,
        generateReCaptchaData,
        recaptchaWidgetProps
    };
};

/** JSDocs type definitions */

/**
 * Object type returned by the {@link useGoogleReCaptcha} hook.
 * It provides props data to use when attaching Google ReCaptcha V3 to a form.
 *
 * @typedef {Object} GoogleReCaptchaProps
 *
 * @property {Boolean} recaptchaLoading - Indicates if hook is loading data or loading the script.
 * @property {Function} generateReCaptchaData - The function to generate ReCaptcha Mutation data.
 * @property {Object} recaptchaWidgetProps - Props for the GoogleReCaptcha component.
 * @property {Function} recaptchaWidgetProps.containerElement - Container reference callback.
 * @property {Boolean} recaptchaWidgetProps.shouldRender - Checks if component should be rendered.
 */
