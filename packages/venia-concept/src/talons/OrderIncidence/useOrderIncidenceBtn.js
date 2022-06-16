import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import DEFAULT_OPERATIONS from './orderIncidence.gql.js';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useToasts } from '@magento/peregrine';

const createParams = (form, files, orderNumber) => {
    let params = {
        order_number: orderNumber,
        name: form.name,
        email: form.email,
        phone: form.telephone,
        indices: []
    };
    if (form.description) {
        form.description.forEach((value, key) => {
            params.indices[key] = {
                description: value,
                image: files[key]
            };
        });
    }
    return params;
};

export const useOrderIncidenceBtn = props => {
    const { orderNumber } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const [, { addToast }] = useToasts();
    const fileTypes = ['JPG', 'PNG'];
    const [indices, setIndices] = useState([{ des: '' }]);
    const [files, setFiles] = useState([]);

    const displayMessage = (type, message, time = 5000) => {
        addToast({
            type: type,
            message: message,
            timeout: time
        });
    };

    const { sendOrderIncidencesEmail } = operations;

    const [
        sendOrderIncidencesEmailCall,
        {
            loading: sendOrderIncidencesEmailLoading,
            error: sendOrderIncidencesEmailError,
            data: sendOrderIncidencesEmailData
        }
    ] = useMutation(sendOrderIncidencesEmail);

    const handleSendOrderIncidencesEmail = useCallback(
        form => {
            try {
                const params = createParams(form, files, orderNumber);
                console.log('params', params);
                sendOrderIncidencesEmailCall({
                    variables: {
                        input: params
                    }
                }).then(() => {
                    displayMessage('success', 'Email send.');
                });
            } catch (e) {
                displayMessage('error', e);
                return;
            }
        },
        [files]
    );

    const isLoading = sendOrderIncidencesEmailLoading ? true : false;

    return {
        isLoading,
        fileTypes,
        indices,
        files,
        handleSendOrderIncidencesEmail,
        setIndices,
        setFiles
    };
};
