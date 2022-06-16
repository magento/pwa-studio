import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useIntl } from 'react-intl';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useToasts } from '@magento/peregrine';
import DEFAULT_OPERATIONS from '../query/orderIncidences.gql';

export const useOrderIncidences = props => {
    const { orderNumber } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCustomerOrdersQuery, sendIncidenceEmail } = operations;

    const [, { addToast }] = useToasts();
    const [incidencesImages, setIncidencesImages] = useState({});

    const displayMessage = (type, message, time = 5000) => {
        addToast({
            type: type,
            message: message,
            timeout: time
        });
    };

    const { data: orderData, error: getOrderError, loading: orderLoading } = useQuery(getCustomerOrdersQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            filter: {
                number: {
                    match: orderNumber
                }
            }
        }
    });

    const [
        sendIncidenceEmailAction,
        { data: sendIncidenceEmailData, error: sendIncidenceEmailError, loading: sendIncidenceEmailLoading }
    ] = useMutation(sendIncidenceEmail);

    const orderItems = useMemo(() => {
        if (orderData) {
            return orderData.customer.orders.items[0].items;
        }
        return null;
    }, [orderData]);

    const { formatMessage } = useIntl();

    const [isDisabledBtn, setIsDisabledBtn] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const formErrors = [];

    const initalId = 1;

    const incidencesInfo = {
        id: initalId,
        reference: null,
        variant: null,
        description: null,
        units: null,
        images: null
    };

    const [incidences, setIncidences] = useState([incidencesInfo]);

    const handleSendEmail = useCallback(
        async formValues => {
            try {
                setIsDisabledBtn(true);
                setErrorMsg(null);
                setError(false);
                setSuccessMsg(null);

                var json = JSON.stringify(formValues);

                const incidencesToEmail = [];

                var looperId = 1;

                var reference, description, units;
                JSON.parse(json.toString(), function(key, value) {
                    if (key == 'reference' + looperId) {
                        reference = value;
                    } else if (key == 'units' + looperId) {
                        units = value;
                    } else if (key == 'description' + looperId) {
                        description = value;
                        var incidenceInfo = {
                            id: looperId,
                            reference: reference,
                            description: description,
                            units: parseInt(units),
                            images: null
                        };
                        incidencesToEmail.push(incidenceInfo);
                        looperId++;
                    }
                });

                await incidencesToEmail.forEach((incidence, incidenceKey) => {
                    if (incidencesImages != null && incidencesImages['images' + incidence.id] != null) {
                        var files = incidencesImages['images' + incidence.id].values;
                        var paramsFiles = [];
                        if (files.length > 0) {
                            files.forEach((file, key) => {
                                var reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = function() {
                                    paramsFiles.push({
                                        base64: reader.result,
                                        lastModified: file.lastModified,
                                        name: file.name,
                                        size: file.size,
                                        type: file.type,
                                        webkitRelativePath: file.webkitRelativePath
                                    });
                                };
                            });
                        }
                        incidencesToEmail[incidenceKey].images = paramsFiles;
                    }
                });

                const params = {
                    order_number: orderNumber,
                    name: formValues.name,
                    email: formValues.email,
                    phone: formValues.phone,
                    incidences: incidencesToEmail
                };

                setTimeout(() => {
                    sendIncidenceEmailAction({
                        variables: {
                            input: params
                        }
                    }).then(response => {
                        const {
                            data: {
                                orderIncidencesEmail: { message, status }
                            }
                        } = response;
                        if (status) {
                            setSuccessMsg(message);
                            displayMessage('success', message);
                        } else {
                            setError(true);
                            setErrorMsg(message);
                            displayMessage('error', message);
                        }
                        setIsDisabledBtn(false);
                    });
                }, 1000);
            } catch (error) {
                setIsDisabledBtn(false);
            }
        },
        [incidencesImages]
    );

    function handleAddNewInsurance() {
        incidencesInfo.id = incidences[incidences.length - 1].id + initalId;
        setIncidences(prev => [...prev, incidencesInfo]);
    }

    if (error) {
        formErrors.push(
            new Error(
                formatMessage({
                    id: 'checkoutPage.createAccountBeCustomer',
                    defaultMessage: errorMsg
                })
            )
        );
    }

    const isLoading = orderLoading || sendIncidenceEmailLoading ? true : false;

    return {
        isLoading,
        successMsg,
        formErrors,
        isDisabledBtn,
        incidences: incidences,
        orderItems,
        incidencesImages: incidencesImages,
        setIncidencesImages,
        handleSendEmail,
        handleAddNewInsurance
    };
};
