import { useCallback, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import debounce from 'lodash.debounce';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import DEFAULT_OPERATIONS from './giftOptions.gql';

/**
 * This talon contains the logic for a gift options component.
 * It performs effects and returns a data object containing values for rendering the component.
 *
 * This talon performs the following effects:
 *
 * - Fetch the gift options associated with the cart
 * - Update the {@link GiftOptionsTalonProps} values with the data returned by the query
 *
 * @function
 *
 * @param {Object} props
 * @param {GiftOptionsOperations} props.operations
 *
 * @returns {GiftOptionsTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useGiftOptions } from '@magento/peregrine/lib/talons/CartPage/GiftOptions/useGiftOptions';
 */
export const useGiftOptions = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { setGiftOptionsOnCartMutation, getGiftOptionsQuery } = operations;

    const [{ cartId }] = useCartContext();

    const [
        setGiftOptionsOnCart,
        { error: setGiftOptionsOnCartError }
    ] = useMutation(setGiftOptionsOnCartMutation);
    const {
        data: getGiftOptionsData,
        error: getGiftOptionsError,
        loading
    } = useQuery(getGiftOptionsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: { cartId }
    });

    const { cart } = getGiftOptionsData || {};

    const formApiRef = useRef(null);

    const [giftMessageIsChecked, setGiftMessageIsChecked] = useState(false);
    const [showGiftMessageResult, setShowGiftMessageResult] = useState(false);
    const [savingOptions, setSavingOptions] = useState([]);

    const initialValues = useMemo(() => {
        const hasInitialGiftMessage =
            cart?.gift_message?.from.length > 0 ||
            cart?.gift_message?.to.length > 0 ||
            cart?.gift_message?.message.length > 0;

        if (formApiRef?.current?.getState()?.values === undefined) {
            setGiftMessageIsChecked(hasInitialGiftMessage);
            setShowGiftMessageResult(hasInitialGiftMessage);
        }

        return {
            cardFrom: cart?.gift_message?.from || '',
            cardTo: cart?.gift_message?.to || '',
            cardMessage: cart?.gift_message?.message || '',
            includeGiftReceipt: cart?.gift_receipt_included === true,
            includeGiftMessage: hasInitialGiftMessage,
            includePrintedCard: cart?.printed_card_included === true
        };
    }, [cart]);

    const giftMessageResult = useMemo(
        () => ({
            cardFrom: cart?.gift_message?.from || '',
            cardTo: cart?.gift_message?.to || '',
            cardMessage: cart?.gift_message?.message || ''
        }),
        [
            cart?.gift_message?.from,
            cart?.gift_message?.message,
            cart?.gift_message?.to
        ]
    );

    const printedCardPrice = cart?.prices?.gift_options?.printed_card || {};

    const hasGiftMessage =
        giftMessageResult.cardFrom.length > 0 &&
        giftMessageResult.cardTo.length > 0 &&
        giftMessageResult.cardMessage.length > 0;

    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const handleOnChange = useCallback(async () => {
        try {
            const formApi = formApiRef.current;

            if (formApi) {
                await setGiftOptionsOnCart({
                    variables: {
                        cartId,
                        giftReceiptIncluded: formApi.getValue(
                            'includeGiftReceipt'
                        ),
                        printedCardIncluded: formApi.getValue(
                            'includePrintedCard'
                        )
                    }
                });

                // Reset saving options when mutation is complete
                setSavingOptions([]);
            }
        } catch (e) {
            // Error is logged by apollo link - no need to double log.
        }
    }, [cartId, setGiftOptionsOnCart]);

    // TODO: Update mutation when backend provides the option to remove Gift Message
    const handleRemoveGiftMessage = useCallback(async () => {
        try {
            const formApi = formApiRef.current;

            if (formApi) {
                // Indicates Gift Message is currently saving
                setSavingOptions([...savingOptions, 'giftMessage']);

                // Reset form data and form errors
                formApi.setValues({
                    cardTo: '',
                    cardFrom: '',
                    cardMessage: ''
                });
                formApi.setError('cardTo');
                formApi.setError('cardFrom');
                formApi.setError('cardMessage');
                setShowGiftMessageResult(false);

                await setGiftOptionsOnCart({
                    variables: {
                        cartId,
                        giftMessage: {
                            to: '',
                            from: '',
                            message: ''
                        },
                        // Mutation requires both options to be provided
                        giftReceiptIncluded: formApi.getValue(
                            'includeGiftReceipt'
                        ),
                        printedCardIncluded: formApi.getValue(
                            'includePrintedCard'
                        )
                    }
                });

                // Reset saving options when mutation is complete
                setSavingOptions([]);
            }
        } catch (e) {
            // Error is logged by apollo link - no need to double log.
        }
    }, [cartId, savingOptions, setGiftOptionsOnCart]);

    const handleUpdateGiftMessage = useCallback(async () => {
        try {
            const formApi = formApiRef.current;

            if (formApi) {
                formApi.validate();

                if (!formApi.getState().invalid) {
                    // Indicates Gift Message is currently saving
                    setSavingOptions([...savingOptions, 'giftMessage']);

                    await setGiftOptionsOnCart({
                        variables: {
                            cartId,
                            giftMessage: {
                                to: formApi.getValue('cardTo'),
                                from: formApi.getValue('cardFrom'),
                                message: formApi.getValue('cardMessage')
                            },
                            // Mutation requires both options to be provided
                            giftReceiptIncluded: formApi.getValue(
                                'includeGiftReceipt'
                            ),
                            printedCardIncluded: formApi.getValue(
                                'includePrintedCard'
                            )
                        }
                    });

                    setShowGiftMessageResult(true);
                    // Reset saving options when mutation is complete
                    setSavingOptions([]);
                }
            }
        } catch (e) {
            // Error is logged by apollo link - no need to double log.
        }
    }, [cartId, savingOptions, setGiftOptionsOnCart]);

    const handleToggleGiftMessageIsChecked = useCallback(
        async isChecked => {
            if (!isChecked) {
                // Remove Gift Message and reset form
                await handleRemoveGiftMessage();
            }

            setGiftMessageIsChecked(prevState => !prevState);
        },
        [handleRemoveGiftMessage]
    );

    const handleToggleGiftMessageResult = useCallback(() => {
        setShowGiftMessageResult(prevState => !prevState);
    }, []);

    // Batch writes if the user inputs quickly.
    const debouncedOnChange = useMemo(
        () =>
            debounce(() => {
                handleOnChange();
            }, 500),
        [handleOnChange]
    );

    // Indicates which options are currently saving
    const updateSavingOptionsOnChange = useCallback(
        element => {
            const elementName = element.target.name;

            if (!savingOptions.includes(elementName)) {
                setSavingOptions([...savingOptions, elementName]);
            }

            debouncedOnChange();
        },
        [debouncedOnChange, savingOptions]
    );

    const giftReceiptProps = {
        field: 'includeGiftReceipt',
        onChange: updateSavingOptionsOnChange
    };

    const printedCardProps = {
        field: 'includePrintedCard',
        onChange: updateSavingOptionsOnChange
    };

    const giftMessageCheckboxProps = {
        disabled: savingOptions.includes('giftMessage'),
        field: 'includeGiftMessage',
        onValueChange: handleToggleGiftMessageIsChecked
    };

    const cardToProps = {
        disabled:
            !giftMessageIsChecked || savingOptions.includes('giftMessage'),
        field: 'cardTo',
        validate: isRequired
    };

    const cardFromProps = {
        disabled:
            !giftMessageIsChecked || savingOptions.includes('giftMessage'),
        field: 'cardFrom',
        validate: isRequired
    };

    const cardMessageProps = {
        disabled:
            !giftMessageIsChecked || savingOptions.includes('giftMessage'),
        field: 'cardMessage',
        validate: isRequired
    };

    const optionsFormProps = {
        initialValues,
        getApi: setFormApi
    };

    const editGiftMessageButtonProps = {
        disabled:
            !giftMessageIsChecked || savingOptions.includes('giftMessage'),
        priority: 'normal',
        type: 'button',
        onClick: handleToggleGiftMessageResult
    };

    const cancelGiftMessageButtonProps = {
        disabled:
            !giftMessageIsChecked || savingOptions.includes('giftMessage'),
        priority: 'low',
        type: 'button',
        onClick: handleToggleGiftMessageResult
    };

    const saveGiftMessageButtonProps = {
        disabled:
            !giftMessageIsChecked || savingOptions.includes('giftMessage'),
        priority: 'normal',
        type: 'button',
        onClick: handleUpdateGiftMessage
    };

    // Create a memoized error map and toggle individual errors when they change
    const errors = useMemo(
        () =>
            new Map([
                ['setGiftOptionsOnCartMutation', setGiftOptionsOnCartError],
                ['getGiftOptionsQuery', getGiftOptionsError]
            ]),
        [getGiftOptionsError, setGiftOptionsOnCartError]
    );

    return {
        loading,
        errors,
        savingOptions,
        giftReceiptProps,
        printedCardProps,
        printedCardPrice,
        giftMessageCheckboxProps,
        giftMessageResult,
        hasGiftMessage,
        showGiftMessageResult,
        cardToProps,
        cardFromProps,
        cardMessageProps,
        editGiftMessageButtonProps,
        cancelGiftMessageButtonProps,
        saveGiftMessageButtonProps,
        optionsFormProps
    };
};

/** JSDocs type definitions */

/**
 * Props data to use when rendering a gift options component.
 *
 * @typedef {Object} GiftOptionsTalonProps
 *
 * @property {Boolean} loading Query loading indicator.
 * @property {Object} errors Errors for GraphQl query and mutation.
 * @property {Array} savingOptions Array containing fields that are busy.
 * @property {Object} giftReceiptProps Props for the `includeGiftReceipt` checkbox element.
 * @property {Object} printedCardProps Props for the `includePrintedCard` checkbox element.
 * @property {Object} printedCardPrice Printed Card Price object.
 * @property {Object} giftMessageCheckboxProps Props for the `includeGiftMessage` checkbox element.
 * @property {Object} giftMessageResult Object containing Gift Message data.
 * @property {Boolean} hasGiftMessage Checks if Gift Message data has all fields filled.
 * @property {Boolean} showGiftMessageResult Show or hide Gift Message result.
 * @property {Object} cardToProps Props for the `cardTo` text input element.
 * @property {Object} cardFromProps Props for the `cardFrom` text input element.
 * @property {Object} cardMessageProps Props for the `cardMessage` textarea element.
 * @property {Object} editGiftMessageButtonProps Props for the Edit Gift Message button.
 * @property {Object} cancelGiftMessageButtonProps Props for the Cancel Gift Message button.
 * @property {Object} saveGiftMessageButtonProps Props for the Update Gift Message button.
 * @property {Object} optionsFormProps Props for the form element.
 */

/**
 * This is a type used by the {@link useGiftOptions} talon.
 *
 * @typedef {Object} GiftOptionsOperations
 *
 * @property {GraphQLAST} setGiftOptionsOnCartMutation sets the gift options on cart.
 * @property {GraphQLAST} getGiftOptionsQuery fetch the gift options.
 */
